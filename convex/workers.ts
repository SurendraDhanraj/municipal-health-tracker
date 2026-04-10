import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("workers").collect();
  },
});

export const get = query({
  args: { id: v.id("workers") },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    role: v.union(
      v.literal("Inspector"),
      v.literal("Supervisor"),
      v.literal("Admin")
    ),
    email: v.string(),
    department: v.string(),
    initials: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("workers", args);
  },
});

export const remove = mutation({
  args: { id: v.id("workers") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});
