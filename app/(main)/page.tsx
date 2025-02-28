import BookingForm from "@/components/local/BookingForm";
import React from "react";

export default function SendEmails() {
  return (
    <div>
      <BookingForm
        therapistName={"John Test"}
        therapistEmail={"netojaycee@gmail.com"}
      />
    </div>
  );
}
