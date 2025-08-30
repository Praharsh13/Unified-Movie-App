import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { registerUser } from '../controllers/user.controller.js';

// Configure the transporter
const transporter = nodemailer.createTransport({
    service: 'gmail', // You can use other email services like Outlook, Yahoo, etc.
    auth: {
      user: 'movieappott@gmail.com',  // Your email (from environment variables)
      pass: 'dgmfhvtljswhctbj',  // Your email password (from environment variables)
    },
  });
  
  // Function to send confirmation email to the user
  export const sendRegistrationConfirmationEmail = (newUser) => {
    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender address
      to: newUser.email, // Receiver (user's email)
      subject: 'Registration Successful - Welcome to Movie App!',
      text: `Hello ${newUser.username},\n\nThank you for registering on Movie App! We are excited to have you on board.\n\nStart exploring the movies from your favorite OTT platforms now!\n\nBest Regards,\nMovie App Team`,
      html: `
        <h2>Hello ${newUser.username},</h2>
        <p>Thank you for registering on <strong>Movie App</strong>! We are excited to have you on board.</p>
        <p>Start exploring the movies from your favorite OTT platforms now!</p>
        <br />
        <p>Best Regards,<br/>Movie App Team</p>
      `, // HTML formatted email body
    };
  
    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error sending email:', error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  };