"use client"
import React, { useState } from "react";
import { usePoll } from "../context/PollContext";
import { useAuth } from "../context/AuthContext";

const CreatePoll = () => {
  const { user } = useAuth();
  const [pollData, setPollData] = useState({
    pollName: "",
    endDate: "",
    options: ["", ""],
  });
  const { createPoll, loading } = usePoll();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPollData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...pollData.options];
    newOptions[index] = value;
    setPollData((prev) => ({ ...prev, options: newOptions }));
  };

  const addOption = () => {
    setPollData((prev) => ({
      ...prev,
      options: [...prev.options, ""],
    }));
  };

  const minusOption = () => {
    setPollData((prev) => ({
      ...prev,
      options: prev.options.slice(0, -1),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await createPoll({
      ...pollData,
      createdBy: user?.name || "Anonymous",
    });
  
    if (result.success) {
      alert("Poll created successfully!");
    } else {
      alert("Error: " + result.error);
    }
  };

  return (
    <div className="bg-white text-black dark:text-white dark:bg-gray-900 flex flex-col md:flex-row min-h-screen">
      {/* Left side - Logo and App Name */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center bg-gray-600 p-4 md:p-0">
        <div className="text-white text-center">
          <img src="/Logo.png" alt="DBVS Logo" className="w-32 md:w-64 h-auto mb-4" />
          <p className="text-xl md:text-2xl">BIIT VOTING</p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-8">
        <div className="p-4 md:p-8 rounded-lg dark:shadow-blue-200 shadow-xl w-full max-w-md">
          <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6 text-center">Create New Poll</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Poll Name</label>
              <input
                type="text"
                name="pollName"
                value={pollData.pollName}
                onChange={handleInputChange}
                className="w-full p-2 md:p-3 border rounded-lg text-sm md:text-base"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">End Date</label>
              <input
                type="datetime-local"
                name="endDate"
                value={pollData.endDate}
                onChange={handleInputChange}
                className="w-full p-2 md:p-3 border rounded-lg text-sm md:text-base"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Poll Options</label>
              {pollData.options.map((option, index) => (
                <input
                  key={index}
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  className="w-full p-2 md:p-3 border rounded-lg mb-2 text-sm md:text-base"
                  placeholder={`Option ${index + 1}`}
                  required
                />
              ))}
              <div className="flex flex-col sm:flex-row gap-2 mt-2">
                <button
                  type="button"
                  onClick={addOption}
                  className="flex-1 py-2 px-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition text-sm md:text-base"
                >
                  Add Option
                </button>
                {pollData.options.length > 2 && (
                  <button
                    type="button"
                    onClick={minusOption}
                    className="flex-1 py-2 px-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition text-sm md:text-base"
                  >
                    Remove Option
                  </button>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 md:py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm md:text-base"
            >
              {loading ? "Creating..." : "Create Poll"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePoll;