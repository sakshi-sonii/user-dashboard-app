import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/authcontext';

export const UserDashboard = () => {
  const navigate = useNavigate();
  const { user, usersData, logout } = useContext(AuthContext);

  // Debugging logs to verify data
  useEffect(() => {
    console.log('User:', user);
    console.log('Users Data:', usersData);
  }, [user, usersData]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div
      style={{
        fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
        backgroundColor: '#f7f9fc',
        minHeight: '100vh',
        padding: '20px',
        textAlign: 'center',
      }}
    >
      <h1
        style={{
          color: '#333',
          marginBottom: '30px',
          fontSize: '28px',
          fontWeight: 'bold',
        }}
      >
        User Dashboard
      </h1>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          padding: '10px 20px',
          backgroundColor: '#e74c3c',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Logout
      </button>

      <div
        style={{
          marginTop: '30px',
          backgroundColor: '#fff',
          borderRadius: '10px',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
          padding: '20px',
          width: '100%',
          maxWidth: '600px',
          textAlign: 'left',
        }}
      >
        <h2
          style={{
            color: '#555',
            marginBottom: '20px',
            fontSize: '20px',
            fontWeight: 'bold',
          }}
        >
          Your Data sorted by month-year
        </h2>

        {usersData && Object.keys(usersData).length > 0 ? (
          <ul>
            {Object.entries(usersData).map(([sheetName, userData]) => {
  // Split sheet name by "-" and ensure proper structure
  const [month = 'Unknown', year = 'Unknown'] = sheetName.split('-');

  return (
    <div key={sheetName}>
      <h3 style={{ color: '#333', marginBottom: '10px', fontSize: '18px' }}>
        {`${month}-${year}`}
      </h3>
      {userData.filter(item => item.Username === user.Username).length > 0 ? (
        <ul>
          {userData
            .filter(item => item.Username === user.Username)
            .map((filteredData, idx) => (
              <><li key={idx} style={{ marginBottom: '8px', fontSize: '16px' }}>
                {filteredData.Name || 'No name'}
              </li><li key={idx} style={{ marginBottom: '8px', fontSize: '16px' }}>
                  {filteredData.TOTAL || 'No name'}
                </li></>
            ))}
        </ul>
      ) : (
        <p style={{ color: '#888', fontSize: '16px' }}>No data available for this sheet.</p>
      )}
    </div>
  );
})}

          </ul>
        ) : (
          <p style={{ color: '#888', fontSize: '16px' }}>No data available.</p>
        )}
      </div>
    </div>
  );
};
