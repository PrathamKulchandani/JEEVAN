/* eslint-disable @typescript-eslint/no-explicit-any */
import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import React from "react";
import VerificationEmail from "../../Emails/VerificationEmail";

interface SendEmailParams {
  email: string;
  emailType: "verify" | "reset";
  name: string;
  otp: string;
}

export const sendEmail = async ({ email, emailType, name, otp }: SendEmailParams) => {
  try {
    const htmlContent = await render(
      React.createElement(VerificationEmail, { name, otp })
    );

    const subject = emailType === "verify" ? "Verify your account" : "Reset your password";

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.PASS,
      },
    });

    const mailOptions = {
      from: `"Jeevan" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
