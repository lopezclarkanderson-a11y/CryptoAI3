export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { content: "Error: OpenAI API key is missing on the server configuration." },
        { status: 500 }
      );
    }

    // Extract the image file from the request data
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ content: "Error: No file uploaded." }, { status: 400 });
    }

    // Convert the file to a buffer and then to a base64 string for the AI to look at
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString("base64");

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", 
      messages: [
        {
          role: "system",
          content: "You are a professional crypto trading coach. Analyze the provided chart screenshot. Detail an Entry zone, Stop Loss, and Take Profit target, alongside a confidence score (1-10). Emphasize risk management and adherence to a minimum 1:2 risk-reward structure.",
        },
        {
          role: "user",
          content: [
            { type: "text", text: "Analyze this crypto trade setup and evaluate its structural validity." },
            {
              type: "image_url",
              image_url: {
                url: `data:${file.type};base64,${base64Image}`,
              },
            },
          ],
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