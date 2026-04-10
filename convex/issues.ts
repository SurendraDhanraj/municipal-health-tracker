import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: {
    status: v.optional(
      v.union(
        v.literal("open"),
        v.literal("pending"),
        v.literal("resolved"),
        v.literal("critical")
      )
    ),
    categoryId: v.optional(v.id("categories")),
  },
  handler: async (ctx, { status, categoryId }) => {
    let q = ctx.db.query("issues");
    const results = status
      ? await q.withIndex("by_status", (q) => q.eq("status", status)).collect()
      : await q.withIndex("by_created").order("desc").collect();

    const filtered = categoryId
      ? results.filter((i) => i.categoryId === categoryId)
      : results;

    // Attach category and worker data
    return await Promise.all(
      filtered.map(async (issue) => {
        const category = await ctx.db.get(issue.categoryId);
        const worker = issue.assignedTo
          ? await ctx.db.get(issue.assignedTo)
          : null;
        return { ...issue, category, worker };
      })
    );
  },
});

export const get = query({
  args: { id: v.id("issues") },
  handler: async (ctx, { id }) => {
    const issue = await ctx.db.get(id);
    if (!issue) return null;
    const category = await ctx.db.get(issue.categoryId);
    const worker = issue.assignedTo ? await ctx.db.get(issue.assignedTo) : null;
    return { ...issue, category, worker };
  },
});

export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("issues").collect();
    return {
      total: all.length,
      open: all.filter((i) => i.status === "open").length,
      pending: all.filter((i) => i.status === "pending").length,
      resolved: all.filter((i) => i.status === "resolved").length,
      critical: all.filter((i) => i.status === "critical").length,
    };
  },
});

export const create = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("issues", {
      ...args,
      notes: [],
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("issues"),
    status: v.union(
      v.literal("open"),
      v.literal("pending"),
      v.literal("resolved"),
      v.literal("critical")
    ),
  },
  handler: async (ctx, { id, status }) => {
    await ctx.db.patch(id, { status, updatedAt: Date.now() });
  },
});

export const addNote = mutation({
  args: {
    id: v.id("issues"),
    text: v.string(),
    author: v.string(),
    storageId: v.optional(v.id("_storage")),
    mediaType: v.optional(v.string()),
  },
  handler: async (ctx, { id, text, author, storageId, mediaType }) => {
    const issue = await ctx.db.get(id);
    if (!issue) throw new Error("Issue not found");
    const note = {
      text,
      author,
      timestamp: Date.now(),
      ...(storageId ? { storageId, mediaType } : {}),
    };
    await ctx.db.patch(id, {
      notes: [...issue.notes, note],
      updatedAt: Date.now(),
    });
  },
});

export const assignWorker = mutation({
  args: {
    id: v.id("issues"),
    workerId: v.optional(v.id("workers")),
  },
  handler: async (ctx, { id, workerId }) => {
    await ctx.db.patch(id, { assignedTo: workerId, updatedAt: Date.now() });
  },
});

export const remove = mutation({
  args: { id: v.id("issues") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});
