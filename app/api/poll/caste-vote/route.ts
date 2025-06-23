import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
} from '@solana/web3.js';
import {
  AnchorProvider,
  Program,
  setProvider,
} from '@coral-xyz/anchor';
import walletArray from '@/wallet.json';
import { NextResponse } from 'next/server';
import rawIdl from '@/idl/pdc_blockchain_part.json';

// Constants
const PROGRAM_ID = new PublicKey('D8HmzgTCpv8DhnFegGSG3ZHD1NfH5gZUhpEeEDE9a487');
const WALLET = Keypair.fromSecretKey(Uint8Array.from(walletArray));
const SOLANA_CONNECTION = new Connection('https://api.devnet.solana.com', 'confirmed');

// Transform IDL to match Anchor's expectations
const idl = {
  ...rawIdl,
  instructions: rawIdl.instructions.map(ix => ({
    ...ix,
    accounts: ix.accounts.map(acc => ({
      ...acc,
      isSigner: acc.signer || false,
      isWritable: acc.writable || false
    }))
  }))
};

export async function POST(req: Request) {
  try {
    const { poll_id, option, voter_id } = await req.json();
    
    // Validate inputs
    if (!poll_id || !option || !voter_id) {
      return NextResponse.json(
        { error: 'Missing required fields (poll_id, option, voter_id)' },
        { status: 400 }
      );
    }

    // Setup wallet and provider
    const wallet = {
      publicKey: WALLET.publicKey,
      signTransaction: async (tx) => {
        tx.partialSign(WALLET);
        return tx;
      },
      signAllTransactions: async (txs) => {
        return txs.map(tx => tx.partialSign(WALLET));
      },
    };

    const provider = new AnchorProvider(
      SOLANA_CONNECTION,
      wallet,
      { commitment: 'confirmed' }
    );
    setProvider(provider);

    // Initialize program
    const program = new Program(
      {
        ...idl,
        version: idl.metadata?.version || '0.1.0',
        metadata: {
          ...idl.metadata,
          address: PROGRAM_ID.toString()
        }
      },
      PROGRAM_ID,
      provider
    );

    // Find PDA for vote account
    const [voteAccountPDA] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("vote_account"),
        Buffer.from(poll_id),
        Buffer.from("v1"),
      ],
      program.programId
    );

    // Send transaction with better error handling
    const txSignature = await program.methods
      .castVote(poll_id, option, voter_id)
      .accounts({
        voteAccount: voteAccountPDA,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc()
      .catch(async (error) => {
        console.error("Transaction Error:", {
          error: error.message,
          logs: error.logs,
          voteAccountPDA: voteAccountPDA.toString(),
          voter: voter_id
        });
        throw error;
      });

    return NextResponse.json({ 
      success: true, 
      signature: txSignature,
      voteAccount: voteAccountPDA.toString(),
      explorerUrl: `https://explorer.solana.com/tx/${txSignature}?cluster=devnet`
    });

  } catch (error: any) {
    console.error("Voting Error:", {
      message: error.message,
      stack: error.stack,
      logs: error.logs || []
    });

    return NextResponse.json(
      { 
        error: error.message,
        errorType: error.constructor.name,
        logs: error.logs || [],
        programId: PROGRAM_ID.toString(),
        suggestion: error.code === 6000 ? 'User has already voted' : 
                   error.code === 6001 ? 'Poll vote limit reached' : 
                   'Check transaction details'
      },
      { status: 500 }
    );
  }
}