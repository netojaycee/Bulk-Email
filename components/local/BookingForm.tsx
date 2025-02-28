"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import React, { useState } from "react";
import ErrorMessage from "@/components/local/errorMessage";
import { useSendEmailMutation } from "@/redux/appData";
import { Textarea } from "../ui/textarea";
import { toast } from "sonner";

const uploadSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message cannot be empty"),
  file: z.any().refine((file) => file && file.length > 0, {
    message: "File is required",
  }),
});

export default function BookingForm() {
  const [globalError, setGlobalError] = useState<string>("");
  const [sendEmail, { isLoading, isSuccess, isError, error, data }] =
    useSendEmailMutation();

  const form = useForm<z.infer<typeof uploadSchema>>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      subject: "",
      message: "",
      file: null,
    },
  });

  const onSubmit = async (values: z.infer<typeof uploadSchema>) => {
    setGlobalError("");

    try {
      const formData = new FormData();
      formData.append("subject", values.subject);
      formData.append("message", values.message);

      if (values.file && values.file.length > 0) {
        formData.append("file", values.file[0]); // Ensure it's the actual file
      }

      await sendEmail(formData);
      console.log("Form submitted:", values);
    } catch (error) {
      const message =
        (error as { data?: { message?: string } })?.data?.message ||
        "An unexpected error occurred.";
      setGlobalError(message);
      console.error("An error occurred:", error);
    }
  };

  React.useEffect(() => {
    if (isSuccess) {
      // console.log("Success:", data);
      toast.success("Emails sent successfully!");
      form.reset();
    } else if (isError) {
      if ("data" in error && typeof error.data === "object") {
        setGlobalError("Something went wrong.");
        toast.error("Something went wrong.");
      } else {
        setGlobalError("An unexpected error occurred.");
        toast.error("An unexpected error occurred.");
      }
    }
  }, [isSuccess, isError, error, data, form]);

  return (
    <div className='flex flex-col items-center justify-center w-full'>
      <AnimatePresence>
        <motion.div
          key='uploadForm'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <div className='w-full border p-6 rounded-[16px]'>
            <h1 className='text-xl lg:text-[30px] font-medium mb-4 font-satoshi'>
              Send Bulk Email
            </h1>
            <p className='text-sm text-gray-500 dark:text-gray-400 mb-4'>
              Upload an Excel file with recipient details, enter your message,
              and hit send!
            </p>

            {globalError && <ErrorMessage error={globalError} />}

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-4'
              >
                {/* Subject */}
                <FormField
                  control={form.control}
                  name='subject'
                  render={({ field }) => (
                    <FormItem className='w-full'>
                      <FormLabel className='font-semibold text-base'>
                        Subject
                      </FormLabel>
                      <FormControl>
                        <Input
                          className='w-full'
                          type='text'
                          placeholder='Enter email subject'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Message */}
                <FormField
                  control={form.control}
                  name='message'
                  render={({ field }) => (
                    <FormItem className='w-full'>
                      <FormLabel className='font-semibold text-base'>
                        Message
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          className='w-full'
                          placeholder='Write your email message...'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* File Upload */}
                <FormField
                  control={form.control}
                  name='file'
                  render={({ field }) => (
                    <FormItem className='w-full'>
                      <FormLabel className='font-semibold text-base'>
                        Upload Excel File (.xlsx)
                      </FormLabel>
                      <FormControl>
                        <Input
                          className='w-full'
                          type='file'
                          accept='.xlsx'
                          onChange={(e) => field.onChange(e.target.files)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <div className='w-full mt-5'>
                  {isLoading ? (
                    <Button
                      disabled
                      className='flex items-center justify-center gap-1 w-full'
                      type='submit'
                    >
                      <span>Please wait</span>
                      <Loader2 className='animate-spin' />
                    </Button>
                  ) : (
                    <Button className='w-full' type='submit'>
                      Send
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
