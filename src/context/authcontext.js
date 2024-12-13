import React, { createContext, useState, useCallback, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../firebaseConfig';


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [usersData, setUsersData] = useState({}); // Data stored by month-year
  const [filteredData, setFilteredData] = useState([]); // Filtered data for display

  // Function to load users from Excel file
  const loadUsersFromExcel = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = async (event) => {
        try {
          const binaryString = event.target.result;
          const workbook = XLSX.read(binaryString, { type: 'binary' });
          const sheetsData = {};

          // Parse data from each sheet
          workbook.SheetNames.forEach((sheetName) => {
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);

            // Extract month and year from sheet name (e.g., "January 2024")
            const [month, year] = sheetName.split(' ');
            sheetsData[`${month}-${year}`] = jsonData;
          });

          setUsersData(sheetsData); // Update local state

          // Save to Firestore
          await setDoc(doc(db, 'uploads', 'usersData'), sheetsData);
          resolve(sheetsData);
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = (error) => reject(error);
      reader.readAsBinaryString(file);
    });
  };

  // Function to fetch users data from Firestore on app load
  const fetchUsersData = useCallback(async () => {
    try {
      const docRef = doc(db, 'uploads', 'usersData');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setUsersData(data);
      } else {
        console.log('No users data found in Firestore.');
      }
    } catch (error) {
      console.error('Error fetching users data:', error);
    }
  }, []);

  // Filter data by month and year
  const filterDataByMonthYear = (month, year) => {
    const key = `${month}-${year}`;
    setFilteredData(usersData[key] || []);
  };

  // Login function
  const login = (username, password) => {
    if (username === 'admin' && password === 'adminpass') {
      setUser({ username: 'admin' });
      setIsAdmin(true);
      return true;
    }

    const foundUser = Object.values(usersData)
      .flat()
      .find((u) => u.Username === username && u.Password === password);

    if (foundUser) {
      setUser(foundUser);
      setIsAdmin(false);
      return true;
    }

    return false;
  };

  const logout = useCallback(() => {
    console.log('Logout function called');
    setUser(null);
    setIsAdmin(false);
  }, []);

  // Fetch data from Firestore when the app loads
  useEffect(() => {
    fetchUsersData();
  }, [fetchUsersData]);

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

