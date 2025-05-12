import React, { useState, useEffect, useContext } from 'react';
import '../assets/styles/Admin.css';
import { fetchUsers } from '../api/users';
import { resetDeviceId } from '../api/resetDeviceId';
import { AuthContext } from '../context/AuthContext';
import Cookies from 'js-cookie';
function Admin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [adminName, setAdminName] = useState('Admin User');
  const {logout: contextLogout } = useContext(AuthContext);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const usersData = await fetchUsers();
        setUsers(usersData.users);
      } catch (err) {
        if(err.response && err.response.status === 403) {
          nav
        }
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
    // Mock fetching admin name, replace with actual API/auth call
    // setAdminName(localStorage.getItem('adminName') || 'Admin User');
  }, []);

  const handleResetDevice = async (userId) => {
    const confirmed = window.confirm('Apakah Anda yakin ingin mereset Device ID untuk pengguna ini?');
    if (!confirmed) return; // Batal kalau klik "Tidak"

    try {
      await resetDeviceId(userId);
      alert('Berhasil mereset Device ID untuk pengguna ini.');
    } catch (err) {
      console.log('Error mereset Device ID ', err);
      alert('Gagal mereset Device ID. Silakan coba lagi.');
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.nama.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const logout = () => {
      contextLogout(); 
      Cookies.remove('token');
      navigate('/login', { replace: true });
    };
  return (
    <div className="admin-container">
      <div className="admin-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p className="admin-name">Welcome, {adminName}</p>
        </div>
        <div>
            <button
            className="logout-button"
            onClick={() => {
                logout();
                alert('Logging out...');
            }}
            >
            Logout
            </button>
        </div>
            
      </div>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search by username or name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      {loading && <p className="loading-text">Loading users...</p>}
      {error && <p className="error-message">{error}</p>}
      {!loading && !error && (
        <div className="table-wrapper">
          <table className="users-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Nama</th>
                <th>Device ID</th>
                <th>Updated At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id_user}>
                    <td>{user.username}</td>
                    <td>{user.nama}</td>
                    <td>{user.device_id || 'N/A'}</td>
                    <td>{user.device_id_updated_at || 'N/A'}</td>
                    <td>
                      <button
                        className="reset-button"
                        onClick={() => handleResetDevice(user.username)}
                      >
                        Reset Device
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="no-users">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Admin;