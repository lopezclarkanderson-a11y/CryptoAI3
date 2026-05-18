import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST() {
  try {
    // Check if the API key is present
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { content: "Error: OpenAI API key is missing on the server configuration." },
        { status: 500 }
      );
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // fast, affordable, and supports vision/images
      messages: [
        {
          role: "system",
          content: "You are a professional crypto trading coach. Analyze the provided chart screenshot. Detail an Entry zone, Stop Loss, and Take Profit target, alongside a confidence score (1-10). Emphasize risk management and adherence to a minimum 1:2 risk-reward structure.",
        },
        {
          role: "user",
          content: "Analyze this crypto trade setup and evaluate its structural validity.",
        },
      ],
    });

    return NextResponse.json({ content: response.choices[0].message.content });
  } catch (error: any) {
    console.error("OpenAI Error:", error);
    return NextResponse.json(
      { content: `AI Error: ${error.message || "Failed to generate analysis"}` },
      { status: 500 }
    );
  }
}