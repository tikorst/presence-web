import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Bisa dipindah ke index.js

const QRModal = ({ isOpen, onClose, className, meetingNumber, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{className}</h5>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <h6>Pertemuan {meetingNumber}</h6>
            <div className="d-flex justify-content-center">
              {children}
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