import React, { useState } from "react";
import { supabase } from '../../config/supabaseClient';
import toast from 'react-hot-toast';

const Login = ({ handleLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: user, error } = await supabase
        .from('users')
        .select('id, name, email, is_admin, task_counts')
        .eq('email', email)
        .eq('password', password)
        .single();

      if (error) throw error;
      if (!user) throw new Error('Invalid credentials');

      const userInfo = {
        role: user.is_admin ? 'admin' : 'employee',
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          isAdmin: user.is_admin,
          taskCounts: user.task_counts,
        },
      };

      localStorage.setItem("loggedInUser", JSON.stringify(userInfo));
      handleLogin(userInfo.role, userInfo.data);
      toast.success('Login successful!');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-black p-10 flex items-center justify-center relative overflow-hidden">
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-black/90 border border-[#00ff0030] rounded-lg p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Login</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-300">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-black/50 border border-[#00ff0030] focus:border-[#00ff00] text-white rounded-lg outline-none transition-colors"
                placeholder="Enter your email"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-300">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-black/50 border border-[#00ff0030] focus:border-[#00ff00] text-white rounded-lg outline-none transition-colors"
                placeholder="Enter your password"
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-[#00ff0015] hover:bg-[#00ff0030] text-[#00ff00] rounded-lg transition-colors"
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
