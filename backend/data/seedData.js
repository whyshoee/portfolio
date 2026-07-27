// backend/data/seedData.js
// Shared seed logic. Called automatically on server startup (server.js)
// and also runnable manually via `npm run seed`.
//
// Every section is guarded by an existence check, so this is safe to run
// on every boot — your admin-panel edits and deletions are never overwritten.

import bcrypt from 'bcryptjs';
import { UserModel } from '../models/User.js';
import { ProjectModel } from '../models/Project.js';
import { IdeaModel } from '../models/Idea.js';

// Starter projects, taken from Vaishnavi's resume.
// These are only created if the projects table is completely empty, so
// anything you add, edit or delete in the admin panel is never touched.
const PROJECTS = [
  {
    title: 'Adversarial ML Security Framework',
    desc: 'An end-to-end security lifecycle engine for adversarial stress testing of financial AI models. Implements white-box attack vectors (FGSM, PGD) against XGBoost, DistilBERT and ResNet to expose vulnerabilities in high-stakes transaction logic, paired with an automated defensive pipeline and an immutable telemetry audit trail.',
    cat: 'app', color: 'purple', emoji: '🛡️',
    tools: 'Python, XGBoost, DistilBERT, PyTorch, SQLModel',
    url: '', featured: 1
  },
  {
    title: 'Lightweight Container Runtime & Kernel Monitor',
    desc: 'A mini-Docker container runtime written from scratch in C, using UNIX socket IPC and custom Linux kernel modules to monitor memory usage and process synchronisation at the OS level.',
    cat: 'system', color: 'teal', emoji: '⚙️',
    tools: 'C, Linux Kernel Modules, UNIX Sockets, Multithreading',
    url: '', featured: 0
  },
  {
    title: 'JavaScript Syntax Validator',
    desc: 'A compiler-design project: a validation tool built in Node.js using lexical analysis, recursive descent parsing and context-free grammars to verify JavaScript syntax from first principles.',
    cat: 'system', color: 'blue', emoji: '🔤',
    tools: 'Node.js, Lexical Analysis, CFG, Recursive Descent',
    url: '', featured: 0
  },
  {
    title: 'Advanced Port Scanner',
    desc: 'A custom network auditing tool for service detection, built on socket-level communication and protocol analysis to identify infrastructure exposure and surface potential security risks.',
    cat: 'app', color: 'coral', emoji: '🔍',
    tools: 'Python, Sockets, Networking, Protocol Analysis',
    url: '', featured: 0
  },
  {
    title: 'House Sales Data Analysis',
    desc: 'Exploratory data analysis and predictive regression modelling over large-scale housing datasets, building a data-driven quality assessment framework to validate model accuracy and predict price variance.',
    cat: 'app', color: 'amber', emoji: '📊',
    tools: 'Python, Pandas, NumPy, Matplotlib, Statsmodels',
    url: '', featured: 0
  },
  {
    title: 'Intelligent Waste Segregation System',
    desc: 'An embedded real-time classification system using sensor fusion (ultrasonic, IR, moisture) and servo-control logic to sort waste automatically — hardware and software integrated for real-time decision making.',
    cat: 'system', color: 'pink', emoji: '♻️',
    tools: 'Embedded C, Sensor Fusion, Servo Control',
    url: '', featured: 0
  },
  {
    title: 'Full-Stack Auction & E-Commerce Platform',
    desc: 'Scalable web platforms featuring secure user authentication, transactional bidding logic and responsive interfaces — covering the full stack from database schema through to front-end performance.',
    cat: 'web', color: 'purple', emoji: '🛒',
    tools: 'Node.js, Express, SQL, REST APIs, HTML/CSS',
    url: '', featured: 0
  }
];

// Ideas are added by you from the admin panel — nothing is created here.
const IDEAS = [];

export async function runSeed() {
  const username = process.env.ADMIN_USERNAME || 'vaishnavi';
  const plainPassword = process.env.ADMIN_PASSWORD || 'yourpassword123';

  if (!(await UserModel.exists())) {
    const hash = await bcrypt.hash(plainPassword, 10);
    await UserModel.create(username, hash);
    console.log(`🚀 Admin profile seeded for user: ${username}`);
  } else {
    console.log('💡 Admin user already exists — skipping.');
  }

  if (PROJECTS.length && Number(await ProjectModel.count()) === 0) {
    for (const p of PROJECTS) await ProjectModel.create(p);
    console.log(`📦 Seeded ${PROJECTS.length} projects.`);
  }

  if (IDEAS.length && Number(await IdeaModel.count()) === 0) {
    for (const i of IDEAS) await IdeaModel.create(i);
    console.log(`💡 Seeded ${IDEAS.length} ideas.`);
  }
}
