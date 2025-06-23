"use client";
import { useEffect, useState } from "react";
import Loader from "./Loader";
import { useAuth } from "@/app/context/AuthContext";

const PublicPolls = () => {
  const [votedPolls, setVotedPolls] = useState([]);
  const [loadingVote, setLoadingVote] = useState(null);
  const [polls, setPolls] = useState([]);
  const [loadingPolls, setLoadingPolls] = useState(false);
  const { Arid } = useAuth(); // Assuming Arid = voter_id

  console.log("Current Arid (voter_id):", Arid);

  const fetchPollsAndVotes = async () => {
    setLoadingPolls(true);
    try {
      // 1. Get all votes from Solana
      const allVotesRes = await fetch("/api/poll/vote-count");
      const allVotesData = await allVotesRes.json();

      // 2. Filter only current user's voted polls
      const userVotes = allVotesData.polls.filter(v => String(v.voter_id) === String(Arid));
      const votedPollIds = userVotes.map(v => v.poll_id);
      setVotedPolls(votedPollIds);
      console.log("Voted Poll IDs:", votedPollIds);

      // 3. Get active polls from DB
      const pollsRes = await fetch("/api/poll/active");
      const pollsData = await pollsRes.json();
      setPolls(pollsData.polls || []);
      console.log("Active Polls:", pollsData.polls);

    } catch (err) {
      console.error("Error fetching polls or votes:", err);
    } finally {
      setLoadingPolls(false);
    }
  };

  useEffect(() => {
    if (Arid) {
      fetchPollsAndVotes();
    }
  }, [Arid]);

  const handleVote = async (optionText, pollId) => {
    console.log("Attempting to vote - Poll ID:", pollId, "Option:", optionText);
    setLoadingVote(optionText);
    try {
      const res = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          poll_id: String(pollId),
          option: String(optionText),
          voter_id: Arid,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        console.log("Vote successful for Poll ID:", pollId);
        setVotedPolls([...votedPolls, pollId]);
        fetchPollsAndVotes();
      } else {
        console.error(data.error || "Vote failed");
      }
    } catch (err) {
      console.error("Vote error:", err);
    } finally {
      setLoadingVote(null);
    }
  };

  return (
    <div className="p-4 dark:bg-gray-900 dark:text-white bg-white text-black">
      <h2 className="text-2xl font-bold mb-4 dark:text-white text-black">Active Public Polls</h2>

      {loadingPolls ? (
        <Loader />
      ) : polls.length === 0 ? (
        <p className="dark:text-white text-black">No active polls.</p>
      ) : (
        polls.map((poll) => {
          const hasVoted = votedPolls.includes(String(poll.id));  // Force string compare
        
          return (
            <div key={poll.id} className="border p-4 mb-4 rounded dark:bg-gray-800 dark:text-white bg-white text-black">
              <h3 className="text-lg font-semibold dark:text-white text-black">{poll.name}</h3>
              <p className="dark:text-white text-black">Ends on: {new Date(poll.endDate).toLocaleString()}</p>
        
              {hasVoted ? (
                <p className="text-green-600 font-semibold mt-2">You have already voted.</p>
              ) : (
                <ul className="pl-5 mt-2">
                  {poll.options.map((opt) => (
                    <li key={opt.id} className="mb-2">
                      <button
                        onClick={() => handleVote(opt.text, poll.id)}
                        disabled={loadingVote === opt.text}
                        className="flex items-center justify-between p-2 rounded w-full dark:hover:bg-gray-600 hover:bg-gray-100 dark:text-white text-black dark:bg-gray-700 bg-white"
                      >
                        <span>{opt.text}</span>
                        {loadingVote === opt.text && (
                          <span className="ml-2 text-sm text-blue-600 animate-pulse">
                            Voting...
                          </span>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default PublicPolls;
