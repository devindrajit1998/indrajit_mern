import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

export default defineTool({
  name: "get_portfolio_summary",
  title: "Get portfolio summary",
  description: "Returns a short summary of Indrajit Ghosh's MERN developer portfolio: role, stack, experience and contact info.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [
      {
        type: "text",
        text: JSON.stringify(
          {
            name: "Indrajit Ghosh",
            role: "MERN Stack Developer",
            stack: ["MongoDB", "Express.js", "React.js", "Node.js", "TypeScript", "Tailwind CSS"],
            years_experience: 3,
            projects_completed: 15,
            location: "Kolkata, India",
            email: "hello@indrajit.dev",
            available_for_hire: true,
          },
          null,
          2,
        ),
      },
    ],
  }),
});
