// // /api/vote/route.ts
// import { NextResponse } from 'next/server'
// import { PrismaClient } from '@prisma/client'
// import { Connection, Keypair, Transaction, SystemProgram } from '@solana/web3.js'
// import { createClient } from 'redis'

// const prisma = new PrismaClient()
// const solanaConn = new Connection('https://api.devnet.solana.com')
// const redis = createClient({ url: process.env.REDIS_URL })
// await redis.connect()

// export async function POST(req: Request) {
//   try {
//     const { pollId, optionId, voterId } = await req.json()

//     // 1. Validation Checks
//     const [poll, existingVote, user] = await Promise.all([
//       prisma.poll.findUnique({
//         where: { id: pollId },
//         include: { options: true }
//       }),
//       prisma.vote.findFirst({
//         where: { pollId, voterId }
//       }),
//       prisma.user.findUnique({ where: { arid: voterId } })
//     ])

//     // Check if poll exists and is active
//     if (!poll || new Date(poll.endDate) < new Date()) {
//       return NextResponse.json(
//         { error: "Poll not found or has ended" },
//         { status: 400 }
//       )
//     }

//     // Check if option is valid
//     if (!poll.options.some(opt => opt.id === optionId)) {
//       return NextResponse.json(
//         { error: "Invalid voting option" },
//         { status: 400 }
//       )
//     }

//     // Check if user exists
//     if (!user) {
//       return NextResponse.json(
//         { error: "User not registered" },
//         { status: 401 }
//       )
//     }

//     // Check for duplicate vote
//     if (existingVote) {
//       return NextResponse.json(
//         { error: "You have already voted in this poll" },
//         { status: 400 }
//       )
//     }

//     // 2. Create transaction
//     const voteData = {
//       pollId,
//       optionId,
//       voterId,
//       timestamp: new Date().toISOString()
//     }

//     const transaction = new Transaction().add(
//       SystemProgram.transfer({
//         fromPubkey: user.publicKey,
//         toPubkey: poll.publicKey,
//         lamports: 1_000_000,
//       }),
//       new TransactionInstruction({
//         keys: [],
//         programId: new web3.PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"),
//         data: Buffer.from(JSON.stringify(voteData)),
//       })
//     )

//     // 3. Store in Redis queue
//     await redis.rPush('vote_queue', JSON.stringify({
//       pollId,
//       optionId,
//       voterId,
//       txData: transaction.serialize().toString('base64')
//     }))

//     return NextResponse.json({
//       status: 'queued',
//       message: 'Your vote is being processed'
//     })

//   } catch (error) {
//     console.error('Voting error:', error)
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     )
//   }
// }





// // app/api/test-program/route.ts
// import { 
//   Connection, 
//   Transaction, 
//   TransactionInstruction,
//   PublicKey,
//   Keypair,
//   SystemProgram
// } from '@solana/web3.js';
// import { NextResponse } from 'next/server';
// import wallet from '@/wallet.json'; // Your 64-byte array

// export async function POST() {
//   const connection = new Connection('https://api.devnet.solana.com');
//   const fundedWallet = Keypair.fromSecretKey(Uint8Array.from(wallet));
//   const programId = new PublicKey('D8HmzgTCpv8DhnFegGSG3ZHD1NfH5gZUhpEeEDE9a487');

//   try {
//     // 1. Verify balance
//     const balance = await connection.getBalance(fundedWallet.publicKey);
//     console.log(`Using wallet ${fundedWallet.publicKey} with ${balance/1e9} SOL`);

//     // 2. Create test transaction (transfer 0.001 SOL to yourself)
//     const data = JSON.stringify({ id: 123, name: "Alice", age: 30 });
//     const transaction = new Transaction().add(
//       SystemProgram.transfer({
//         fromPubkey: fundedWallet.publicKey,
//         toPubkey: fundedWallet.publicKey,
//         lamports: 1_000_000 // 0.001 SOL
//       }),
//       new TransactionInstruction({
//         keys: [],
//         programId: new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr'),
//         data: Buffer.from(data )
//       })
//     );

//     // 3. Finalize transaction
//     const { blockhash } = await connection.getLatestBlockhash();
//     transaction.recentBlockhash = blockhash;
//     transaction.feePayer = fundedWallet.publicKey;
//     transaction.sign(fundedWallet);

//     // 4. Send and confirm
//     const rawTx = transaction.serialize();
//     const txSignature = await connection.sendRawTransaction(rawTx);
//     const confirmation = await connection.confirmTransaction(txSignature);

//     return NextResponse.json({
//       status: 'success',
//       txSignature,
//       explorerUrl: `https://explorer.solana.com/tx/${txSignature}?cluster=devnet`,
//       wallet: fundedWallet.publicKey.toString(),
//       balanceChange: `-${0.001 + 0.000005} SOL` // Transfer + fee
//     });

//   } catch (error: any) {
//     console.error('Transaction failed:', {
//       error: error.message,
//       stack: error.stack,
//       wallet: fundedWallet?.publicKey?.toString()
//     });
    
//     return NextResponse.json(
//       { 
//         error: error.message,
//         walletBalance: await connection.getBalance(fundedWallet.publicKey),
//         walletAddress: fundedWallet.publicKey.toString(),
//         programId: programId.toString(),
//         debug: {
//           walletKeyLength: wallet.length,
//           isKeypairValid: !!fundedWallet?.publicKey
//         }
//       },
//       { status: 500 }
//     );
//   }
// }



// app/api/vote/route.ts
// import { Connection, Transaction, TransactionInstruction, PublicKey, Keypair, SystemProgram } from '@solana/web3.js';
// import { NextResponse } from 'next/server';
// import { getServerSession } from 'next-auth';
// import { authOptions } from '@/app/api/auth/[...nextauth]/route';
// import wallet from '@/wallet.json';

// export async function POST(req: Request) {
//   const connection = new Connection('https://api.devnet.solana.com');
//   const fundedWallet = Keypair.fromSecretKey(Uint8Array.from(wallet));

//   try {
//     // Get logged in user session
//     const session = await getServerSession(authOptions);
//     if (!session?.user?.arid) {
//       return NextResponse.json(
//         { error: "Unauthorized - Please login first" },
//         { status: 401 }
//       );
//     }

//     const { poll_id, option, optionId } = await req.json();
//     const voter_id = session.user.arid; // Use logged in user's arid
    
//     // Validation
//     if (!poll_id || !option) {
//       return NextResponse.json(
//         { error: "poll_id and option are required" }, 
//         { status: 400 }
//       );
//     }

//     if (typeof poll_id !== 'string' || typeof option !== 'string') {
//       return NextResponse.json(
//         { error: "poll_id and option must be strings" },
//         { status: 400 }
//       );
//     }

//     // Prepare vote data
//     const voteData = {
//       type: "vote",
//       data: {
//         poll_id,
//         option,
//         voter_id,
//         timestamp: new Date().toISOString()
//       }
//     };
    
//     // Create transaction
//     const transaction = new Transaction().add(
//       SystemProgram.transfer({
//         fromPubkey: fundedWallet.publicKey,
//         toPubkey: fundedWallet.publicKey,
//         lamports: 1_000_000, // 0.001 SOL
//       }),
//       new TransactionInstruction({
//         keys: [],
//         programId: new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"),
//         data: Buffer.from(JSON.stringify(voteData)),
//       })
//     );

//     // Finalize transaction
//     const { blockhash } = await connection.getLatestBlockhash();
//     transaction.recentBlockhash = blockhash;
//     transaction.feePayer = fundedWallet.publicKey;
//     transaction.sign(fundedWallet);

//     // Send transaction
//     const rawTx = transaction.serialize();
//     const txSignature = await connection.sendRawTransaction(rawTx);
//     const confirmation = await connection.confirmTransaction(txSignature);

//     // ✅ PendingVote Queue Me Store Karo
//     await prisma.pendingVote.create({
//       data: {
//         pollId: Number(poll_id),
//         optionId: Number(optionId), 
//         voterId: Number(voter_id),
//         txData: {
//           txHash: txSignature,
//           voteData
//         }
//       }
//     });

//     return NextResponse.json({
//       status: 'success',
//       txSignature,
//       explorerUrl: `https://explorer.solana.com/tx/${txSignature}?cluster=devnet`,
//       voteData,
//       confirmation
//     });

//   } catch (error: any) {
//     console.error('Voting failed:', {
//       error: error.message,
//       stack: error.stack
//     });
    
//     return NextResponse.json(
//       { 
//         error: error.message || "Voting failed",
//         details: error.details || null
//       },
//       { status: 500 }
//     );
//   }
// }


// import { Connection, Transaction, TransactionInstruction, PublicKey, Keypair, SystemProgram } from '@solana/web3.js';
// import { NextResponse } from 'next/server';
// import wallet from '@/wallet.json';
// import prisma from '@/lib/prisma'; // Remove if not using Prisma

// export async function POST(req: Request) {
//   const connection = new Connection('https://api.devnet.solana.com');
//   const fundedWallet = Keypair.fromSecretKey(Uint8Array.from(wallet));

//   try {
//     const { poll_id, option, optionId, voter_id } = await req.json();

//     if (!poll_id || !option || !voter_id) {
//       return NextResponse.json({ error: "poll_id, option, and voter_id are required" }, { status: 400 });
//     }

//     if (typeof poll_id !== 'string' || typeof option !== 'string' || typeof voter_id !== 'string') {
//       return NextResponse.json({ error: "poll_id, option, voter_id must be strings" }, { status: 400 });
//     }

//     const voteData = {
//       type: "vote",
//       data: {
//         poll_id,
//         option,
//         voter_id,
//         timestamp: new Date().toISOString()
//       }
//     };

//     const transaction = new Transaction().add(
//       SystemProgram.transfer({
//         fromPubkey: fundedWallet.publicKey,
//         toPubkey: fundedWallet.publicKey,
//         lamports: 1_000_000, 
//       }),
//       new TransactionInstruction({
//         keys: [],
//         programId: new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"),
//         data: Buffer.from(JSON.stringify(voteData)),
//       })
//     );

//     const { blockhash } = await connection.getLatestBlockhash();
//     transaction.recentBlockhash = blockhash;
//     transaction.feePayer = fundedWallet.publicKey;
//     transaction.sign(fundedWallet);

//     const rawTx = transaction.serialize();
//     const txSignature = await connection.sendRawTransaction(rawTx);
//     const confirmation = await connection.confirmTransaction(txSignature);

//     // Optional: Prisma save
//     if (prisma?.pendingVote) {
//       await prisma.pendingVote.create({
//         data: {
//           pollId: Number(poll_id),
//           optionId: Number(optionId),
//           voterId: String(voter_id),
//           txData: {
//             txHash: txSignature,
//             voteData
//           }
//         }
//       });
//     }

//     return NextResponse.json({
//       status: 'success',
//       txSignature,
//       explorerUrl: `https://explorer.solana.com/tx/${txSignature}?cluster=devnet`,
//       voteData,
//       confirmation
//     });

//   } catch (error: any) {
//     console.error('Voting failed:', {
//       error: error.message,
//       stack: error.stack
//     });
    
//     return NextResponse.json({ error: error.message || "Voting failed" }, { status: 500 });
//   }
// }



import { Connection, Transaction, TransactionInstruction, PublicKey, Keypair, SystemProgram } from '@solana/web3.js';
import { NextResponse } from 'next/server';
import wallet from '@/wallet.json';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  const connection = new Connection('https://api.devnet.solana.com');
  const fundedWallet = Keypair.fromSecretKey(Uint8Array.from(wallet));

  try {
    const { poll_id, option, optionId, voter_id } = await req.json();

    // Input validation (unchanged)
    if (!poll_id || !option || !voter_id) {
      return NextResponse.json({ error: "poll_id, option, and voter_id are required" }, { status: 400 });
    }

    const voteData = {
      type: "vote",
      data: {
        poll_id,
        option,
        voter_id,
        timestamp: new Date().toISOString()
      }
    };

    // Create transaction (unchanged)
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: fundedWallet.publicKey,
        toPubkey: fundedWallet.publicKey,
        lamports: 1_000_000, 
      }),
      new TransactionInstruction({
        keys: [],
        programId: new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"),
        data: Buffer.from(JSON.stringify(voteData)),
      })
    );

    // Finalize and send transaction (unchanged)
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = fundedWallet.publicKey;
    transaction.sign(fundedWallet);

    const rawTx = transaction.serialize();
    const txSignature = await connection.sendRawTransaction(rawTx);
    
    // Log the transaction signature to console
    console.log(`✅ Vote transaction submitted:`, {
      txSignature,
      explorerUrl: `https://explorer.solana.com/tx/${txSignature}?cluster=devnet`,
      poll_id,
      option,
      voter_id
    });

    const confirmation = await connection.confirmTransaction(txSignature);

    // Optional: Prisma save (unchanged)
    if (prisma?.pendingVote) {
      await prisma.pendingVote.create({
        data: {
          pollId: Number(poll_id),
          optionId: Number(optionId),
          voterId: String(voter_id),
          txData: {
            txHash: txSignature,
            voteData
          }
        }
      });
    }

    return NextResponse.json({
      status: 'success',
      txSignature,
      explorerUrl: `https://explorer.solana.com/tx/${txSignature}?cluster=devnet`,
      voteData,
      confirmation
    });

  } catch (error: any) {
    console.error('❌ Voting failed:', {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    
    return NextResponse.json({ error: error.message || "Voting failed" }, { status: 500 });
  }
}