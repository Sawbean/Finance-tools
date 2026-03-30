// data/blogEducational.js

export const blogEducational = {
  "financial-planning-basics": {
    id: "blog-001",
    title: "Financial Planning Basics: How to Manage Your Money Effectively",
    description:
      "Learn the fundamental steps for creating a financial plan, budgeting, and saving for your goals.",
    category: "personal-finance",
    keywords: ["financial planning", "budgeting", "saving"],
    publishDate: "2026-02-25",
    readTime: "5 min",
    image: "/images/financial-planning.jpg",

    content: [
      { type: "paragraph", text: "Financial planning helps you control your money and achieve your life goals." },

      { type: "heading", text: "Why Financial Planning Matters" },
      { type: "paragraph", text: "Without a plan, it's easy to overspend and miss long-term goals." },

      {
        type: "callout",
        style: "info",
        text: "Tip: Start tracking your expenses today — awareness is the first step."
      },

      { type: "heading", text: "Steps to Start Planning" },
      {
        type: "list",
        items: [
          "Track income and expenses",
          "Create a budget",
          "Set financial goals",
          "Start saving and investing"
        ]
      },

      {
        type: "image",
        src: "/images/budget-chart.jpg",
        alt: "Budget planning illustration"
      },

      {
        type: "cta",
        text: "Try our EMI Calculator",
        link: "/tools/emi"
      },

      {
        type: "video",
        url: "https://www.youtube.com/embed/your-video-id"
      }
    ],

    faq: [
      {
        question: "Why is financial planning important?",
        answer: "It helps you manage money and achieve goals."
      }
    ]
  }
};