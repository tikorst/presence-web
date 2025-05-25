import React from 'react';
import '../assets/styles/QRDisplayLarge.css'; // Pastikan path benar

const QRDisplayLarge = ({ qrData,onClose  }) => {
    // Pastikan qrData ada sebelum navigasi
  if (!qrData || qrData.status !== 'active' || !qrData.qr) return null;

  return (
    <div className="fullscreen-modal-overlay">
      <div className="fullscreen-modal-content">
        <button className="close-btn" onClick={onClose}>✕</button>
        <img src={`data:image/png;base64,${qrData.qr}`} alt="QR Code" className="fullscreen-qr" />
      </div>
    </div>
  );
};

export default QRDisplayLarge;