import UserModel from "@/model/User.model";
import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { NextRequest } from "next/server";

export async function DELETE(request: NextRequest) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!session || !user) {
    return Response.json(
      {
        success: false,
        message: "Can't delete message. Unauthorized request.",
      },
      { status: 401 }
    );
  }

  // Extract messageId from the URL params
  const url = new URL(request.url);
  const pathParts = url.pathname.split("/");
  const messageId = pathParts[pathParts.length - 1];  // Last part of path is messageId

  console.log("Deleting message with ID:", messageId);

  try {
    const updatedResult = await UserModel.updateOne(
      { _id: user._id },
      { $pull: { messages: { _id: messageId } } }
    );

    if (updatedResult.modifiedCount === 0) {
      return Response.json(
        {
          success: false,
          message: "Message not found or already deleted",
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
    console.error("Error deleting the message: ", error);
    return Response.json(
      {
        success: false,
        message: "Error in deleting message",
      },
      { status: 500 }
    );
  }
}
