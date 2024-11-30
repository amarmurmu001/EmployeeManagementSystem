import React from "react";

import Header from "../others/Header";

import CreateTask from "../others/CreateTask";

import AllTasks from "../others/AllTasks";



const AdminDashboard = ({ data, changeUser }) => {

  return (

    <div className="min-h-screen w-full bg-black p-10 relative overflow-hidden">

      {/* Background grid effect */}

      <div className="fixed inset-0 bg-[linear-gradient(to_right,#4f4f4f10_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f10_1px,transparent_1px)] bg-[size:14px_24px]"></div>



      {/* Glow effects */}

      <div className="fixed -top-24 -left-24 w-64 md:w-96 h-64 md:h-96 bg-[#00ff0008] md:bg-[#00ff0015] blur-[80px] md:blur-[120px] rounded-full"></div>

      <div className="fixed -bottom-24 -right-24 w-64 md:w-96 h-64 md:h-96 bg-[#00ff0008] md:bg-[#00ff0015] blur-[80px] md:blur-[120px] rounded-full"></div>



      {/* Content */}

      <div className="relative z-10">

        <Header changeUser={changeUser} data={data} isAdmin={true} />

        <CreateTask />

        <AllTasks />

      </div>

    </div>

  );

};



export default AdminDashboard;






























































