"use client";
import { createContext, useContext, useState } from "react";

// Create the context
export const PollContext = createContext();

// Provider component
export const PollProvider = ({ children }) => {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(false);

  // Function to create a new poll
  const createPoll = async (pollData) => {
    try {
      setLoading(true);
      const res = await fetch("/api/poll/poll_creation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pollData),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        // You can optionally update local state with the new poll
        setPolls((prev) => [...prev, data.poll]);
        return { success: true, poll: data.poll };
      } else {
        return { success: false, error: data.message };
      }
    } catch (error) {
      setLoading(false);
      return { success: false, error: "Something went wrong." };
    }
  };

  return (
    <PollContext.Provider value={{ polls, createPoll, loading }}>
      {children}
    </PollContext.Provider>
  );
};

// Custom hook for using poll context
export const usePoll = () => useContext(PollContext);
