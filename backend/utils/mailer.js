// utils/mailer.js
const nodemailer = require("nodemailer");

// Create and configure nodemailer transport
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "your-email@gmail.com", // Replace with your email
    pass: "your-email-password", // Replace with your email password or app password
  },
});

// Function to send email with custom HTML layout
const sendEmail = (fromEmail, name, message) => {
  const mailOptions = {
    from: fromEmail,
    to: "admin-email@example.com", // Replace with admin's email
    subject: `Contact us query from ${name}`,
    text: message,
    html: `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              color: #333;
              margin: 0;
              padding: 0;
              background-color: #f4f4f4;
            }
            .email-container {
              width: 100%;
              max-width: 600px;
              margin: 0 auto;
              background-color: #fff;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            }
            .email-header {
              text-align: center;
              padding: 10px;
              background-color: #0077b6;
              color: white;
              border-radius: 8px 8px 0 0;
            }
            .email-body {
              padding: 20px;
              line-height: 1.6;
            }
            .email-footer {
              text-align: center;
              margin-top: 30px;
              padding: 10px;
              font-size: 12px;
              color: #777;
            }
            .message {
              background-color: #f9f9f9;
              padding: 10px;
              border-left: 4px solid #0077b6;
              margin-top: 10px;
            }
            .footer-text {
              font-size: 12px;
              color: #555;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="email-header">
              <h2>New Contact Us Message</h2>
            </div>
            <div class="email-body">
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${fromEmail}</p>
              <div class="message">
                <p><strong>Message:</strong></p>
                <p>${message}</p>
              </div>
            </div>
            
          </div>
        </body>
      </html>
    `,
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error);
      } else {
        resolve(info.response);
      }
    });
  });
};

module.exports = { sendEmail };
