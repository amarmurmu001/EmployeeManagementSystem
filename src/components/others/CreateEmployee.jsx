import React, { useContext, useState } from "react";

import { AuthContext } from "../../context/AuthProvider";

import toast from 'react-hot-toast';



const CreateEmployee = ({ onClose }) => {

  const [userData, setUserData] = useContext(AuthContext);

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");



  const handleSubmit = (e) => {

    e.preventDefault();



    // Validate inputs

    if (!name || !email || !password) {

      toast.error('All fields are required!', {

        style: {

          border: '1px solid #ff0000',

          padding: '16px',

          background: '#000',

          color: '#fff',

        },

      });

      return;

    }



    // Check if email already exists

    const emailExists = userData.some(user => user.email === email);

    if (emailExists) {

      toast.error('Email already exists!', {

        style: {

          border: '1px solid #ff0000',

          padding: '16px',

          background: '#000',

          color: '#fff',

        },

      });

      return;

    }



    const newEmployee = {

      id: Math.max(...userData.map(u => u.id)) + 1,

      name,

      email,

      password,

      taskCounts: {

        active: 0,

        completed: 0,

        newTask: 0,

        failed: 0,

      },

      tasks: [],

    };



    const updatedUserData = [...userData, newEmployee];

    setUserData(updatedUserData);

    localStorage.setItem('employees', JSON.stringify(updatedUserData));



    toast.success('Employee created successfully!');

    

    // Close the overlay after successful creation

    onClose();

  };



  return (

    <div className="p-6">

      <h2 className="text-2xl font-bold text-white mb-6">Create New Employee</h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        <div className="space-y-2">

          <label className="text-sm text-gray-300">Name</label>

          <input

            type="text"

            value={name}

            onChange={(e) => setName(e.target.value)}

            className="w-full px-4 py-2 bg-black/50 border border-[#00ff0030] focus:border-[#00ff00] text-white rounded-lg outline-none transition-colors"

            placeholder="Enter employee name"

          />

        </div>



        <div className="space-y-2">

          <label className="text-sm text-gray-300">Email</label>

          <input

            type="email"

            value={email}

            onChange={(e) => setEmail(e.target.value)}

            className="w-full px-4 py-2 bg-black/50 border border-[#00ff0030] focus:border-[#00ff00] text-white rounded-lg outline-none transition-colors"

            placeholder="Enter employee email"

          />

        </div>



        <div className="space-y-2">

          <label className="text-sm text-gray-300">Password</label>

          <input

            type="password"

            value={password}

            onChange={(e) => setPassword(e.target.value)}

            className="w-full px-4 py-2 bg-black/50 border border-[#00ff0030] focus:border-[#00ff00] text-white rounded-lg outline-none transition-colors"

            placeholder="Enter employee password"

          />

        </div>



        <button

          type="submit"

          className="w-full px-4 py-2 bg-[#00ff0015] hover:bg-[#00ff0030] text-[#00ff00] rounded-lg transition-colors"

        >

          Create Employee

        </button>

      </form>

    </div>

  );

};



export default CreateEmployee; 
