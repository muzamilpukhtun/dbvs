// //app/poll/vote-count
// import { NextResponse } from 'next/server';
// import { Connection, PublicKey, Keypair } from '@solana/web3.js';
// import wallet from '@/wallet.json';

// const MEMO_PROGRAM_ID = new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr");

// export async function GET() {
//   const connection = new Connection("https://api.devnet.solana.com");

//   try {
//     const fundedWallet = Keypair.fromSecretKey(Uint8Array.from(wallet));
//     const devWalletPubkey = fundedWallet.publicKey;

//     const sigs = await connection.getSignaturesForAddress(devWalletPubkey, { limit: 100 });
//     const allPolls = [];
    

//     for (const sigInfo of sigs) {
//       // ✅ Rate Limit Handling
//       await new Promise(res => setTimeout(res, 300)); // Adjust delay as needed (300ms is safe)

//       const tx = await connection.getTransaction(sigInfo.signature, { maxSupportedTransactionVersion: 0 });
//       if (!tx?.transaction?.message?.compiledInstructions) continue;

//       const programIds = tx.transaction.message.staticAccountKeys.map(k => k.toString());

//       for (const ix of tx.transaction.message.compiledInstructions) {
//         const programId = programIds[ix.programIdIndex];

//         if (programId === MEMO_PROGRAM_ID.toString() && ix.data) {
//           try {
//             const memoDataStr = Buffer.from(ix.data, "base64").toString("utf8");

//             // ✅ JSON Parse only if string starts with `{`
//             if (!memoDataStr.trim().startsWith("{")) continue;

//             const memoData = JSON.parse(memoDataStr);

//             if (memoData?.type === "vote" && memoData?.data?.poll_id) {
//               allPolls.push(memoData.data);
//             }
//           } catch (err) {
//             console.warn("Invalid memo JSON ignored:", err.message);
//           }
//         }
//       }
//     }

//     return NextResponse.json({ polls: allPolls });

//   } catch (err: any) {
//     console.error("API Error:", err.message);
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }



// app/poll/vote-count
import { NextResponse } from 'next/server';
import { Connection, PublicKey, Keypair } from '@solana/web3.js';
import wallet from '@/wallet.json';

const MEMO_PROGRAM_ID = new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr");

export async function GET() {
  const connection = new Connection("https://api.devnet.solana.com");

  try {
    const fundedWallet = Keypair.fromSecretKey(Uint8Array.from(wallet));
    const devWalletPubkey = fundedWallet.publicKey;

    // ✅ Updated: Reduced to latest 10 signatures only to speed up processing
    const sigs = await connection.getSignaturesForAddress(devWalletPubkey, { limit: 10 });

    const allPolls = [];

    // ✅ Updated: Parallel fetching of transactions for faster response
    const txResults = await Promise.all(
      sigs.map(sigInfo => connection.getTransaction(sigInfo.signature, { maxSupportedTransactionVersion: 0 }))
    );

    for (const tx of txResults) {
      if (!tx?.transaction?.message?.compiledInstructions) continue;

      const programIds = tx.transaction.message.staticAccountKeys.map(k => k.toString());

      for (const ix of tx.transaction.message.compiledInstructions) {
        const programId = programIds[ix.programIdIndex];

        if (programId === MEMO_PROGRAM_ID.toString() && ix.data) {
          try {
            const memoDataStr = Buffer.from(ix.data, "base64").toString("utf8");

            // ✅ Already good: Validate JSON structure
            if (!memoDataStr.trim().startsWith("{")) continue;

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
