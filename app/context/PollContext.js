"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

export const PollContext = createContext();

export const PollProvider = ({ children }) => {
  const { Arid } = useAuth();
  const [polls, setPolls] = useState([]);
  const [votedPollIds, setVotedPollIds] = useState([]);
  const [loadingPolls, setLoadingPolls] = useState(false);
  const [loadingVotes, setLoadingVotes] = useState(false);
  const [loadingCreate, setLoadingCreate] = useState(false);

  // Fetch active polls from API
  const fetchPolls = async () => {
    try {
      setLoadingPolls(true);
      const res = await fetch("/api/poll/active");
      const data = await res.json();
      setPolls(data.polls || []);
    } catch (err) {
      console.error("Error fetching polls:", err);
    } finally {
      setLoadingPolls(false);
    }
  };

  // Fetch current user's voted poll IDs
  const fetchUserVotes = async () => {
    if (!Arid) return;
    setLoadingVotes(true);
    try {
      const res = await fetch("/api/poll/vote-count");
      const data = await res.json();
      
      if (!data?.polls || !Array.isArray(data.polls)) {
        console.warn("Invalid or empty polls data:", data);
        return;
      }

      const userVotes = data.polls.filter(v => String(v.voter_id) === String(Arid));
      const ids = userVotes.map(v => v.poll_id);
      setVotedPollIds(ids);
    } catch (err) {
      console.error("Error fetching votes:", err);
    } finally {
      setLoadingVotes(false);
    }
  };

  const fetchBlockchainData = async () => {
    if (!Arid) return;
    setLoadingVotes(true);
    try {
      // First trigger the worker to process votes
      const processRes = await fetch(`/api/poll/process-votes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pollId: 'all' }) // Process all polls
      });
      
      if (!processRes.ok) {
        throw new Error('Failed to process votes');
      }
  
      // Then get the user's specific votes
      const res = await fetch("/api/poll/vote-count");
      const data = await res.json();
      
      if (!data?.polls || !Array.isArray(data.polls)) {
        console.warn("Invalid or empty polls data:", data);
        return;
      }
  
      const userVotes = data.polls.filter(v => String(v.voter_id) === String(Arid));
      const ids = userVotes.map(v => v.poll_id);
      setVotedPollIds(ids);
    } catch (err) {
      console.error("Error fetching votes:", err);
    } finally {
      setLoadingVotes(false);
    }
  };

  // Create new poll
  const createPoll = async (pollData) => {
    try {
      setLoadingCreate(true);
      const res = await fetch("/api/poll/poll_creation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pollData),
      });

      const data = await res.json();
      if (res.ok) {
        setPolls((prev) => [...prev, data.poll]);
        return { success: true, poll: data.poll };
      } else {
        return { success: false, error: data.message };
      }
    } catch (error) {
      console.error("Poll creation error:", error);
      return { success: false, error: "Something went wrong." };
    } finally {
      setLoadingCreate(false);
    }
  };

  // Refresh all data
  const refreshAll = () => {
    fetchPolls();
    fetchUserVotes();
  };

  // Initial data load
  useEffect(() => {
    if (Arid) {
      refreshAll();
    }
  }, [Arid]);

  return (
    <PollContext.Provider
      value={{
        polls,
        votedPollIds,
        loading: loadingPolls || loadingVotes || loadingCreate,
        loadingPolls,
        loadingVotes,
        loadingCreate,
        createPoll,
        fetchPolls,
        fetchUserVotes,
        refreshAll,
      }}
    >
      {children}
    </PollContext.Provider>
  );
};

export const usePoll = () => useContext(PollContext);