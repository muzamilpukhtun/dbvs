// import { Connection, PublicKey, VersionedTransactionResponse } from '@solana/web3.js';
// import { NextResponse } from 'next/server';

// const MEMO_PROGRAM_ID = new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr");

// interface VoteData {
//   poll_id: string;
//   option: string;
//   voter_id?: string;
//   timestamp: string;
// }

// interface ParsedVoteData {
//   type: string;
//   data: VoteData;
//   version?: string;
// }

// export async function POST(req: Request) {
//   const connection = new Connection('https://api.devnet.solana.com');
  
//   try {
//     const { txSignature } = await req.json();
    
//     // Enhanced input validation
//     if (!txSignature || typeof txSignature !== 'string' || txSignature.length !== 88) {
//       return NextResponse.json(
//         { error: "Valid 88-character transaction signature is required" }, 
//         { status: 400 }
//       );
//     }

//     // Get transaction with error handling
//     let tx: VersionedTransactionResponse | null;
//     try {
//       tx = await connection.getTransaction(txSignature, {
//         maxSupportedTransactionVersion: 0,
//         commitment: 'confirmed'
//       });
//     } catch (err: any) {
//       console.error('Transaction fetch error:', err);
//       return NextResponse.json(
//         { 
//           error: "Failed to fetch transaction",
//           details: err.message
//         },
//         { status: 500 }
//       );
//     }

//     if (!tx?.transaction?.message) {
//       return NextResponse.json(
//         { error: "Transaction message is invalid or empty" },
//         { status: 400 }
//       );
//     }

//     // Get all instructions from the transaction
//     const instructions = tx.transaction.message.compiledInstructions;
//     if (!instructions || instructions.length === 0) {
//       return NextResponse.json(
//         { error: "Transaction contains no instructions" },
//         { status: 400 }
//       );
//     }

//     // Get the program IDs from the message
//     const programIds = tx.transaction.message.addressTableLookups
//       ? [
//           ...tx.transaction.message.staticAccountKeys,
//           ...tx.transaction.message.addressTableLookups.flatMap(lookup => [...lookup.writableIndexes, ...lookup.readonlyIndexes])
//         ]
//       : tx.transaction.message.staticAccountKeys;

//     // Find memo instruction
//     let memoData: string | null = null;
//     for (const ix of instructions) {
//       try {
//         const programId = programIds[ix.programIdIndex];
//         if (!programId) continue;

//         const ixProgramId = new PublicKey(programId);
//         if (ixProgramId.equals(MEMO_PROGRAM_ID) && ix.data) {
//           memoData = Buffer.from(ix.data).toString('utf8');
//           break;
//         }
//       } catch (err) {
//         console.warn('Error processing instruction:', err);
//         continue;
//       }
//     }

//     if (!memoData) {
//       return NextResponse.json(
//         { 
//           error: "No valid vote data found in transaction",
//           details: {
//             instructions: instructions.map(ix => ({
//               programIdIndex: ix.programIdIndex,
//               dataLength: ix.data?.length || 0
//             })),
//             programIds: programIds.map(p => p.toString())
//           }
//         },
//         { status: 400 }
//       );
//     }

// // Parse and validate vote data
// // let voteData: VoteData;
// // try {
// //   // First try to parse as wrapped format
// //   let parsedData: ParsedVoteData | VoteData = JSON.parse(memoData);
  
// //   // Handle both formats:
// //   // 1. Wrapped format: { type: "vote", data: { poll_id, option, ... } }
// //   // 2. Direct format: { poll_id, option, ... }
// //   if (typeof (parsedData as ParsedVoteData).type !== 'undefined') {
// //     // This is the wrapped format
// //     if ((parsedData as ParsedVoteData).type !== 'vote' || !(parsedData as ParsedVoteData).data) {
// //       throw new Error("Invalid wrapped vote data structure - missing type or data");
// //     }
// //     voteData = (parsedData as ParsedVoteData).data;
// //   } else {
// //     // This is the direct format
// //     voteData = parsedData as VoteData;
// //   }
  
// //   // Validate required fields
// //   if (!voteData.poll_id || !voteData.option) {
// //     throw new Error("Missing required vote fields (poll_id or option)");
// //   }

// //   // Validate field types
// //   if (typeof voteData.poll_id !== 'string' || typeof voteData.option !== 'string') {
// //     throw new Error("poll_id and option must be strings");
// //   }

// //   // Set default values
// //   if (!voteData.voter_id) voteData.voter_id = "anonymous";
// //   if (!voteData.timestamp) voteData.timestamp = new Date().toISOString();

// // } catch (err: any) {
// //   console.error('Data parsing error:', err);
// //   return NextResponse.json(
// //     { 
// //       error: "Invalid vote data format",
// //       details: {
// //         message: err.message,
// //         rawData: memoData,
// //         expectedFormats: [
// //           "Format 1: { type: 'vote', data: { poll_id: string, option: string, ... } }",
// //           "Format 2: { poll_id: string, option: string, ... }"
// //         ]
// //       }
// //     },
// //     { status: 400 }
// //   );
// // }

// // Parse and validate vote data


// let voteData: VoteData;
// try {
//   const parsed = JSON.parse(memoData);

//   if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
//     throw new Error("Vote data must be a JSON object");
//   }

//   // Handle both wrapped and direct formats
//   if (parsed.type === "vote" && parsed.data && typeof parsed.data === 'object') {
//     voteData = parsed.data;  // Wrapped format
//   } else if (parsed.poll_id && parsed.option) {
//     voteData = parsed;  // Direct format
//   } else {
//     throw new Error(
//       `Invalid vote structure. Must include either:
//       1. { type: 'vote', data: { poll_id, option, ... } } or
//       2. { poll_id, option, ... }`
//     );
//   }

//   // Validate field types
//   if (typeof voteData.poll_id !== 'string') {
//     throw new Error("poll_id must be a string");
//   }
//   if (typeof voteData.option !== 'string') {
//     throw new Error("option must be a string");
//   }

//   // Set defaults
//   voteData = {
//     voter_id: "anonymous",
//     // Don't set default timestamp as it will be overwritten by spread operator
//     ...voteData  // Spread to preserve existing values
//   };

// } catch (err: any) {
//   console.error("Vote data parsing failed:", { error: err.message, stack: err.stack });
//   return NextResponse.json({
//     error: "Invalid vote data format",
//     details: err.message,
//     receivedData: memoData,
//     expectedFormats: [
//       "{ type: 'vote', data: { poll_id: string, option: string, [voter_id?: string], [timestamp?: string] } }",
//       "{ poll_id: string, option: string, [voter_id?: string], [timestamp?: string] }"
//     ]
//   }, { status: 400 });
// }

//     return NextResponse.json({
//       status: 'success',
//       txSignature,
//       voteData,
//       explorerUrl: `https://explorer.solana.com/tx/${txSignature}?cluster=devnet`,
//       timestamp: tx.blockTime ? new Date(tx.blockTime * 1000).toISOString() : voteData.timestamp,
//       slot: tx.slot,
//       confirmationStatus: tx.meta?.err ? "failed" : "confirmed"
//     });

//   } catch (error: any) {
//     console.error('Server error:', error);
//     return NextResponse.json(
//       { 
//         error: "Internal server error",
//         details: process.env.NODE_ENV === 'development' ? error.message : null
//       },
//       { status: 500 }
//     );
//   }
// }



//app/poll/vote-count
import { NextResponse } from 'next/server';
import { Connection, PublicKey, Keypair } from '@solana/web3.js';
import wallet from '@/wallet.json';

const MEMO_PROGRAM_ID = new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr");

export async function GET() {
  const connection = new Connection("https://api.devnet.solana.com");

  try {
    const fundedWallet = Keypair.fromSecretKey(Uint8Array.from(wallet));
    const devWalletPubkey = fundedWallet.publicKey;

    const sigs = await connection.getSignaturesForAddress(devWalletPubkey, { limit: 100 });
    const allPolls = [];

    for (const sigInfo of sigs) {
      const tx = await connection.getTransaction(sigInfo.signature, { maxSupportedTransactionVersion: 0 });
      if (!tx?.transaction?.message?.compiledInstructions) continue;

      const programIds = tx.transaction.message.staticAccountKeys.map(k => k.toString());

      for (const ix of tx.transaction.message.compiledInstructions) {
        const programId = programIds[ix.programIdIndex];

        if (programId === MEMO_PROGRAM_ID.toString() && ix.data) {
          try {
            const memoDataStr = Buffer.from(ix.data, "base64").toString("utf8");
            const memoData = JSON.parse(memoDataStr);

            if (memoData?.type === "vote" && memoData?.data?.poll_id) {
              allPolls.push(memoData.data);
            }
          } catch (err) {
            console.warn("Invalid memo JSON ignored:", err.message);
          }
        }
      }
    }

    return NextResponse.json({ polls: allPolls });

  } catch (err: any) {
    console.error("API Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
