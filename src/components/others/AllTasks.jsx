import React, { useContext } from "react";

import { AuthContext } from "../../context/AuthProvider";



const AllTasks = () => {

  const [userData] = useContext(AuthContext);

  

  return (

    <div className="card p-6 mt-8 overflow-x-auto">

      {/* Desktop View */}

      <div className="hidden md:block">

        <div className="grid grid-cols-5 gap-4 mb-6 text-gray-400 text-sm">

          <h3>Employee Name</h3>

          <h3>New Tasks</h3>

          <h3>Active Tasks</h3>

          <h3>Completed Tasks</h3>

          <h3>Failed Tasks</h3>

        </div>



        <div className="space-y-4">

          {userData.map((elem, index) => (

            <div key={index} className="grid grid-cols-5 gap-4 p-4 border border-[#00ff0030] rounded-lg hover:border-[#00ff00] transition-colors">

              <p className="text-white">{elem.name}</p>

              <p className="text-[#00ff00]">{elem.taskCounts.newTask}</p>

              <p className="text-blue-400">{elem.taskCounts.active}</p>

              <p className="text-green-400">{elem.taskCounts.completed}</p>

              <p className="text-red-400">{elem.taskCounts.failed}</p>

            </div>

          ))}

        </div>

      </div>



      {/* Mobile View */}

      <div className="md:hidden space-y-6">

        {userData.map((elem, index) => (

          <div key={index} className="border border-[#00ff0030] rounded-lg p-4 hover:border-[#00ff00] transition-colors space-y-3">

            <div className="flex justify-between items-center border-b border-[#00ff0015] pb-2">

              <h3 className="text-white font-medium">{elem.name}</h3>

            </div>

            

            <div className="grid grid-cols-2 gap-3">

              <div className="space-y-1">

                <p className="text-xs text-gray-400">New Tasks</p>

                <p className="text-[#00ff00] font-medium">{elem.taskCounts.newTask}</p>

              </div>

              

              <div className="space-y-1">

                <p className="text-xs text-gray-400">Active Tasks</p>

                <p className="text-blue-400 font-medium">{elem.taskCounts.active}</p>

              </div>

              

              <div className="space-y-1">

                <p className="text-xs text-gray-400">Completed Tasks</p>

                <p className="text-green-400 font-medium">{elem.taskCounts.completed}</p>

              </div>

              

              <div className="space-y-1">

                <p className="text-xs text-gray-400">Failed Tasks</p>

                <p className="text-red-400 font-medium">{elem.taskCounts.failed}</p>

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>

  );

};



export default AllTasks;


