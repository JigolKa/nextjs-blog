import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

const transporter = nodemailer.createTransport({
 service: "Gmail",
 auth: {
  user: process.env["GMAIL_USERNAME"],
  pass: process.env["GMAIL_PASSWORD"],
 },
});

export default async function sendMail(options: SMTPTransport.Options) {
 return await transporter.sendMail(options);
}
