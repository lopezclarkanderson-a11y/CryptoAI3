import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST() {
  const response = await openai.chat.completions.create({
    model: "gpt-5.5",
    messages: [
      {
        role: "system",
        content: "You are a professional crypto trader.",
      },
      {
        role: "user",
        content: "Analyze this trade setup.",
      },
    ],
  });

  return Response.json(response.choices[0].message);
}
