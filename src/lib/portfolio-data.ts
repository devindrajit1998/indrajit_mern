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

