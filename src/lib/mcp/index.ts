import { defineMcp } from "@lovable.dev/mcp-js";
import subscribeNewsletterTool from "./tools/subscribe-newsletter";

export default defineMcp({
  name: "newsletter-mcp",
  title: "Newsletter MCP",
  version: "0.1.0",
  instructions:
    "Tools for this site's weekly newsletter. Use `subscribe_newsletter` to add an email address to the list.",
  tools: [subscribeNewsletterTool],
});
