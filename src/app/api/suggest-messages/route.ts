import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: Request) {
  try {
    const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Include things which people would like to tell about themselves. Like their hobbies or there favourite shows or musicians or food anything..";

      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string)
      const model = genAI.getGenerativeModel({model: 'gemini-2.0-flash', generationConfig:{
        temperature:0.8,
        topK: 40,
        topP: 0.95
      }})

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const output = await response.text();

      console.log("response: ", response.text());
      return Response.json({
        success: true,
        message: " suggested Messages sent successfully",
        messages: output

      })
      
  } catch (error) {
    console.error("error in sending messages", error)
  }
}
