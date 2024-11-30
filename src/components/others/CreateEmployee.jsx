import React, { useContext, useState } from "react";

import { AuthContext } from "../../context/AuthProvider";

import toast from 'react-hot-toast';

import { supabase } from '../../config/supabaseClient';

const CreateEmployee = ({ onClose }) => {

  const [userData, setUserData] = useContext(AuthContext);

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);



  const handleSubmit = async (e) => {

    e.preventDefault();

    setIsLoading(true);



    try {

      // Validate inputs

      if (!name || !email || !password) {

        throw new Error('All fields are required!');

      }



      // Check if email already exists

      const { data: existingUser, error: checkError } = await supabase

        .from('users')

        .select('id')

        .eq('email', email)

        .maybeSingle();



      if (existingUser) {

        throw new Error('Email already exists!');

      }



      // Create new employee in Supabase

      const { data: newEmployee, error: createError } = await supabase

        .from('users')

        .insert([{

          name,

          email,

          password,

          is_admin: false,

          task_counts: {

            active: 0,

            completed: 0,

            newTask: 0,

            failed: 0

          }

        }])

        .select()

        .single();



      if (createError) {

        console.error('Create error:', createError);

        throw new Error('Failed to create employee');

      }



      // Update context with new employee

      setUserData(prevData => [...prevData, {

        id: newEmployee.id,

        name: newEmployee.name,

        email: newEmployee.email,

        password: newEmployee.password,

        isAdmin: newEmployee.is_admin,

        taskCounts: newEmployee.task_counts,

        tasks: []

      }]);



      toast.success('Employee created successfully!');

      onClose();

    } catch (error) {

      console.error('Error:', error);

      toast.error(error.message || 'Failed to create employee');

    } finally {

      setIsLoading(false);

    }

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
