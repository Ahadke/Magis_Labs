import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const InputSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(255),
});

export const subscribeToNewsletter = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => InputSchema.parse(data))
  .handler(async ({ data }) => {
    const apiKey = process.env.MAILCHIMP_API_KEY;
    const audienceId = process.env.MAILCHIMP_AUDIENCE_ID;

    if (!apiKey || !audienceId) {
      throw new Error(
        "Newsletter is not configured yet. Please add MAILCHIMP_API_KEY and MAILCHIMP_AUDIENCE_ID.",
      );
    }

    const dc = apiKey.split("-")[1];
    if (!dc) {
      throw new Error("Invalid Mailchimp API key format.");
    }

    const url = `https://${dc}.api.mailchimp.com/3.0/lists/${audienceId}/members`;
    const auth = "Basic " + Buffer.from(`anystring:${apiKey}`).toString("base64");

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: auth,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email_address: data.email,
        status: "subscribed",
      }),
    });

    if (res.ok) {
      return { ok: true as const, alreadySubscribed: false };
    }

    // Mailchimp returns 400 with title "Member Exists" when already subscribed.
    let body: { title?: string; detail?: string } = {};
    try {
      body = (await res.json()) as { title?: string; detail?: string };
    } catch {
      // ignore
    }

    if (res.status === 400 && body.title === "Member Exists") {
      return { ok: true as const, alreadySubscribed: true };
    }

    console.error("Mailchimp subscribe failed", res.status, body);
    throw new Error(body.detail || "Unable to subscribe right now. Please try again later.");
  });
