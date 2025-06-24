"use client";
import { useEffect, useState } from "react";

const PollResultsPublic = () => {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEndedPolls = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/poll/public-ended");
    
        if (!res.ok) {
          console.error("API Error:", res.status);
          setPolls([]);
          return;
        }
    
        const data = await res.json();
        setPolls(data.polls || []);
      } catch (err) {
        console.error("Fetch error:", err);
        setPolls([]);
      } finally {
        setLoading(false);
      }
    };
    

    fetchEndedPolls();
  }, []);

  return (
    <div className="min-h-screen dark:bg-gray-900 bg-white p-4">
      <h2 className="text-3xl font-bold text-center mb-6 dark:text-white text-black">Poll Results</h2>

      {loading ? (
        <div className="text-center dark:text-gray-300 text-gray-600">Loading polls...</div>
      ) : (
        <div className="max-w-3xl mx-auto overflow-y-auto overflow-x-hidden" style={{ maxHeight: "calc(100vh - 150px)" }}>
          {polls.length === 0 ? (
            <div className="text-center dark:text-gray-300 text-gray-600 dark:bg-gray-800 bg-white p-6 rounded-lg shadow">
              No ended polls with results found.
            </div>
          ) : (
            polls.map((poll) => (
              <div key={poll.id} className="dark:bg-gray-800 bg-white rounded-lg shadow-md mb-4 p-6 transition-transform hover:scale-[1.01]">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold dark:text-white text-gray-800">{poll.name}</h3>

                  <div className="inline-block px-3 py-1 dark:bg-blue-900 bg-blue-100 dark:text-blue-100 text-blue-800 rounded-full text-sm">
                    Results Announced
                  </div>

                  <div className="space-y-3">
                    {poll.options.map((opt) => (
                      <div key={opt.id} className="dark:bg-gray-700 bg-gray-50 p-3 rounded-md dark:hover:bg-gray-600 hover:bg-gray-100 transition-colors">
                        <div className="flex justify-between items-center">
                          <span className="dark:text-gray-200 text-gray-700">{opt.text}</span>
                          <span className="text-sm dark:text-gray-300 text-gray-600">{opt.votes} votes</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center pt-4 dark:border-gray-700 border-t border-gray-200">
                    <span className="text-sm dark:text-gray-400 text-gray-500">
                      Ended: {new Date(poll.endDate).toLocaleDateString()}
                    </span>
                    <span className="text-sm dark:text-gray-400 text-gray-600">
                      Created by: {poll.createdBy || "Unknown"}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default PollResultsPublic;
