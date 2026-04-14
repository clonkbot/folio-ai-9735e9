import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const get = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    return await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
  },
});

export const upsert = mutation({
  args: {
    name: v.string(),
    tagline: v.string(),
    bio: v.string(),
    links: v.array(v.object({
      label: v.string(),
      url: v.string(),
    })),
    skills: v.array(v.string()),
    vibe: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        ...args,
        updatedAt: Date.now(),
      });
      return existing._id;
    } else {
      return await ctx.db.insert("profiles", {
        userId,
        ...args,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }
  },
});

export const updateBio = mutation({
  args: { bio: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (profile) {
      await ctx.db.patch(profile._id, {
        bio: args.bio,
        updatedAt: Date.now(),
      });
    }
  },
});
