import { NextResponse } from 'next/server';
import { Connection, PublicKey } from '@solana/web3.js';

export async function GET(req, { params }) {
  const { arid } = params;

  if (!arid) {
    return NextResponse.json({ error: "Voter ID required" }, { status: 400 });
  }

  try {
    const connection = new Connection('https://api.devnet.solana.com');
    
    // Replace with your program's public key that handles votes
    const programId = new PublicKey('8zuukeU9WWQN6HhEANZvkrdm6qXDAZFRFxixT6kmJAaV');
    
    // Fetch all transactions for the program
    const signatures = await connection.getSignaturesForAddress(programId, { limit: 100 });
    
    const votedPolls = [];

    for (const sig of signatures) {
      const tx = await connection.getParsedTransaction(sig.signature);
      
      if (tx && tx.transaction.message.instructions) {
        for (const ix of tx.transaction.message.instructions) {
          if (ix.programId.equals(programId)) {
            // Parse your custom instruction data here
            // This depends on how your program stores votes
            // Example (pseudo-code):
            const voteData = parseVoteInstruction(ix.data);
            if (voteData && voteData.voter_id === arid) {
              votedPolls.push(voteData.poll_id);
            }
          }
        }
      }
    }

    return NextResponse.json({
      votedPolls: [...new Set(votedPolls)] // Remove duplicates
    });

  } catch (err) {
    console.error("Error fetching votes:", err);
    return NextResponse.json(
      { error: "Failed to fetch votes", details: err.message },
      { status: 500 }
    );
  }
}