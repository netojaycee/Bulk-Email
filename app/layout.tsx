import type { Metadata } from "next";
import "./globals.css";
import ReduxProvider from "@/lib/ReduxProvider";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "email - An email sending app",
  description:
    "A simple app that takes excel file and send emails to emails contained in it.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={`antialiased bg-[#fafbff]`}>
        <ReduxProvider>{children}</ReduxProvider>{" "}
        <Toaster richColors closeButton />
      </body>
    </html>
  );
}
