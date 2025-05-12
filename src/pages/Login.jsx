import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/auth';
import '../assets/styles/Login.css';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState(''); // State untuk menyimpan pesan error

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login(formData);
      if(data.error){
          setError(data.error); 
          return; 
      }else{
        setError(''); 
        console.log(data.user);
        if(data.user.tipe_user === 'Admin'){
          navigate('/admin');
        } else{
          navigate('/');
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'An unexpected error occurred.');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        {error && <div className="error-message">{error}</div>} {/* Tampilkan pesan error */}
        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter your username"
            required
            autoComplete="username"
          />
        </div>
        
        <div className="form-group">
          <label>Password:</label>  
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Masukan Password"
            required
          />
        </div>
        
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;