import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,

  // User profiles with AI-generated bios
  profiles: defineTable({
    userId: v.id("users"),
    name: v.string(),
    tagline: v.string(),
    bio: v.string(),
    links: v.array(v.object({
      label: v.string(),
      url: v.string(),
    })),
    skills: v.array(v.string()),
    vibe: v.string(), // e.g. "chaotic", "minimal", "corporate"
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"]),

  // AI-generated bios history
  bioGenerations: defineTable({
    userId: v.id("users"),
    prompt: v.string(),
    generatedBio: v.string(),
    vibe: v.string(),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),

  // Projects/work showcase
  projects: defineTable({
    userId: v.id("users"),
    title: v.string(),
    description: v.string(),
    imageBase64: v.optional(v.string()),
    tags: v.array(v.string()),
    url: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),
});
