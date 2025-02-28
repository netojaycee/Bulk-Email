import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import * as xlsx from "xlsx";

interface Recipient {
    "First Name": string;
    "Last Name": string;
    Email: string;
}

export async function POST(req: Request) {
    try {
        // Ensure correct Content-Type handling
        if (!req.headers.get("content-type")?.includes("multipart/form-data")) {
            return NextResponse.json({ error: "Invalid Content-Type" }, { status: 400 });
        }

        // Parse FormData
        const formData = await req.formData();
        const file = formData.get("file") as File;
        const subject = formData.get("subject") as string;
        const message = formData.get("message") as string;

        // console.log("Received subject:", subject);
        // console.log("Received message:", message);

        if (!file || !subject || !message) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Read file as buffer
        const buffer = Buffer.from(await file.arrayBuffer());
        console.log("File buffer size:", buffer.length);

        // Parse Excel File
        const workbook = xlsx.read(buffer, { type: "buffer" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const recipients: Recipient[] = xlsx.utils.sheet_to_json(sheet);

        // console.log("Parsed Recipients:", recipients);

        // Validate Email Column
        if (!recipients.every((r: any) => r["Email"])) {
            return NextResponse.json({ error: "Invalid file format. 'Email' column required." }, { status: 400 });
        }

        // Email Credentials
        const senderEmail = process.env.SENDER_EMAIL;
        const senderPassword = process.env.SENDER_PASSWORD;

        if (!senderEmail || !senderPassword) {
            return NextResponse.json({ error: "Missing email credentials" }, { status: 500 });
        }

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: { user: senderEmail, pass: senderPassword },
        });

        // Send Emails
        for (const recipient of recipients) {
            // Replace all occurrences of placeholders
            const personalizedMessage = message
                .replace(/{{FirstName}}/g, recipient["First Name"])
                .replace(/{{LastName}}/g, recipient["Last Name"]);

            const mailOptions = {
                from: senderEmail,
                to: recipient.Email,
                subject,
                html: personalizedMessage, // No extra formatting, just the message
            };

            await transporter.sendMail(mailOptions);
        }


        return NextResponse.json({ message: "Emails sent successfully" }, { status: 200 });

    } catch (error) {
        console.error("Error sending emails:", error);
        return NextResponse.json({ error: "Failed to send emails" }, { status: 500 });
    }
}
