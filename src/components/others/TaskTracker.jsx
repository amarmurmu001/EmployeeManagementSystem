import React, { useEffect, useState } from "react";
import { supabase } from '../../config/supabaseClient';

const TaskTracker = ({ data }) => {
  const [taskCounts, setTaskCounts] = useState({
    newTask: 0,
    completed: 0,
    active: 0,
    failed: 0
  });

  const fetchTaskCounts = async () => {
    try {
      const { data: tasks, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', data.id);

      if (error) throw error;

      // Calculate counts from actual tasks
      const counts = tasks.reduce((acc, task) => ({
        newTask: acc.newTask + (task.new_task ? 1 : 0),
        completed: acc.completed + (task.completed ? 1 : 0),
        active: acc.active + (task.active ? 1 : 0),
        failed: acc.failed + (task.failed ? 1 : 0)
      }), { newTask: 0, completed: 0, active: 0, failed: 0 });

      setTaskCounts(counts);

      // Update database if counts don't match
      if (JSON.stringify(counts) !== JSON.stringify(data.taskCounts)) {
        await supabase
          .from('users')
          .update({ task_counts: counts })
          .eq('id', data.id);
      }
    } catch (error) {
      console.error('Error fetching task counts:', error);
    }
  };

  useEffect(() => {
    fetchTaskCounts();

    // Subscribe to task changes
    const tasksChannel = supabase
      .channel('task-counts-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
          filter: `user_id=eq.${data.id}`
        },
        () => {
          fetchTaskCounts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(tasksChannel);
    };
  }, [data.id]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-10">
      <div className="card p-6 neon-glow">
        <h2 className="text-3xl font-bold text-[#00ff00]">{taskCounts.newTask}</h2>
        <h3 className="text-lg text-gray-300">New Tasks</h3>
      </div>

      <div className="card p-6 neon-glow">
        <h2 className="text-3xl font-bold text-[#00ff00]">{taskCounts.completed}</h2>
        <h3 className="text-lg text-gray-300">Completed Tasks</h3>
      </div>

      <div className="card p-6 neon-glow">
        <h2 className="text-3xl font-bold text-[#00ff00]">{taskCounts.active}</h2>
        <h3 className="text-lg text-gray-300">Active Tasks</h3>
      </div>

      <div className="card p-6 neon-glow">
        <h2 className="text-3xl font-bold text-[#00ff00]">{taskCounts.failed}</h2>
        <h3 className="text-lg text-gray-300">Failed Tasks</h3>
      </div>
    </div>
  );
};

export default TaskTracker;


