
import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-900 p-4 relative overflow-hidden">
    
      <div
        className="absolute bottom-0 left-0 w-full h-32 bg-green-800"
        style={{
          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 70%)', 
        }}
      ></div>

         <div className="max-w-lg bg-white rounded-2xl shadow-xl p-8 text-center z-10">
        <h1 className="text-4xl font-extrabold text-green-900 mb-2">
          Welcome to Wholesaler Wizard!
        </h1>
        <p className="text-sm text-gray-600 mb-6">
          Smart recommendations to elevate your agency.
        </p>
        <div className="flex space-x-4 justify-center">
          <Link href="/register">
            <button className="bg-green-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-green-700 transition duration-200">
              Register
            </button>
          </Link>
          <Link href="/login">
            <button className="bg-gray-300 text-gray-700 font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-gray-400 transition duration-200">
              Login
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
