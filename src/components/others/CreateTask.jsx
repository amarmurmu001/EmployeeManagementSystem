import React, { useContext, useState } from "react";
import { format } from 'date-fns';
import { AuthContext } from "../../context/AuthProvider";
import toast from 'react-hot-toast';

const CreateTask = () => {
  const [userData, setUserData] = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [date, setDate] = useState("");
  const [empName, setEmpName] = useState("");
  const [category, setCategory] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();

    const newTask = {
      taskNumber: Math.floor(Math.random() * 1000),
      title,
      description: desc,
      date,
      category,
      assignTo: empName,
      active: false,
      newTask: true,
      completed: false,
      failed: false,
    };

    const updatedUserData = JSON.parse(JSON.stringify(userData));

    const employeeIndex = updatedUserData.findIndex(e => newTask.assignTo === e.name);
    
    if (employeeIndex !== -1) {
      updatedUserData[employeeIndex].tasks.push(newTask);
      
      updatedUserData[employeeIndex].taskCounts.newTask += 1;

      setUserData(updatedUserData);
      localStorage.setItem('employees', JSON.stringify(updatedUserData));

      toast.success('Task created successfully!', {
        style: {
          border: '1px solid #00ff00',
          padding: '16px',
          background: '#000',
          color: '#fff',
        },
        iconTheme: {
          primary: '#00ff00',
          secondary: '#000',
        },
      });

      setTitle("");
      setDesc("");
      setDate("");
      setEmpName("");
      setCategory("");
    } else {
      toast.error('Employee not found!', {
        style: {
          border: '1px solid #ff0000',
          padding: '16px',
          background: '#000',
          color: '#fff',
        },
      });
    }
  };

  return (
    <div className="mt-7 card p-8">
      <h2 className="text-2xl font-bold text-white mb-6">Create New Task</h2>
      <form onSubmit={submitHandler} className="flex flex-wrap items-start justify-between w-full gap-6">
        <div className="w-full md:w-1/2">
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-300 mb-1 block">Task Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input"
                placeholder="Enter task title"
                type="text"
                required
              />
            </div>

            <div>
              <label className="text-sm text-gray-300 mb-1 block">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="input"
                required
              >
                <option value="">Select category</option>
                <option value="Development">Development</option>
                <option value="Design">Design</option>
                <option value="Marketing">Marketing</option>
                <option value="Research">Research</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-300 mb-1 block">Assign To</label>
              <select
                value={empName}
                onChange={(e) => setEmpName(e.target.value)}
                className="input"
                required
              >
                <option value="">Select employee</option>
                {userData.map((emp, index) => (
                  <option key={index} value={emp.name}>
                    {emp.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-300 mb-1 block">Due Date</label>
              <input
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="input"
                type="date"
                required
                min={format(new Date(), 'yyyy-MM-dd')}
              />
            </div>
          </div>
        </div>

        <div className="w-full md:w-[45%]">
          <label className="text-sm text-gray-300 mb-1 block">Description</label>
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            className="input h-[220px] resize-none"
            placeholder="Enter task description"
            required
          ></textarea>
        </div>

        <button type="submit" className="button-primary w-full">
          Create Task
        </button>
      </form>
    </div>
  );
};

export default CreateTask;






























