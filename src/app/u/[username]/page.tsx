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
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useCompletion } from "@ai-sdk/react";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator"; // fixed: use correct separator
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

const specialChar = "||";

const parseStringMessages = (messageString: string): string[] => {
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
      content: "This is content",
    },
  });

  const [suggestedMessages, setSuggestedMessages] =
    useState(initialMessageString);
  const router = useRouter();

  const {
    complete,
    completion,
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

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      const res = await axios.post(`/api/send-messages`, {
        username,
        content: data.content,
      });
      toast.success("Message sent successfully");
      router.replace(`/dashboard`);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError?.response?.data.message || "Error in sending messages"
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
      setSuggestedMessages(data.messages);
    } catch (error) {
      toast.error("Couldn't generate message suggestions.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-yellow-50 to-white py-12 px-4 flex justify-center items-start">
      <div className="w-full max-w-7xl bg-white shadow-2xl rounded-3xl p-10 space-y-10">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Send an Anonymous Message
          </h1>
          <p className="text-gray-600 text-sm">
            Your identity will not be revealed to the recipient.
          </p>
        </div>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 text-sm font-medium">
                    Send anonymous message to{" "}
                    <span className="font-semibold">{username}</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="h-12 rounded-lg border-gray-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200"
                      placeholder="Write your anonymous message..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <Button type="submit" disabled={isLoading || !messageContent}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </>
                ) : (
                  "Send It"
                )}
              </Button>
            </div>
          </form>
        </Form>

        {/* Suggest Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <Button
              onClick={fetchSuggestedMessages}
              disabled={isSuggestLoading}
            >
              Suggest Messages
            </Button>
            <p className="text-sm text-gray-500">
              Click on any message below to select it
            </p>
          </div>

          <Card className="bg-gray-50 border border-yellow-100">
            <CardHeader>
              <h3 className="text-xl font-semibold text-gray-800">
                Suggestions
              </h3>
            </CardHeader>
            <CardContent>
              {error ? (
                <p className="text-red-500">{error.message}</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {parseStringMessages(suggestedMessages).map(
                    (message, index) => (
                      <button
                        key={index}
                        onClick={() => handleMessageClick(message)}
                        className="w-full text-left bg-white border border-gray-200 rounded-lg px-4 py-3 hover:bg-yellow-50 transition-all duration-200 text-sm text-gray-700 break-words"
                      >
                        {message}
                      </button>
                    )
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Separator className="my-6 bg-gray-200 h-[1px]" />

        {/* Footer CTA */}
        <div className="text-center space-y-3">
          <p className="text-sm text-gray-600">Want to receive messages too?</p>
          <Link href="/sign-up">
            <Button>Create your account</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SendMessagesToUsername;
