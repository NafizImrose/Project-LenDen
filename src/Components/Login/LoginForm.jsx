import React from "react";
import Link from "next/link";

const LoginForm = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-[url('/images/bg-image.jpg')] bg-cover bg-center bg-no-repeat ">
      <div>
        <div className="flex justify-center p-5">
          <h1 className="text-3xl font-bold text-white">Login to LenDen</h1>
        </div>
        <fieldset className="fieldset rounded-box w-xs border border-white/30 p-4 bg-white/10 backdrop-blur-lg shadow-xl">
          <label className="label text-white">Mobile Number</label>
          <input
            type="number"
            className="input rounded-3xl focus:outline-none focus:border-transparent focus:ring-0
  [&::-webkit-inner-spin-button]:appearance-none 
  [&::-webkit-outer-spin-button]:appearance-none"
            placeholder="Number"
          />

          <label className="label text-white">Pin</label>
          <input
            type="password"
            className="input focus:outline-none focus:border-transparent focus:ring-0 rounded-3xl "
            placeholder="pin"
          />

          <button className="btn btn-neutral rounded-3xl mt-4">Login</button>
          <div className="flex justify-center">
            <h1 className="text-white font-bold ">
              Does not have any account?<Link href="/register"> Register</Link>
            </h1>
          </div>
        </fieldset>
      </div>
    </div>
  );
};

export default LoginForm;
