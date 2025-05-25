import React, { useState } from 'react';
import '../assets/styles/QRDisplay.css'; 
import QRDisplayLarge from './QRDisplayLarge';

const QRDisplay = ({ qrData }) => {
  const [showLargeQR, setShowLargeQR] = useState(false);
  return (
    <div className="qr-display-container"> 
      {qrData?.status === 'active' && qrData.qr ? (
        <>
          <div className="qr-code-box" onClick={() => setShowLargeQR(true)}> 
            <img src={`data:image/png;base64,${qrData.qr}`} alt="QR Code" className='qr-image' />
          </div>

          {showLargeQR && (
            <QRDisplayLarge 
              qrData={qrData} 
              onClose={() => setShowLargeQR(false)}/>
            )}
        </>
        
      ) : qrData?.status === 'error' ? (
        <div className="qr-message error">
          <p>Terjadi kesalahan saat membuat QR Code.</p>
          <p>Silakan coba lagi atau hubungi administrator.</p>
        </div>
      ) : qrData?.status === 'complete' ? (
        <div className="qr-message complete">
          <p>Sesi QR Code telah berakhir.</p>
          <p>QR Code aktif selama 3 menit.</p>
        </div>
      ) : (
        <div className="qr-message initial">
          <p>Klik tombol 'Buat QR' untuk memulai sesi presensi.</p>
          <p>QR Code akan muncul di sini.</p>
        </div>
      )}
    </div>
  );
};

export default QRDisplay;