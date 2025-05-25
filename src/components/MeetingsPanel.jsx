import React from 'react';
import MeetingRow from './MeetingRow';

const MeetingsPanel = ({ selectedClass, selectedClassData, meetings, schedules, startQR, qrData, formatDate, formatTime }) => {
  return (
    <section className="meetings-panel">
      <div className="panel-header">
        <h2>{selectedClassData?.MataKuliah?.nama_matkul} - {selectedClassData?.nama_kelas}</h2>
      </div>
      
      {!meetings || meetings.length === 0 ? (
        <div className="empty-state">
          {meetings ? "Tidak ada pertemuan untuk kelas ini." : "Memuat pertemuan..."}
        </div>
      ) : (
        <div className="meetings-table">
          <div className="table-header">
            <span>Pertemuan Ke</span>
            <span>Tanggal</span>
            <span>Sesi</span>
            <span>Ruangan</span>
            <span>Aksi</span>
          </div>
          <div className="table-body"> {/* Tambahkan body untuk scroll jika perlu */}
            {meetings.map((meeting) => {
              // Pastikan schedule untuk meeting ini ditemukan berdasarkan id_jadwal
              const scheduleForMeeting = schedules ? schedules[meeting.id_jadwal] : null;
              if (!scheduleForMeeting) {
                console.warn(`Jadwal tidak ditemukan untuk pertemuan ${meeting.id_pertemuan}`);
                return null; // Lewati jika jadwal tidak ditemukan
              }
              return (
                <MeetingRow
                  key={meeting.id_pertemuan}
                  selectedClass={selectedClass}
                  pertemuan={meeting}
                  schedule={scheduleForMeeting} // Kirim jadwal yang sesuai
                  startQR={startQR}
                  qrData={qrData}
                  formatDate={formatDate}
                  formatTime={formatTime}
                />
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
};

export default MeetingsPanel;