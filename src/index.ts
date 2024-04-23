import { Prisma, PrismaClient } from '@prisma/client'
import express from 'express'
import cors from 'cors'

const prisma = new PrismaClient()
const app = express()

app.use(express.json())
// enable CORS for all origins
app.use(cors());

app.get("/api/v1/", async (req, res) => {
  console.log("GET /api/v1")
  res.json("Hello, World!");
})

app.put("/api/v1/", async (req, res) => {
  const {email, from, to, target, greater} = req.body
  console.log(email, from, to, target, greater)
  
  if (!email || !from || !to || !target || !greater) {
    return res.status(400).json({error: "Invalid request body"})
  }
  // check if email exist in the database
  const user = await prisma.user.findUnique({
    where: {email: email}
  })
  console.log('founded user:', user)
  if (!user) {
    try {
      // insert new record
      const insertResult = await prisma.user.create({
        data: {
          email,
          from,
          to,
          target,
          greater
        }
      })
      console.log("inserted new record")
      return res.status(200).json(insertResult)
    }
    catch (err) {
      console.log(err)
      return res.status(500).json({error: err})
    }
  }
  else {
    try {
      // update existing record
      const updateResult = await prisma.user.update({
        where: {email: email},
        data: {
          from,
          to,
          target,
          greater
        }
      })
      console.log("updated a record")
      return res.status(200).json(updateResult)
    }
    catch (err) {
      console.log(err)
      return res.status(500).json({error: err})
    }
  }
})

const server = app.listen(3000, () =>
  console.log(`
🚀 Server ready at: http://localhost:3000
⭐️ See sample requests: http://pris.ly/e/ts/rest-express#3-using-the-rest-api`),
)
