import {
  Code2, Database, Server, Palette, Cloud, Zap,
  GraduationCap, Award, Medal, Trophy, FileCheck, type LucideIcon,
} from "lucide-react";

import projectTravel from "@/assets/project-travel.jpg";
import projectDashboard from "@/assets/project-dashboard.jpg";
import projectTasks from "@/assets/project-tasks.jpg";

export const mernStack = [
  { name: "MongoDB", letter: "M", color: "text-brand-green" },
  { name: "Express.js", letter: "ex", color: "text-foreground" },
  { name: "React.js", letter: "⚛", color: "text-brand-blue" },
  { name: "Node.js", letter: "js", color: "text-brand-green" },
];

export const stats = [
  { value: "3+", label: "Years Exp" },
  { value: "25+", label: "Components" },
  { value: "3+", label: "Production UIs" },
  { value: "1st", label: "Hackathon Award" },
];

export const techStack = [
  "JavaScript", "TypeScript", "HTML5", "CSS3", "Tailwind CSS",
  "Redux Toolkit", "Next.js", "Git", "GitHub", "Postman", "JWT",
];

export type Project = {
  slug: string;
  img: string;
  title: string;
  desc: string;
  tags: string[];
  year: string;
  role: string;
  liveUrl: string;
  repoUrl: string;
  overview: string;
  features: string[];
  category?: string;
  impact?: string;
  featured?: boolean;
  status?: string;
};

export const projects: Project[] = [
  {
    slug: "travel-explorer",
    img: projectTravel,
    title: "Travel Explorer",
    desc: "A full-stack MERN travel booking platform with user authentication and payments.",
    tags: ["MongoDB", "Express.js", "React.js", "Node.js", "JWT"],
    year: "2025",
    role: "Full-Stack Developer",
    liveUrl: "#",
    repoUrl: "#",
    overview:
      "Travel Explorer is a full-stack booking platform where users discover destinations, plan itineraries, and pay securely. Built end-to-end on the MERN stack with JWT-based auth and Stripe payments.",
    features: [
      "Search & filter destinations with real-time availability",
      "Secure JWT authentication with role-based access",
      "Stripe payment integration with booking confirmations",
      "Review & rating system with image uploads",
      "Admin dashboard for managing tours and bookings",
    ],
  },
  {
    slug: "admin-dashboard",
    img: projectDashboard,
    title: "Admin Dashboard",
    desc: "Analytics dashboard with modern UI, real-time data and role based authentication.",
    tags: ["React.js", "Node.js", "MongoDB", "Chart.js", "Tailwind"],
    year: "2024",
    role: "Frontend Lead",
    liveUrl: "#",
    repoUrl: "#",
    overview:
      "An analytics command center that surfaces real-time KPIs, cohort trends, and revenue breakdowns for SaaS teams. Modular widgets, dark UI, and granular role-based access.",
    features: [
      "Live-updating charts powered by WebSockets",
      "Fine-grained role and permission system",
      "Custom widget builder with drag-and-drop layouts",
      "Exportable reports (CSV, PDF) with scheduled emails",
      "Fully responsive dark-first interface",
    ],
  },
  {
    slug: "task-management",
    img: projectTasks,
    title: "Task Management App",
    desc: "A collaborative task management application with real-time updates and team chats.",
    tags: ["MERN Stack", "Socket.io", "Tailwind CSS", "Redux"],
    year: "2024",
    role: "Full-Stack Developer",
    liveUrl: "#",
    repoUrl: "#",
    overview:
      "A collaborative workspace for distributed teams to plan sprints, assign tasks, and chat in real time. Kanban boards, threaded comments, and instant notifications keep everyone in sync.",
    features: [
      "Kanban boards with drag-and-drop task reordering",
      "Real-time chat & typing indicators (Socket.io)",
      "Sprint planning with velocity tracking",
      "Task assignments with due date reminders",
      "Slack-style channels for team collaboration",
    ],
  },
];

export const skills = [
  { name: "React.js", value: 95 },
  { name: "Node.js", value: 90 },
  { name: "MongoDB", value: 85 },
  { name: "Express.js", value: 90 },
  { name: "JavaScript (ES6+)", value: 95 },
  { name: "TypeScript", value: 80 },
  { name: "Tailwind CSS", value: 90 },
];

export const services: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: Code2, title: "Web Application Development", desc: "End-to-end MERN stack web applications tailored to your business needs, from MVP to scale." },
  { icon: Server, title: "API Development & Integration", desc: "RESTful APIs, third-party integrations, webhooks, and secure microservices." },
  { icon: Palette, title: "Frontend Development", desc: "Responsive, interactive and modern UI built with React, TypeScript and Tailwind CSS." },
  { icon: Zap, title: "Performance Optimization", desc: "Auditing and optimizing apps for speed, Core Web Vitals, and horizontal scalability." },
  { icon: Database, title: "Database Design & Management", desc: "MongoDB schema design, aggregation pipelines, indexing and query optimization." },
  { icon: Cloud, title: "Deployment & DevOps", desc: "CI/CD pipelines and deploying apps on Vercel, AWS and other cloud platforms." },
];

export const experience = [
  {
    title: "Software Engineer", company: "XYZ Solutions Pvt. Ltd.", date: "Jan 2023 - Present",
    desc: "Working on scalable web applications using MERN stack. Building RESTful APIs, integrating third-party services and optimizing performance.",
    color: "text-brand-blue",
  },
  {
    title: "Frontend Developer", company: "ABC Digital Solutions", date: "Jun 2021 - Dec 2022",
    desc: "Developed responsive web apps using React.js and Redux. Collaborated with UI/UX team to deliver pixel-perfect interfaces.",
    color: "text-brand-purple",
  },
  {
    title: "Web Developer Intern", company: "CodeCraft Technologies", date: "Jan 2021 - May 2021",
    desc: "Worked on frontend projects and learned backend development using Node.js and Express.js.",
    color: "text-brand-green",
  },
];

export const navLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/projects", label: "Projects" },
  { to: "/services", label: "Services" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact" },
] as const;

export const qualifications = [
  {
    icon: GraduationCap,
    degree: "Bachelor of Technology in Computer Science",
    institution: "Maulana Abul Kalam Azad University of Technology",
    year: "2018 - 2022",
    grade: "CGPA 8.5/10",
  },
  {
    icon: GraduationCap,
    degree: "Higher Secondary (Science)",
    institution: "West Bengal Council of Higher Secondary Education",
    year: "2016 - 2018",
    grade: "Score 85%",
  },
];

export const certifications = [
  {
    icon: FileCheck,
    title: "MongoDB Certified Developer",
    provider: "MongoDB University",
    year: "2024",
    credential: "Credential ID: MDB-2024-XXXX",
  },
  {
    icon: FileCheck,
    title: "AWS Certified Cloud Practitioner",
    provider: "Amazon Web Services",
    year: "2023",
    credential: "Credential ID: AWS-CP-XXXX",
  },
  {
    icon: FileCheck,
    title: "React Developer Certification",
    provider: "Meta (Coursera)",
    year: "2023",
    credential: "Credential ID: META-REACT-XXXX",
  },
];

export const awards = [
  {
    icon: Trophy,
    title: "Best Full-Stack Project",
    event: "Internal Hackathon 2024",
    desc: "Won first place for building a real-time collaborative task manager.",
  },
  {
    icon: Medal,
    title: "Employee of the Quarter",
    event: "XYZ Solutions Pvt. Ltd.",
    desc: "Recognized for leading the delivery of a high-impact customer portal.",
  },
  {
    icon: Award,
    title: "Top Performer in Coding Challenge",
    event: "CodeCraft Technologies",
    desc: "Ranked in the top 5% among 500+ participants in a national-level coding contest.",
  },
];

export type Testimonial = {
  id?: string;
  name: string; // Customer Name
  quote: string; // Review / feedback
  avatar?: string; // Customer Image
  rating?: number; // 1-5
  date?: string; // Date added (e.g. YYYY-MM-DD)
  featured?: boolean;
};

export const testimonials: Testimonial[] = [
  {
    name: "Rohan Sharma",
    quote: "Indrajit is one of the most reliable engineers I've worked with. He owns features end-to-end, writes clean, well-tested code, and communicates clearly with product and design. Any team would be lucky to have him.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    rating: 5,
    date: "2025-01-15",
    featured: true,
  },
];

export type BlogPost = {
  id?: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  category: string;
  tags: string[];
  readTime: string;
  publishedAt: string;
  published: boolean;
  featured?: boolean;
};

export const mockBlogs: BlogPost[] = [
  {
    slug: "getting-started-with-react-in-2026",
    title: "Getting Started with React: A Complete Beginner's Roadmap",
    excerpt: "New to React? Learn the essential core concepts: JSX, components, props, and useState with simple hands-on code examples.",
    content: `## Welcome to Modern React!

If you are just starting your frontend journey, React can feel overwhelming with all the terminology. But at its core, React is simply about breaking user interfaces into small, reusable building blocks called **Components**.

### 1. What is JSX?
JSX stands for JavaScript XML. It allows you to write HTML-like syntax right inside your JavaScript code:

\`\`\`javascript
function WelcomeMessage() {
  const name = "Developer";
  return <h1>Hello, {name}! Welcome to React.</h1>;
}
\`\`\`

### 2. Understanding Props (Passing Data)
Props (short for properties) allow you to pass dynamic data from a parent component down to a child component:

\`\`\`javascript
function UserCard({ name, role }) {
  return (
    <div className="card">
      <h3>{name}</h3>
      <p>{role}</p>
    </div>
  );
}

// Usage:
<UserCard name="Indrajit" role="Full-Stack Engineer" />
\`\`\`

### 3. Adding Interactivity with useState
State is how a component remembers data that can change over time based on user clicks or typing:

\`\`\`javascript
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Clicked {count} times
    </button>
  );
}
\`\`\`

### Summary
Mastering Components, Props, and State provides 80% of what you need to build interactive web apps. Build small projects and practice every day!`,
    coverImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&auto=format&fit=crop&q=80",
    category: "React / Frontend",
    tags: ["React", "JavaScript", "Beginner", "WebDev"],
    readTime: "4 min read",
    publishedAt: "2025-02-15",
    published: true,
    featured: true,
  },
  {
    slug: "understanding-rest-apis-and-nodejs",
    title: "Understanding REST APIs: A Beginner's Guide to Backend with Node.js & Express",
    excerpt: "Learn how the frontend talks to the backend: HTTP methods (GET, POST, PUT, DELETE), JSON data exchange, and creating your very first Express server.",
    content: `## How Does the Web Actually Work?

Whenever you load a website, submit a form, or like a post, your browser (the client) communicates with a server over the internet. That communication happens through an **API (Application Programming Interface)**.

### 1. The 4 Key HTTP Methods (CRUD)
REST APIs typically follow standard HTTP action verbs:
- **GET**: Retrieve data from the server (e.g., getting a list of projects).
- **POST**: Send new data to the server (e.g., submitting a contact form).
- **PUT / PATCH**: Update existing data (e.g., editing your profile name).
- **DELETE**: Remove data from the database.

### 2. Creating Your First Express.js Server
With Node.js and Express, spinning up an API endpoint takes only a few lines:

\`\`\`javascript
const express = require("express");
const app = express();

app.use(express.json());

// Sample GET endpoint
app.get("/api/greet", (req, res) => {
  res.json({ message: "Hello from the backend!" });
});

app.listen(5000, () => {
  console.log("Server running on port 5000 🚀");
});
\`\`\`

### 3. Connecting Frontend to Backend with fetch()
In your React application, calling this API is straightforward:

\`\`\`javascript
useEffect(() => {
  fetch("/api/greet")
    .then((response) => response.json())
    .then((data) => console.log(data.message));
}, []);
\`\`\`

### Next Steps
Now that you understand client-server communication, try connecting MongoDB to store your data permanently!`,
    coverImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&auto=format&fit=crop&q=80",
    category: "Backend / Node.js",
    tags: ["Node.js", "Express", "API", "Beginner"],
    readTime: "5 min read",
    publishedAt: "2025-02-18",
    published: true,
    featured: false,
  },
  {
    slug: "mastering-mern-scalable-architecture",
    title: "Mastering the MERN Stack: Architectural Patterns for Scalable Apps",
    excerpt: "A deep dive into repository patterns, JWT authentication with refresh token rotations, and Redis caching strategies in production MERN environments.",
    content: `## Building Production-Grade MERN Applications

When building scalable full-stack applications with MongoDB, Express.js, React, and Node.js, engineering beyond basic tutorial CRUD structures is essential.

### 1. Layered Architecture & Separation of Concerns
Avoid dumping database queries directly into route controllers. Instead, segment your backend into:
- **Routes Layer**: Endpoint definitions and input validation (using Zod or Joi).
- **Controller Layer**: Orchestrates requests, status codes, and HTTP responses.
- **Service Layer**: Houses the core business logic.
- **Repository / Model Layer**: Communicates with MongoDB via Mongoose.

### 2. High-Performance Caching with Redis
Database lookups for frequently requested read-heavy endpoints can saturate MongoDB connections:
\`\`\`javascript
const cachedData = await redis.get(cacheKey);
if (cachedData) return JSON.parse(cachedData);

const dbData = await Project.find({ featured: true });
await redis.setex(cacheKey, 3600, JSON.stringify(dbData));
return dbData;
\`\`\`

### 3. Conclusion
Architecting cleanly early on saves dozens of hours of refactoring when traffic begins scaling.`,
    coverImage: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=1200&auto=format&fit=crop&q=80",
    category: "Full-Stack Development",
    tags: ["MERN", "React", "Node.js", "System Design"],
    readTime: "5 min read",
    publishedAt: "2025-01-20",
    published: true,
    featured: false,
  },
];


