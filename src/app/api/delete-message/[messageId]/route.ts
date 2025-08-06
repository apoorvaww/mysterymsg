import UserModel from "@/model/User.model";
import dbConnect from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../../../api/auth/[...nextauth]/options";
import { NextRequest } from "next/server";

export async function DELETE(
  { params }: { params: { messageId: string } }
) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !user) {
    return Response.json(
      {
        success: false,
        message: "Can't delete message. Unauthorized request.",
      },
      { status: 401 }
    );
  }

  // get the message id from the params:
  const messageId = params.messageId;

  try {
    const updatedResult = await UserModel.updateOne(
      {
        _id: user._id,
      },
      {
        $pull: { messages: { _id: messageId } },
      }
    );
    if (updatedResult.modifiedCount === 0) {
      return Response.json(
        {
          success: false,
          message: "message not found or already deleted",
        },
        { status: 404 }
      );
    }
    return Response.json(
      {
        success: true,
        message: "Message deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("error deleting the message: ", error);
    return Response.json(
      {
        success: false,
        message: "Error in deleting message",
      },
      { status: 500 }
    );
  }
}
