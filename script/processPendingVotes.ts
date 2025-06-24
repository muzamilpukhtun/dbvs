// scripts/processPendingVotes.ts
import  prisma  from "@/lib/prisma";
import { Connection } from "@solana/web3.js";

const connection = new Connection("https://api.devnet.solana.com");

async function processVotes() {
  const pendingVotes = await prisma.pendingVote.findMany();

  for (const vote of pendingVotes) {
    try {
      const txStatus = await connection.getConfirmedTransaction(vote.txData.txSignature);

      if (txStatus) {
        await prisma.vote.create({
          data: {
            pollId: vote.pollId,
            optionId: vote.optionId,
            voterId: vote.voterId,
            txHash: vote.txData.txSignature,
            status: "CONFIRMED",
          },
        });

        await prisma.pendingVote.delete({ where: { id: vote.id } });
        console.log(`Vote confirmed for Poll ${vote.pollId}`);
      }
    } catch (err) {
      console.error("Error processing vote", err);
    }
  }
}

processVotes().then(() => {
  console.log("Vote processing complete.");
  process.exit(0);
});
