import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: process.env.SMTP_PORT == 465,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

export const sendOtpEmail = async (email, otp, type = "verification") => {
  const transporter = createTransporter();
  
  let subject, html;
  
  if (type === "arrival") {
    subject = "Your Guest Arrival Verification Code";
    html = getArrivalOtpHtml(otp);
  } else {
    subject = "Email Verification - One-Time Password";
    html = getSignupOtpHtml(otp);
  }

  const mailOptions = {
    from: `"HydraOne" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: subject,
    html: html,
  };

  await transporter.sendMail(mailOptions);
};

const getSignupOtpHtml = (otp) => {
  return `
<html>
<head>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
    </style>
</head>
<body style="margin: 0; padding: 0; background: #0a0a0a; font-family: 'Inter', Arial, sans-serif; min-height: 100vh;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; min-height: 100vh; display: flex; align-items: center; justify-content: center;">
        <div style="width: 100%; background: #0f0f0f; position: relative; overflow: hidden; border-radius: 24px; border: 1px solid rgba(139, 92, 246, 0.2); box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);">
            <div style="position: absolute; left: 0; top: 0; bottom: 0; width: 4px; background: linear-gradient(180deg, #8B5CF6, #A855F7, #C084FC);"></div>
            <div style="position: absolute; right: 0; top: 0; bottom: 0; width: 4px; background: linear-gradient(180deg, #8B5CF6, #A855F7, #C084FC);"></div>
            <div style="margin: 0 20px; padding: 40px 30px; position: relative;">
                <div style="text-align: center; margin-bottom: 36px;">
                    <div style="background: linear-gradient(135deg, #8B5CF6, #A855F7); padding: 12px 32px; border-radius: 50px; display: inline-block; margin-bottom: 24px;">
                        <h1 style="color: white; font-size: 22px; margin: 0; font-weight: 700; letter-spacing: 1px;">HydraOne</h1>
                    </div>
                </div>
                <div style="text-align: center; margin-bottom: 36px;">
                    <h2 style="color: #8B5CF6; font-size: 42px; margin: 0 0 12px 0; font-weight: 700; letter-spacing: -1px;">Verify Your Email</h2>
                    <p style="color: #9CA3AF; font-size: 16px; margin: 0;">Complete your registration to join HydraOne</p>
                </div>
                <div style="text-align: center; margin: 50px 0;">
                    <p style="color: #9CA3AF; font-size: 13px; margin: 0 0 18px 0; font-weight: 500; letter-spacing: 2px; text-transform: uppercase;">Your Verification Code</p>
                    <div style="position: relative; display: inline-block; margin: 20px 0;">
                        <div style="background: linear-gradient(45deg, #F59E0B, #EF4444, #EC4899, #8B5CF6); padding: 3px; border-radius: 20px;">
                            <div style="background: #0f0f0f; border-radius: 17px; padding: 28px 48px;">
                                <div style="font-size: 42px; font-weight: 700; letter-spacing: 12px; color: #8B5CF6; font-family: 'Courier New', monospace;">${otp.toString().split('').join(' ')}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div style="background: linear-gradient(135deg, rgba(139, 92, 246, 0.08), rgba(168, 85, 247, 0.08)); border: 1px solid rgba(139, 92, 246, 0.2); border-radius: 16px; padding: 22px; margin: 36px 0;">
                    <p style="color: #A855F7; font-size: 16px; font-weight: 600; margin-bottom: 10px;">✨ Quick Note</p>
                    <p style="color: #D1D5DB; font-size: 14px; margin: 0; line-height: 1.5;">This code will expire in <strong style="color: #F59E0B;">10 minutes</strong>. Enter it to verify your email and complete signup.</p>
                </div>
                <div style="text-align: center; margin-top: 40px; padding-top: 28px; border-top: 1px solid #1f2937;">
                    <p style="color: #6B7280; font-size: 12px; margin: 0;">&copy; ${new Date().getFullYear()} HydraOne. All rights reserved.</p>
                    <p style="color: #6B7280; font-size: 12px; margin: 10px 0 0 0;">Didn't request this? You can safely ignore this email.</p>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
  `;
};

const getArrivalOtpHtml = (otp) => {
  return `
<div style="background:#111;color:#fff;padding:40px;text-align:center;font-family:Inter,Arial,sans-serif">
    <h2 style="color:#8B5CF6">Welcome!</h2>
    <p>Your arrival has been verified. Enter this code:</p>
    <h1 style="letter-spacing:8px;color:#8B5CF6">${otp.toString().split("").join(" ")}</h1>
    <p>Use within 10 minutes near the property.</p>
</div>
  `;
};

export const sendBulkOtpEmails = async (emailOtpMap, type = "verification") => {
  const transporter = createTransporter();
  
  for (const [email, otp] of Object.entries(emailOtpMap)) {
    let subject, html;
    
    if (type === "arrival") {
      subject = "Your Guest Arrival Verification Code";
      html = getArrivalOtpHtml(otp);
    } else {
      subject = "Email Verification - One-Time Password";
      html = getSignupOtpHtml(otp);
    }

    const mailOptions = {
      from: `"HydraOne" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: subject,
      html: html,
    };

    await transporter.sendMail(mailOptions);
  }
};