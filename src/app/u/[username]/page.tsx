"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { messageSchema } from "@/schemas/messageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useCompletion } from "@ai-sdk/react";
import { Loader2, Sparkles, Send } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

const specialChar = "||";

const parseStringMessages = (
  messageString?: string
): string[] => {
  if (!messageString) return [];
  return messageString.split(specialChar);
};

const initialMessageString =
  "What's your favorite movie?||Do you have any pets?||What's your dream job?";

const SendMessagesToUsername = () => {
  const [isLoading, setIsLoading] = useState(false);

  const params = useParams<{ username: string }>();
  const username = params.username;

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
  });

  const [suggestedMessages, setSuggestedMessages] =
    useState<string>(initialMessageString);

  // const router = useRouter();

  const {
    isLoading: isSuggestLoading,
    error,
  } = useCompletion({
    api: "/api/suggest-messages",
    initialCompletion: initialMessageString,
  });

  const messageContent = form.watch("content");

  const handleMessageClick = (message: string) => {
    form.setValue("content", message);
  };

  const onSubmit = async (
    data: z.infer<typeof messageSchema>
  ) => {
    setIsLoading(true);

    try {
      const res = await axios.post("/api/send-messages", {
        username,
        content: data.content,
      });

      console.log(res.data);

      toast.success("Message sent successfully");

      form.reset({
        content: "",
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;

      toast.error(
        axiosError?.response?.data.message ||
          "Error in sending messages"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSuggestedMessages = async () => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/suggest-messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      console.log(data);

      // FIXED HERE
      setSuggestedMessages(data.message || initialMessageString);
    } catch (error) {
      toast.error("Couldn't generate message suggestions.");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-900 py-12 px-4 flex justify-center items-start selection:bg-indigo-500/30">
      <div className="w-full max-w-3xl bg-white border border-slate-200/80 shadow-sm rounded-2xl p-6 md:p-10 space-y-8">
        
        {/* Header */}
        <div className="text-center">
          <p className="text-xs font-bold tracking-widest uppercase text-indigo-600 mb-1">
            Mystery Message
          </p>

          <h1 className="text-3xl font-black tracking-tight text-slate-950">
            Send an Anonymous Message
          </h1>

          <p className="text-slate-500 text-sm mt-1">
            Your identity remains completely hidden from the recipient.
          </p>
        </div>

        {/* Form */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 text-xs font-bold tracking-wide uppercase">
                    Anonymous Message to{" "}
                    <span className="text-indigo-600 font-extrabold">
                      @{username}
                    </span>
                  </FormLabel>

                  <FormControl>
                    <Input
                      className="h-12 rounded-xl bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-500 text-sm transition-all"
                      placeholder="Type your candid feedback or question here..."
                      {...field}
                    />
                  </FormControl>

                  <FormMessage className="text-xs font-medium text-rose-500" />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={
                  isLoading || !messageContent?.trim()
                }
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl px-5 h-11 shadow-sm transition-all flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    Send Message
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>

        <Separator className="bg-slate-100" />

        {/* Suggestions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={fetchSuggestedMessages}
              disabled={isSuggestLoading || isLoading}
              className="border-slate-200 bg-white text-slate-700 hover:bg-slate-50 font-bold text-xs rounded-xl shadow-sm flex items-center gap-2"
            >
              <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
              Suggest Messages
            </Button>

            <p className="text-xs font-medium text-slate-400">
              Select an option below to fill the input field
            </p>
          </div>

          <Card className="bg-slate-50/50 border border-slate-200/60 rounded-xl shadow-none overflow-hidden">
            <CardHeader className="bg-slate-50 px-5 py-3 border-b border-slate-200/50">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                AI Prompts & Ideas
              </h3>
            </CardHeader>

            <CardContent className="p-5">
              {error ? (
                <p className="text-sm font-medium text-rose-500">
                  {error.message}
                </p>
              ) : (
                <div className="flex flex-col gap-2.5">
                  {parseStringMessages(
                    suggestedMessages
                  ).map((message, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() =>
                        handleMessageClick(message)
                      }
                      className="w-full text-left bg-white border border-slate-200 hover:border-indigo-200 rounded-xl px-4 py-3 hover:bg-indigo-50/30 transition-all duration-200 text-sm text-slate-700 font-medium shadow-none hover:shadow-sm break-words"
                    >
                      {message}
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Separator className="bg-slate-100" />

        {/* Footer */}
        <div className="text-center space-y-3 bg-indigo-50/40 border border-indigo-100/40 rounded-xl p-5">
          <p className="text-xs font-semibold text-slate-500">
            Want to host your own anonymous inbox?
          </p>

          <Link href="/sign-up" className="inline-block">
            <Button
              variant="link"
              className="text-indigo-600 hover:text-indigo-700 font-bold text-sm p-0 h-auto"
            >
              Create your account today →
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SendMessagesToUsername;