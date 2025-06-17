"use client";
import MessageCards from "@/components/MessageCards";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Message } from "@/model/User.model";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw, Link as LinkIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const Dashboard = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
  });

  const { register, watch, setValue } = form;
  const acceptMessages = watch("acceptingMessages");

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const res = await axios.get<ApiResponse>(`/api/accept-messages`);
      setValue("acceptingMessages", res.data.isAcceptingMessages as boolean);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message || "Failed to fetch message settings."
      );
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(async (refresh = false) => {
    setIsLoading(true);
    try {
      const res = await axios.get(`/api/get-messages`);
      console.log(res.data.messages);
      setMessages(res.data.messages || []);
      if (refresh) {
        toast.message("Refreshed messages. Showing latest messages.");
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message || "Failed to fetch messages."
      );
      console.error("error in fetching messages:", axiosError);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!session?.user) return;
    fetchMessages();
    fetchAcceptMessage();
  }, [session, fetchMessages, fetchAcceptMessage]);

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>("/api/accept-messages", {
        acceptingMessages: !acceptMessages,
      });
      setValue("acceptingMessages", !acceptMessages);
      toast.success(response.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message ||
          "Failed to handle accepting messages."
      );
    }
  };

  const handleDeleteMessage = (messageId: string) => {
    setMessages((prev) => prev.filter((m) => m._id !== messageId));
  };

  const username = session?.user.username;
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast.success("URL copied to clipboard");
  };

  if (!session?.user)
    return (
      <div className="text-center py-20 text-lg font-semibold">
        Please login to continue.
      </div>
    );

  return (
    
      <div className="p-6 bg-white shadow-md rounded-lg w-full">
        <h1 className="text-4xl font-bold mb-6">Anonymous messages</h1>
        <p className="text-lg">
          Send messages/feedbacks honestly with your identity hidden. Copy the
          link to my profile below:
        </p>

        <div className="mb-6 mt-6">
          <h2 className="text-lg font-semibold mb-2">
            Your Unique Message Link
          </h2>
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
            <input
              type="text"
              value={profileUrl}
              disabled
              className="w-full border border-gray-300 p-2 rounded-md bg-gray-100 text-sm"
            />
            <Button onClick={copyToClipboard} className="w-full md:w-auto">
              Copy
            </Button>
          </div>
        </div>

        <div className="mb-6 flex items-center gap-4">
          <Switch
            {...register("acceptingMessages")}
            checked={acceptMessages}
            onCheckedChange={handleSwitchChange}
            disabled={isSwitchLoading}
          />
          <span className="text-sm font-medium">
            Accept Messages:{" "}
            <span
              className={acceptMessages ? "text-green-600" : "text-red-600"}
            >
              {acceptMessages ? "On" : "Off"}
            </span>
          </span>
        </div>

        <div className="mb-6">
          <Button
            variant="outline"
            onClick={(e) => {
              e.preventDefault();
              fetchMessages(true);
            }}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />

            ) : (
              <RefreshCcw className="h-4 w-4" />
            )}
            <span className="ml-2">Refresh</span>
          </Button>
        </div>

        <Separator className="my-6" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading? (
            Array.from({length: 5}).map((_,index) => (
              <Skeleton key={index} className="h-36 w-full rounded-xl" />
            ))
          ) : 
          messages.length > 0 ? (
            messages.map((message) => (
              <MessageCards
                key={message._id as string}
                message={message}
                onMessageDelete={handleDeleteMessage}
              />
            ))
          ) : (
            <p className="text-gray-500">No messages to display.</p>
          )}
        </div>
      </div>

  );
};

export default Dashboard;
