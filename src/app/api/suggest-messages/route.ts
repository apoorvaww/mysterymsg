import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST() {
  try {
    const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Include things which people would like to tell about themselves. Like their hobbies or there favourite shows or musicians or food anything..";

    const completion = await openai.chat.completions.create({
      model: "mistralai/mistral-7b-instruct-v0.2",

      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],

      temperature: 0.8,
      top_p: 0.95,
    });

    const output = completion.choices[0].message.content;

    return Response.json({
      success: true,
      message: "Suggested messages generated successfully",
      messages: output,
    });
  } catch (error: any) {
    console.error("error in sending messages", error);

    return Response.json(
      {
        success: false,
        message: "Failed to generate messages",
        error: error?.message || "Unknown error",
      },
      {
        status: 500,
      },
    );
  }
}
