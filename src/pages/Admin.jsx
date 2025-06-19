import React, { useState, useEffect, useContext } from 'react';
import '../assets/styles/Admin.css';
import { fetchUsers } from '../api/users';
import { resetDeviceId } from '../api/resetDeviceId';
import { AuthContext } from '../context/AuthContext';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { logout } from '../api/auth';
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
        const usersData = await fetchUsers(currentPage, limit, debouncedSearchQuery);
        setUsers(usersData.users);
        setTotalPages(usersData.totalPages);
        setError('');
      } catch (err) {
        console.error('Error fetching users:', err);
        if (err.response && err.response.status === 403) {
          navigate('/login', { replace: true });
          toast.error('Sesi berakhir atau tidak memiliki otorisasi. Silakan login kembali.');
        } else {
          setError('Gagal memuat pengguna. Silakan coba lagi nanti.');
          toast.error('Gagal memuat pengguna. Silakan coba lagi nanti.');
        }
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [currentPage, limit, debouncedSearchQuery, navigate, refreshTrigger]);

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
        setRefreshTrigger(prev => prev + 1);
      } catch (err) {
        console.error('Error resetting Device ID:', err);
        toast.error('Gagal mereset Device ID. Silakan coba lagi.');
      }
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      toast.info('Reset Device ID dibatalkan.');
    }
  };

  const handleLogout = () => {
    logout();
    contextLogout(); 
    navigate('/login', { replace: true });
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    for (let i = 1; i <= totalPages; i++) {
      buttons.push(
        <button
          key={i}
          className={`page-btn ${currentPage === i ? 'active' : ''}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }
    return buttons;
  };

  return (
    <div className="admin-wrapper">
      <div className="admin-dashboard-container">
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

        {/* Header Section */}
        <div className="header">
          <div className="header-left">
            <h1>Admin Dashboard</h1>
            <p>Welcome, {adminName}</p>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>

        {/* Divider */}
        <div className="divider"></div>

        {/* Search Section */}
        <div className="search-container">
          <div className="search-bar">
            <input
              type="text"
              className="search-input"
              placeholder="Search by username or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className="loading-text">Loading users...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="error-container">
            <p className="error-message">{error}</p>
          </div>
        )}

        {/* Table Section */}
        {!loading && !error && (
          <>
            <div className="table-container">
              <table className="user-table">
                <thead>
                  <tr>
                    <th>NPM</th>
                    <th>Nama Lengkap</th>
                    <th>Device ID</th>
                    <th>Terakhir Diperbarui</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length > 0 ? (
                    users.map((user) => (
                      <tr key={user.id_user}>
                        <td>
                          <span className="username">{user.username}</span>
                        </td>
                        <td>{user.nama}</td>
                        <td>
                          <span className="device-id">
                            {user.device_id || 'N/A'}
                          </span>
                        </td>
                        <td>
                          {user.device_id_updated_at 
                            ? new Date(user.device_id_updated_at).toLocaleString()
                            : 'N/A'
                          }
                        </td>
                        <td>
                          <button
                            className="reset-btn"
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                {renderPaginationButtons()}
              </div>
            )}
          </>
        )}
      </div>
    </div>
    
  );
}

export default Admin;