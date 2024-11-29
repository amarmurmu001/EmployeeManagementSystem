import React from "react";

const TaskTracker = ({ data }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-10">
      <div className="card p-6 neon-glow">
        <h2 className="text-3xl font-bold text-[#00ff00]">{data.taskCounts.newTask}</h2>
        <h3 className="text-lg text-gray-300">New Tasks</h3>
      </div>
      <div className="card p-6 neon-glow">
        <h2 className="text-3xl font-bold text-[#00ff00]">{data.taskCounts.completed}</h2>
        <h3 className="text-lg text-gray-300">Completed Tasks</h3>
      </div>
      <div className="card p-6 neon-glow">
        <h2 className="text-3xl font-bold text-[#00ff00]">{data.taskCounts.active}</h2>
        <h3 className="text-lg text-gray-300">Active Tasks</h3>
      </div>
      <div className="card p-6 neon-glow">
        <h2 className="text-3xl font-bold text-[#00ff00]">{data.taskCounts.failed}</h2>
        <h3 className="text-lg text-gray-300">Failed Tasks</h3>
      </div>
    </div>
  );
};

export default TaskTracker;
