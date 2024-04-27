// import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import {USER} from "./types";
import { sendEmail } from "./sendemail";

// dotenv.config();
const prisma = new PrismaClient();

let rateFetched = false;
let currecyRates:any = null;
const INTERVAL = 1000 * 60 * 60 *24; // 24 hour
const apiKey=process.env.API_KEY?.replace(/"/g, '');
const fetchUrl = "https://api.currencybeacon.com/v1/latest?api_key="+apiKey+"&base=USD&ftype=fiat";
console.log(fetchUrl)

export function startLoop() {
  checkRate();
  return setInterval(checkRate, INTERVAL);
}

export function stopLoop(intervalId: NodeJS.Timeout) {
  clearInterval(intervalId);
}

const checkRate = async () => {
  if (!rateFetched) {
    try {
      const response = await fetch(fetchUrl);

      const data: any = await response.json();

      console.log("data: ", data)
      
      const { rates } = data;
      if (rates) {
        currecyRates = rates;
      }
      else {
        currecyRates = null;
      }
    
    } catch (err) {
      currecyRates = null;
      console.log(err);
    }

    if (currecyRates === null) {
      console.log("Failed to fetch currency rates");
      return;
    }

    // get all user data from database
    const users: USER[] = await prisma.user.findMany();

    users.forEach(user => {
      console.log(checkTarget(user))
      if (checkTarget(user))
      {
        sendEmail(user);
      }
    });

  }
};

function checkTarget(user:USER) {
  if (!currecyRates || !user.from || !user.to || !user.target) {
    return false;
  }
  const fromRate = currecyRates[user.from];
  const toRate = currecyRates[user.to];
  const currentExchageRate = (1/fromRate) / (1/toRate);
  return user.greater ? currentExchageRate >= user.target : currentExchageRate <= user.target;
}
