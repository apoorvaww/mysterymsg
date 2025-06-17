import {GoogleGenerativeAI} from '@google/generative-ai'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string)
        const model = genAI.getGenerativeModel({model: "gemini-2.0-flash"})

        const data = await request.json()

        const prompt = data.body
        const result = await model.generateContent(prompt)

        const response = await result.response;
        const output = await response.text();

        console.log("response", response.text())
        return NextResponse.json({output: output})
        
    } catch (error) {
        console.error("error in generating message: ", error)
    }
}