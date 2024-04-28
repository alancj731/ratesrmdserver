import dotenv from "dotenv";
import { Resend } from "resend";
import { USER } from "./types";

dotenv.config();

export const sendEmail = async (user: USER) => {

    const resendApiKey = process.env.RESEND_API_KEY?.replace(/"/g, '');
    console.log('resendApiKey:', resendApiKey)

    const resend = new Resend(resendApiKey)
    
    const result = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: user.email,
    subject: "Exchange Rate Reminder",
    html: `The exchange rate from ${user.from} to ${user.to} is now ${user.target}.`
    });

    console.log("send email result: ", result);

}