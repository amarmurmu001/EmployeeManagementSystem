import React, { useContext, useEffect, useState } from "react";
import Login from "./components/Auth/Login";
import EmployeeDashboard from "./components/Dashboard/EmployeeDashboard";
import AdminDashboard from "./components/Dashboard/AdminDashboard";
import { getLocalStorage, setLocalStorage } from "./utils/localStorage";
import { AuthContext } from "./context/AuthProvider";
import { parse } from "postcss";
import { Toaster } from 'react-hot-toast';

const App = () => {
  const [user, setUser] = useState(null);
  const [userData, setUserData, adminData, setAdminData] =
    useContext(AuthContext);

  // This 'loggedInUserData' state is used to store the state of data of the currently logged in User.
  const [loggedInUserData, setloggedInUserData] = useState(null);

  useEffect(() => {
    // Sets the Data from time to time in the Local storage. Uses the "setLocalStorage" function, defined in localStorage.jsx.
    setLocalStorage();
  }, []);

  useEffect(() => {
    const newUser = localStorage.getItem("loggedInUser");
    if (newUser) {
      const parsedUser = JSON.parse(newUser);
      setUser(parsedUser.role);
      setloggedInUserData(parsedUser.data);
    }
  }, [userData]);


  const handleLogin = (email, password) => {
    if (email === "saksham8@gmail.com" && password === "sak") {
      // setting 'user' state to admin, coz admin is currently logged in.
      setUser("admin");
      // Setting loggedInUserData to adminData
      // We use .find() in adminData so we can scan the data of specific admin that has signed in, in case of multiple admins.
      const admin = adminData[0];

      if (admin) {
        setloggedInUserData(admin);
        localStorage.setItem(
          "loggedInUser",
          JSON.stringify({ role: "admin", data: admin })
        );
        
      }
      // *************************
    } else if (userData) {
      const employee = userData.find((e) => {
        if (email === e.email && password === e.password) return true;
        else return false;
      });

      if (employee) {
        setUser("employee");
        setloggedInUserData(employee);
        localStorage.setItem(
          "loggedInUser",
          JSON.stringify({ role: "employee", data: employee })
        );
      }
    } else {
      alert("Invalid Credentials");
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      {!user ? (
        <Login handleLogin={handleLogin} />
      ) : user === "admin" ? (
        <AdminDashboard changeUser={setUser} data={loggedInUserData} />
      ) : user == "employee" ? (
        <EmployeeDashboard changeUser={setUser} data={loggedInUserData} />
      ) : null}
    </>
  );
};

export default App;
