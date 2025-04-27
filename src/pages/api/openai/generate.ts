import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

// Check if we have the API key
if (!process.env.OPENAI_API_KEY) {
  console.error("Missing OPENAI_API_KEY environment variable");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Helper function to clean potential markdown code blocks
const cleanJsonResponse = (text: string): string => {
  const match = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  return match ? match[1].trim() : text.trim();
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  console.log('handler');
  if (req.method !== "POST") {
    res.status(405).json({
      error: "Method not allowed",
      showToast: true
    });
    return;
  }

  const { model, messages, temperature = 0.7, response_format } = req.body;

  // Log the incoming request body (excluding potentially large messages if needed)
  console.log('API Request Body:', { model, temperature, response_format, messageCount: messages?.length });

  if (!model || !messages) {
    res.status(400).json({
      error: "Missing required fields: model or messages",
      showToast: true
    });
    return;
  }

  try {
    const completionConfig: OpenAI.Chat.Completions.ChatCompletionCreateParams = {
      model,
      messages,
      temperature,
    };

    // Add response_format if provided and valid
    if (response_format && response_format.type === 'json_object') {
      completionConfig.response_format = { type: 'json_object' };
      console.log('Using response_format: json_object');
    }

    const chat = await openai.chat.completions.create(completionConfig);

    const responseText = chat.choices[0].message.content;

    // Log the raw response from OpenAI
    console.log('Raw OpenAI Response:', responseText);

    if (!responseText) {
      res.status(500).json({
        error: "AI returned an empty response. Please try again.",
        showToast: true
      });
      return;
    }

    let cleanedText = responseText;
    // Only clean if not using json_object mode, as that should guarantee JSON
    if (completionConfig.response_format?.type !== 'json_object') {
      cleanedText = cleanJsonResponse(responseText);
      if (cleanedText !== responseText) {
        console.log('Cleaned OpenAI Response:', cleanedText);
      }
    }

    try {
      const parsed = JSON.parse(cleanedText);
      res.status(200).json(parsed);
    } catch (parseError) {
      console.error("Invalid JSON response after cleaning:", cleanedText, parseError);
      res.status(500).json({
        error: "AI returned invalid JSON format. Please try again.",
        showToast: true,
        details: cleanedText.substring(0, 150) + "..."
      });
    }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error("Error in OpenAI API call:", err);

    let errorMessage = "AI service encountered an error";
    let statusCode = err.status || 500;

    if (err instanceof OpenAI.APIError) {
      statusCode = err.status;
      errorMessage = err.message;
      console.error(`OpenAI API Error (${statusCode}): ${err.name} - ${err.message}`);
      if (statusCode === 429) {
        errorMessage = "AI service is currently busy (Rate Limit). Please try again in a moment.";
      } else if (statusCode === 401 || statusCode === 403) {
        errorMessage = "Authentication error with AI service. Check API Key.";
      } else if (statusCode >= 500) {
        errorMessage = "AI service is experiencing issues. Please try again later.";
      } else if (statusCode === 400) {
        errorMessage = `Invalid request sent to AI service: ${err.message}`;
      }
    } else {
      errorMessage = err.message || "An unknown error occurred.";
    }

    res.status(statusCode).json({
      error: errorMessage,
      showToast: true,
      details: err.message || "Unknown error details"
    });
  }
}