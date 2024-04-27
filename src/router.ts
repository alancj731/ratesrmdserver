import express from "express";
import { Prisma, PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

router.put("api/v1", async (req, res) => {
  const { email, from, to, target, greater } = req.body;
  console.log(email, from, to, target, greater);

  if (email === "" || from === "" || to === "" || target <= 0) {
    return res.status(400).json({ error: "Invalid request body" });
  }
  // check if email exist in the database
  const user = await prisma.user.findUnique({
    where: { email: email },
  });
  if (!user) {
    console.log("user not found!");
    try {
      // insert new record
      const insertResult = await prisma.user.create({
        data: {
          email,
          from,
          to,
          target,
          greater,
        },
      });
      console.log("inserted new record");
      return res.status(200).json(insertResult);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: err });
    }
  } else {
    console.log("user found");
    try {
      // update existing record
      const updateResult = await prisma.user.update({
        where: { email: email },
        data: {
          from,
          to,
          target,
          greater,
        },
      });
      console.log("updated a record");
      return res.status(200).json(updateResult);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: err });
    }
  }
});

router.get("", async (_, res) => {
  return res.status(200).json({ messge: "Hello from express server!" });
});

export default router;
