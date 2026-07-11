import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

export default defineTool({
  name: "send_contact_message",
  title: "Send contact message",
  description: "Record an inquiry from a visitor who wants to hire or collaborate. Returns a confirmation payload.",
  inputSchema: {
    name: z.string().min(1).describe("Sender's name"),
    email: z.string().email().describe("Sender's email"),
    message: z.string().min(1).describe("Message body"),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
  handler: ({ name, email, message }) => ({
    content: [
      {
        type: "text",
        text: `Thanks ${name}! Your message has been recorded and will be forwarded to hello@indrajit.dev.`,
      },
    ],
    structuredContent: {
      received: true,
      from: { name, email },
      preview: message.slice(0, 120),
      timestamp: new Date().toISOString(),
    },
  }),
});
