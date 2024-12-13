import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/authcontext';

export const UserUploader = () => {
  const { loadUsersFromExcel } = useContext(AuthContext);
  const [uploadStatus, setUploadStatus] = useState('');

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) {
      setUploadStatus('Please select a valid file.');
      return;
    }

    try {
      await loadUsersFromExcel(file);
      setUploadStatus('Users uploaded successfully with data from multiple sheets!');
    } catch (error) {
      setUploadStatus('Error uploading users. Please check the file format.');
      console.error('Upload failed:', error);
    }
  };

  return (
    <div
      style={{
        textAlign: 'center',
        padding: '20px',
        border: '1px solid #ddd',
        borderRadius: '10px',
        backgroundColor: '#f9f9f9',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
      }}
    >
      <h2
        style={{
          color: '#333',
          marginBottom: '20px',
          fontSize: '20px',
          fontWeight: 'bold',
        }}
      >
        Upload User Excel File
      </h2>
      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileUpload}
        style={{
          display: 'block',
          margin: '10px auto',
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '5px',
          backgroundColor: '#fff',
          cursor: 'pointer',
          fontSize: '14px',
        }}
      />
      {uploadStatus && (
        <p
          style={{
            marginTop: '15px',
            color: uploadStatus.includes('successfully') ? '#28a745' : '#e74c3c',
            fontSize: '14px',
          }}
        >
          {uploadStatus}
        </p>
      )}
    </div>
  );
};
