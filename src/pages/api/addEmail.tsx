import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailRequest {
  email: string;
}

interface ApiResponse {
  error?: string;
  success?: boolean;
  response?: object;
}

export default async function handler(
  req: { method: string; body: EmailRequest },
  res: {
    status: (code: number) => {
      json: (response: ApiResponse) => void;
    };
  }
): Promise<void> {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method Not Allowed" });

  try {
    const { email } = req.body;
    const response = await resend.contacts.create({
      email: email,
      firstName: "",
      lastName: "",
      unsubscribed: false,
      audienceId: "40357694-6f0b-43a6-865d-64cb132af2a3",
    });

    return res.status(200).json({ success: true, response });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return res.status(500).json({ error: errorMessage });
  }
}
