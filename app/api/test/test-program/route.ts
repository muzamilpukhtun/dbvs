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
import { Connection, Transaction, TransactionInstruction, PublicKey, Keypair, SystemProgram } from '@solana/web3.js';
import { NextResponse } from 'next/server';
import wallet from '@/wallet.json';

export async function POST(req: Request) {
  const connection = new Connection('https://api.devnet.solana.com');
  const fundedWallet = Keypair.fromSecretKey(Uint8Array.from(wallet));

  try {
    const { poll_id, option, voter_id = "anonymous" } = await req.json();
    
    // Validation
    if (!poll_id || !option) {
      return NextResponse.json(
        { error: "poll_id and option are required" }, 
        { status: 400 }
      );
    }

    if (typeof poll_id !== 'string' || typeof option !== 'string') {
      return NextResponse.json(
        { error: "poll_id and option must be strings" },
        { status: 400 }
      );
    }

    // Prepare vote data
    const voteData = {
      poll_id,
      option,
      voter_id,
      timestamp: new Date().toISOString()
    };

    // Create transaction
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: fundedWallet.publicKey,
        toPubkey: fundedWallet.publicKey,
        lamports: 1_000_000, // 0.001 SOL
      }),
      new TransactionInstruction({
        keys: [],
        programId: new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"),
        data: Buffer.from(JSON.stringify(voteData)),
      })
    );

    // Finalize transaction
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = fundedWallet.publicKey;
    transaction.sign(fundedWallet);

    // Send transaction
    const rawTx = transaction.serialize();
    const txSignature = await connection.sendRawTransaction(rawTx);
    const confirmation = await connection.confirmTransaction(txSignature);

    return NextResponse.json({
      status: 'success',
      txSignature,
      explorerUrl: `https://explorer.solana.com/tx/${txSignature}?cluster=devnet`,
      voteData,
      confirmation
    });

  } catch (error: any) {
    console.error('Voting failed:', {
      error: error.message,
      stack: error.stack
    });
    
    return NextResponse.json(
      { 
        error: error.message || "Voting failed",
        details: error.details || null
      },
      { status: 500 }
    );
  }
}