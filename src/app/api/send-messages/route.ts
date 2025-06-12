import UserModel from "@/model/User.model";
import dbConnect from "@/lib/dbConnect";
import { Message } from "@/model/User.model";

export async function POST(request: Request) {
  await dbConnect();

  // since we are allowing users to send messages without signin-up we don't need to check auhtentication for this particular route
  // the username in the request is the one for which we are sending the message.. i guess..

  const { username, content } = await request.json();
  try {
    const user = await UserModel.findOne({ username });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    // is user accepting messages:
    const isAcceptingMessages = user.isAcceptingMessages;
    if (!isAcceptingMessages) {
      return Response.json(
        {
          success: false,
          message: "User is not accepting messages",
        },
        { status: 403 }
      );
    }

    const newMessage = { content, createdAt: new Date() };
    user.messages.push(newMessage as Message);
    await user.save();

    return Response.json(
      {
        success: true,
        message: "Message sent successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error while sending message: ", error);
    return Response.json(
      {
        success: false,
        message: "Error while sending message",
      },
      { status: 500 }
    );
  }
}
