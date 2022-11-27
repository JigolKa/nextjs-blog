import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
const transporter = nodemailer.createTransport({
 service: "Gmail",
 auth: {
  user: "AwesomeBlog36@gmail.com",
  pass: "gbwkbmtjnprgkvoa",
 },
});

export default async function sendMail(options: SMTPTransport.Options) {
 return await transporter.sendMail(options);
}
