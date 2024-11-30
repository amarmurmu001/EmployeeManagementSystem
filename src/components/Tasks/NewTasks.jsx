import React from "react";



const NewTasks = ({ data, employeeData, updateTaskStatus }) => {

  const handleAccept = () => {

    if (updateTaskStatus) {

      updateTaskStatus(data.taskNumber, {

        active: true,

        completed: false,

        newTask: false,

        failed: false

      });

    }

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



      <div className="mt-6">

        <button

          onClick={handleAccept}

          className="w-full px-4 py-2 bg-[#00ff0015] hover:bg-[#00ff0030] text-[#00ff00] text-sm rounded-lg transition-colors"

        >

          Accept Task

        </button>

      </div>

    </div>

  );

};



export default NewTasks;














