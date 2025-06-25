import React, { useState } from 'react';
import '../assets/styles/QRModal.css';
import { FiRefreshCcw, FiUserPlus, FiMessageCircle,  FiEye, FiEyeOff  } from "react-icons/fi";

const QRModal = ({ isOpen, onClose, className, meetingNumber, children, students, onRefresh, qrData, viewOnlyMode, onOpenLargeQR, onManualAttendance }) => {
  const [showManualInput, setShowManualInput] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAllNotes, setShowAllNotes] = useState(false);

  if (!isOpen) return null;

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStudent || !reason.trim()) {
      alert('Pilih mahasiswa dan masukkan alasan');
      return;
    }

    setIsSubmitting(true);
    try {
      await onManualAttendance(selectedStudent, reason.trim());
      setSelectedStudent('');
      setReason('');
      setShowManualInput(false);
    } catch (error) {
      console.error('Error adding manual attendance:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasNotes = students.some(student => student.catatan);

  const absentStudents = students.filter(student => !student.status);

  return (
    <div className="qr-modal-overlay" onClick={onClose}>
      <div className="qr-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-custom">
          <h2 className="modal-title-custom">
            {className} – Pertemuan {meetingNumber}
            
          </h2>
          <button type="button" className="close-button-custom" onClick={onClose} aria-label="Close">
            &times;
          </button>
        </div>
        
        <div className="modal-body-custom">
          {!viewOnlyMode && (
            <div className="qr-section">
              <div className="section-title">QR Code Presensi</div>
              <div className="qr-display-wrapper">
                {children}
              </div>
            </div>
          )}
          
          <div className={`students-section ${viewOnlyMode ? 'full-width' : ''}`}>
            <div className="students-header">
              <div className="section-title">Daftar Mahasiswa Hadir</div>
              <div className="students-actions">
                {hasNotes && (
                  <button 
                    className="toggle-notes-button" 
                    onClick={() => setShowAllNotes(!showAllNotes)}
                    title={showAllNotes ? "Sembunyikan Catatan" : "Tampilkan Catatan"}
                  >
                    {showAllNotes ? <FiEyeOff className="toggle-icon" /> : <FiEye className="toggle-icon" />}
                    Catatan
                  </button>
                )}
                <button 
                  className="manual-attendance-button" 
                  onClick={() => setShowManualInput(!showManualInput)}
                  title="Input Manual Kehadiran"
                >
                  <FiUserPlus className="manual-icon" /> Manual
                </button>
                <button className="refresh-button" onClick={onRefresh} title="Refresh Daftar Kehadiran">
                  <FiRefreshCcw className="refresh-icon" /> Refresh
                </button>
              </div>
            </div>
            
            {/* Manual Attendance Input Form */}
            {showManualInput && (
              <div className="manual-input-section">
                <form onSubmit={handleManualSubmit} className="manual-form">
                  <div className="form-group">
                    <label htmlFor="student-select">Pilih Mahasiswa:</label>
                    <select 
                      id="student-select"
                      value={selectedStudent} 
                      onChange={(e) => setSelectedStudent(e.target.value)}
                      className="student-select"
                      required
                    >
                      <option value="">-- Pilih Mahasiswa --</option>
                      {absentStudents.map((student) => (
                        <option key={student.npm} value={student.npm}>
                          {student.nama}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="reason-input">Alasan:</label>
                    <textarea 
                      id="reason-input"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Masukkan alasan kehadiran manual (misal: terlambat, masalah teknis, dll)"
                      className="reason-input"
                      rows={3}
                      required
                    />
                  </div>
                  <div className="form-actions">
                    <button 
                      type="button" 
                      className="cancel-button"
                      onClick={() => {
                        setShowManualInput(false);
                        setSelectedStudent('');
                        setReason('');
                      }}
                    >
                      Batal
                    </button>
                    <button 
                      type="submit" 
                      className="submit-button"
                      disabled={isSubmitting || !selectedStudent || !reason.trim()}
                    >
                      {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                    </button>
                  </div>
                </form>
              </div>
            )}            <div className={`students-list-container ${showManualInput ? 'hidden' : ''}`}>
              {students.length === 0 ? (
                <p className="empty-students-message">Belum ada mahasiswa yang melakukan presensi.</p>
              ) : (
                <ul className="students-list">
                  {students.map((student) => (
                    <li key={`${className}:${meetingNumber}:${student.npm}`} className="student-list-item">
                      <div className="student-info">
                        <span className="student-name">{student.nama}</span>
                        <div className="student-indicators">
                          {student.catatan && (
                              <span className="note-indicator-static" title={student.catatan}>
                                <FiMessageCircle className="note-icon" />
                              </span>
                            )}
                        </div>
                      </div>
                      {student.catatan && showAllNotes && (
                          <div className="student-note">
                            <span className="note-text">"{student.catatan}"</span>
                          </div>
                        )}
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
          {!viewOnlyMode && qrData?.status === 'active' && qrData?.qr && (
            <button
              type="button"
              className="open-qr-page-button"
              onClick={onOpenLargeQR}
            >
              Buka Halaman QR
            </button>
          )}
          <button type="button" className="close-modal-button" onClick={onClose}>
            {viewOnlyMode ? 'Tutup' : 'Tutup Sesi'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRModal;