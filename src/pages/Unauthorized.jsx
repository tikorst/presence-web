import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/Unauthorized.css';

function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="unauthorized-container">
      <h1>403 - Unauthorized</h1>
      <p>You do not have permission to access this page.</p>
      <button className="back-button" onClick={() => navigate('/')}>
        Go Back to Home
      </button>
    </div>
  );
}

export default Unauthorized;