import React, { useState, useEffect, useContext } from 'react';
import { fetchClasses } from '../api/classes';
import { fetchMeetings } from '../api/meetings';
import { fetchAttendance, addManualAttendance } from '../api/attendance';
import QRDisplay from '../components/QRDisplay';
import QRModal from '../components/QRModal';
import ClassList from '../components/ClassList';
import MeetingsPanel from '../components/MeetingsPanel';
import '../assets/styles/Home.css'; 
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import QRDisplayLarge from '../components/QRDisplayLarge';
import { logout } from '../api/auth';

function Home() {
  const [classes, setClasses] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [schedules, setSchedules] = useState({});
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedClassData, setSelectedClassData] = useState(null); 
  const [qrData, setQrData] = useState({});
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMeetingId, setCurrentMeetingId] = useState(null);
  const [students, setStudents] = useState([]);
  const [user, setUser] = useState({});
  const [viewOnlyMode, setViewOnlyMode] = useState(false);
  const { logout: contextLogout } = useContext(AuthContext);
  const [showLargeQR, setShowLargeQR] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        const classesData = await fetchClasses();
        const flattenedClasses = classesData.classes;
        setUser(classesData.user);
        
        setClasses(flattenedClasses);
        if (flattenedClasses.length > 0) {
          setSelectedClass(flattenedClasses[0].id_kelas);
          setSelectedClassData(flattenedClasses[0]);
          handleFetchMeetings(flattenedClasses[0].id_kelas);
        }
      } catch (error) {
        console.error('Error fetching classes:', error);
        toast.error('Gagal memuat daftar kelas.');
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  useEffect(() => {
    if (currentMeetingId) {
      refreshAttendance(); 
    }
  }, [currentMeetingId]);

  const handleFetchMeetings = async (classId) => {
    if (schedules[classId]) {
      console.log('Meetings already loaded for this class.');
      return;
    }
    try {
      setLoading(true);
      const meetingData = await fetchMeetings(classId);
      
      const schedulesForClass = {};
      meetingData.data.forEach(schedule => {
        schedulesForClass[schedule.id_jadwal] = schedule;
      });
      
      setSchedules((prev) => ({ ...prev, [classId]: schedulesForClass }));
      const flattenedMeetings = meetingData.data.flatMap(schedule => schedule.Pertemuan);
      setMeetings((prev) => ({ ...prev, [classId]: flattenedMeetings }));

    } catch (error) {
      console.error('Error fetching meetings:', error);
      toast.error('Gagal memuat jadwal pertemuan.');
    } finally {
      setLoading(false);
    }
  };
  
  const startQR = (classId, meetingId) => {
    if (qrData[meetingId]?.ws && qrData[meetingId]?.status !== 'complete') {
        toast.info("QR sudah aktif atau sedang dibuat.");
        setIsModalOpen(true);
        setViewOnlyMode(false);
        return;
    }

    setCurrentMeetingId(meetingId);
    setViewOnlyMode(false);
    const wsUrl = `${import.meta.env.VITE_WS_BASE_URL}/generate_qr/${classId}/${meetingId}`;
    const ws = new WebSocket(wsUrl);
    
    setQrData((prev) => ({ ...prev, [meetingId]: { ws, qr: '', status: 'loading' } }));
    setIsModalOpen(true);
    toast.info("Membuat QR Code...");
    
    ws.onopen = () => {
        console.log('WebSocket connection established.');
    };

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
        if (data.error) {
            toast.error(`Gagal membuat QR: ${data.error}`);
        } else if (data.complete) {
            toast.success("QR Code Selesai dibuat.");
        }
    };

    ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        toast.error('Koneksi QR terputus atau gagal.');
        setQrData((prev) => ({ ...prev, [meetingId]: { ...prev[meetingId], status: 'error' } }));
    };

    ws.onclose = () => {
        console.log('WebSocket connection closed.');
        setQrData((prev) => ({ ...prev, [meetingId]: { ...prev[meetingId], status: 'complete' } }));
    };
  };

  const viewAttendance = (meetingId) => {
    setCurrentMeetingId(meetingId);
    setViewOnlyMode(true);
    setIsModalOpen(true);
    toast.info("Memuat daftar kehadiran...");
  };


  const handleOpenLargeQR = () => {
    setShowLargeQR(true);
  };

  const closeLargeQR = () => {
    setShowLargeQR(false);
  };
  const refreshAttendance = async () => {
    try {
      const attendance = await fetchAttendance(selectedClass, currentMeetingId);
      setStudents(attendance.attendance);
    } catch (error) {
      console.error('Error refreshing attendance:', error);
      toast.error('Gagal memperbarui daftar hadir.');
    }
  };

  const closeModal = () => {
    if (currentMeetingId && qrData[currentMeetingId]?.ws && !viewOnlyMode) {
      qrData[currentMeetingId].ws.close();
    }
    
    if (currentMeetingId && qrData[currentMeetingId]?.status !== 'complete' && !viewOnlyMode) {
      setQrData((prev) => ({ 
        ...prev, 
        [currentMeetingId]: { ...prev[currentMeetingId], status: 'closing' } 
      }));
      toast.info("Menutup sesi QR.");
    }

    setIsModalOpen(false);
    setCurrentMeetingId(null);
    setViewOnlyMode(false);
  };

  const handleManualAttendance = async (studentId, reason) => {
    try {
     const result = await addManualAttendance(selectedClass, currentMeetingId, studentId, reason);
     if (result.error) {
        toast.error(result.error);
        return;
      } else {
        toast.success('Kehadiran manual berhasil ditambahkan');
        await refreshAttendance();
      }
      // Refresh attendance list to show the new manual entry
    } catch (error) {
      console.error('Error adding manual attendance:', error);
      toast.error('Terjadi kesalahan saat menambahkan kehadiran manual.');
      throw error;
    }
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

  const handleLogout = () => {
    logout();
    contextLogout(); 
    navigate('/login', { replace: true });
  };

  const getMeetingNumber = (meetingId) => {
    if (!selectedClass || !schedules[selectedClass]) return null;
    
    for (const schedule of Object.values(schedules[selectedClass])) {
      const meeting = schedule.Pertemuan.find(
        (pertemuan) => pertemuan.id_pertemuan === meetingId
      );
      if (meeting) {
        return meeting.pertemuan_ke; 
      }
    }
    return null; 
  };

  const sortedMeetings = selectedClass 
    ? Object.values(schedules[selectedClass] || {})
      .flatMap(schedule => schedule.Pertemuan)
      .sort((a, b) => new Date(a.tanggal) - new Date(b.tanggal)) 
    : [];

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h3>Sistem Presensi</h3>
        </div>
        
        <nav className="sidebar-nav">
          <h2>Kelas</h2>
          {loading && <div className="loading-message">Memuat...</div>}
          <ClassList
            classes={classes}
            selectedClass={selectedClass}
            setSelectedClass={setSelectedClass}
            handleFetchMeetings={handleFetchMeetings}
            setSelectedClassData={setSelectedClassData}
          />
        </nav>
        
        <div className="user-info-panel">
          <div className="user-details">
            <h5>{user.nama || 'Loading...'}</h5>
            <p className="user-role">Dosen</p>
          </div>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>

      <main className="main-content">
        {selectedClass && selectedClassData ? (
          <>
            <MeetingsPanel
              selectedClass={selectedClass}
              selectedClassData={selectedClassData}
              meetings={sortedMeetings}
              schedules={schedules[selectedClass]}
              startQR={startQR}
              qrData={qrData}
              formatDate={formatDate}
              formatTime={formatTime}
              onViewAttendance={viewAttendance}
            />

            <QRModal
              key={`${selectedClass}:${currentMeetingId}`}
              isOpen={isModalOpen}
              onClose={closeModal}
              className={selectedClassData?.MataKuliah?.nama_matkul}
              meetingNumber={getMeetingNumber(currentMeetingId)}
              students={students} 
              onRefresh={refreshAttendance}
              qrData={currentMeetingId ? qrData[currentMeetingId] : null}
              viewOnlyMode={viewOnlyMode}
              onOpenLargeQR={handleOpenLargeQR}
              onManualAttendance={handleManualAttendance}
            >
              {currentMeetingId && qrData[currentMeetingId] && !viewOnlyMode && (
                <QRDisplay 
                  qrData={qrData[currentMeetingId]} 
                  meetingId={currentMeetingId} 
                  onOpenLargeQR={handleOpenLargeQR}
                  />
              )}
            </QRModal>
            {showLargeQR && currentMeetingId && qrData[currentMeetingId]?.qr && (
              <QRDisplayLarge 
                qrData={qrData[currentMeetingId]} 
                onClose={closeLargeQR}
              />
            )}
          </>
        ) : (
          <div className="empty-state">
            <h3>Pilih kelas untuk melihat jadwal pertemuan.</h3>
            <p>Jika tidak ada kelas, silakan hubungi administrator.</p>
          </div>
        )}
      </main>
      <ToastContainer position="top-center" autoClose={500} hideProgressBar={false} newestOnTop={true} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
}

export default Home;