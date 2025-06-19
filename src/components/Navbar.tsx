"use client";

import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "./ui/button";
import Skeleton from 'react-loading-skeleton'
const Navbar = () => {
  const { data: session } = useSession();
  const user: User = session?.user as User;


  return (
    <nav className="bg-white shadow-sm px-4 py-4 md:px-8 md:py-5 border-b">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
        <Link
          href="/"
          className="text-2xl font-bold text-black hover:text-yellow-300 transition-colors duration-200 mb-3 md:mb-0"
        >
          Mystery Msgs
        </Link>

        <div className="flex items-center gap-4">
          {session ? (
            <>
              <span className="text-sm md:text-base text-gray-600">
                Welcome,{" "}
                <span className="font-medium text-gray-800">
                  {user.username || user.email}
                </span>
              </span>
              <Button
                className="w-full md:w-auto bg-black text-white"
                onClick={() => signOut()}
              >
                Logout
              </Button>
            </>
          ) : (
            <Link href="/sign-in">
              <Button className="w-full md:w-auto" >Login</Button>

            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
