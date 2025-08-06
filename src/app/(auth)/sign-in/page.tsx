"use client";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { signInSchema } from "@/schemas/signInSchema";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import LoadingPage from "@/components/LoadingPage";

const SignIn = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const[showRedirectLoading, setShowRedirectLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    mode: "onChange",
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);
    const result = await signIn("credentials", {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });

    if (result?.error) {
      if (result.error === "CredentialsSignin") {
        toast.error("Login Failed. Incorrect username or password.");
      } else {
        toast.error(`Error occurred while logging in: ${result.error}`);
      }
    } else if (result?.url) {
      setShowRedirectLoading(true);
      setTimeout(() => {
        router.replace(`/dashboard`);
      }, 500);
      
    }
    // setIsSubmitting(false);
  };

  if(showRedirectLoading) {
    <LoadingPage/>
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-white to-gray-100 px-4">
      <div className="w-full max-w-md p-8 rounded-2xl border border-gray-200 shadow-xl bg-white space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-gray-900 mb-2">
            Welcome Back 👋
          </h1>
          <p className="text-sm text-gray-500">
            Sign in to continue your secret conversations
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Email/Username */}
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email / Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter email or username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Sign In Button */}
            <Button
              className="w-full bg-black text-white hover:bg-gray-900"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                  Please wait
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </Form>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 mt-4">
          Not a member yet?{" "}
          <Link href="/sign-up" className="text-black underline hover:text-gray-700">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
