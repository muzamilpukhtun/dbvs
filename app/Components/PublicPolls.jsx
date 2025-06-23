// "use client";
// import { useEffect, useState } from "react";
// import Loader from "./Loader";
// import { useAuth } from "@/app/context/AuthContext";

// const PublicPolls = () => {
//   const [votedPolls, setVotedPolls] = useState([]);
//   const [loadingVote, setLoadingVote] = useState(null);
//   const [polls, setPolls] = useState([]);
//   const [loadingPolls, setLoadingPolls] = useState(false);
//   const { Arid } = useAuth();

//   const fetchAndUpdatePolls = async () => {
//     setLoadingPolls(true);
//     try {
//       const votedPollsRes = await fetch(`/api/vote/user/${Arid}`);
//       const votedPollsData = await votedPollsRes.json();
//       setVotedPolls(votedPollsData.votedPolls || []);

//       const res = await fetch("/api/poll/active");
//       const data = await res.json();
//       setPolls(data.polls);
//     } catch (err) {
//       console.error("Error fetching polls:", err);
//     } finally {
//       setLoadingPolls(false);
//     }
//   };

//   useEffect(() => {
//     if (Arid) {
//       fetchAndUpdatePolls();
//     }
//   }, [Arid]);

//   const handleVote = async (optionId, pollId) => {
//     setLoadingVote(optionId);
//     try {
//       const res = await fetch("/api/vote", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           poll_id: String(pollId),
//           option: String(optionId),
//           voter_id: Arid,
//         }),
//       });
//       const data = await res.json();

//       if (res.ok) {
//         setVotedPolls([...votedPolls, pollId]);
//         localStorage.setItem(`voted_poll_${pollId}`, 'true');
//         fetchAndUpdatePolls();
//       }
//     } catch (err) {
//       console.error("Error submitting vote:", err);
//     } finally {
//       setLoadingVote(null);
//     }
//   };

//   return (
//     <div className="p-4">
//       <h2 className="text-2xl font-bold mb-4">Active Public Polls</h2>
//       {loadingPolls ? (
//         <Loader />
//       ) : polls.length === 0 ? (
//         <p>No active polls.</p>
//       ) : (
//         polls.map((poll) => {
//           const hasVoted = votedPolls.includes(poll.id) || localStorage.getItem(`voted_poll_${poll.id}`) === 'true';
          
//           return (
//             <div key={poll.id} className="border p-4 mb-4 rounded">
//               <h3 className="text-lg font-semibold">{poll.name}</h3>
//               <p>Ends on: {new Date(poll.endDate).toLocaleString()}</p>
//               {hasVoted ? (
//                 <p className="text-green-600 font-semibold mt-2">Vote Submitted</p>
//               ) : (
//                 <ul className="pl-5 mt-2">
//                   {poll.options.map((opt) => (
//                     <li key={opt.id} className="mb-2">
//                       <button
//                         onClick={() => handleVote(opt.text, poll.id)}
//                         disabled={loadingVote === opt.id}
//                         className="flex items-center justify-between p-2 rounded w-full hover:bg-gray-100"
//                       >
//                         <span>{opt.text}</span>
//                         {loadingVote === String(opt.text) && (
//                           <span className="ml-2 text-sm text-blue-600 animate-pulse">
//                             Voting...
//                           </span>
//                         )}
//                       </button>
//                     </li>
//                   ))}
//                 </ul>
//               )}
//             </div>
//           );
//         })
//       )}
//     </div>
//   );
// };

// export default PublicPolls;



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

  const fetchPollsAndVotes = async () => {
    setLoadingPolls(true);
    try {
  

      // 2. Get active polls from DB
      const pollsRes = await fetch("/api/poll/active");
      const pollsData = await pollsRes.json();
      setPolls(pollsData.polls || []);


         // 1. Get voted polls from Solana
         const votedRes = await fetch(`/api/user/${Arid}`);
         const votedData = await votedRes.json();
         setVotedPolls(votedData.votedPolls || []);

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
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Active Public Polls</h2>

      {loadingPolls ? (
        <Loader />
      ) : polls.length === 0 ? (
        <p>No active polls.</p>
      ) : (
        polls.map((poll) => {
          const hasVoted = votedPolls.includes(poll.id);

          return (
            <div key={poll.id} className="border p-4 mb-4 rounded">
              <h3 className="text-lg font-semibold">{poll.name}</h3>
              <p>Ends on: {new Date(poll.endDate).toLocaleString()}</p>

              {hasVoted ? (
                <p className="text-green-600 font-semibold mt-2">Vote Submitted</p>
              ) : (
                <ul className="pl-5 mt-2">
                  {poll.options.map((opt) => (
                    <li key={opt.id} className="mb-2">
                      <button
                        onClick={() => handleVote(opt.text, poll.id)}
                        disabled={loadingVote === opt.text}
                        className="flex items-center justify-between p-2 rounded w-full hover:bg-gray-100"
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
