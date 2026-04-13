// data/financeArticles.js
export const financeArticles = {
  "understanding-investment-basics": {
    title: "Investment Basics: How to Grow Your Wealth",
    description: "A beginner's guide to understanding how compounding works and where to start.",
    
    // NEW ARCHITECTURE TAGS
    masterCategory: "markets", // Put this in the Blue (Global Markets) card
    type: "guide",             // Standard guide layout
    
    category: "Investing",
    publishDate: "2026-04-10",
    readTime: "5 min read",
    image: "/images/financial-planning.jpg",
    content: [
      { type: "paragraph", text: "Investing is the act of allocating resources, usually money, with the expectation of generating an income or profit." }
    ]
  },

  "how-to-spot-online-scams": {
    title: "How to Spot and Avoid Online Financial Scams",
    description: "Protect your hard-earned money from common digital frauds and phishing attempts.",
    
    // NEW ARCHITECTURE TAGS
    masterCategory: "protection", // Put this in the Red (Risk & Protection) card
    type: "news",               // This will make it show up in the "Trending News" section!
    
    category: "Security",
    publishDate: "2026-04-12",
    readTime: "6 min read",
    image: "/images/financial-planning.jpg",
    content: [
      { type: "paragraph", text: "In the digital age, financial scammers are becoming more sophisticated. Always verify the source." }
    ]
  },

  "passive-income-ideas-2026": {
    title: "5 Passive Income Ideas for 2026",
    description: "Explore realistic ways to earn money while you sleep using digital tools.",
    
    // NEW ARCHITECTURE TAGS
    masterCategory: "digital", // Put this in the Purple (Digital Economy) card
    type: "guide",
    
    category: "Income",
    publishDate: "2026-04-13",
    readTime: "7 min read",
    image: "/images/financial-planning.jpg",
    content: [
      { type: "paragraph", text: "Passive income is money earned with minimal activity through a variety of ventures." }
    ]
  },

  // Add this to your financeArticles object in data/financeArticles.js
  "understanding-inflation-basics": {
    title: "Inflation 101: Why Your Money Buys Less Over Time",
    description: "A beginner's guide to how inflation works, why it happens, and how it impacts global economies.",
    publishDate: "2026-04-12",
    readTime: "6 min read",
    category: "Economic Basics",
    masterCategory: "foundation", // This links it to the Foundation Card
    image: "/blog/inflation-basics.jpg", // Ensure you have a placeholder image
    tool: "budgeter",
    content: [
      {
        type: "paragraph",
        text: "Inflation is the rate at which the general level of prices for goods and services is rising. As inflation rises, every dollar you own buys a smaller percentage of a good or service."
      },
      {
        type: "heading",
        text: "The Three Main Causes of Inflation"
      },
      {
        type: "paragraph",
        text: "Economists generally point to three main drivers: Demand-Pull inflation (too much money chasing too few goods), Cost-Push inflation (rising production costs), and Built-In inflation (wage-price spirals)."
      },
      {
        type: "keyTakeaways",
        items: [
          "Inflation erodes the purchasing power of your savings.",
          "Moderate inflation (around 2%) is often seen as a sign of a healthy economy.",
          "Fixed-income assets suffer the most during high inflation periods."
        ]
      },
      {
        type: "heading",
        text: "Historical Inflation Comparison"
      },
      {
        type: "table",
        headers: ["Era", "Average Inflation Rate", "Economic Impact"],
        rows: [
          ["1970s", "7.1%", "High volatility and 'Stagflation'"],
          ["1990s", "3.0%", "Steady growth and expansion"],
          ["2020-2024", "4.5%", "Supply chain disruptions and recovery"]
        ]
      },
      {
        type: "formula",
        label: "Purchasing Power Formula",
        equation: "Value = Initial Amount / (1 + Inflation Rate)^n"
      }
    ]
  },
};