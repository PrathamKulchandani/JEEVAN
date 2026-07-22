/* eslint-disable @typescript-eslint/no-explicit-any */
import { Resend } from "resend";
import { render } from "@react-email/render";
import React from "react";
import VerificationEmail from "../../Emails/VerificationEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

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

    const { data, error } = await resend.emails.send({
      from: "Jeevan <onboarding@resend.dev>",
      to: email,
      subject,
      html: htmlContent,
    });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
