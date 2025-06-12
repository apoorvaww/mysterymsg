import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(3, "Username must be atleast 2 characters long.")
  .max(20, "Username must not be longer than 20 characters long.")
  .regex(/^[a-zA-X0-9_]+$/, "Username must not contain special characters");

export const fullNameValidation = z
  .string()
  .min(6, "Full Name must be atleast 6 characters long.")
  .max(30, "Fullname can't be longer than 30 characters")
  .regex(/^[a-zA-X0-9_]+$/, "Full name must not contain special characters");

// object because we have to validate username, fullName, email etc. ek saath me
export const signUpSchema = z.object({
  username: usernameValidation,
  email: z.string().email({ message: "Invalid email address" }),
  fullName: fullNameValidation,
  password: z.string().min(8, {message: "Password must be atleast 8 character"})
});
