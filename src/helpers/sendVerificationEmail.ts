import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verificationCode: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: "Mysterymsg || Verification code ",
      react: VerificationEmail({ username, otp: verificationCode }),
    });
    return { success: true, message: "email sent" };
  } catch (emailError) {
    console.error("Error while sending verification email:", emailError);
    return { success: false, message: "Failed to send verification email" };
  }
}
