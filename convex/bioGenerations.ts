import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return await ctx.db
      .query("bioGenerations")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(10);
  },
});

export const create = mutation({
  args: {
    prompt: v.string(),
    generatedBio: v.string(),
    vibe: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    return await ctx.db.insert("bioGenerations", {
      userId,
      prompt: args.prompt,
      generatedBio: args.generatedBio,
      vibe: args.vibe,
      createdAt: Date.now(),
    });
  },
});
