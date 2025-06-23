//lib/blockchain.ts
import { Connection, PublicKey } from '@solana/web3.js';

const MEMO_PROGRAM_ID = 'MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr';
const connection = new Connection('https://api.devnet.solana.com');

type ParsedVote = {
  pollId: number;
  optionId: number;n 
  voterId: string;
  txHash: string;
};

export async function fetchRecentVoteFromChain(): Promise<ParsedVote | null> {
  const confirmedTxs = await connection.getSignaturesForAddress(
    new PublicKey(MEMO_PROGRAM_ID),
    { limit: 1 }
  );

  if (confirmedTxs.length === 0) {
    return null;
  }

  try {
    const tx = confirmedTxs[0];
    const txDetails = await connection.getTransaction(tx.signature, {
      commitment: 'confirmed',
    });

    const memoInstruction = txDetails?.transaction.message.instructions.find(
      (ix) => ix.programId.toBase58() === MEMO_PROGRAM_ID
    );

    if (!memoInstruction) {
      return null;
    }

    const memoData = Buffer.from(memoInstruction.data, 'base64').toString('utf-8');
    const parsed = JSON.parse(memoData);

    return {
      pollId: Number(parsed.poll_id),
      optionId: Number(parsed.option),
      voterId: parsed.voter_id || 'anonymous',
      txHash: tx.signature,
    };
  } catch (err) {
    console.warn('Failed to parse vote tx:', confirmedTxs[0].signature);
    return null;
  }
}
