import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/auth';
import '../assets/styles/Login.css';
import { AuthContext } from '../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import gambar from '../assets/logo_presence.png'; 

function Login() {
  const navigate = useNavigate();
  const { setRole } = useContext(AuthContext);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const data = await login(formData);
      if (data.error) {
        toast.error(data.error);
        return;
      } else {
        toast.success("Login berhasil! Selamat datang.");
        setRole(data.user.tipe_user);
        if (data.user.tipe_user === 'Admin') {
          navigate('/admin');
        } else {
          navigate('/dosen/qr-presensi');
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      const errorMessage = err.response?.data?.message || 'Terjadi kesalahan. Silakan coba lagi.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Add focus animation effect
  const handleFocus = (e) => {
    e.target.parentElement.classList.add('focused');
  };

  const handleBlur = (e) => {
    e.target.parentElement.classList.remove('focused');
  };

  return (
    <div className="login-wrapper"> 
      <div className="login-box"> 
        <div className="login-header">
          <img src={gambar} alt="Logo Aplikasi" className="login-logo" /> 
          <h2>Sistem Presensi QR</h2>
          <p>Silakan login untuk melanjutkan</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder="Username Dosen/Admin"
              required
              autoComplete="username"
              disabled={isLoading}
            />
          </div>
          
          <div className="form-group">
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder="Kata Sandi"
              required
              disabled={isLoading}
            />
          </div>
          
          <button 
            type="submit" 
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>

        <div className="login-footer">
          <p>&copy; {new Date().getFullYear()} Universitas X. All rights reserved.</p>
        </div>
      </div>
      <ToastContainer 
        position="top-center" 
        autoClose={5000} 
        hideProgressBar={false} 
        newestOnTop={true} 
        closeOnClick 
        rtl={false} 
        pauseOnFocusLoss 
        draggable 
        pauseOnHover 
      />
    </div>
  );
}

export default Login;