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
// app.use(cors({
//   origin: '*', // Allow all domains
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow all methods
//   allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'] // Allow all headers
// }));
app.use((_, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Adjust this to match the domain you wish to allow
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});
// set up a checking loop
// intervalId = startLoop() // 24 hour

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
  console.log(`
🚀 Server ready at: http://localhost:3000
⭐️ See sample requests: http://pris.ly/e/ts/rest-express#3-using-the-rest-api`),
)
