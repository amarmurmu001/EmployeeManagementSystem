import React from "react";



const NewTasks = ({ data, employeeData, updateTaskStatus }) => {

  const handleAccept = () => {

    updateTaskStatus(data.taskNumber, {

      active: true,

      completed: false,

      newTask: false,

      failed: false

    });

  };



  return (

    <div className="mt-6">

      <button

        onClick={handleAccept}

        className="w-full px-4 py-2 bg-[#00ff0015] hover:bg-[#00ff0030] text-[#00ff00] text-sm rounded-lg transition-colors"

      >

        Accept Task

      </button>

    </div>

  );

};



export default NewTasks;














