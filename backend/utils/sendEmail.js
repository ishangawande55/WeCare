// utils/sendEmail.js
const nodemailer = require('nodemailer');

// Set up the transporter for sending emails
const transporter = nodemailer.createTransport({
  service: 'gmail', // Email service (you can change this to other services like SendGrid or Amazon SES)
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Function to send email
const sendEmail = async (to, subject, text) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (err) {
    console.error('Error sending email: ', err);
  }
};

module.exports = sendEmail;