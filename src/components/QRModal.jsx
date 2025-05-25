import React from 'react';
import '../assets/styles/QRModal.css';
import { FiRefreshCcw } from "react-icons/fi";
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const QRModal = ({ isOpen, onClose, className, meetingNumber, sessionTime, children, students, onRefresh, qrData }) => {
  const navigate = useNavigate(); // Inisialisasi useNavigate

  if (!isOpen) return null;

  return (
    <div className="qr-modal-overlay" onClick={onClose}>
      <div className="qr-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-custom">
          <h5 className="modal-title-custom">{className} - Pertemuan {meetingNumber}</h5>
          <button type="button" className="close-button-custom" onClick={onClose} aria-label="Close">
            &times;
          </button>
        </div>
        <div className="modal-body-custom">
          <div className="qr-section">
            <h6 className="section-title">QR Code Presensi</h6>
            {children}
          </div>
          <div className="students-section">
            <div className="students-header">
              <h6 className="section-title">Daftar Mahasiswa Hadir</h6>
              <button className="refresh-button" onClick={onRefresh} title="Refresh Daftar Hadir">
                <FiRefreshCcw className="refresh-icon" /> Refresh
              </button>
            </div>
            <div className="students-list-container">
              {students.length === 0 ? (
                <p className="empty-students-message">Belum ada mahasiswa yang presensi.</p>
              ) : (
                <ul className="students-list">
                  {students.map((student) => (
                    <li key={`${student.id}:${meetingNumber}`} className="student-list-item">
                      <span className="student-name">{student.nama}</span>
                      <span className={`attendance-badge ${student.status ? 'hadir' : 'alpha'}`}>
                        {student.status ? 'Hadir' : 'Alpha'}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
        <div className="modal-footer-custom">
          {/* Tombol baru untuk membuka halaman QR */}
          {qrData?.status === 'active' && ( // Hanya tampilkan jika QR aktif
            <button
              type="button"
              className="open-qr-page-button"
              onClick={handleOpenQRCodePage}
            >
              Buka Halaman QR Penuh
            </button>
          )}
          <button type="button" className="close-modal-button" onClick={onClose}>
            Tutup Sesi
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRModal;