import React, { createContext, useState, useCallback } from 'react';
import * as XLSX from 'xlsx';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Current logged-in user
  const [isAdmin, setIsAdmin] = useState(false); // Admin check
  const [usersData, setUsersData] = useState({}); // Store users data by "month-year"
  const [filteredData, setFilteredData] = useState([]); // Store filtered data for display

  /**
   * Function to load and parse users from an Excel file.
   * Parses data from each sheet, storing it in usersData with the format "month-year".
   */
  const loadUsersFromExcel = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        try {
          const binaryString = event.target.result;
          const workbook = XLSX.read(binaryString, { type: 'binary' });
          const sheetsData = {};

          // Process each sheet in the workbook
          workbook.SheetNames.forEach((sheetName) => {
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

            // Extract month and year from the sheet name (e.g., "January 2024")
            const [month, year] = sheetName.split(' ');
            sheetsData[`${month}-${year}`] = jsonData;
          });

          setUsersData(sheetsData); // Update usersData with parsed data
          resolve(sheetsData);
        } catch (error) {
          console.error('Error parsing Excel file:', error);
          reject(error);
        }
      };

      reader.onerror = (error) => {
        console.error('File reading error:', error);
        reject(error);
      };

      reader.readAsBinaryString(file); // Read the file as a binary string
    });
  };

  /**
   * Function to filter user data based on a specified month and year.
   * Updates filteredData with the relevant data.
   */
  const filterDataByMonthYear = (month, year) => {
    const key = `${month}-${year}`;
    const data = usersData[key] || [];
    setFilteredData(data);
  };

  /**
   * Function to authenticate a user.
   * Admin login requires fixed credentials, while user login checks Excel data.
   */
  const login = (username, password) => {
    // Admin login
    if (username === 'admin' && password === 'adminpass') {
      setUser({ username: 'admin' });
      setIsAdmin(true);
      return true;
    }

    // Regular user login
    const foundUser = Object.values(usersData)
      .flat()
      .find((u) => u.Username === username && u.Password === password);

    if (foundUser) {
      setUser(foundUser);
      setIsAdmin(false);
      return true;
    }

    // If no user is found
    return false;
  };

  /**
   * Function to log out the current user.
   * Clears user and admin states.
   */
  const logout = useCallback(() => {
    console.log('Logout function called');
    setUser(null);
    setIsAdmin(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        usersData,
        filteredData,
        loadUsersFromExcel,
        filterDataByMonthYear,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
