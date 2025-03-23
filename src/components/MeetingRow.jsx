import React from 'react';

const MeetingRow = ({ selectedClass, pertemuan, selectedClassData, schedule, startQR, qrData, formatDate, formatTime }) => {
  return (
    <div className="table-row">
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
        disabled={qrData[pertemuan.id_pertemuan]?.status === 'loading' || qrData[pertemuan.id_pertemuan]?.status === 'closing'}
      >
        {qrData[pertemuan.id_pertemuan]?.status === 'loading'
          ? 'Generating...'
          : qrData[pertemuan.id_pertemuan]?.status === 'closing'
          ? 'Closing...'
          : 'Generate QR'}
      </button>
    </div>
  );
};

export default MeetingRow;