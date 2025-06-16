const ClassList = ({ classes, selectedClass, setSelectedClass, handleFetchMeetings, setSelectedClassData }) => {
  const handleClassClick = (kelas) => {
    setSelectedClass(kelas.id_kelas);
    setSelectedClassData(kelas);
    handleFetchMeetings(kelas.id_kelas);
  };

  return (
    <>
      {classes.map((kelas) => (
        <div
          key={kelas.id_kelas}
          className={`class-item ${selectedClass === kelas.id_kelas ? 'selected' : ''}`}
          onClick={() => handleClassClick(kelas)}
        >
          <div className="class-details">
              <h3>{kelas.MataKuliah.nama_matkul}</h3>
              <p>{kelas.nama_kelas}</p>
            </div>
        </div>
      ))}
    </>
  );
};

export default ClassList;