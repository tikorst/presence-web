// import React, { useEffect, useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import '../assets/styles/QRCodePage.css'; // Akan kita buat nanti

// const QRCodePage = ({qrData}) => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [meetingInfo, setMeetingInfo] = useState({});

//   useEffect(() => {
//     // Ambil data QR dan informasi pertemuan dari state lokasi
//     if (location.state && location.state.qrData && location.state.meetingInfo) {
//       setMeetingInfo(location.state.meetingInfo);
//     } else {
//       // Jika tidak ada data, redirect kembali atau tampilkan pesan error
//       navigate('/dashboard'); // Contoh: kembali ke dashboard
//     }
//   }, [location.state, navigate]);

//   if (!qrData || !qrData.qr) {
//     return (
//       <div className="qr-page-container fallback">
//         <p>QR Code tidak ditemukan atau sesi telah berakhir.</p>
//         <button onClick={() => navigate('/dashboard')} className="back-button">
//           Kembali ke Dashboard
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="qr-page-container">
//       <div className="qr-page-header">
//         <h1>QR Code Presensi</h1>
//         <p>Mata Kuliah: **{meetingInfo.className}**</p>
//         <p>Pertemuan ke: **{meetingInfo.meetingNumber}**</p>
//         <p>Waktu Sesi: **{meetingInfo.sessionTime}**</p>
//       </div>
//       <div className="qr-page-content">
//         <div className="qr-code-display-large">
//           {qrData.status === 'active' && qrData.qr ? (
//             <img src={`data:image/png;base64,${qrData.qr}`} alt="QR Code" className='qr-image-large' />
//           ) : (
//             <p className="qr-status-message">Sesi QR Code tidak aktif atau sudah berakhir.</p>
//           )}
//         </div>
//       </div>
//       <div className="qr-page-footer">
//         <button onClick={() => navigate('/dashboard')} className="back-button">
//           Tutup Halaman QR
//         </button>
//       </div>
//     </div>
//   );
// };

// export default QRCodePage;