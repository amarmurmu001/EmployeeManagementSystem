import React, { useEffect, useState } from "react";

const NewTasks = ({ data, employeeData }) => {
  const [newTaskStatus, setnewTaskStatus] = useState(true);
  const acceptNewTask = () => {
    /*employeeData.tasks.forEach((elem) => {
      if (elem.title === data.title) {
        elem.active = true;
        elem.newTask = false;
      }
    });*/
    const taskIndex = employeeData.tasks.findIndex((elem) => {
      return elem.newTask === true;
    });

    if (taskIndex !== -1) {
      const currentTask = employeeData.tasks[taskIndex];
      currentTask.active = true;
      currentTask.newTask = false;
      localStorage.setItem("taskStatus", "accepted");
    }
  };

  useEffect(() => {
    const storedTaskStatus = localStorage.getItem("taskStatus");
    console.log(storedTaskStatus);
    if (storedTaskStatus === "accepted") {
      setnewTaskStatus(false);
    }
  }, [data.title]);

  return (
    <div className="card p-6 min-w-[300px] flex-shrink-0">
      <div className="flex justify-between items-center">
        <span className="text-xs text-[#00ff00] border border-[#00ff0030] rounded-full px-3 py-1">
          {data.category}
        </span>
        <span className="text-sm text-gray-400">{data.date}</span>
      </div>

      <h2 className="mt-4 text-xl font-semibold text-white">{data.title}</h2>
      <p className="mt-2 text-sm text-gray-400">{data.description}</p>

      <div className="mt-6">
        {newTaskStatus ? (
          <button onClick={acceptNewTask} className="button-primary w-full">
            Accept Task
          </button>
        ) : (
          <div className="flex gap-3">
            <button className="button-primary flex-1">Mark as Completed</button>
            <button className="flex-1 bg-black/50 border border-red-500 text-red-500 rounded-md px-4 py-3 hover:bg-red-500/10 transition-colors">
              Mark as Failed
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewTasks;
