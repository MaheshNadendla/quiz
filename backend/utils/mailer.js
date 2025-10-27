import nodemailer from "nodemailer";

// Create and configure nodemailer transport
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER, // e.g., your-email@gmail.com
    pass: process.env.MAIL_PASS, // Gmail App Password (not raw password)
  },
});

// Function to send an email with custom HTML layout
export const sendEmail = async (fromEmail, name, message) => {
  const mailOptions = {
    from: process.env.MAIL_USER,
    to: process.env.ADMIN_EMAIL || "admin@example.com", // Default admin email
    subject: `Contact Us Query from ${name}`,
    html: `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
            }
            .email-container {
              max-width: 600px;
              margin: 20px auto;
              background-color: #fff;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            }
            .email-header {
              background-color: #0077b6;
              color: white;
              padding: 10px;
              text-align: center;
              border-radius: 8px 8px 0 0;
            }
            .email-body {
              padding: 20px;
              line-height: 1.6;
            }
            .message {
              background-color: #f9f9f9;
              padding: 10px;
              border-left: 4px solid #0077b6;
              margin-top: 10px;
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

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.response);
    return info.response;
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};
