// // /api/vote/route.ts
// import { Connection, Transaction, TransactionInstruction, PublicKey, Keypair, SystemProgram } from '@solana/web3.js';
// import { NextResponse } from 'next/server';
// import wallet from '@/wallet.json';
// import prisma from '@/lib/prisma';

// export async function POST(req: Request) {
//   const connection = new Connection('https://api.devnet.solana.com');
//   const fundedWallet = Keypair.fromSecretKey(Uint8Array.from(wallet));

//   try {
//     const { poll_id, option, optionId, voter_id } = await req.json();

//     // Input validation (unchanged)
//     if (!poll_id || !option || !voter_id) {
//       return NextResponse.json({ error: "poll_id, option, and voter_id are required" }, { status: 400 });
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

//     // Create transaction (unchanged)
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

//     // Finalize and send transaction (unchanged)
//     const { blockhash } = await connection.getLatestBlockhash();
//     transaction.recentBlockhash = blockhash;
//     transaction.feePayer = fundedWallet.publicKey;
//     transaction.sign(fundedWallet);

//     const rawTx = transaction.serialize();
//     const txSignature = await connection.sendRawTransaction(rawTx);
    
//     // Log the transaction signature to console
//     console.log(`✅ Vote transaction submitted:`, {
//       txSignature,
//       explorerUrl: `https://explorer.solana.com/tx/${txSignature}?cluster=devnet`,
//       poll_id,
//       option,
//       voter_id
//     });

//     const confirmation = await connection.confirmTransaction(txSignature);

//     // Optional: Prisma save (unchanged)
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
//     console.error('❌ Voting failed:', {
//       error: error.message,
//       stack: error.stack,
//       timestamp: new Date().toISOString()
//     });
    
//     return NextResponse.json({ error: error.message || "Voting failed" }, { status: 500 });
//   }
// }



// pages/api/vote.ts
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

    // Save vote to database
    try {
      const savedVote = await prisma.pendingVote.create({
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
      
      console.log('Vote saved to database:', savedVote);
    } catch (dbError: any) {
      console.error('Failed to save vote to database:', {
        error: dbError.message,
        code: dbError.code,
        meta: dbError.meta
      });
      // Continue execution even if database save fails
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