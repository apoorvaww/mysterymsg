"use client";
import React from "react";
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
  CardContent
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { Message } from "@/model/User.model";
import { toast } from "sonner";
import axios from "axios";
import dayjs from 'dayjs';
import { ApiResponse } from "@/types/ApiResponse";
import { Skeleton } from "./ui/skeleton";

type MessageCardProps = {
    message: Message,
    onMessageDelete: (messageId: string) => void
}

const MessageCards = ({message, onMessageDelete} : MessageCardProps) => {

    const handleDeleteConfirm = async () => {
        try {
          const res = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`)
  
          console.log("response after deleting message: ", res.data);
          toast.success(res.data.message)
          onMessageDelete(message._id as string)
        } catch (error) {
          toast.error("Failed to delete the message. Try again.")
          console.error("error in deleting message: ", error)
        }
    }

  return (
    <Card>
      <Skeleton className="h-[20px] w-[100px] rounded-full"/>
      <CardHeader>
        <div className="flex justify-between items-center">
        <CardTitle>{message.content}</CardTitle>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive"><X className="w-5 h-5"/></Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                message.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        </div>
        <div className="text-sm">
          {dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}
        </div>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  );
};

export default MessageCards;
