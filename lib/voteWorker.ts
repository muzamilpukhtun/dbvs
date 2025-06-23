import { PrismaClient } from '@prisma/client'
import { Connection, Transaction } from '@solana/web3.js'
import { createClient } from 'redis'

const prisma = new PrismaClient()
const solanaConn = new Connection('https://api.devnet.solana.com')
const redis = createClient({ url: process.env.REDIS_URL })

async function processVoteBatch() {
  await redis.connect()
  
  while (true) {
    // 1. Get batch of 20 votes from Redis
    const batch = await redis.lRange('vote_queue', 0, 19)
    if (batch.length === 0) {
      await new Promise(resolve => setTimeout(resolve, 5000))
      continue
    }

    // 2. Process each vote
    for (const item of batch) {
      const { pollId, optionId, voterId, txData } = JSON.parse(item)
      
      try {
        const tx = Transaction.from(Buffer.from(txData, 'base64'))
        const txSignature = await solanaConn.sendRawTransaction(tx.serialize())
        
        // 3. Update database
        await prisma.vote.create({
          data: {
            pollId,
            optionId,
            voterId,
            txHash: txSignature,
            status: 'CONFIRMED'
          }
        })

        // 4. Update vote count
        await prisma.option.update({
          where: { id: optionId },
          data: { votes: { increment: 1 } }
        })

        // 5. Remove from queue
        await redis.lRem('vote_queue', 1, item)

      } catch (error) {
        console.error(`Failed to process vote: ${error}`)
        await prisma.vote.create({
          data: {
            pollId,
            optionId,
            voterId,
            txHash: 'FAILED',
            status: 'FAILED'
          }
        })
      }
    }
  }
}

// Start worker
processVoteBatch()