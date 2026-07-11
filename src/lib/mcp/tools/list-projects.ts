import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

const projects = [
  {
    title: "Travel Explorer",
    description: "Full-stack MERN travel booking platform with user authentication and payments.",
    tags: ["MongoDB", "Express.js", "React.js", "Node.js", "JWT"],
  },
  {
    title: "Admin Dashboard",
    description: "Analytics dashboard with modern UI, real-time data and role based authentication.",
    tags: ["React.js", "Node.js", "MongoDB", "Chart.js", "Tailwind"],
  },
  {
    title: "Task Management App",
    description: "Collaborative task management application with real-time updates and team chats.",
    tags: ["MERN Stack", "Socket.io", "Tailwind CSS", "Redux"],
  },
];

export default defineTool({
  name: "list_projects",
  title: "List projects",
  description: "List featured portfolio projects, optionally filtered by a tag (e.g. 'React.js', 'MongoDB').",
  inputSchema: {
    tag: z.string().optional().describe("Optional case-insensitive tag filter."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ tag }) => {
    const filtered = tag
      ? projects.filter((p) => p.tags.some((t) => t.toLowerCase() === tag.toLowerCase()))
      : projects;
    return {
      content: [{ type: "text", text: JSON.stringify(filtered, null, 2) }],
      structuredContent: { projects: filtered },
    };
  },
});
