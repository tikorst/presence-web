import React from 'react';

const ClassList = ({ classes, selectedClass, setSelectedClass,setSelectedClassData, handleFetchMeetings }) => {
  return (
    <div className="class-list">
      {classes.length === 0 ? (
        <div className="empty">Tidak ada kelas</div>
      ) : (
        classes.map((cls) => (
          <div
            key={cls.id_kelas}
            className={`class-item ${selectedClass === cls.id_kelas ? 'active' : ''}`}
            onClick={() => {
              setSelectedClass(cls.id_kelas);
              handleFetchMeetings(cls.id_kelas);
              setSelectedClassData(cls);
            }}
          >
            <h3>{cls.MataKuliah.nama_matkul}</h3>
            <p>{cls.nama_kelas}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default ClassList;