import React, { useContext, useEffect, useState } from "react";

import { AuthContext } from "../../context/AuthProvider";

import AcceptTasks from "./AcceptTasks";

import NewTasks from "./NewTasks";

import CompleteTasks from "./CompleteTasks";

import FailedTasks from "./FailedTasks";

import toast from 'react-hot-toast';

import { supabase } from '../../config/supabaseClient';



const TaskList = ({ data }) => {

  const [userData, setUserData] = useContext(AuthContext);

  const [tasks, setTasks] = useState([]);

  const [isLoading, setIsLoading] = useState(true);



  const fetchTasks = async () => {

    try {

      setIsLoading(true);

      const { data: taskData, error } = await supabase

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

        .eq('user_id', data.id)

        .order('created_at', { ascending: false });



      if (error) throw error;



      const formattedTasks = taskData.map(task => ({

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

        taskCounts: task.users?.task_counts

      }));



      // Calculate current task counts

      const currentTaskCounts = formattedTasks.reduce((acc, task) => ({

        active: acc.active + (task.active ? 1 : 0),

        completed: acc.completed + (task.completed ? 1 : 0),

        newTask: acc.newTask + (task.newTask ? 1 : 0),

        failed: acc.failed + (task.failed ? 1 : 0)

      }), { active: 0, completed: 0, newTask: 0, failed: 0 });



      // Update user's task counts if they don't match

      if (JSON.stringify(currentTaskCounts) !== JSON.stringify(data.taskCounts)) {

        const { error: updateError } = await supabase

          .from('users')

          .update({ task_counts: currentTaskCounts })

          .eq('id', data.id);



        if (!updateError) {

          // Update local userData state with new counts

          setUserData(prevData => prevData.map(user => 

            user.id === data.id 

              ? { ...user, taskCounts: currentTaskCounts }

              : user

          ));

        }

      }



      setTasks(formattedTasks);

      setIsLoading(false);

    } catch (error) {

      console.error('Error fetching tasks:', error);

      toast.error('Failed to fetch tasks');

    }

  };



  useEffect(() => {

    fetchTasks();



    const tasksChannel = supabase

      .channel('custom-employee-channel')

      .on(

        'postgres_changes',

        {

          event: '*',

          schema: 'public',

          table: 'tasks',

          filter: `user_id=eq.${data.id}`

        },

        (payload) => {

          console.log('Real-time update:', payload);

          fetchTasks();

        }

      )

      .subscribe();



    return () => {

      supabase.removeChannel(tasksChannel);

    };

  }, [data.id]);



  const updateTaskStatus = async (taskNumber, newStatus) => {

    try {

      // Update task in Supabase

      const { error: updateError } = await supabase

        .from('tasks')

        .update({

          active: newStatus.active,

          completed: newStatus.completed,

          new_task: newStatus.newTask,

          failed: newStatus.failed

        })

        .eq('task_number', taskNumber)

        .eq('user_id', data.id);



      if (updateError) throw updateError;



      // Update local tasks state

      const updatedTasks = tasks.map(task => 

        task.taskNumber === taskNumber ? { ...task, ...newStatus } : task

      );



      // Calculate new task counts

      const taskCounts = updatedTasks.reduce((acc, task) => ({

        active: acc.active + (task.active ? 1 : 0),

        completed: acc.completed + (task.completed ? 1 : 0),

        newTask: acc.newTask + (task.newTask ? 1 : 0),

        failed: acc.failed + (task.failed ? 1 : 0)

      }), { active: 0, completed: 0, newTask: 0, failed: 0 });



      // Update user's task counts in Supabase

      const { error: userUpdateError } = await supabase

        .from('users')

        .update({ task_counts: taskCounts })

        .eq('id', data.id);



      if (userUpdateError) throw userUpdateError;



      // Update local states

      setTasks(updatedTasks);

      setUserData(prevData => prevData.map(user => 

        user.id === data.id 

          ? { ...user, taskCounts }

          : user

      ));



      toast.success('Task status updated successfully!');

    } catch (error) {

      console.error('Error updating task status:', error);

      toast.error('Failed to update task status');

      // Refresh tasks to ensure consistency

      fetchTasks();

    }

  };



  if (isLoading) {

    return <div className="text-[#00ff00]">Loading tasks...</div>;

  }



  const renderTaskSection = (title, filterFn, TaskComponent) => (

    <div className="mt-8">

      <h3 className="text-xl font-semibold text-white mb-4">{title}</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {tasks.filter(filterFn).map((task) => (

          <div

            key={task.taskNumber}

            className="p-6 bg-black/50 border border-[#00ff0030] rounded-lg space-y-4"

          >

            <div className="flex justify-between items-start">

              <h3 className="text-lg font-semibold text-white">{task.title}</h3>

              <div className="flex items-center gap-2">

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

            </div>



            <div className="space-y-2">

              <p className="text-gray-400 text-sm">{task.description}</p>

              <div className="flex justify-between text-sm">

                <span className="text-[#00ff00]">{task.category}</span>

                <span className="text-gray-400">{task.date}</span>

              </div>

            </div>



            {TaskComponent && (

              <TaskComponent

                data={task}

                employeeData={data}

                updateTaskStatus={updateTaskStatus}

              />

            )}

          </div>

        ))}

        {tasks.filter(filterFn).length === 0 && (

          <div className="col-span-full text-center text-gray-400">

            No {title.toLowerCase()} found

          </div>

        )}

      </div>

    </div>

  );



  return (

    <div className="mt-8 space-y-8">

      {renderTaskSection("Active Tasks", task => task.active, AcceptTasks)}

      {renderTaskSection("New Tasks", task => task.newTask, NewTasks)}

      {renderTaskSection("Completed Tasks", task => task.completed, CompleteTasks)}

      {renderTaskSection("Failed Tasks", task => task.failed, FailedTasks)}

    </div>

  );

};



export default TaskList;






























































