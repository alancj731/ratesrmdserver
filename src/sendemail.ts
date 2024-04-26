import { Resend } from "resend";
import { USER } from "./types";

export const sendEmail = async (user: USER) => {
    const resend = new Resend("re_aKNWoDkJ_LwQU98ZFsD61TNjeZXSeWJMk") //process.env.RESEND_API_KEY);
    console.log("user.email: ", user.email)
    
    const result = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: user.email,
    subject: "Exchange Rate Reminder",
    html: `The exchange rate from ${user.from} to ${user.to} is now ${user.target}.`
    });

    console.log("send email result: ", result);

}