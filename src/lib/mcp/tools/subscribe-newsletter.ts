import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

export default defineTool({
  name: "subscribe_newsletter",
  title: "Subscribe to newsletter",
  description:
    "Subscribe an email address to the weekly newsletter. Returns whether the address was newly subscribed or was already on the list.",
  inputSchema: {
    email: z.string().trim().toLowerCase().email().max(255).describe("Email address to subscribe."),
  },
  annotations: { readOnlyHint: false, idempotentHint: true, openWorldHint: true },
  handler: async ({ email }) => {
    const apiKey = process.env.MAILCHIMP_API_KEY;
    const audienceId = process.env.MAILCHIMP_AUDIENCE_ID;

    if (!apiKey || !audienceId) {
      return {
        content: [
          {
            type: "text",
            text: "Newsletter is not configured yet (missing Mailchimp credentials).",
          },
        ],
        isError: true,
      };
    }

    const dc = apiKey.split("-")[1];
    if (!dc) {
      return {
        content: [{ type: "text", text: "Invalid Mailchimp API key format." }],
        isError: true,
      };
    }

    const url = `https://${dc}.api.mailchimp.com/3.0/lists/${audienceId}/members`;
    const auth = "Basic " + Buffer.from(`anystring:${apiKey}`).toString("base64");

    const res = await fetch(url, {
      method: "POST",
      headers: { Authorization: auth, "Content-Type": "application/json" },
      body: JSON.stringify({ email_address: email, status: "subscribed" }),
    });

    if (res.ok) {
      return {
        content: [{ type: "text", text: `Subscribed ${email} to the newsletter.` }],
        structuredContent: { email, alreadySubscribed: false },
      };
    }

    let body: { title?: string; detail?: string } = {};
    try {
      body = (await res.json()) as { title?: string; detail?: string };
    } catch {
      // ignore
    }

    if (res.status === 400 && body.title === "Member Exists") {
      return {
        content: [{ type: "text", text: `${email} is already subscribed.` }],
        structuredContent: { email, alreadySubscribed: true },
      };
    }

    return {
      content: [
        {
          type: "text",
          text: body.detail || `Mailchimp request failed with status ${res.status}.`,
        },
      ],
      isError: true,
    };
  },
});
