import { NextResponse } from "next/server";
import {GoogleGenerativeAI} from "@google/generative-ai"

export const runtime = "edge";

const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const model = ai.getGenerativeModel({model:"gemini-1.5-flash"})

export async function POST(request: Request) {
  try {
    const prompt ="Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

    const model = ai.getGenerativeModel({model:"gemini-1.5-flash"}) 

    const streamingResponse = await model.generateContentStream({
      contents: [{role:"user",parts: [{text:prompt}]}]
    })

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of streamingResponse.stream) {
          const text = chunk.text();
          if (text) {
            controller.enqueue(encoder.encode(text));
          }
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (error: any) {
    console.error("Gemini error:", error);
    return NextResponse.json(
      {
        error: true,
        message: error?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
