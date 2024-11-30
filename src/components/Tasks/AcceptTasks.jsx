import React from "react";



const AcceptTasks = ({ data, employeeData, updateTaskStatus }) => {

  const handleComplete = () => {

    updateTaskStatus(data.taskNumber, {

      active: false,

      completed: true,

      newTask: false,

      failed: false

    });

  };



  const handleFailed = () => {

    updateTaskStatus(data.taskNumber, {

      active: false,

      completed: false,

      newTask: false,

      failed: true

    });

  };



  return (

    <div className="bg-black/90 border border-[#00ff0030] hover:border-[#00ff00] transition-colors rounded-lg p-6">

      <div className="flex justify-between items-center">

        <span className="px-3 py-1 text-xs bg-[#00ff0015] text-[#00ff00] rounded-full">

          {data.category}

        </span>

        <span className="text-sm text-gray-400">{data.date}</span>

      </div>



      <h3 className="mt-4 text-lg font-semibold text-white">{data.title}</h3>

      <p className="mt-2 text-sm text-gray-400">{data.description}</p>



      <div className="mt-6 flex gap-3">

        <button 

          onClick={handleComplete}

          className="flex-1 px-4 py-2 bg-[#00ff0015] hover:bg-[#00ff0030] text-[#00ff00] text-sm rounded-lg transition-colors"

        >

          Complete

        </button>

        <button 

          onClick={handleFailed}

          className="flex-1 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-sm rounded-lg transition-colors"

        >

          Failed

        </button>

      </div>

    </div>

  );

};



export default AcceptTasks;






