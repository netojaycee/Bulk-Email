import { z } from "zod";

export const contactSchema = z.object({
    name: z
        .string({ required_error: "Name is required" })
        .min(1, "Name is required"),

    email: z
        .string({ required_error: "Email is required" })
        .email("Invalid email address"),
    phone: z
        .string()
        .regex(/^\+?[0-9\s-]+$/, "Invalid phone number format")
        .min(10, "Phone number must be at least 10 digits"),
    subject: z
        .string({ required_error: "Subject is required" })
        .min(1, "Subject is required"),
    message: z
        .string({ required_error: "Message is required" })
        .min(1, "Message is required"),
})


