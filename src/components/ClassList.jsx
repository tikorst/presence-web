import React from 'react';

// Opsional: import ikon
// import { FaBookOpen } from 'react-icons/fa';

const ClassList = ({ classes, selectedClass, setSelectedClass, setSelectedClassData, handleFetchMeetings }) => {
  return (
    <div className="class-list">
      {classes.length === 0 ? (
        <div className="empty-state">Tidak ada kelas yang terdaftar.</div>
      ) : (
        classes.map((cls) => (
          <div
            key={cls.id_kelas}
            className={`class-item ${selectedClass === cls.id_kelas ? 'active' : ''}`}
            onClick={() => {
              setSelectedClass(cls.id_kelas);
              setSelectedClassData(cls); // Set data kelas lengkap saat memilih
              handleFetchMeetings(cls.id_kelas);
            }}
          >
            <div className="class-details">
              <h3>{cls.MataKuliah.nama_matkul}</h3>
              <p>{cls.nama_kelas}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ClassList;