import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
    try {
        const { therapistName, therapistEmail, name, email } = await req.json();

        const senderEmail = process.env.SENDER_EMAIL;
        const senderPassword = process.env.SENDER_PASSWORD;
        const adminEmail = process.env.SENDER_EMAIL; // Your site admin email

        if (!senderEmail || !senderPassword) {
            return NextResponse.json({ error: "Missing email credentials" }, { status: 500 });
        }

        // Create transporter
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: senderEmail,
                pass: senderPassword,
            },
        });

        // Email template function
        const getEmailTemplate = (recipient: string) => `
      <div style="background-color: #f9f9f9; padding: 20px; font-family: Arial, sans-serif;">
        <div style="max-width: 600px; background: white; padding: 20px; border-radius: 10px; box-shadow: 0px 4px 10px rgba(0,0,0,0.1);">
          <div style="text-align: center;">
            <img src="https://mhapy.vercel.app/images/logo.png" alt="Mhapy Logo" style="max-width: 150px;">
          </div>
          <h2 style="color: #441890; text-align: center;">New Booking Notification</h2>
          <p style="color: #333;">Hello ${recipient},</p>
          <p>A new client has shown interest in booking an appointment.</p>

          <h3 style="color: #441890;">Client Details:</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>

          <h3 style="color: #441890;">Therapist Details:</h3>
          <p><strong>Name:</strong> ${therapistName}</p>
          <p><strong>Email:</strong> ${therapistEmail}</p>

          <p style="margin-top: 20px; text-align: center;">
            <a href="mailto:${email}" style="background: #441890; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px;">Contact Client</a>
          </p>

          <p style="font-size: 12px; color: #888; text-align: center; margin-top: 20px;">
            This email was sent by Mhapy. If you have any questions, please contact support.
          </p>
        </div>
      </div>
    `;

        // Email to Therapist
        const therapistMailOptions = {
            from: senderEmail,
            to: therapistEmail,
            subject: "New Booking Request",
            html: getEmailTemplate(therapistName),
        };

        // Email to Admin
        const adminMailOptions = {
            from: senderEmail,
            to: adminEmail,
            subject: "New Client Booking - Notification",
            html: getEmailTemplate("Admin"),
        };

        // Send Emails
        await transporter.sendMail(therapistMailOptions);
        await transporter.sendMail(adminMailOptions);

        return NextResponse.json({ message: "Emails sent successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error sending email:", error);
        return NextResponse.json({ error: "Failed to send emails" }, { status: 500 });
    }
}
