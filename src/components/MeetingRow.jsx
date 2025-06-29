import React from 'react';

const MeetingRow = ({ selectedClass, pertemuan, schedule, startQR, qrData, formatDate, formatTime, onViewAttendance }) => {
  const isToday = (date) => {
    const today = new Date();
    const meetingDate = new Date(date);
    return (
      today.getFullYear() === meetingDate.getFullYear() &&
      today.getMonth() === meetingDate.getMonth() &&
      today.getDate() === meetingDate.getDate()
    );
  };

  const isSchedulePassed = (date, endTime) => {
    if (!endTime) return false;
    
    const now = new Date();
    const meetingDate = new Date(date);
    const [hours, minutes] = endTime.split(':');
    const scheduleEnd = new Date(
      meetingDate.getFullYear(), 
      meetingDate.getMonth(), 
      meetingDate.getDate(), 
      parseInt(hours), 
      parseInt(minutes)
    );
    
    return now > scheduleEnd;
  };

  const isScheduleStarted = (date, startTime) => {
    if (!startTime) return false;
    
    const now = new Date();
    const meetingDate = new Date(date);
    const [hours, minutes] = startTime.split(':');
    const scheduleStart = new Date(
      meetingDate.getFullYear(), 
      meetingDate.getMonth(), 
      meetingDate.getDate(), 
      parseInt(hours), 
      parseInt(minutes)
    );
    
    return now >= scheduleStart;
  };

  const canShowQR = () => {
    // Only allow QR if: today's session, has started, and not yet ended
    return isToday(pertemuan.tanggal) && 
           isScheduleStarted(pertemuan.tanggal, schedule?.Sesi?.jam_masuk) &&
           !isSchedulePassed(pertemuan.tanggal, schedule?.Sesi?.jam_keluar);
  };

  const getSessionStatus = () => {
    // If manually marked as selesai
    if (pertemuan.status === 'selesai') return 'selesai';
    
    // Check if session has passed (any date)
    if (isSchedulePassed(pertemuan.tanggal, schedule?.Sesi?.jam_keluar)) {
      return 'berakhir';
    }
    
    // Check if session is today and active
    if (isToday(pertemuan.tanggal)) {
      if (isScheduleStarted(pertemuan.tanggal, schedule?.Sesi?.jam_masuk)) {
        return 'aktif'; // Session is ongoing
      } else {
        return 'terjadwal'; // Session is today but hasn't started
      }
    }
    
    // Check if session is in the future
    const now = new Date();
    const meetingDate = new Date(pertemuan.tanggal);
    
    if (meetingDate > now) {
      return 'terjadwal'; // Future session
    } else {
      return 'berakhir'; // Past session
    }
  };

  const buttonText = () => {
    const sessionStatus = getSessionStatus();
    
    // Handle QR-specific states first
    if (qrData[pertemuan.id_pertemuan]?.status === 'loading') return 'Membuat...';
    if (qrData[pertemuan.id_pertemuan]?.status === 'closing') return 'Menutup...';
    if (qrData[pertemuan.id_pertemuan]?.status === 'active') return 'Aktif';
    if (qrData[pertemuan.id_pertemuan]?.status === 'error') return 'Error';
    
    // Handle session states
    switch (sessionStatus) {
      case 'selesai': return 'Selesai';
      case 'berakhir': return 'Berakhir';
      case 'terjadwal': return 'Terjadwal';
      case 'aktif': return 'Buat QR';
      default: return 'Terjadwal';
    }
  };

  const getQRButtonClass = () => {
    const qr = qrData[pertemuan.id_pertemuan];
    const sessionStatus = getSessionStatus();
    let baseClass = 'qr-button';
    
    // Handle QR-specific states first
    if (qr) {
      switch (qr.status) {
        case 'loading': return baseClass + ' active';
        case 'active': return baseClass + ' active';
        case 'error': return baseClass + ' error';
        case 'closing': return baseClass + ' complete';
        default: break;
      }
    }
    
    // Handle session states
    switch (sessionStatus) {
      case 'aktif': return baseClass; // Green, clickable
      case 'selesai': return baseClass + ' disabled';
      case 'berakhir': return baseClass + ' disabled';
      case 'terjadwal': return baseClass + ' disabled';
      default: return baseClass + ' disabled';
    }
  };

  const isButtonDisabled = () => {
    const sessionStatus = getSessionStatus();
    const qr = qrData[pertemuan.id_pertemuan];
    
    // Always disabled if loading or closing
    if (qr?.status === 'loading' || qr?.status === 'closing') {
      return true;
    }
    
    // Only enabled for active sessions or when QR is already active
    return sessionStatus !== 'aktif' && qr?.status !== 'active';
  };

  const isSessionEnded = () => {
    const sessionStatus = getSessionStatus();
    return sessionStatus === 'selesai' || sessionStatus === 'berakhir';
  };

  const handleButtonClick = () => {
    const qr = qrData[pertemuan.id_pertemuan];
    
    // If QR is already active, open the modal to show it
    if (qr?.status === 'active') {
      startQR(selectedClass, pertemuan.id_pertemuan);
      return;
    }
    
    // Only start new QR if session can show QR
    if (canShowQR()) {
      startQR(selectedClass, pertemuan.id_pertemuan);
    }
  };

  return (
    <tr>
      <td>{pertemuan.pertemuan_ke}</td>
      <td>{formatDate(pertemuan.tanggal)}</td>
      <td style={{ textAlign: 'center' }}>
        {schedule?.Sesi?.no_sesi}
        <br />
        ({formatTime(schedule?.Sesi?.jam_masuk)} - {formatTime(schedule?.Sesi?.jam_keluar)})
      </td>
      <td>{schedule?.Ruangan?.kode_ruangan || 'TBA'}</td>
      <td>
        <div className="action-buttons">
          {isSessionEnded() ? (
            <>
              <span className="status-text">
                {getSessionStatus() === 'selesai' ? 'Selesai' : 'Berakhir'}
              </span>
              <button
                className="view-attendance-button"
                onClick={() => onViewAttendance(pertemuan.id_pertemuan)}
              >
                Lihat Presensi
              </button>
            </>
          ) : (
            <button
              className={getQRButtonClass()}
              onClick={handleButtonClick}
              disabled={isButtonDisabled()}
            >
              {buttonText()}
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};

export default MeetingRow;