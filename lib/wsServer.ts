import { WebSocketServer } from 'ws'
import { createClient } from 'redis'

const wss = new WebSocketServer({ port: 3001 })
const redis = createClient({ url: process.env.REDIS_URL })

redis.subscribe('vote_updates', (message) => {
  wss.clients.forEach(client => {
    client.send(message)
  })
})