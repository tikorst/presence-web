import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Bisa dipindah ke index.js
import '../assets/styles/QRModal.css'; // Import custom styles
import { FiRefreshCcw } from "react-icons/fi";
const QRModal = ({ isOpen, onClose, className, meetingNumber, children, students, onRefresh }) => {
  if (!isOpen) return null;

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{className}</h5>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
          </div>
          <div className="modal-body d-flex">
            <div className="qr-container">
              <h6>Pertemuan {meetingNumber}</h6>
              <div className="d-flex">
                {children}
              </div>
            </div>
            <div>
               <div className='d-flex justify-content-between'>
                <h6>Daftar Mahasiswa</h6>
                <button className="refresh-button d-flex" onClick={onRefresh}>
                    <FiRefreshCcw className="icon" />
                </button>
               </div>
            <div className="students-container">
              <ul className="list-group">
                {students.map((student) => (
                  <li key={student.id} className="list-group-item d-flex justify-content-between align-items-center">
                    {student.nama}
                    <span className={`badge ${student.status ? 'bg-success' : 'bg-danger'}`}>
                      {student.status ? 'Hadir' : 'Alpha'}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            </div>
            
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRModal;