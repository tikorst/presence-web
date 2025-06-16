import React from 'react';
import MeetingRow from './MeetingRow';

const MeetingsPanel = ({ selectedClass, selectedClassData, meetings, schedules, startQR, qrData, formatDate, formatTime, onViewAttendance }) => {
  return (
    <>
      <div className="class-header">
        <h1 className="class-name">{selectedClassData?.MataKuliah?.nama_matkul} - {selectedClassData?.nama_kelas} </h1>
      </div>
      
      <div className="meetings-container">
        <div className="meetings-header">
          Pertemuan
        </div>
        <div className="meetings-content">
          <table className="meetings-table">
            <thead>
              <tr>
                <th>Nomor</th>
                <th>Tanggal</th>
                <th>Sesi</th>
                <th>Ruangan</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {meetings.map((meeting) => {
                const schedule = schedules && Object.values(schedules).find(s => 
                  s.Pertemuan.some(p => p.id_pertemuan === meeting.id_pertemuan)
                );
                
                return (
                  <MeetingRow
                    key={meeting.id_pertemuan}
                    selectedClass={selectedClass}
                    pertemuan={meeting}
                    schedule={schedule}
                    startQR={startQR}
                    qrData={qrData}
                    formatDate={formatDate}
                    formatTime={formatTime}
                    onViewAttendance={onViewAttendance}
                  />
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default MeetingsPanel;