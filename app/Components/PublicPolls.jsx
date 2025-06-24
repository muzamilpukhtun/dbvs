"use client";
import { useEffect, useState } from "react";
import Loader from "./Loader";
import { useAuth } from "@/app/context/AuthContext";
import { usePoll } from "../context/PollContext";

const PublicPolls = () => {
  const { polls, votedPollIds, fetchUserVotes, loading } = usePoll();
  const { Arid } = useAuth();
  const [loadingVote, setLoadingVote] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    if (Arid) {
      fetchUserVotes().finally(() => setInitialLoading(false));
    }
  }, [Arid]);

  const handleVote = async (optionId, optionText, pollId) => {
    console.log("Voting for option:", optionId, optionText, "Poll:", pollId);
    setLoadingVote(optionText);
  
    try {
      const response = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          poll_id: String(pollId),
          option: String(optionText),
          optionId: String(optionId),
          voter_id: String(Arid)
        }),
      });
  
      const result = await response.json();
      
      if (response.ok) {
        console.log("🎉 Vote successful! Transaction details:", {
          txSignature: result.txSignature,
          explorerUrl: result.explorerUrl,
          pollId,
          option: optionText,
          voterId: Arid
        });
      } else {
        console.error("Vote failed:", result.error);
      }
  
      fetchUserVotes();
    } catch (err) {
      console.error("Vote error:", err);
      alert("Vote failed, please try again.");
    } finally {
      setLoadingVote(null);
    }
  };

  const hasVoted = (pollId) => votedPollIds.includes(String(pollId));

  return (
    <div className="p-4 dark:bg-gray-900 dark:text-white bg-white text-black">
      <h2 className="text-2xl font-bold mb-4">Active Public Polls</h2>

      {loading || initialLoading ? (
        <Loader />
      ) : polls.length === 0 ? (
        <p>No active polls.</p>
      ) : (
        polls.map((poll) => (
          <div key={poll.id} className="border p-4 mb-4 rounded dark:bg-gray-800 bg-white">
            <h3 className="text-lg font-semibold">{poll.name}</h3>
            <p>Ends on: {new Date(poll.endDate).toLocaleString()}</p>

            {hasVoted(poll.id) ? (
              <p className="text-green-600 font-semibold mt-2">You have already voted.</p>
            ) : (
              <ul className="pl-5 mt-2">
                {poll.options.map((opt) => (
                  <li key={opt.id} className="mb-2">
                    <button
                      onClick={() => handleVote(opt.id, opt.text, poll.id)}
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
        ))
      )}
    </div>
  );
};

export default PublicPolls;
