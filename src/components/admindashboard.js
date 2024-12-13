import React, { useContext, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/authcontext';
import { UserUploader } from './useruploader';

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const { logout, usersData } = useContext(AuthContext);

  // Debugging: Log raw user data from context
  useEffect(() => {
    console.log("Raw Users Data:", usersData);
  }, [usersData]);

  // Normalize and flatten users from all months
  const users = useMemo(() => {
    if (!usersData) return [];

    const normalizeKeys = (data) => {
      return data.map((item) => {
        const normalizedItem = {};
        Object.keys(item).forEach((key) => {
          const normalizedKey = key.trim().toLowerCase();
          normalizedItem[normalizedKey] = item[key];
        });
        return normalizedItem;
      });
    };

    return normalizeKeys(Object.values(usersData).flat());
  }, [usersData]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div
      style={{
        fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
        padding: '20px',
        backgroundColor: '#f7f9fc',
        minHeight: '100vh',
      }}
    >
      <h1 style={{ textAlign: 'center', color: '#333', marginBottom: '30px' }}>
        Admin Dashboard
      </h1>

      {/* User Uploader Section */}
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: '10px',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
          padding: '20px',
          marginBottom: '30px',
        }}
      >
        <UserUploader />
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        style={{
          display: 'block',
          margin: '30px auto 0',
          padding: '10px 20px',
          backgroundColor: '#e74c3c',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: 'bold',
          transition: 'background-color 0.3s',
        }}
        onMouseEnter={(e) => (e.target.style.backgroundColor = '#c0392b')}
        onMouseLeave={(e) => (e.target.style.backgroundColor = '#e74c3c')}
      >
        Logout
      </button>
    </div>
  );
};
