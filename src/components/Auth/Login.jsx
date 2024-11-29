import React, { useState } from "react";







const Login = ({ handleLogin }) => {



  const [email, setEmail] = useState("");



  const [password, setPassword] = useState("");







  const submitHandler = (e) => {



    e.preventDefault();



    handleLogin(email, password);



    setEmail("");



    setPassword("");



  };







  return (



    <div className="min-h-screen w-full bg-black flex items-center justify-center p-4 relative overflow-hidden">



      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f15_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f15_1px,transparent_1px)] bg-[size:14px_24px]"></div>







      <div className="fixed -top-24 -left-24 w-64 md:w-96 h-64 md:h-96 bg-[#00ff0008] md:bg-[#00ff0015] blur-[80px] md:blur-[120px] rounded-full"></div>



      <div className="fixed -bottom-24 -right-24 w-64 md:w-96 h-64 md:h-96 bg-[#00ff0008] md:bg-[#00ff0015] blur-[80px] md:blur-[120px] rounded-full"></div>







      <div className="w-full max-w-md bg-black/90 rounded-lg border border-[#00ff0030] shadow-[0_0_15px_rgba(0,255,0,0.07)] p-6 md:p-10 relative z-10">



        <div className="mb-8 text-center">



          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">



            Welcome Back



          </h2>



          <div className="h-1 w-12 bg-[#00ff00] mx-auto rounded-full mb-3"></div>



          <p className="text-gray-400 text-sm md:text-base">Please enter your credentials</p>



        </div>







        <form onSubmit={submitHandler} className="space-y-4 md:space-y-5">



          <div className="space-y-2">



            <label className="text-sm text-gray-300 ml-1">Email</label>



            <input



              value={email}



              autoComplete="on"



              onChange={(e) => setEmail(e.target.value)}



              className="w-full bg-black/50 text-white placeholder:text-gray-600 border border-[#00ff0030] rounded-md px-4 py-2.5 md:py-3 focus:outline-none focus:border-[#00ff00] focus:ring-1 focus:ring-[#00ff00] transition-all text-sm md:text-base"



              required



              type="email"



              placeholder="Enter your email"



            />



          </div>







          <div className="space-y-2">



            <label className="text-sm text-gray-300 ml-1">Password</label>



            <input



              value={password}



              autoComplete="on"



              onChange={(e) => setPassword(e.target.value)}



              className="w-full bg-black/50 text-white placeholder:text-gray-600 border border-[#00ff0030] rounded-md px-4 py-2.5 md:py-3 focus:outline-none focus:border-[#00ff00] focus:ring-1 focus:ring-[#00ff00] transition-all text-sm md:text-base"



              required



              type="password"



              placeholder="Enter your password"



            />



          </div>







          <button



            type="submit"



            className="w-full bg-[#00ff00] hover:bg-[#00dd00] text-black font-medium rounded-md px-4 py-2.5 md:py-3 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#00ff00] focus:ring-offset-2 focus:ring-offset-black mt-6 text-sm md:text-base"



          >



            Sign In



          </button>



        </form>



      </div>



    </div>



  );



};







export default Login;






























