import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
    // if(request.method !== 'GET'){
    //     return Response.json({
    //         success: false,
    //         message: "Method not allowed"
    //     }, {status: 405})
    // }

  await dbConnect();
  // localhost:3000/api/cuu?username=apoorva
  try {
    //get username from the url. username must be sent in the form of query in url
    const {searchParams} = new URL(request.url)
    // new URL() creates a full URL object from the request's url
    // search params is a built-in object which helps you access query paramteres easily.
    /// and then searchParams.get("username") extracts value of username from the url.
    const queryParam = {
        username: searchParams.get('username')
    }

    /// validating username with zod:
    /// in the documentation it is written quite clearly that safe parse will validate the parameter you have provided with respect to the schena you have written
    const result = UsernameQuerySchema.safeParse(queryParam)
    console.log("result from zod: ", result)

    // if the username is not adhering to the usernameValidation then throw error:
    if(!result.success) {
        const usernameErrors = result.error.format().username?._errors || []
        return Response.json({
            success: false,
            message: usernameErrors?.length > 0 ? usernameErrors.join(', ') : "invalid query parameters"
        } , {status: 400})
    }

    const {username} = result.data

    const existingVerifiedUser = await UserModel.findOne({
        username, isVerified: true
    })

    if(existingVerifiedUser) {
        return Response.json({
            success: false,
            message: "Username is already taken"
        }, {status: 400})
    }

    return Response.json({
        success: true,
        message: "Username is unique"
    }, {status: 200})


  } catch (error) {
    console.error("Error in checking uniqueness of username: ", error);
    return Response.json(
      {
        success: false,
        message: "Error in checking username",
      },
      { status: 500 }
    );
  }
}
