import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  issues: defineTable({
    title: v.string(),
    description: v.string(),
    categoryId: v.id("categories"),
    status: v.union(
      v.literal("open"),
      v.literal("pending"),
      v.literal("resolved"),
      v.literal("critical")
    ),
    priority: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high")
    ),
    location: v.string(),
    assignedTo: v.optional(v.id("workers")),
    reportedBy: v.string(),
    notes: v.array(
      v.object({
        text: v.string(),
        author: v.string(),
        timestamp: v.number(),
        storageId: v.optional(v.id("_storage")),
        mediaType: v.optional(v.string()),
      })
    ),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_category", ["categoryId"])
    .index("by_assigned", ["assignedTo"])
    .index("by_created", ["createdAt"]),

  categories: defineTable({
    name: v.string(),
    color: v.string(),
    icon: v.string(),
    description: v.string(),
  }),

  workers: defineTable({
    name: v.string(),
    role: v.union(
      v.literal("Inspector"),
      v.literal("Supervisor"),
      v.literal("Admin")
    ),
    email: v.string(),
    department: v.string(),
    initials: v.string(),
  }).index("by_role", ["role"]),
});
