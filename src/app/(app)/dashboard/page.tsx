"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import MessageCards from "@/components/MessageCards";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Message } from "@/model/User.model";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, RefreshCcw } from "lucide-react";

const Dashboard = () => {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const [profileUrl, setProfileUrl] = useState<string>("");

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
    } catch (err) {
      const e = err as AxiosError<ApiResponse>;
      toast.error(e.response?.data.message || "Failed to fetch settings.");
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(
    async (refresh = false) => {
      setIsLoading(true);
      try {
        const res = await axios.get<ApiResponse & { messages: Message[] }>(
          "/api/get-messages"
        );
        setMessages(res.data.messages || []);
        if (refresh) toast.message("Refreshed messages.");
      } catch (err) {
        const e = err as AxiosError<ApiResponse>;
        toast.error(e.response?.data.message || "Failed to fetch messages.");
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (typeof window !== "undefined" && session?.user?.username) {
      const { protocol, host } = window.location;
      setProfileUrl(`${protocol}//${host}/u/${session.user.username}`);
    }
  }, [session?.user?.username]);

  useEffect(() => {
    if (!session?.user) return;
    fetchMessages();
    fetchAcceptMessage();
  }, [session, fetchMessages, fetchAcceptMessage]);

  const handleSwitchChange = async () => {
    try {
      const res = await axios.post<ApiResponse>("/api/accept-messages", {
        acceptingMessages: !acceptMessages,
      });
      setValue("acceptingMessages", !acceptMessages);
      toast.success(res.data.message);
    } catch (err) {
      const e = err as AxiosError<ApiResponse>;
      toast.error(e.response?.data.message || "Toggle failed.");
    }
  };

  const handleDeleteMessage = (id: string) =>
    setMessages((prev) => prev.filter((m) => m._id !== id));

  const copyToClipboard = () => {
    if (typeof navigator !== "undefined" && profileUrl) {
      navigator.clipboard.writeText(profileUrl);
      toast("Copied to clipboard!");
    }
  };

  if (!session?.user) {
    return (
      <div className="text-center py-20 text-lg font-semibold">
        Please log in to continue.
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-10 mx-auto max-w-7xl">
      {/* Header */}
      <h1 className="text-3xl font-extrabold mb-3 text-center">
        Anonymous Messages
      </h1>
      <p className="text-center text-gray-600 mb-8">
        Copy your unique link and share it:
      </p>

      {/* Profile Link */}
      <div className="mb-10 text-center">
        <input
          type="text"
          value={profileUrl}
          disabled
          className="w-full md:w-2/3 border p-3 rounded-lg bg-gray-100"
        />
        <Button onClick={copyToClipboard} className="mt-2">
          Copy Link
        </Button>
      </div>

      {/* Accept Switch */}
      <div className="flex items-center justify-center mb-10 gap-4">
        <Switch
          {...register("acceptingMessages")}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className="text-gray-700">
          Accept Messages:{" "}
          <strong
            className={acceptMessages ? "text-green-600" : "text-red-600"}
          >
            {acceptMessages ? "On" : "Off"}
          </strong>
        </span>
      </div>

      {/* Refresh */}
      <div className="flex justify-center mb-8">
        <Button
          variant="outline"
          onClick={(e) => {
            e.preventDefault();
            fetchMessages(true);
          }}
          className="flex items-center gap-2"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCcw className="h-4 w-4" />
          )}
          Refresh
        </Button>
      </div>

      <Separator className="my-8" />

      {/* Messages Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-36 w-full rounded-xl" />
          ))
        ) : messages.length > 0 ? (
          messages.map((msg) => (
            <MessageCards
              key={msg._id as string}
              message={msg}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No messages to display.
          </p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
