import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthProvider";
import { supabase } from '../../config/supabaseClient';
import toast from 'react-hot-toast';
import { ChevronDown, ChevronRight } from 'lucide-react';

const AllTasks = () => {
  const [userData] = useContext(AuthContext);
  const [allTasks, setAllTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedEmployees, setExpandedEmployees] = useState({});

  const fetchAllTasks = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          users (
            id,
            name,
            email,
            task_counts
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        toast.error('Error fetching tasks: ' + error.message);
        return;
      }

      const formattedTasks = data?.map(task => ({
        id: task.id,
        taskNumber: task.task_number,
        title: task.title,
        description: task.description,
        date: task.date,
        category: task.category,
        active: task.active,
        completed: task.completed,
        newTask: task.new_task,
        failed: task.failed,
        userId: task.user_id,
        employeeName: task.users?.name || 'Unknown',
        employeeEmail: task.users?.email || 'Unknown',
        taskCounts: task.users?.task_counts,
        created_at: task.created_at
      })) || [];

      // Group tasks by employee
      const groupedTasks = formattedTasks.reduce((acc, task) => {
        const employeeKey = `${task.userId}-${task.employeeName}-${task.employeeEmail}`;
        if (!acc[employeeKey]) {
          acc[employeeKey] = {
            employeeId: task.userId,
            employeeName: task.employeeName,
            employeeEmail: task.employeeEmail,
            taskCounts: task.taskCounts,
            tasks: []
          };
        }
        acc[employeeKey].tasks.push(task);
        return acc;
      }, {});

      setAllTasks(Object.values(groupedTasks));
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllTasks();

    const tasksChannel = supabase
      .channel('custom-all-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks'
        },
        (payload) => {
          console.log('Real-time update:', payload);
          fetchAllTasks();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(tasksChannel);
    };
  }, []);

  const toggleEmployeeExpand = (employeeEmail) => {
    setExpandedEmployees(prev => ({
      ...prev,
      [employeeEmail]: !prev[employeeEmail]
    }));
  };

  if (isLoading) {
    return <div className="mt-8 text-[#00ff00]">Loading tasks...</div>;
  }

  // Desktop View
  const TableView = () => (
    <div className="hidden md:block overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-[#00ff0030]">
            <th className="py-3 px-4 text-left text-sm text-gray-300">Employee</th>
            <th className="py-3 px-4 text-left text-sm text-gray-300">Total Tasks</th>
            <th className="py-3 px-4 text-left text-sm text-gray-300">Actions</th>
          </tr>
        </thead>
        <tbody>
          {allTasks.map((employee) => (
            <>
              <tr 
                key={employee.employeeEmail}
                className="border-b border-[#00ff0030] hover:bg-black/30 transition-colors cursor-pointer"
                onClick={() => toggleEmployeeExpand(employee.employeeEmail)}
              >
                <td className="py-4 px-4">
                  <div>
                    <p className="text-white font-semibold">{employee.employeeName}</p>
                    <p className="text-sm text-gray-400">{employee.employeeEmail}</p>
                  </div>
                </td>
                <td className="py-4 px-4 text-[#00ff00]">
                  {employee.tasks.length} Tasks
                </td>
                <td className="py-4 px-4">
                  {expandedEmployees[employee.employeeEmail] ? 
                    <ChevronDown className="text-white" /> : 
                    <ChevronRight className="text-white" />
                  }
                </td>
              </tr>
              {expandedEmployees[employee.employeeEmail] && (
                <tr>
                  <td colSpan="3" className="p-0">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-[#00ff0030]">
                          <th className="py-2 px-4 text-left text-sm text-gray-300">Title</th>
                          <th className="py-2 px-4 text-left text-sm text-gray-300">Status</th>
                          <th className="py-2 px-4 text-left text-sm text-gray-300">Category</th>
                          <th className="py-2 px-4 text-left text-sm text-gray-300">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {employee.tasks.map((task) => (
                          <tr 
                            key={task.taskNumber} 
                            className="border-b border-[#00ff0030] hover:bg-black/20"
                          >
                            <td className="py-3 px-4">
                              <div>
                                <h3 className="font-semibold text-white">{task.title}</h3>
                                <p className="text-sm text-gray-400 mt-1">{task.description}</p>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded text-xs ${
                                task.active ? 'bg-blue-500/20 text-blue-500' :
                                task.completed ? 'bg-green-500/20 text-green-500' :
                                task.failed ? 'bg-red-500/20 text-red-500' :
                                'bg-yellow-500/20 text-yellow-500'
                              }`}>
                                {task.active ? 'Active' :
                                 task.completed ? 'Completed' :
                                 task.failed ? 'Failed' :
                                 'New'}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-[#00ff00]">{task.category}</td>
                            <td className="py-3 px-4 text-gray-400">{task.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );

  // Mobile View (Card-based)
  const CardView = () => (
    <div className="md:hidden space-y-4">
      {allTasks.map((employee) => (
        <div 
          key={employee.employeeEmail} 
          className="bg-black/50 border border-[#00ff0030] rounded-lg"
        >
          <div 
            className="p-4 flex justify-between items-center cursor-pointer"
            onClick={() => toggleEmployeeExpand(employee.employeeEmail)}
          >
            <div>
              <h3 className="text-white font-semibold">{employee.employeeName}</h3>
              <p className="text-sm text-gray-400">{employee.employeeEmail}</p>
            </div>
            <div className="flex items-center">
              <span className="mr-2 text-[#00ff00]">{employee.tasks.length} Tasks</span>
              {expandedEmployees[employee.employeeEmail] ? 
                <ChevronDown className="text-white" /> : 
                <ChevronRight className="text-white" />
              }
            </div>
          </div>

          {expandedEmployees[employee.employeeEmail] && (
            <div className="p-4 pt-0 space-y-4">
              {employee.tasks.map((task) => (
                <div
                  key={task.taskNumber}
                  className="p-4 bg-black/30 border border-[#00ff0030] rounded-lg space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-white">{task.title}</h3>
                    <span className={`px-2 py-1 rounded text-xs ${
                      task.active ? 'bg-blue-500/20 text-blue-500' :
                      task.completed ? 'bg-green-500/20 text-green-500' :
                      task.failed ? 'bg-red-500/20 text-red-500' :
                      'bg-yellow-500/20 text-yellow-500'
                    }`}>
                      {task.active ? 'Active' :
                       task.completed ? 'Completed' :
                       task.failed ? 'Failed' :
                       'New'}
                    </span>
                  </div>

                  <p className="text-sm text-gray-400">{task.description}</p>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-gray-400">Category</p>
                      <p className="text-[#00ff00]">{task.category}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Date</p>
                      <p className="text-white">{task.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-white mb-6">All Tasks</h2>
      {allTasks.length === 0 ? (
        <div className="text-center text-gray-400">No tasks found</div>
      ) : (
        <>
          <TableView />
          <CardView />
        </>
      )}
    </div>
  );
};

export default AllTasks;