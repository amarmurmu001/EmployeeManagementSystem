import React from "react";

import Header from "../others/Header";

import CreateTask from "../others/CreateTask";

import AllTasks from "../others/AllTasks";



const AdminDashboard = ({ data, changeUser }) => {

  return (

    <div className="min-h-screen w-full bg-black p-10 relative overflow-hidden">

      {/* Background grid effect - reduced opacity */}

      <div className="fixed inset-0 bg-[linear-gradient(to_right,#4f4f4f10_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f10_1px,transparent_1px)] bg-[size:14px_24px]"></div>

      

      {/* Glow effects - reduced blur and opacity */}

      <div className="fixed -top-24 -left-24 w-96 h-96 bg-[#00ff0008] rounded-full opacity-50"></div>

      <div className="fixed -bottom-24 -right-24 w-96 h-96 bg-[#00ff0008] rounded-full opacity-50"></div>

      

      <div className="relative z-10">

        <Header changeUser={changeUser} data={data} />

        <CreateTask />

        <AllTasks />

      </div>

    </div>

  );

};



export default AdminDashboard;


