// import transporter from '../config/emailConfig.js';

// async function sendEmail(to, subject, text) {
//   try {
//     // Send email
//     const info = await transporter.sendMail({
//       from: 'nidhee.dubey@ennomail.com',
//       to,
//       subject,
//       text,
//     });

//     console.log('Email sent:', info.messageId);
//   } catch (error) {
//     console.error('Error sending email:', error);
//   }
// }

// export default sendEmail;

import { createTransport } from "nodemailer";

async function sendEmail(req, res, emailData) {
  const transporter = createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: "nicenidhee01@gmail.com", // MAKE SURE THIS EMAIL IS YOUR GMAIL FOR WHICH YOU GENERATED APP PASSWORD
      pass: "kvuv ddyc ijxq ywma", // MAKE SURE THIS PASSWORD IS YOUR GMAIL APP PASSWORD WHICH YOU GENERATED EARLIER
    }
  });

  try {
    const info = await transporter
      .sendMail(emailData);
    console.log(`Message sent: ${info.response}`);
    return res.json({
      success: true,
    });
  } catch (err) {
    return console.log(`Problem sending email: ${err}`);
  }
}

export default sendEmail;