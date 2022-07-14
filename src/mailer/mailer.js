const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});

const mailOptions = (html) => ({
  from: process.env.EMAIL,
  to: process.env.EMAIL,
  subject: "User Details Data Records",
  html: html,
});

module.exports = { mailOptions, transporter };
