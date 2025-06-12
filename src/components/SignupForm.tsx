"use client";
import React from "react";
import { ApiResponse } from "@/types/ApiResponse";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import useForm from "react-hook-form";
import { useEffect, useState } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import * as z from "zod";
import { Button } from "./ui/button";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";

import { Form, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Loader2 } from "lucide-react";

function SignupForm() {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const debouncedUsername = useDebounce(username, 300);

  const router = useRouter();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      fullName: "",
    },
  });

  useEffect(() => {
    const checkUsernameUnique = async() => {
      if(debouncedUsername) {
        setIsCheckingUsername(true);
        setUsernameMessage('');
      }
      try {
        const response = await axios.get<ApiResponse>(`/api/check-username-unique?username=${debouncedUsername}`)
      } catch (error) {
        
      }
    }
  }, [])
}

export default SignupForm;
