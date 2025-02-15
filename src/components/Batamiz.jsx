import React from 'react';

const Batamiz = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-100 to-purple-100 flex items-center justify-center px-4">
      <div className="max-w-2xl text-center">
        <div className="mb-8">
          <span className="text-6xl">🛠️</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Server Under Maintenance
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-600 mb-8">
          Due to some "interesting" logs, we're doing a bit of spring cleaning 🧹
        </p>
        
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <p className="text-gray-700 text-lg">
            Our servers decided to take a quick break after seeing some... let's say, creative log entries 😅
          </p>
        </div>
        
        <div className="text-gray-600">
          <p className="mb-2">Expected downtime: As long as it takes to bleach our eyes 👀</p>
          <p className="text-sm">Don't worry, we're working on it! (and maybe updating our log filters)</p>
          <p>BKL batamizi na kro , bhalayi krne do mc</p>
        </div>
      </div>
    </div>
  );
};

export default Batamiz;