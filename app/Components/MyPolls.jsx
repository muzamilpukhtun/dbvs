"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext"; // assuming user context

const MyPolls = () => {
  const { Arid, user } = useAuth(); // Get both Arid and user object
  const [polls, setPolls] = useState([]);

  useEffect(() => {
    if (!Arid) return;
    const fetchMyPolls = async () => {
      const res = await fetch("/api/poll/mine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: Arid }),
      });
    
      const data = await res.json();
      if (res.ok) {
        const activePolls = data.polls.filter(poll => new Date(poll.endDate) > new Date());
        setPolls(activePolls);
      }
    };
    
    fetchMyPolls();
  }, [Arid]);

  return (
    <div className="min-h-screen dark:bg-gray-900 bg-white p-4">
      <h2 className="text-3xl font-bold text-center mb-6 dark:text-white text-black">My Active Polls</h2>
      
      <div className="max-w-3xl mx-auto overflow-y-auto" style={{ maxHeight: "calc(100vh - 150px)" }}>
        {polls.length === 0 && (
          <div className="text-center dark:text-gray-300 text-gray-600 dark:bg-gray-800 bg-white p-6 rounded-lg shadow">
            You have no active polls.
          </div>
        )}
        
        {polls.map((poll) => (
          <div key={poll.id} className="dark:bg-gray-800 bg-white rounded-lg shadow-md mb-4 p-6 transition-transform hover:scale-[1.01]">
            <div className="space-y-4">
              {/* Poll Title */}
              <h3 className="text-xl font-semibold dark:text-white text-gray-800">{poll.name}</h3>
              
              {/* Poll Status */}
              <div className="inline-block px-3 py-1 dark:bg-green-900 bg-green-100 dark:text-green-100 text-green-800 rounded-full text-sm">
                Active
              </div>
              
              {/* Poll Options */}
              <div className="space-y-3">
                {poll.options.map((opt) => (
                  <div key={opt.id} className="dark:bg-gray-700 bg-gray-50 p-3 rounded-md dark:hover:bg-gray-600 hover:bg-gray-100 transition-colors">
                    <div className="flex justify-between items-center">
                      <span className="dark:text-gray-200 text-gray-700">{opt.text}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Poll Footer */}
              <div className="flex justify-between items-center pt-4 dark:border-gray-700 border-t border-gray-200">
                <span className="text-sm dark:text-gray-400 text-gray-500">
                  Ends: {new Date(poll.endDate).toLocaleDateString()}
                </span>
                <span className="text-sm dark:text-gray-400 text-gray-600">
                  Created by: {user?.name || user?.email || "Anonymous User"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyPolls;
