import React from 'react';
import '../assets/styles/QRDisplay.css';
const QRDisplay = ({ qrData }) => {
  return (
    <div className="qr">
      {qrData?.status === 'active' && qrData.qr ? (
        <>
          <img src={`data:image/png;base64,${qrData.qr}`} alt="QR Code" className='qr-image' />
        </>
      ) : qrData?.status === 'error' ? (
        <p>Error: {qrData.error}</p>
      ) : qrData?.status === 'complete' ? (
        <p>Stream ended after 3 minutes</p>
      ) : (
        <p>Click Generate QR to start</p>
      )}
    </div>
  );
};

export default QRDisplay;