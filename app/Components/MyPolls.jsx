"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext"; // assuming user context

const MyPolls = () => {
  const { Arid } = useAuth(); // contains user.arid or user.email
  const [polls, setPolls] = useState([]);

  console.log('😂',Arid);
  useEffect(() => {
    if (!Arid) return;
    const fetchMyPolls = async () => {
      const res = await fetch("/api/poll/mine", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: '4302' }),
      });

      const data = await res.json();
      if (res.ok) setPolls(data.polls);
    };

    fetchMyPolls();
  }, [Arid]);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h2 className="text-3xl font-bold text-center mb-6">My Polls</h2>
      
      <div className="max-w-3xl mx-auto overflow-y-auto" style={{ maxHeight: "calc(100vh - 150px)" }}>
        {polls.length === 0 && (
          <div className="text-center text-gray-600 bg-white p-6 rounded-lg shadow">
            You have not created any polls.
          </div>
        )}
        
        {polls.map((poll) => (
          <div key={poll.id} className="bg-white rounded-lg shadow-md mb-4 p-6 transition-transform hover:scale-[1.01]">
            <div className="space-y-4">
              {/* Poll Title */}
              <h3 className="text-xl font-semibold text-gray-800">{poll.name}</h3>
              
              {/* Poll Options */}
              <div className="space-y-3">
                {poll.options.map((opt) => (
                  <div key={opt.id} className="bg-gray-50 p-3 rounded-md hover:bg-gray-100 transition-colors">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">{opt.text}</span>
                      <span className="text-sm text-gray-500">{opt.votes} votes</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Poll Footer */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <span className="text-sm text-gray-500">
                  Ends: {new Date(poll.endDate).toLocaleDateString()}
                </span>
                <span className="text-sm text-gray-600">
                  Created by: {poll.creatorName || "Anonymous User"}
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
