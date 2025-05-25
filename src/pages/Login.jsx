import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/auth';
import '../assets/styles/Login.css';
import { AuthContext } from '../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import ikon jika Anda menggunakan library seperti Font Awesome atau Material Icons
// Contoh: import { FaUser, FaLock } from 'react-icons/fa'; // Jika menggunakan react-icons/fa

function Login() {
  const navigate = useNavigate();
  const { setRole } = useContext(AuthContext);
  const [formData, setFormData] = useState({ username: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login(formData);
      if (data.error) {
        toast.error(data.error);
        return;
      } else {
        toast.success("Login berhasil! Selamat datang."); // Pesan lebih personal
        setRole(data.user.tipe_user);
        if (data.user.tipe_user === 'Admin') {
          navigate('/admin');
        } else {
          // Asumsi dosen akan diarahkan ke halaman utama atau halaman QR
          navigate('/dosen/qr-presensi'); // Contoh path untuk dosen
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      const errorMessage = err.response?.data?.message || 'Terjadi kesalahan. Silakan coba lagi.';
      toast.error(errorMessage);
    }
  };

  return (
    <div className="login-wrapper"> 
      <div className="login-box"> 
        <div className="login-header">
          {/* Anda bisa menambahkan logo di sini */}
           <img src="/src/assets/logo_presence.png" alt="Logo Aplikasi" className="login-logo" /> 
          
          <h2>Sistem Presensi QR</h2> {/* Judul lebih spesifik */}
          <p>Silakan login untuk melanjutkan</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            {/* Anda bisa menambahkan ikon di sini */}
            {/* <FaUser className="input-icon" /> */}
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username Dosen/Admin" // Placeholder lebih informatif
              required
              autoComplete="username"
            />
          </div>
          
          <div className="form-group">
            {/* <FaLock className="input-icon" /> */}
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Kata Sandi" // Placeholder lebih informatif
              required
            />
          </div>
          
          <button type="submit" className="login-button">Masuk</button> {/* Teks tombol lebih profesional */}
        </form>

        <div className="login-footer">
          <p>&copy; {new Date().getFullYear()} Universitas X. All rights reserved.</p>
        </div>
      </div>
      <ToastContainer position="top-center" autoClose={5000} hideProgressBar={false} newestOnTop={true} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
}

export default Login;