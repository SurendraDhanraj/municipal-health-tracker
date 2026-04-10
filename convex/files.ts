import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/** Generate a short-lived upload URL for Convex Storage. Call this mutation
 *  from the client, then PUT the file directly to the returned URL. */
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

/** Resolve a storage ID to a public URL so we can render it in the browser. */
export const getUrl = query({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, { storageId }) => {
    return await ctx.storage.getUrl(storageId);
  },
});
