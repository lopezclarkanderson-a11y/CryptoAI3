import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export const dynamic = "force-dynamic";

// Initialize the Gemini SDK
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { content: "Error: Gemini API key is missing on the server configuration." },
        { status: 500 }
      );
    }

    // Extract the image file from the request data
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ content: "Error: No file uploaded." }, { status: 400 });
    }

    // Convert the file to an ArrayBuffer and then to a Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const systemInstruction = 
      "You are a professional crypto trading coach. Analyze the provided chart screenshot. " +
      "Detail an Entry zone, Stop Loss, and Take Profit target, alongside a confidence score (1-10). " +
      "Emphasize risk management and adherence to a minimum 1:2 risk-reward structure.";

    // Call the free Gemini model
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        "Analyze this crypto trade setup and evaluate its structural validity.",
        {
          inlineData: {
            data: buffer.toString("base64"),
            mimeType: file.type,
          },
        },
      ],
      config: {
        systemInstruction: systemInstruction,
      },
    });

    return NextResponse.json({ content: response.text });
  } catch (error: any) {
    console.error("Gemini Error:", error);
    return NextResponse.json(
      { content: `AI Error: ${error.message || "Failed to generate analysis"}` },
      { status: 500 }
    );
  }
}