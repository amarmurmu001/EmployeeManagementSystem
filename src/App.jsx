import React, { useState, useEffect, useContext } from "react";

import { AuthContext } from "./context/AuthProvider";

import Login from "./components/Auth/Login";

import AdminDashboard from "./components/Dashboard/AdminDashboard";

import EmployeeDashboard from "./components/Dashboard/EmployeeDashboard";

import { Toaster } from 'react-hot-toast';

import { supabase } from './config/supabaseClient';



const App = () => {

  const [user, setUser] = useState(null);

  const [userData, setUserData] = useContext(AuthContext);

  const [loggedInUserData, setLoggedInUserData] = useState(null);

  const [isLoading, setIsLoading] = useState(true);



  useEffect(() => {

    // Check for logged in user in localStorage and session

    const checkUser = async () => {

      try {

        const storedUser = localStorage.getItem("loggedInUser");

        

        if (storedUser) {

          const parsedUser = JSON.parse(storedUser);

          

          // Verify user still exists in database

          const { data: dbUser, error } = await supabase

            .from('users')

            .select('*')

            .eq('id', parsedUser.data.id)

            .single();



          if (error) {

            throw error;

          }



          if (dbUser) {

            setUser(parsedUser.role);

            setLoggedInUserData(parsedUser.data);

          } else {

            // User no longer exists in database

            localStorage.removeItem("loggedInUser");

          }

        }

      } catch (error) {

        console.error('Session check error:', error);

        localStorage.removeItem("loggedInUser");

      } finally {

        setIsLoading(false);

      }

    };



    checkUser();

  }, []);



  const handleLogin = (role, data) => {

    const userInfo = { role, data };

    localStorage.setItem("loggedInUser", JSON.stringify(userInfo));

    setUser(role);

    setLoggedInUserData(data);

  };



  const handleLogout = () => {

    localStorage.removeItem("loggedInUser");

    setUser(null);

    setLoggedInUserData(null);

  };



  if (isLoading) {

    return (

      <div className="min-h-screen bg-black flex items-center justify-center">

        <div className="text-[#00ff00]">Loading...</div>

      </div>

    );

  }



  return (

    <>

      <Toaster position="top-right" />

      {!user ? (

        <Login handleLogin={handleLogin} />

      ) : user === "admin" ? (

        <AdminDashboard data={loggedInUserData} changeUser={handleLogout} />

      ) : (

        <EmployeeDashboard data={loggedInUserData} changeUser={handleLogout} />

      )}

    </>

  );

};



export default App;






























