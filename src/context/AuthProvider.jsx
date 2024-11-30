import React, { createContext, useState, useEffect } from "react";
import { supabase } from '../config/supabaseClient';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [adminData, setAdminData] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch users and their tasks, excluding admin users
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select(`
          *,
          tasks (*)
        `)
        .eq('is_admin', false); // Only fetch non-admin users

      if (usersError) throw usersError;

      // Transform data to match your current structure
      const transformedUsers = users.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        password: user.password,
        isAdmin: user.is_admin,
        taskCounts: user.task_counts,
        tasks: user.tasks ? user.tasks.map(task => ({
          taskNumber: task.task_number,
          title: task.title,
          description: task.description,
          date: task.date,
          category: task.category,
          active: task.active,
          completed: task.completed,
          newTask: task.new_task,
          failed: task.failed
        })) : []
      }));

      setUserData(transformedUsers);

      // Fetch admin user separately
      const { data: admin, error: adminError } = await supabase
        .from('users')
        .select('*')
        .eq('is_admin', true)
        .single();

      if (adminError) {
        console.error('Error fetching admin:', adminError);
      } else if (admin) {
        setAdminData({
          id: admin.id,
          name: admin.name,
          email: admin.email,
          password: admin.password,
          isAdmin: admin.is_admin
        });
      }

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <AuthContext.Provider value={[userData, setUserData, adminData, setAdminData]}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;


