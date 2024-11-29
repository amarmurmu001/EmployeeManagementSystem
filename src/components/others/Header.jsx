import React from "react";

const Header = ({ data, changeUser }) => {
  const handleLogout = () => {
    localStorage.setItem("loggedInUser", "");
    changeUser("");
  };

  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-gray-400">Welcome back,</h1>
        <h2 className="text-2xl font-bold text-[#00ff00]">{data.name} 👋</h2>
      </div>
      <button
        onClick={handleLogout}
        className="px-6 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-500/10 transition-colors"
      >
        Log out
      </button>
    </div>
  );
};

export default Header;
