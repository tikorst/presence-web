import React from 'react';

const QRDisplay = ({ qrData }) => {
  return (
    <div className="qr-container">
      {qrData?.status === 'active' && qrData.qr ? (
        <>
          <img src={`data:image/png;base64,${qrData.qr}`} alt="QR Code" />
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