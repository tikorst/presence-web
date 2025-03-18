import React, { useState, useEffect } from 'react';
import { fetchClasses } from '../api/classes';
import { fetchMeetings } from '../api/meetings';
import QRDisplay from '../components/QRDisplay';
import QRModal from '../components/QRModal';
import '../assets/styles/Home.css';

function Home() {
  const [classes, setClasses] = useState([]);
  const [meetings, setMeetings] = useState({});
  const [selectedClass, setSelectedClass] = useState(null);
  const [qrData, setQrData] = useState({});
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMeetingId, setCurrentMeetingId] = useState(null);
  const [students, setStudents] = useState([]);
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        const classesData = await fetchClasses();
        const flattenedClasses = classesData.classes.flatMap(cls => cls.Kelas);
        setClasses(flattenedClasses);
        if (flattenedClasses.length > 0) {
          setSelectedClass(flattenedClasses[0].id_kelas);
          handleFetchMeetings(flattenedClasses[0].id_kelas);
        }
      } catch (error) {
        console.error('Error fetching classes:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();

    return () => {
      if (currentMeetingId && qrData[currentMeetingId]?.ws) {
        qrData[currentMeetingId].ws.close(); // Tutup WebSocket
      }
    };
  }, []);

  const handleFetchMeetings = async (classId) => {
    if (meetings[classId]) return; // Prevent refetching
    try {
      setLoading(true);
      const meetingData = await fetchMeetings(classId);
      setMeetings((prev) => ({ ...prev, [classId]: meetingData.data }));
    } catch (error) {
      console.error('Error fetching meetings:', error);
    } finally {
      setLoading(false);
    }
  };

  const startQR = (classId ,meetingId) => {
    if (qrData[meetingId]?.ws) return;
    
    const ws = new WebSocket(`${import.meta.env.VITE_WS_URL}/generate_qr/${classId}/${meetingId}`);
    console.log("WEB SOCKET", ws);
    setQrData((prev) => ({ ...prev, [meetingId]: { ws, qr: '', status: 'loading' } }));
    setCurrentMeetingId(meetingId);
    setIsModalOpen(true);

    ws.onopen = () => console.log('WebSocket connected'); 
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if(data.qr){
        setQrData((prev) => ({
          ...prev,
          [meetingId]: {
            ws, 
            qr: data.qr || '', 
            status: data.error ? 'error' : data.complete ? 'complete' : 'active' 
          },
        }));
      } else if(data.attendance){
        console.log("ATTENDANCE", data.attendance);
        setStudents(data.attendance);
      }
      
    };

    ws.onclose = () => {
      setQrData((prev) => ({ ...prev, [meetingId]: { qr: '', status: 'complete' } }));
    };
  };

  const closeModal = () => {
    if (currentMeetingId && qrData[currentMeetingId]?.ws) {
      qrData[currentMeetingId].ws.close();
    }
    if (qrData[currentMeetingId]?.status !== 'complete') {
      setQrData((prev) => ({ ...prev, [currentMeetingId]: { ...prev[currentMeetingId], status: 'closing' } }));
    }
    setIsModalOpen(false);
    setCurrentMeetingId(null);
  };

  const formatDate = (datetime) => {
    return new Date(datetime).toLocaleString('id-ID', {
      dateStyle: 'medium',
    });
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    return `${hours}:${minutes}`;
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2>Kelas</h2>
        {loading && <div className="loading">Memuat...</div>}
        <div className="class-list">
          {classes.length === 0 && !loading ? (
            <div className="empty">Tidak ada kelas</div>
          ) : (
            classes.map((cls) => (
              <div
                key={cls.id_kelas}
                className={`class-item ${selectedClass === cls.id_kelas ? 'active' : ''}`}
                onClick={() => {
                  setSelectedClass(cls.id_kelas);
                  handleFetchMeetings(cls.id_kelas);
                }}
              >
                <h3>{cls.MataKuliah.nama_matkul}</h3>
                <p>{cls.nama_kelas}</p>
              </div>
            ))
          )}
        </div>
      </aside>

      <main className="main-content">
        {selectedClass && (
          <>
            <section className="meetings-panel">
              <h2>Pertemuan - {classes.find(cls => cls.id_kelas === selectedClass)?.MataKuliah.nama_matkul}</h2>
              {!meetings[selectedClass] ? (
                <div className="loading">Memuat pertemuan...</div>
              ) : meetings[selectedClass].length === 0 ? (
                <div className="empty">Tidak ada pertemuan</div>
              ) : (
                <div className="meetings-table">
                  <div className="table-header">
                    <span>Tanggal</span>
                    <span>Sesi</span>
                    <span>Ruangan</span>
                    <span>Aksi</span>
                  </div>
                  {meetings[selectedClass].map((meeting) => (
                    meeting.pertemuan.map((pertemuan) => (
                      <div key={pertemuan.id_pertemuan} className="table-row">
                        <span>{formatDate(pertemuan.tanggal)}</span>
                        <span>
                          {meeting.Sesi.no_sesi}
                          <br />
                          {formatTime(meeting.Sesi.jam_masuk)} - {formatTime(meeting.Sesi.jam_keluar)}
                        </span>
                        <span>{meeting.Ruangan.kode_ruangan}</span>
                        <button
                          className="qr-button"
                          onClick={() => startQR(selectedClass, pertemuan.id_pertemuan)}
                          disabled={qrData[pertemuan.id_pertemuan]?.status === 'loading' || qrData[pertemuan.id_pertemuan]?.status === 'closing'}
                        >
                          {qrData[pertemuan.id_pertemuan]?.status === 'loading' 
                            ? 'Generating...' 
                            : qrData[pertemuan.id_pertemuan]?.status === 'closing'
                            ? 'Closing...'
                            : 'Generate QR'
                          }
                        </button>
                      </div>
                    ))
                  ))}
                </div>
              )}
            </section>

            <QRModal 
              isOpen={isModalOpen} 
              onClose={closeModal} 
              className={classes.find(cls => cls.id_kelas === selectedClass)?.MataKuliah.nama_matkul}
              meetingNumber={currentMeetingId}
              students={students}
            >
              {currentMeetingId && qrData[currentMeetingId] && (
                <QRDisplay qrData={qrData[currentMeetingId]} meetingId={currentMeetingId} />
              )}
            </QRModal>
          </>
        )}
      </main>
    </div>
  );
}

export default Home;