// ─── Hero ───────────────────────────────────────────────────────────────────
export type HeroContent = {
  badgeInner: string;
  badgeOuter: string;
  titleBefore: string;
  titleHighlight: string;
  titleAfter: string;
  subtitle: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  heroImageLight: string;
  heroImageDark: string;
  heroImageAlt: string;
};
// ... (keep all type definitions unchanged for other sections as well)

export const defaultHomeContent: HomeContent = {
  // ── Hero ─────────────────────────────────────────────────────────────────
  hero: {
    badgeInner: "Launching Now",
    badgeOuter: "Meet AgencySync",
    titleBefore: "Modern Client Management for",
    titleHighlight: "Agencies",
    titleAfter: "",
    subtitle:
      "AgencySync empowers you to manage clients, projects, and invoices efficiently—all in a secure, branded portal designed for high-performing agencies.",
    primaryCta: { label: "See AgencySync in Action", href: "#features" },
    secondaryCta: { label: "View Pricing", href: "#pricing" },
    heroImageLight: "/hero-image-light.jpeg",
    heroImageDark: "/hero-image-dark.jpeg",
    heroImageAlt: "Agency client portal dashboard preview",
  },
  // ── Sponsors ─────────────────────────────────────────────────────────────
  sponsors: {
    heading: "Trusted By Leading Agencies",
    items: [
      { icon: "Crown", name: "Vercel" },
      { icon: "Vegan", name: "Stripe" },
      { icon: "Ghost", name: "OpenAI" },
      { icon: "Puzzle", name: "Supabase" },
      { icon: "Drama", name: "Sentry" },
    ],
  },
  // ── Benefits ─────────────────────────────────────────────────────────────
  benefits: {
    eyebrow: "Why Choose AgencySync",
    heading: "Built for Agencies That Want To Grow",
    description:
      "Streamline your operations, save time, and deliver value—AgencySync replaces scattered spreadsheets with a unified, branded dashboard for your team and clients.",
    items: [
      {
        icon: "UserPlus",
        title: "Effortless Client Onboarding",
        description: "Capture, organize, and onboard clients in minutes—not hours.",
      },
      {
        icon: "FolderKanban",
        title: "Organized Projects & Operations",
        description: "Nested project tracking, tasks, milestones, and comments all under one roof.",
      },
      {
        icon: "ReceiptText",
        title: "Automated Invoicing",
        description: "Track invoices, line items, and payments. Archive and reference anytime for compliance.",
      },
      {
        icon: "ShieldCheck",
        title: "Secure & Multi-Tenant",
        description: "Every agency’s data is siloed—no accidental cross-tenant visibility or access.",
      },
    ],
  },
  // ── Features ─────────────────────────────────────────────────────────────
  features: {
    eyebrow: "AgencySync Features",
    heading: "All-in-one Agency Management, Simplified",
    subtitle:
      "The platform to centralize your clients, projects, invoices, and daily workflows—bespoke for agencies looking to scale with confidence.",
    items: [
      {
        icon: "Users",
        title: "Client Directory",
        description: "Archive, search, and manage detailed client profiles and notes across your agency.",
      },
      {
        icon: "LayoutDashboard",
        title: "Project Console",
        description: "Each project gets a clear view—task lists, timelines, files, and live updates.",
      },
      {
        icon: "Book",
        title: "Invoice Automation",
        description: "Build itemized invoices, manage due dates, and track payment status for every project.",
      },
      {
        icon: "Trello",
        title: "Task & Milestone Board",
        description: "Assign, update, and comment on tasks—watch progress in real time.",
      },
      {
        icon: "BarChart3",
        title: "Reporting & Oversight",
        description: "Spot bottlenecks, get agency-wide summaries, and export reports with a click.",
      },
      {
        icon: "Lock",
        title: "Role & Access Control",
        description: "Multi-role permissions for admin, manager, and members—prevent accidental changes.",
      },
    ],
  },
  // ── Services ─────────────────────────────────────────────────────────────
  services: {
    eyebrow: "Platform Capabilities",
    heading: "An Agency Portal That Grows With You",
    subtitle:
      "AgencySync is the secure, modern SaaS platform for operations-minded agencies.",
    items: [
      { title: "Client CRM", description: "Professional client records, rich context and searchable notes.", pro: false },
      { title: "Nested Projects", description: "Manage every project under the right client, with timelines and team ownership.", pro: false },
      { title: "Invoice Management", description: "Line items, archiving, payment tracking, and branded PDFs.", pro: false },
      { title: "Detailed Operations", description: "Tasks, comments, and milestones for every project.", pro: true },
    ],
  },
  // ── Testimonials ─────────────────────────────────────────────────────────
  testimonials: {
    eyebrow: "Why Agencies Love AgencySync",
    heading: "Real Results, Real Agencies",
    reviews: [
      {
        image: "/demo-img.jpg",
        name: "Julia Kent",
        role: "Managing Director, Array Creative",
        comment: "With AgencySync, our client hand-offs and project tracking improved overnight. No more missed invoices or lost notes!",
        rating: 5.0,
      },
      {
        image: "/demo-img.jpg",
        name: "Samir Mehta",
        role: "Founder, Spark Strategy",
        comment: "AgencySync’s permissions are rock solid. Our managers and ops leads finally have clarity and control.",
        rating: 4.9,
      },
      {
        image: "/demo-img.jpg",
        name: "Tammy Jenkins",
        role: "COO, Nifty Studio",
        comment: "What used to take three spreadsheets, now lives in one neat dashboard. AgencySync has made us more professional.",
        rating: 4.8,
      },
      {
        image: "/demo-img.jpg",
        name: "Andre Vasquez",
        role: "Agency Owner, Pixel Edge",
        comment: "We’ve cut client admin time by 50%. The empty states, reporting, and invoicing are simply best-in-class.",
        rating: 5.0,
      },
    ],
  },
  // ── Team ─────────────────────────────────────────────────────────────────
  team: {
    eyebrow: "AgencySync Team",
    heading: "Our Mission: Agency Success",
    members: [
      {
        imageUrl: "/team1.jpg",
        firstName: "Chirag",
        lastName: "Dodiya",
        positions: ["Founder", "Engineering & Product"],
        socialNetworks: [
          { name: "LinkedIn", url: "https://linkedin.com/in/chiragdodiya" },
          { name: "Github", url: "https://github.com/chiragdodiya" },
          { name: "X", url: "https://x.com/chiragdodiya" },
        ],
      },
      // ... Optionally add more team members here for credibility/branding.
    ],
  },
  // ── Pricing ──────────────────────────────────────────────────────────────
  pricing: {
    eyebrow: "Pricing",
    heading: "Tailored For Agencies Of All Sizes",
    subtitle: "Simple plans that grow with your agency. Scale client, project, and team access as you grow.",
    priceSuffix: "/month",
    plans: [
      {
        title: "Essential",
        popular: false,
        price: 0,
        description: "Get your agency started with core CRM and project tools.",
        buttonText: "Get Started Free",
        benefits: [
          "Unlimited clients & projects",
          "Branded dashboard",
          "Basic tasks & invoicing",
          "Role-based permissions",
          "Live chat support",
        ],
      },
      {
        title: "Pro",
        popular: true,
        price: 69,
        description: "All you need to grow—invoice automation, advanced roles, and reporting.",
        buttonText: "Start Free Trial",
        benefits: [
          "Everything in Essential",
          "Invoice PDF export",
          "Advanced reporting",
          "Custom approval flows",
          "Priority support",
        ],
      },
      {
        title: "Enterprise",
        popular: false,
        price: 199,
        description: "Compliance, dedicated onboarding and custom workflows for large agencies.",
        buttonText: "Contact AgencySync",
        benefits: [
          "Custom SSO & onboarding",
          "Dedicated account manager",
          "Audit trail & activity logs",
          "Bespoke SLAs",
          "Personalized workflow integrations",
        ],
      },
    ],
  },
  // ── Contact ──────────────────────────────────────────────────────────────
  contact: {
    eyebrow: "Get In Touch",
    heading: "Talk To AgencySync",
    description:
      "Whether you’re moving from spreadsheets or modernizing a legacy portal, AgencySync is here to help you launch smooth workflows with your team and clients.",
    mailtoAddress: "hi@chirag.co",
    info: {
      address: {
        label: "Headquarters",
        value: "Remote-first • San Francisco, CA",
      },
      phone: { label: "Call us", value: "+1 (415) 555-0199" },
      email: { label: "Email support", value: "hi@chirag.co" },
      hours: { label: "Hours", value: ["Monday - Friday", "8AM - 6PM PT"] },
    },
    formSubjects: [
      "Demo Request", "Data Migration", "Partnership", "Pricing Inquiry", "Onboarding"
    ],
    formSubmitLabel: "Contact AgencySync",
  },
  // ── FAQ ──────────────────────────────────────────────────────────────────
  faq: {
    eyebrow: "FAQ",
    heading: "AgencySync Questions",
    items: [
      {
        question: "Is AgencySync really agency-focused?",
        answer: "Absolutely—our workflows, navigation, and permissions are optimized for digital, creative, and operations agencies."
      },
      {
        question: "Do you support exporting invoice PDFs?",
        answer: "Yes, Pro plans and higher let you generate and download fully-branded invoices."
      },
      {
        question: "Are my clients’ data visible to other agencies?",
        answer: "Never—each AgencySync account is completely isolated using multi-tenant controls."
      },
      {
        question: "Can I invite my team and manage roles?",
        answer: "Yes—AgencySync supports admin, manager, and member roles for complete access control."
      },
      {
        question: "Is there a free plan?",
        answer: "Yes. Start on Essential and upgrade as your agency grows—no credit card needed."
      },
    ],
  },
  // ── Footer ───────────────────────────────────────────────────────────────
  footer: {
    brandName: "AgencySync",
    columns: [
      {
        heading: "Contact",
        links: [
          { label: "hi@chirag.co", href: "mailto:hi@chirag.co" },
          { label: "About", href: "#team" },
          { label: "Support", href: "#contact" },
        ],
      },
      {
        heading: "Platform",
        links: [
          { label: "Features", href: "#features" },
          { label: "Pricing", href: "#pricing" },
          { label: "Login", href: "/auth#signin" },
        ],
      },
      {
        heading: "Help",
        links: [
          { label: "FAQ", href: "#faq" },
          { label: "Docs", href: "https://nextjs.org/docs" },
        ],
      },
      {
        heading: "Socials",
        links: [
          { label: "GitHub", href: "https://github.com/chiragdodiya" },
          { label: "LinkedIn", href: "https://linkedin.com/in/chiragdodiya" },
          { label: "X", href: "https://x.com/chiragdodiya" },
        ],
      },
    ],
    copyright: "© 2026 AgencySync: Modern Agency Portal.",
    attribution: { label: "by Chirag Dodiya", href: "https://chirag.co" },
  },
  // ── Navbar ───────────────────────────────────────────────────────────────
  navbar: {
    brandName: "AgencySync",
    routes: [
      { href: "/#features", label: "Features" },
      { href: "/#pricing", label: "Pricing" },
      { href: "/#faq", label: "FAQ" },
      { href: "/#contact", label: "Contact" },
    ],
    featureDropdownLabel: "Why AgencySync?",
    featureImage: { src: "/demo-img.jpg", alt: "AgencySync platform preview" },
    features: [
      {
        title: "Multi-tenant Security",
        description: "Every client, project, and invoice is tightly tenant-scoped.",
      },
      {
        title: "Agency-Ready Workflows",
        description: "Clients, projects, and operations—modeled for the way agencies run.",
      },
      {
        title: "Intuitive UI",
        description: "Built on shadcn UI for easy navigation and a branded experience.",
      },
    ],
    signInLabel: "Sign in",
    signUpLabel: "Sign up",
    dashboardLabel: "Dashboard",
    githubLink: { href: "https://github.com/chiragdodiya/agencysync", ariaLabel: "View AgencySync on GitHub" },
  },
};
// All types/exports unchanged below for content compatibility.
export function getHomeContent(): HomeContent {
  return defaultHomeContent;
}