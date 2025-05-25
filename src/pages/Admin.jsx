import React, { useState, useEffect, useContext } from 'react';
import '../assets/styles/Admin.css';
import { fetchUsers } from '../api/users';
import { resetDeviceId } from '../api/resetDeviceId';
import { AuthContext } from '../context/AuthContext';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Swal from 'sweetalert2';

function Admin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [adminName, setAdminName] = useState('Admin User');
  const { logout: contextLogout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);
  const DEBOUNCE_DELAY = 500;

  // New state to trigger a refresh
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        // Use debouncedSearchQuery here
        const usersData = await fetchUsers(currentPage, limit, debouncedSearchQuery);
        setUsers(usersData.users);
        setTotalPages(usersData.totalPages);
        setError('');
      } catch (err) {
        console.error('Error fetching users:', err);
        if (err.response && err.response.status === 403) {
          navigate('/login', { replace: true });
          toast.error('Sesi berakhir atau tidak memiliki otorisasi. Silakan login kembali.'); // Gunakan toast untuk error
        } else {
          setError('Gagal memuat pengguna. Silakan coba lagi nanti.');
          toast.error('Gagal memuat pengguna. Silakan coba lagi nanti.'); // Gunakan toast untuk error
        }
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [currentPage, limit, debouncedSearchQuery, navigate, refreshTrigger]); // Add refreshTrigger to dependencies

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, DEBOUNCE_DELAY);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery, DEBOUNCE_DELAY]);

  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [debouncedSearchQuery]);

  const handleResetDevice = async (userId) => {
    const result = await Swal.fire({
      title: 'Apakah Anda yakin?',
      text: "Ini akan mengatur ulang Device ID untuk pengguna ini.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, reset Device ID',
      cancelButtonText: 'Tidak, batalkan'
    });

    if (result.isConfirmed) {
      try {
        await resetDeviceId(userId);
        toast.success('Device ID berhasil direset untuk pengguna ini!');
        // Increment refreshTrigger to force a re-fetch
        setRefreshTrigger(prev => prev + 1);
      } catch (err) {
        console.error('Error resetting Device ID:', err);
        toast.error('Gagal mereset Device ID. Silakan coba lagi.');
      }
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      toast.info('Reset Device ID dibatalkan.');
    }
  };

  const logout = () => {
    contextLogout();
    Cookies.remove('token', { domain: '.tikorst.cloud', path: '/' });
    navigate('/login', { replace: true });
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="admin-container">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <div className="admin-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p className="admin-name">Welcome, {adminName}</p>
        </div>
        <div>
          <button className="logout-button" onClick={logout}>
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
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id_user}>
                    <td>{user.username}</td>
                    <td>{user.nama}</td>
                    <td>{user.device_id || 'N/A'}</td>
                    <td>{user.device_id_updated_at ? new Date(user.device_id_updated_at).toLocaleString() : 'N/A'}</td>
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
          <div className="pagination">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`page-button ${currentPage === page ? 'active' : ''}`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;