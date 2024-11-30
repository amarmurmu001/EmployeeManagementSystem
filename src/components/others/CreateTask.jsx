import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthProvider";
import { supabase } from '../../config/supabaseClient';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const CreateTask = () => {
  const [userData] = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [date, setDate] = useState("");
  const [empName, setEmpName] = useState("");
  const [category, setCategory] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const formattedDate = date ? format(new Date(date), 'MMM dd, yyyy') : '';

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    setDate(selectedDate);
    setShowDatePicker(false);
  };

  const handleDateClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDatePicker(true);
  };

  const today = new Date().toISOString().split('T')[0];

  const resetForm = () => {
    setTitle("");
    setDesc("");
    setDate("");
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
          date,
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
            <div className="relative">
              <input
                type="text"
                value={formattedDate}
                onClick={handleDateClick}
                readOnly
                className="w-full px-4 py-2 bg-black/50 border border-[#00ff0030] focus:border-[#00ff00] text-white rounded-lg outline-none transition-colors cursor-pointer"
                placeholder="Select date"
              />
              {showDatePicker && (
                <>
                  <div 
                    className="fixed inset-0 z-40"
                    onClick={() => setShowDatePicker(false)}
                  />
                  <div className="absolute top-full left-0 mt-1 z-50">
                    <div className="bg-black/90 border border-[#00ff0030] rounded-lg p-4 shadow-lg">
                      <input
                        type="date"
                        value={date}
                        min={today}
                        onChange={handleDateChange}
                        className="w-full px-4 py-2 bg-black/50 border border-[#00ff0030] focus:border-[#00ff00] text-white rounded-lg outline-none transition-colors"
                        onBlur={() => setShowDatePicker(false)}
                      />
                    </div>
                  </div>
                </>
              )}
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
    </div>
  );
};

export default CreateTask;


