import { defineMcp } from "@lovable.dev/mcp-js";
import getPortfolioSummary from "./tools/get-portfolio-summary";
import listProjects from "./tools/list-projects";
import sendContactMessage from "./tools/send-contact-message";

export default defineMcp({
  name: "portfolio-mcp",
  title: "Indrajit Ghosh Portfolio MCP",
  version: "0.1.0",
  instructions:
    "Tools for exploring Indrajit Ghosh's MERN developer portfolio. Use `get_portfolio_summary` for an overview, `list_projects` to browse featured work (optionally filtered by tag), and `send_contact_message` to submit a hiring or collaboration inquiry.",
  tools: [getPortfolioSummary, listProjects, sendContactMessage],
});
