import React, { useState, useEffect, use } from 'react';
import { fetchClasses } from '../api/classes';
import { fetchMeetings } from '../api/meetings';
import { fetchAttendance } from '../api/attendance';
import QRDisplay from '../components/QRDisplay';
import QRModal from '../components/QRModal';
import ClassList from '../components/ClassList';
import MeetingsPanel from '../components/MeetingsPanel';
import '../assets/styles/Home.css';

function Home() {
  const [classes, setClasses] = useState([]);
  const [meetings, setMeetings] = useState({});
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedClassData, setSelectedClassData] = useState([]);
  const [qrData, setQrData] = useState({});
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMeetingId, setCurrentMeetingId] = useState(null);
  const [students, setStudents] = useState([]);
  const [user, setUser] = useState({});
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        const classesData = await fetchClasses();
        const flattenedClasses = classesData.classes.flatMap(cls => cls.Kelas);
        setClasses(flattenedClasses);
        if (flattenedClasses.length > 0) {
          setSelectedClass(flattenedClasses[0].id_kelas);
          setSelectedClassData(flattenedClasses[0]);
          handleFetchMeetings(flattenedClasses[0].id_kelas);
        }
      } catch (error) {
        console.error('Error fetching classes:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  useEffect(() => {
    if(currentMeetingId){
      refreshAttendance();  
    }
  }, [currentMeetingId]);

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
  
  const startQR = (classId, meetingId) => {
    if (qrData[meetingId]?.ws) return;

    setCurrentMeetingId(meetingId);
    const ws = new WebSocket(`${import.meta.env.VITE_WS_URL}/generate_qr/${classId}/${meetingId}`);
    setQrData((prev) => ({ ...prev, [meetingId]: { ws, qr: '', status: 'loading' } }));
    setIsModalOpen(true);
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
        setQrData((prev) => ({
          ...prev,
          [meetingId]: {
            ws,
            qr: data.qr || '',
            status: data.error ? 'error' : data.complete ? 'complete' : 'active'
          },
        }));
      
    };

    ws.onerror = (error) => {

    };

    ws.onclose = () => {

      setQrData((prev) => ({ ...prev, [meetingId]: { qr: '', status: 'complete' } }));
    };
   
  };

  const refreshAttendance = async () => {
    try {
      const attendance = await fetchAttendance(selectedClass, currentMeetingId);

      setStudents(attendance.attendance);
    } catch (error) {

    }
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

  const logout = () => {
    // Hapus token dan arahkan ke halaman login
    localStorage.removeItem('token'); // Contoh penghapusan token
    window.location.href = '/login';
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2>Kelas</h2>
        {loading && <div className="loading">Memuat...</div>}
        <ClassList
          classes={classes}
          selectedClass={selectedClass}
          setSelectedClass={setSelectedClass}
          handleFetchMeetings={handleFetchMeetings}
          setSelectedClassData={setSelectedClassData}
        />
        <div className="user-info">
          <span>{user.name}</span>
          <button className="btn btn-danger btn-sm" onClick={logout}>Logout</button>
        </div>
      </aside>

      <main className="main-content">
        {selectedClass && (
          <>
            <MeetingsPanel
              selectedClass={selectedClass}
              selectedClassData={selectedClassData}
              meetings={meetings[selectedClass]}
              startQR={startQR}
              qrData={qrData}
              formatDate={formatDate}
              formatTime={formatTime}
            />

            <QRModal
              key={`${selectedClass}:${currentMeetingId}`}
              isOpen={isModalOpen}
              onClose={closeModal}
              className={classes.find(cls => cls.id_kelas === selectedClass)?.MataKuliah.nama_matkul}
              meetingNumber={currentMeetingId}
              students={students} 
              onRefresh={refreshAttendance}
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