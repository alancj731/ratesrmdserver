// import dotenv from "dotenv";
import { Resend } from "resend";
import { USER } from "./types";

// dotenv.config();

export const sendEmail = async (user: USER) => {

    console.log("process.env.RESEND_API_KEY: ", process.env.RESEND_API_KEY);

    const resend = new Resend(process.env.RESEND_API_KEY) //process.env.RESEND_API_KEY);
    
    const result = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: user.email,
    subject: "Exchange Rate Reminder",
    html: `The exchange rate from ${user.from} to ${user.to} is now ${user.target}.`
    });

    console.log("send email result: ", result);

}