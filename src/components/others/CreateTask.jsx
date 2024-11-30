import React, { useContext, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { AuthContext } from "../../context/AuthProvider";
import { supabase } from '../../config/supabaseClient';
import toast from 'react-hot-toast';

const CreateTask = () => {
  const [userData] = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [date, setDate] = useState(null);
  const [empName, setEmpName] = useState("");
  const [category, setCategory] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const resetForm = () => {
    setTitle("");
    setDesc("");
    setDate(null);
    setEmpName("");
    setCategory("");
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!title || !desc || !date || !empName || !category) {
        throw new Error('All fields are required');
      }

      // Convert date to ISO string for Supabase
      const formattedDate = date.toISOString().split('T')[0];

      // Find user by name
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('id, task_counts')
        .eq('name', empName)
        .eq('is_admin', false)
        .single();

      if (userError) throw userError;
      if (!user) throw new Error('Employee not found');

      const taskNumber = Math.floor(Math.random() * 1000000);

      // Create task
      const { error: taskError } = await supabase
        .from('tasks')
        .insert({
          task_number: taskNumber,
          title,
          description: desc,
          date: formattedDate,
          category,
          user_id: user.id,
          active: false,
          new_task: true,
          completed: false,
          failed: false
        });

      if (taskError) throw taskError;

      // Update user's task counts
      const newTaskCounts = {
        ...user.task_counts,
        newTask: (user.task_counts.newTask || 0) + 1
      };

      const { error: updateError } = await supabase
        .from('users')
        .update({ task_counts: newTaskCounts })
        .eq('id', user.id);

      if (updateError) throw updateError;

      toast.success('Task created successfully!');
      resetForm(); // Reset form after successful creation
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error(error.message || 'Failed to create task');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-white mb-6">Create New Task</h2>
      <form onSubmit={submitHandler} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm text-gray-300">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 bg-black/50 border border-[#00ff0030] focus:border-[#00ff00] text-white rounded-lg outline-none transition-colors"
              placeholder="Enter task title"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-300">Employee Name</label>
            <select
              value={empName}
              onChange={(e) => setEmpName(e.target.value)}
              className="w-full px-4 py-2 bg-black/50 border border-[#00ff0030] focus:border-[#00ff00] text-white rounded-lg outline-none transition-colors"
            >
              <option value="">Select Employee</option>
              {userData?.filter(user => !user.isAdmin).map((emp) => (
                <option key={emp.id} value={emp.name}>
                  {emp.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-300">Category</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 bg-black/50 border border-[#00ff0030] focus:border-[#00ff00] text-white rounded-lg outline-none transition-colors"
              placeholder="Enter task category"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-300">Date</label>
            <div className="w-full">
              <DatePicker
                selected={date}
                onChange={(date) => setDate(date)}
                minDate={new Date()}
                placeholderText="Select date"
                wrapperClassName="w-full"
                calendarClassName="custom-calendar"
                customInput={
                  <input
                    className="w-full px-4 py-2 bg-black/50 border border-[#00ff0030] focus:border-[#00ff00] text-white rounded-lg outline-none transition-colors"
                  />
                }
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-gray-300">Description</label>
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            className="w-full px-4 py-2 bg-black/50 border border-[#00ff0030] focus:border-[#00ff00] text-white rounded-lg outline-none transition-colors"
            placeholder="Enter task description"
            rows={4}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-4 py-2 bg-[#00ff0015] hover:bg-[#00ff0030] text-[#00ff00] rounded-lg transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Creating...' : 'Create Task'}
        </button>
      </form>
      
      <style jsx global>{`
        .custom-calendar {
          background-color: #121212 !important;
          border: 1px solid #00ff0050 !important;
          color: #fff !important;
          font-family: inherit;
        }
        .react-datepicker__header {
          background-color: #1e1e1e !important;
          border-bottom: 1px solid #00ff0050 !important;
        }
        .react-datepicker__current-month,
        .react-datepicker__day-name {
          color: #00ff00 !important;
        }
        .react-datepicker__day {
          color: #e0e0e0 !important;
          background-color: transparent !important;
        }
        .react-datepicker__day:hover {
          background-color: #00ff0030 !important;
          color: #00ff00 !important;
        }
        .react-datepicker__day--selected {
          background-color: #00ff0060 !important;
          color: #000 !important;
        }
        .react-datepicker__day--outside-month {
          color: #666 !important;
        }
        .react-datepicker__navigation {
          background-color: transparent !important;
        }
        .react-datepicker__navigation-icon::before {
          border-color: #00ff00 !important;
        }
      `}</style>
    </div>
  );
};

export default CreateTask;