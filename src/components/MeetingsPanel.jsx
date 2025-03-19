import React from 'react';
import MeetingRow from './MeetingRow';

const MeetingsPanel = ({ selectedClass, selectedClassData, meetings, startQR, qrData, formatDate, formatTime }) => {
  return (
    <section className="meetings-panel">
      <h2>{selectedClassData.MataKuliah.nama_matkul} - {selectedClassData.nama_kelas}</h2>
      {!meetings ? (
        <div className="loading">Memuat pertemuan...</div>
      ) : meetings.length === 0 ? (
        <div className="empty">Tidak ada pertemuan</div>
      ) : (
        <div className="meetings-table">
          <div className="table-header">
            <span>Tanggal</span>
            <span>Sesi</span>
            <span>Ruangan</span>
            <span>Aksi</span>
          </div>
          {meetings.map((meeting) =>
            meeting.pertemuan.map((pertemuan) => (
              <MeetingRow
                key={pertemuan.id_pertemuan}
                selectedClass={selectedClass}
                pertemuan={pertemuan}
                meeting={meeting}
                startQR={startQR}
                qrData={qrData}
                formatDate={formatDate}
                formatTime={formatTime}
              />
            ))
          )}
        </div>
      )}
    </section>
  );
};

export default MeetingsPanel;