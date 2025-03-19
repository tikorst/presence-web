import React from 'react';

const MeetingRow = ({ selectedClass, pertemuan, meeting, startQR, qrData, formatDate, formatTime }) => {
  return (
    <div className="table-row">
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
          : 'Generate QR'}
      </button>
    </div>
  );
};

export default MeetingRow;