import React, { createContext, useState, useEffect } from "react";

import { getLocalStorage, setLocalStorage } from "../utils/localStorage";



export const AuthContext = createContext();



const AuthProvider = ({ children }) => {

  const [userData, setUserData] = useState(null);

  const [adminData, setAdminData] = useState(null);



  useEffect(() => {

    // Initialize localStorage if empty

    const storedEmployees = localStorage.getItem("employees");

    const storedAdmin = localStorage.getItem("admin");

    

    if (!storedEmployees || !storedAdmin) {

      setLocalStorage();

    }



    // Get data from localStorage

    const { employeeData, adminData } = getLocalStorage();

    setUserData(employeeData);

    setAdminData(adminData);

  }, []);



  return (

    <div>

      <AuthContext.Provider value={[userData, setUserData, adminData, setAdminData]}>

        {children}

      </AuthContext.Provider>

    </div>

  );

};



export default AuthProvider;


