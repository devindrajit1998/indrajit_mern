import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import * as fs from "fs";
import * as path from "path";

// Manually parse local .env file
const envPath = path.resolve(process.cwd(), ".env");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  const lines = envContent.split("\n");
  for (const line of lines) {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || "";
      if (value.length > 0 && value.charAt(0) === '"' && value.charAt(value.length - 1) === '"') {
        value = value.replace(/^"|"\s*$/g, "");
      }
      process.env[key] = value;
    }
  }
}

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || "",
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.VITE_FIREBASE_APP_ID || "",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const experience = [
  {
    title: "Software Engineer",
    company: "Indus Net Technologies",
    date: "2nd June 2025 – Present",
    color: "text-brand-purple",
    desc: "Architected and developed 25+ high-performance, reusable React.js components from Figma specifications. Spearheaded frontend performance optimization, achieving a 20–30% reduction in load times. Engineered centralized state management systems using Redux Toolkit. Integrated Node.js/Express RESTful APIs with MongoDB."
  },
  {
    title: "Frontend Developer",
    company: "Sleek Info Solutions Pvt Ltd",
    date: "6th Sept 2023 – 29th April 2025",
    color: "text-brand-blue",
    desc: "Transformed 50+ Figma screens into pixel-perfect React.js interfaces. Built custom library of 20+ reusable React components, accelerating delivery timelines by 15%. Utilized Tailwind CSS to implement modern, responsive UIs. Resolved critical frontend bottlenecks leading to 15% increase in stability."
  }
];

const projects = [
  {
    title: "ColourMyTrip",
    slug: "colourmytrip",
    role: "Frontend & Firebase Developer",
    year: "2025",
    desc: "Responsive travel booking platform using Next.js and Tailwind CSS.",
    overview: "Developed a responsive travel booking platform featuring real-time data sync. Integrated Firebase Authentication and Firestore to manage secure user sessions and real-time reservation schedules.",
    liveUrl: "https://colourmytrip.com",
    repoUrl: "https://github.com/indrajit/colourmytrip",
    tags: ["Next.js", "Tailwind CSS", "Firebase", "Firestore"],
    features: [
      "Responsive travel booking interfaces",
      "Firebase user session management",
      "Firestore real-time reservation schedules",
      "Optimized SEO & image loading"
    ],
    img: ""
  },
  {
    title: "Employee Management System",
    slug: "employee-management-system",
    role: "Full-Stack Developer",
    year: "2025",
    desc: "MERN Stack system for streamlined workforce management.",
    overview: "Designed and developed a scalable workforce management dashboard with role-based access controls to manage records, tasks, and departments securely.",
    liveUrl: "https://ems.indrajit.dev",
    repoUrl: "https://github.com/indrajit/employee-management-system",
    tags: ["MongoDB", "Express.js", "React.js", "Node.js", "JWT"],
    features: [
      "Role-Based Access Control (RBAC)",
      "Secure JWT authentication",
      "Department & Record CRUD capabilities",
      "Tailwind responsive layout"
    ],
    img: ""
  },
  {
    title: "E-Commerce Admin Dashboard",
    slug: "ecommerce-admin-dashboard",
    role: "Full-Stack Developer",
    year: "2024",
    desc: "Product, inventory, and order management dashboard.",
    overview: "Developed a full-stack e-commerce management platform. Includes secure JWT auth, product catalog management modules, dynamic search filters, pagination, and file uploads.",
    liveUrl: "https://admin.indrajit.dev",
    repoUrl: "https://github.com/indrajit/ecommerce-dashboard",
    tags: ["MongoDB", "Express.js", "Node.js", "React.js", "Tailwind CSS"],
    features: [
      "Inventory product modules",
      "Order status flow tracking",
      "Multi-criteria filter and pagination",
      "Secure admin JWT protection"
    ],
    img: ""
  }
];

const skills = [
  { name: "React.js", value: 95 },
  { name: "Next.js", value: 90 },
  { name: "Node.js & Express", value: 85 },
  { name: "TypeScript", value: 80 },
  { name: "MongoDB", value: 85 },
  { name: "Tailwind CSS", value: 95 }
];

const techStack = [
  "React.js", "Next.js", "TypeScript", "Node.js", "Express.js", 
  "MongoDB", "Redux Toolkit", "Tailwind CSS", "Firebase", "Firestore", "Git"
];

const credentials = {
  qualifications: [
    { degree: "Bachelor of Technology (B.Tech) – Electrical Engineering", institution: "Gargi Memorial Institute Of Technology | Kolkata", year: "2020 – 2023", grade: "First Class" },
    { degree: "Diploma – Electrical Engineering", institution: "Baruipur Government Polytechnic | Kolkata", year: "2017 – 2020", grade: "First Class" }
  ],
  certifications: [
    { title: "React.js Developer Certificate", provider: "INT Academy", year: "2024", credential: "ID: INT-RCT-932" }
  ],
  awards: [
    { title: "1st Position — Presales BA Agent Hackathon", event: "INT Corporate Hackathon", desc: "Created an AI-powered Presales Business Analyst (BA) Agent and secured 1st place.", icon: "Trophy" }
  ]
};

const settings = {
  title: "Indrajit Ghosh — Software Engineer",
  tagline: "Software Engineer specializing in React.js, Next.js, and Node.js Developer.",
  domain: "indrajit.dev",
  description: "Software Engineer with 3+ years of experience building scalable web applications.",
  keywords: "React, Next.js, Node.js, MERN, Full-Stack, Software Engineer",
  ogImage: "",
  github: "https://github.com/indrajit",
  linkedin: "https://linkedin.com/in/indrajit",
  twitter: "https://x.com/indrajit",
  email: "hello@indrajit.dev",
  enableContactForm: true,
  showOpenToWork: true,
  enableBlog: false,
  maintenanceMode: false
};

const about = {
  fullName: "Indrajit Ghosh",
  headline: "Software Engineer • React.js • Next.js • Node.js",
  email: "hello@indrajit.dev",
  location: "Kolkata, India",
  shortBio: "Software Engineer with 3+ years of experience building scalable web applications using React.js, Next.js, Node.js, Express.js, MongoDB, and Tailwind CSS.",
  longBio: "Software Engineer with 3+ years of experience building scalable web applications using React.js, Next.js, Node.js, Express.js, MongoDB, and Tailwind CSS. Skilled in frontend architecture, REST API development, authentication systems, performance optimization, and responsive UI development. Proven track record of delivering reusable component libraries, reducing application load times, and developing production-ready full-stack solutions.",
  stats: [
    { value: "3+", label: "Years Exp" },
    { value: "25+", label: "Components" },
    { value: "3+", label: "Production UIs" },
    { value: "1st", label: "Hackathon Award" }
  ]
};

async function seed() {
  try {
    console.log("Seeding professional data...");

    // Seeding About
    await setDoc(doc(db, "about", "personal_bio"), about);
    console.log("✓ Seeded personal bio");

    // Seeding Settings
    await setDoc(doc(db, "settings", "site_settings"), settings);
    console.log("✓ Seeded settings");

    // Seeding Credentials
    await setDoc(doc(db, "credentials", "portfolio_credentials"), credentials);
    console.log("✓ Seeded credentials");

    // Seeding Skills Doc
    await setDoc(doc(db, "skills", "portfolio_skills"), { techStack });
    console.log("✓ Seeded techStack chips");

    // Seeding Skills Collection
    for (const s of skills) {
      const id = s.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      await setDoc(doc(db, "skills", id), s);
    }
    console.log("✓ Seeded skills collection");

    // Seeding Experience
    for (const e of experience) {
      const id = e.company.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      await setDoc(doc(db, "experience", id), e);
    }
    console.log("✓ Seeded experience collection");

    // Seeding Projects
    for (const p of projects) {
      await setDoc(doc(db, "projects", p.slug), p);
    }
    console.log("✓ Seeded projects collection");

    console.log("★ Database successfully seeded with your new professional profile!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding:", error);
    process.exit(1);
  }
}

seed();
