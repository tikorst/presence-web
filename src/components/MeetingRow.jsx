import React from 'react';

const MeetingRow = ({ selectedClass, pertemuan, selectedClassData, schedule, startQR, qrData, formatDate, formatTime }) => {
  const isToday = (date) => {
    
    const today = new Date();
    const meetingDate = new Date(date);
    return (
      today.getFullYear() === meetingDate.getFullYear() &&
      today.getMonth() === meetingDate.getMonth() &&
      today.getDate() === meetingDate.getDate()
    );
  };
  
  return (
    <div className="table-row">
      <span>{pertemuan.pertemuan_ke}</span>
      <span>{formatDate(pertemuan.tanggal)}</span>
      <span>
        {console.log(schedule)}
        {
        schedule.Sesi.no_sesi}
        <br />
        {formatTime(schedule.Sesi.jam_masuk)} - {formatTime(schedule.Sesi.jam_keluar)}
      </span>
      <span>{schedule.Ruangan.kode_ruangan}</span>
      <button
        className="qr-button"
        onClick={() => startQR(selectedClass, pertemuan.id_pertemuan)}
        disabled={
          !isToday(pertemuan.tanggal) ||
          qrData[pertemuan.id_pertemuan]?.status === 'loading' || 
          qrData[pertemuan.id_pertemuan]?.status === 'closing' || 
          pertemuan.status === 'selesai'}
      >
        {pertemuan.status === 'selesai'
          ? 'Selesai'
          : qrData[pertemuan.id_pertemuan]?.status === 'loading'
          ? 'Sedang Membuat QR...'
          : qrData[pertemuan.id_pertemuan]?.status === 'closing'
          ? 'Menutup...'
          : 'Buat QR'}
      </button>
    </div>
  );
};

export default MeetingRow;