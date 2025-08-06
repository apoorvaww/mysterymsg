import { Schema, Document } from "mongoose";
import mongoose from "mongoose";

export interface Message extends Document {
  content: string;
  createdAt: Date;
}

const MessageSchema: Schema<Message> = new Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});


export interface User extends Document {
    _id: mongoose.Types.ObjectId,
    username: string,
    fullName: string,
    email: string,
    password: string,
    verifyCode: string,
    verifyCodeExpiry: Date,
    isVerified: boolean,
    isAcceptingMessages: boolean,
    messages: Message[]
}

const UserSchema:Schema = new Schema({
    username: {
        type:String,
        required: [true, "Username is required"],
        trim: true,
        unique: true
    },
    fullName: {
        type: String,
        required: [true, "Full Name is required"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true, 
        match: [/.+\@.+\..+/, 'please enter a valid email address']
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        
    },
    verifyCode: {
        type: String,
        required: [true, "Verify code is required"]
    },
    verifyCodeExpiry: {
        type: Date,
        required: [true, "Verify code expiry is required"]
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isAcceptingMessages: {
        type: Boolean,
        default: true,
    },
    messages: [MessageSchema]
});

//nextjs edge pe run krta hai to use nhi pta hai ki vo database ko pehli baar request bhej rha hai ya nhi

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema)

export default UserModel;