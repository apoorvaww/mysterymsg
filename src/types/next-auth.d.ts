import "next-auth";
import { DefaultSession } from "next-auth";

// modifying the data types from next-auth, specifically the user field

declare module "next-auth" {
  interface User {
    _id?: string;
    username?: string;
    isVerified?: boolean;
    fullName?: string;
    isAcceptingMessages?: boolean;
  }
  interface Session {
    user: {
      _id?: string;
      username?: string;
      isVerified?: boolean;
      fullName?: string;
      isAcceptingMessages?: boolean;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    _id?:string,
    isVerified?:boolean,
    isAcceptingMessages?:boolean,
    username?:string,
    fullName?:string,
  }
}