import React, { useState } from "react";

import CreateEmployee from "./CreateEmployee";



const Header = ({ data, changeUser, isAdmin }) => {

  const [showCreateEmployee, setShowCreateEmployee] = useState(false);



  const handleLogout = () => {

    localStorage.setItem("loggedInUser", "");

    changeUser("");

  };



  return (

    <>

      <div className="flex items-center justify-between mb-8">

        <div>

          <h1 className="text-gray-400">Welcome back,</h1>

          <h2 className="text-2xl font-bold text-white">{data.name}</h2>

        </div>

        <div className="flex gap-4">

          {isAdmin && (

            <button

              onClick={() => setShowCreateEmployee(true)}

              className="px-4 py-2 bg-[#00ff0015] hover:bg-[#00ff0030] text-[#00ff00] text-sm rounded-lg transition-colors"

            >

              Add Employee

            </button>

          )}

          <button

            onClick={handleLogout}

            className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-sm rounded-lg transition-colors"

          >

            Logout

          </button>

        </div>

      </div>



      {/* Overlay */}

      {showCreateEmployee && (

        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">

          <div className="relative w-full max-w-md mx-4">

            {/* Close button */}

            <button

              onClick={() => setShowCreateEmployee(false)}

              className="absolute -top-2 -right-2 w-8 h-8 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-full flex items-center justify-center"

            >

              ×

            </button>

            

            {/* Create Employee Form */}

            <div className="bg-black/90 border border-[#00ff0030] rounded-lg">

              <CreateEmployee onClose={() => setShowCreateEmployee(false)} />

            </div>

          </div>

        </div>

      )}

    </>

  );

};



export default Header;














