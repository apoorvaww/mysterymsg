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
import { Loader2, RefreshCcw, Copy, Check, Inbox } from "lucide-react";

const Dashboard = () => {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const [profileUrl, setProfileUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
  });
  const { register, watch, setValue } = form;
  const acceptMessages = watch("acceptingMessages");

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const res = await axios.get<ApiResponse>(`/api/accept-messages`, {
        withCredentials: true,
      });
      setValue("acceptingMessages", res.data.isAcceptingMessages as boolean);
    } catch (err) {
      const e = err as AxiosError<ApiResponse>;
      toast.error(e.response?.data.message || "Failed to fetch settings.");
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(async (refresh = false) => {
    setIsLoading(true);
    try {
      const res = await axios.get<ApiResponse & { messages: Message[] }>(
        "/api/get-messages"
      );
      setMessages(res.data.messages || []);
      if (refresh) toast.success("Messages refreshed.");
    } catch (err) {
      const e = err as AxiosError<ApiResponse>;
      toast.error(e.response?.data.message || "Failed to fetch messages.");
    } finally {
      setIsLoading(false);
    }
  }, []);

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
      const res = await axios.post<ApiResponse>(
        "/api/accept-messages",
        { acceptingMessages: !acceptMessages },
        { withCredentials: true }
      );
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
      setCopied(true);
      toast.success("Link copied!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-lg font-semibold text-slate-600">
          Please log in to continue.
        </p>
      </div>
    );
  }

  const username = session.user.username || session.user.name || "you";

  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-900">
      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Page Header Layout */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="text-xs font-bold tracking-widest uppercase text-indigo-600 mb-1">
              Mystery Message
            </p>
            <h1 className="text-3xl font-black tracking-tight text-slate-950">
              Hello, {username} ✦
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Manage your message settings and shareable link.
            </p>
          </div>

          {/* Stats Badges matching the dashboard look */}
          <div className="flex gap-2 flex-wrap">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
              You have {messages.length} message{messages.length !== 1 ? "s" : ""}
            </span>
            <span
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border ${
                acceptMessages
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-slate-100 text-slate-600 border-slate-200"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  acceptMessages ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
                }`}
              />
              {acceptMessages ? "Active" : "Paused"}
            </span>
          </div>
        </div>

        {/* Configuration Row Layout (Your Profile & Messages Split Look) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

          {/* Share Link Card component layout styling */}
          <div className="rounded-xl bg-white border border-slate-200/80 shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <p className="text-xs font-bold tracking-wider uppercase text-slate-500">
                Shareable Link
              </p>
              <span className="text-xs font-medium text-slate-400">Edit Username</span>
            </div>
            
            <div className="flex gap-2 items-center mb-2">
              <input
                type="text"
                value={profileUrl}
                readOnly
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-xs font-mono text-slate-600 focus:outline-none"
              />
              <Button
                onClick={copyToClipboard}
                size="icon"
                className={`rounded-lg h-[38px] w-10 shrink-0 transition-all border ${
                  copied
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600"
                    : "bg-white hover:bg-slate-50 text-slate-600 border-slate-200"
                }`}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
              </Button>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Share this link with others to receive anonymous messages.
            </p>
          </div>

          {/* Settings / Accept Status Controls Box */}
          <div className="rounded-xl bg-white border border-slate-200/80 shadow-sm p-6">
            <p className="text-xs font-bold tracking-wider uppercase text-slate-500 mb-4">
              Accept Messages Configuration
            </p>
            <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 border border-slate-100">
              <div>
                <p className="text-sm font-bold text-slate-800">
                  {isSwitchLoading ? "Updating settings..." : "Accept Messages Status"}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {acceptMessages
                    ? "Allow others to send you anonymous messages"
                    : "Inbox currently locked to new submissions"}
                </p>
              </div>
              <Switch
                {...register("acceptingMessages")}
                checked={acceptMessages}
                onCheckedChange={handleSwitchChange}
                disabled={isSwitchLoading}
                className="data-[state=checked]:bg-emerald-600 mt-0.5"
              />
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-slate-200" />

        {/* Inbox Header Controls Section */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div>
            <p className="text-xs font-bold tracking-wider uppercase text-slate-400 mb-0.5">
              Your Messages
            </p>
            <h2 className="text-xl font-extrabold text-slate-900">
              Inbox Manager
            </h2>
          </div>
          <Button
            variant="outline"
            onClick={(e) => {
              e.preventDefault();
              fetchMessages(true);
            }}
            className="flex items-center gap-2 rounded-lg border-slate-200 bg-white text-slate-600 hover:bg-slate-50 font-semibold text-xs shadow-sm"
          >
            {isLoading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <RefreshCcw className="h-3.5 w-3.5" />
            )}
            Refresh
          </Button>
        </div>

        {/* Message Cards Grid layout matching overall sleek aesthetics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Skeleton
                key={i}
                className="h-36 w-full rounded-xl bg-slate-200/60"
              />
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
            <div className="col-span-full flex flex-col items-center gap-3 py-16 text-slate-300">
              <Inbox size={40} strokeWidth={1.5} className="text-slate-400" />
              <p className="font-bold text-base text-slate-700">
                Your Inbox is Clean
              </p>
              <p className="text-xs text-slate-400 max-w-xs text-center leading-relaxed">
                No anonymous feedback entries here yet. Share your profile url to assemble feedback details!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;