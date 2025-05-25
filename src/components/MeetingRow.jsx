import React from 'react';

const MeetingRow = ({ selectedClass, pertemuan, schedule, startQR, qrData, formatDate, formatTime }) => {
  const isToday = (date) => {
    const today = new Date();
    const meetingDate = new Date(date);
    return (
      today.getFullYear() === meetingDate.getFullYear() &&
      today.getMonth() === meetingDate.getMonth() &&
      today.getDate() === meetingDate.getDate()
    );
  };

  const buttonText = () => {
    if (pertemuan.status === 'selesai') return 'Selesai';
    if (qrData[pertemuan.id_pertemuan]?.status === 'loading') return 'Membuat QR...';
    if (qrData[pertemuan.id_pertemuan]?.status === 'closing') return 'Menutup...';
    if (qrData[pertemuan.id_pertemuan]?.status === 'active') return 'QR Aktif'; // Tambahkan status aktif
    if (!isToday(pertemuan.tanggal)) return 'Diluar Jadwal'; 
    return 'Buat QR';
  };

  const isButtonDisabled = 
    pertemuan.status === 'selesai' ||
    qrData[pertemuan.id_pertemuan]?.status === 'loading' || 
    qrData[pertemuan.id_pertemuan]?.status === 'closing' ||
    qrData[pertemuan.id_pertemuan]?.status === 'active' || // Disabled jika QR sudah aktif
    !isToday(pertemuan.tanggal);

  return (
    <div className="table-row">
      <span>{pertemuan.pertemuan_ke}</span>
      <span>{formatDate(pertemuan.tanggal)}</span>
      <span>
        {schedule?.Sesi?.no_sesi} {/* Gunakan optional chaining untuk safety */}
        <br />
        {formatTime(schedule?.Sesi?.jam_masuk)} - {formatTime(schedule?.Sesi?.jam_keluar)}
      </span>
      <span>{schedule?.Ruangan?.kode_ruangan}</span> {/* Gunakan optional chaining */}
      <button
        className={`action-button ${isButtonDisabled ? 'disabled' : ''} ${qrData[pertemuan.id_pertemuan]?.status === 'active' ? 'active-qr' : ''}`}
        onClick={() => startQR(selectedClass, pertemuan.id_pertemuan)}
        disabled={isButtonDisabled}
      >
        {buttonText()}
      </button>
    </div>
  );
};

export default MeetingRow;