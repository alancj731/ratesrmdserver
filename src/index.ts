import { PrismaClient } from '@prisma/client'
import express from 'express'
import cors from 'cors'
import { startLoop, stopLoop } from './loop'
import router from "./router"

const prisma = new PrismaClient()
const app = express()
const INTERVAL = 1000 * 2 // 24 hour
let intervalId:any = null;

app.use(express.json())
// enable CORS for all origins
app.use(cors({
  origin: '*', // Allow all domains
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow all methods
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'] // Allow all headers
}));

// set up a checking loop
intervalId = startLoop() // 24 hour

// router to handel api access
app.use(router)

function clearBeforeExit(){
  if (intervalId) stopLoop(intervalId);
  prisma.$disconnect()
  process.exit()
}
// close interval when exit
process.on('exit', () => {
  clearBeforeExit();
})

process.on('SIGINT', () => {
  clearBeforeExit();
})

process.on('SIGTERM', () => {
  clearBeforeExit();
})


const server = app.listen(3000, () =>
  console.log(`🚀 Server Started!`),
)
