import { mutation } from "./_generated/server";

export const seedDatabase = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if already seeded
    const existing = await ctx.db.query("categories").first();
    if (existing) return { message: "Already seeded" };

    // Seed categories
    const categories = [
      {
        name: "Food Safety",
        color: "#b92109",
        icon: "🍽️",
        description: "Restaurant inspections, food-borne illness reports",
      },
      {
        name: "Environmental Hazard",
        color: "#003f87",
        icon: "⚠️",
        description: "Chemical spills, air/water quality issues",
      },
      {
        name: "Disease Surveillance",
        color: "#6b2d8e",
        icon: "🦠",
        description: "Communicable disease reports and outbreaks",
      },
      {
        name: "Sanitation",
        color: "#005047",
        icon: "🧹",
        description: "Waste disposal, sewage, hygiene violations",
      },
      {
        name: "Vector Control",
        color: "#7a4e00",
        icon: "🦟",
        description: "Pest, rodent, and mosquito complaints",
      },
    ];

    const catIds: Record<string, any> = {};
    for (const cat of categories) {
      catIds[cat.name] = await ctx.db.insert("categories", cat);
    }

    // Seed workers
    const workers = [
      {
        name: "Maria Santos",
        role: "Inspector" as const,
        email: "m.santos@municipal.gov",
        department: "Environmental Health",
        initials: "MS",
      },
      {
        name: "Deon Williams",
        role: "Inspector" as const,
        email: "d.williams@municipal.gov",
        department: "Food Safety Division",
        initials: "DW",
      },
      {
        name: "Priya Nair",
        role: "Supervisor" as const,
        email: "p.nair@municipal.gov",
        department: "Health Services",
        initials: "PN",
      },
      {
        name: "Carl Hutchinson",
        role: "Inspector" as const,
        email: "c.hutchinson@municipal.gov",
        department: "Vector Control",
        initials: "CH",
      },
      {
        name: "Admin User",
        role: "Admin" as const,
        email: "admin@municipal.gov",
        department: "Health Administration",
        initials: "AU",
      },
    ];

    const workerIds: any[] = [];
    for (const w of workers) {
      workerIds.push(await ctx.db.insert("workers", w));
    }

    // Seed issues
    const now = Date.now();
    const day = 86400000;
    const issues = [
      {
        title: "Rodent Infestation — Al's Diner",
        description:
          "Multiple rodent droppings found in kitchen prep area and dry storage. Immediate closure recommended pending remediation.",
        categoryId: catIds["Food Safety"],
        status: "critical" as const,
        priority: "high" as const,
        location: "219 Main St, West District",
        assignedTo: workerIds[1],
        reportedBy: "Anonymous Tip",
        createdAt: now - 2 * day,
        updatedAt: now - 1 * day,
        notes: [
          {
            text: "Premises visited. Confirmed 3 points of entry. Owner notified. Pest control ordered within 24hrs.",
            author: "Deon Williams",
            timestamp: now - 1 * day,
          },
        ],
      },
      {
        title: "Suspected Chemical Runoff — Riverside Canal",
        description:
          "Strong chemical odor and visible discoloration of water near industrial estate outfall. Residents reporting skin irritation.",
        categoryId: catIds["Environmental Hazard"],
        status: "open" as const,
        priority: "high" as const,
        location: "Riverside Canal, North Industrial Zone",
        assignedTo: workerIds[0],
        reportedBy: "Resident Complaint",
        createdAt: now - 5 * day,
        updatedAt: now - 5 * day,
        notes: [],
      },
      {
        title: "Dengue Cluster — San Fernando West",
        description:
          "Three confirmed dengue cases within 200m radius. Possible mosquito breeding site nearby.",
        categoryId: catIds["Disease Surveillance"],
        status: "pending" as const,
        priority: "high" as const,
        location: "San Fernando West, Block 4",
        assignedTo: workerIds[3],
        reportedBy: "General Hospital",
        createdAt: now - 7 * day,
        updatedAt: now - 3 * day,
        notes: [
          {
            text: "Area surveyed. Abandoned tire dump found 150m away — likely breeding site. Fogging scheduled.",
            author: "Carl Hutchinson",
            timestamp: now - 3 * day,
          },
        ],
      },
      {
        title: "Illegal Waste Dumping — Junction Road",
        description:
          "Large pile of construction debris and household waste blocking drainage channel. Foul odor affecting nearby residences.",
        categoryId: catIds["Sanitation"],
        status: "open" as const,
        priority: "medium" as const,
        location: "Junction Road & Cipero St",
        assignedTo: undefined,
        reportedBy: "Community Officer",
        createdAt: now - 3 * day,
        updatedAt: now - 3 * day,
        notes: [],
      },
      {
        title: "Expired Products on Shelf — FreshMart",
        description:
          "Multiple dairy and deli products past use-by date found during routine inspection. Staff unaware of complaint.",
        categoryId: catIds["Food Safety"],
        status: "resolved" as const,
        priority: "medium" as const,
        location: "FreshMart, High Street",
        assignedTo: workerIds[1],
        reportedBy: "Routine Inspection",
        createdAt: now - 10 * day,
        updatedAt: now - 8 * day,
        notes: [
          {
            text: "Products removed and destroyed on site. Manager given written warning. Follow-up in 14 days.",
            author: "Deon Williams",
            timestamp: now - 8 * day,
          },
        ],
      },
      {
        title: "Poor Handwashing Facilities — Street Food Stalls",
        description:
          "Five street food vendors at Central Market found without access to running water or soap.",
        categoryId: catIds["Food Safety"],
        status: "pending" as const,
        priority: "medium" as const,
        location: "Central Market, North End",
        assignedTo: workerIds[1],
        reportedBy: "Inspector Patrol",
        createdAt: now - 4 * day,
        updatedAt: now - 4 * day,
        notes: [],
      },
      {
        title: "Mosquito Breeding — Abandoned Pool",
        description:
          "Stagnant water in abandoned residential pool confirmed with larvae. Property owner unresponsive.",
        categoryId: catIds["Vector Control"],
        status: "open" as const,
        priority: "high" as const,
        location: "12 Acacia Ave, South Side",
        assignedTo: workerIds[3],
        reportedBy: "Neighbour Complaint",
        createdAt: now - 1 * day,
        updatedAt: now - 1 * day,
        notes: [],
      },
      {
        title: "Gastroenteritis Outbreak — Primary School",
        description:
          "14 students and 2 staff presenting with vomiting and diarrhoea. Canteen food suspected source.",
        categoryId: catIds["Disease Surveillance"],
        status: "critical" as const,
        priority: "high" as const,
        location: "Wellington Primary School",
        assignedTo: workerIds[2],
        reportedBy: "School Principal",
        createdAt: now - 6 * day,
        updatedAt: now - 5 * day,
        notes: [
          {
            text: "Canteen temporarily closed. Samples collected and sent to lab. Results expected in 48hrs.",
            author: "Priya Nair",
            timestamp: now - 5 * day,
          },
          {
            text: "Lab results: Salmonella detected in egg salad. Full kitchen deep-clean ordered.",
            author: "Priya Nair",
            timestamp: now - 4 * day,
          },
        ],
      },
      {
        title: "Open Sewer — Union Street",
        description:
          "Cracked sewer pipe causing sewage overflow onto footpath and road. Residents unable to use walkway.",
        categoryId: catIds["Sanitation"],
        status: "pending" as const,
        priority: "high" as const,
        location: "Union Street, Downtown",
        assignedTo: workerIds[0],
        reportedBy: "Public Works Referral",
        createdAt: now - 8 * day,
        updatedAt: now - 6 * day,
        notes: [
          {
            text: "Area cordoned off. WASA notified for emergency repairs. ETA 72hrs.",
            author: "Maria Santos",
            timestamp: now - 6 * day,
          },
        ],
      },
      {
        title: "Unlicensed Food Prep — Home Caterer",
        description:
          "Home-based caterer supplying food to offices without valid health certificate or approved kitchen.",
        categoryId: catIds["Food Safety"],
        status: "open" as const,
        priority: "low" as const,
        location: "47 Circular Road, East Side",
        assignedTo: undefined,
        reportedBy: "Anonymous Tip",
        createdAt: now - 9 * day,
        updatedAt: now - 9 * day,
        notes: [],
      },
    ];

    for (const issue of issues) {
      await ctx.db.insert("issues", issue);
    }

    return { message: "Seeded successfully", counts: { categories: categories.length, workers: workers.length, issues: issues.length } };
  },
});
