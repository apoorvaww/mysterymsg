import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";


export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, email, password, fullName } = await request.json();
    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingUserVerifiedByUsername) {
      return Response.json(
        {
          success: false,
          message: "User with this username already exists and is verified.",
        },
        { status: 400 }
      );
    }

    const existingUserByEmail = await UserModel.findOne({
      email,
    });

    let verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    if (existingUserByEmail) {
        if(existingUserByEmail.isVerified) {
            return Response.json({
                success: false,
                message: "User with email already exists."
            }, {status: 400})
        }
        else{ 
            const hashedPassword = await bcrypt.hash(password, 10);
            existingUserByEmail.password = hashedPassword;
            existingUserByEmail.verifyCode = verificationCode;
            existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600)
            existingUserByEmail.fullName = fullName;

            await existingUserByEmail.save();
        }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new UserModel({
        username,
        email,
        fullName,
        verifyCode: verificationCode,
        verifyCodeExpiry: expiryDate,
        password: hashedPassword,
        isVerified: false,
        isAcceptingMessages: true,
        messages: [],
      });

      await newUser.save();
    }

    /// send verification email:
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verificationCode
    );

    console.log("email response", emailResponse)

    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "User registered successfully. Please verify your email.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in registering the user", error);
    return Response.json({
      sucess: false,
      message: "Error registering the user",
    },{
      status:500
    });
  }
}
