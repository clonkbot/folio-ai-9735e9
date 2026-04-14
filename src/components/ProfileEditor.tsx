import { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

const VIBES = ["chaotic", "hacker", "corporate", "minimal", "unhinged"];

export function ProfileEditor({ profile }: { profile: any }) {
  const upsertProfile = useMutation(api.profiles.upsert);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    tagline: "",
    bio: "",
    skills: "",
    vibe: "chaotic",
    links: [{ label: "", url: "" }],
  });

  // Load existing profile
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        tagline: profile.tagline || "",
        bio: profile.bio || "",
        skills: profile.skills?.join(", ") || "",
        vibe: profile.vibe || "chaotic",
        links: profile.links?.length > 0 ? profile.links : [{ label: "", url: "" }],
      });
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError("Name is required!");
      return;
    }

    setIsSaving(true);
    setError(null);
    setSuccess(false);

    try {
      await upsertProfile({
        name: formData.name,
        tagline: formData.tagline,
        bio: formData.bio,
        skills: formData.skills.split(",").map((s) => s.trim()).filter(Boolean),
        vibe: formData.vibe,
        links: formData.links.filter((l) => l.label && l.url),
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError("Failed to save profile. Try again!");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const addLink = () => {
    setFormData({
      ...formData,
      links: [...formData.links, { label: "", url: "" }],
    });
  };

  const updateLink = (index: number, field: "label" | "url", value: string) => {
    const newLinks = [...formData.links];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setFormData({ ...formData, links: newLinks });
  };

  const removeLink = (index: number) => {
    setFormData({
      ...formData,
      links: formData.links.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="max-w-2xl mx-auto animate-stagger">
      <div className="mb-8">
        <h2 className="font-display text-3xl md:text-4xl font-black text-white mb-2 flex items-center gap-3">
          <span className="text-lime-400">⚙</span> SETTINGS
        </h2>
        <p className="text-white/50 font-mono text-sm">
          // Configure your portfolio profile
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-red-500/20 border border-red-500 px-4 py-3 text-red-400 text-sm font-mono">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 bg-lime-500/20 border border-lime-500 px-4 py-3 text-lime-400 text-sm font-mono">
          Profile saved successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div>
          <label className="block text-xs font-mono text-lime-400/70 mb-2 uppercase tracking-wider">
            Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full bg-black/50 border-2 border-white/20 px-4 py-3 text-white font-mono placeholder-white/30 focus:border-lime-400 transition-colors"
            placeholder="Your Name"
          />
        </div>

        {/* Tagline */}
        <div>
          <label className="block text-xs font-mono text-lime-400/70 mb-2 uppercase tracking-wider">
            Tagline
          </label>
          <input
            type="text"
            value={formData.tagline}
            onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
            className="w-full bg-black/50 border-2 border-white/20 px-4 py-3 text-white font-mono placeholder-white/30 focus:border-lime-400 transition-colors"
            placeholder="Full-stack Developer & Chaos Engineer"
          />
        </div>

        {/* Bio */}
        <div>
          <label className="block text-xs font-mono text-lime-400/70 mb-2 uppercase tracking-wider">
            Bio
          </label>
          <textarea
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            className="w-full bg-black/50 border-2 border-white/20 px-4 py-3 text-white font-mono text-sm placeholder-white/30 focus:border-lime-400 transition-colors resize-none h-32"
            placeholder="Your bio... or generate one with AI!"
          />
          <p className="mt-2 text-xs text-white/40 font-mono">
            Tip: Use the AI BIO tab to generate this automatically!
          </p>
        </div>

        {/* Skills */}
        <div>
          <label className="block text-xs font-mono text-lime-400/70 mb-2 uppercase tracking-wider">
            Skills (comma separated)
          </label>
          <input
            type="text"
            value={formData.skills}
            onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
            className="w-full bg-black/50 border-2 border-white/20 px-4 py-3 text-white font-mono placeholder-white/30 focus:border-lime-400 transition-colors"
            placeholder="React, TypeScript, Node.js, Chaos"
          />
        </div>

        {/* Vibe */}
        <div>
          <label className="block text-xs font-mono text-lime-400/70 mb-3 uppercase tracking-wider">
            Vibe
          </label>
          <div className="flex flex-wrap gap-2">
            {VIBES.map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setFormData({ ...formData, vibe: v })}
                className={`px-4 py-2 font-mono text-sm transition-all ${
                  formData.vibe === v
                    ? "bg-lime-400 text-black border-2 border-lime-400"
                    : "bg-white/5 text-white/60 border-2 border-white/10 hover:border-white/30"
                }`}
              >
                {v.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Links */}
        <div>
          <label className="block text-xs font-mono text-lime-400/70 mb-3 uppercase tracking-wider">
            Links
          </label>
          <div className="space-y-3">
            {formData.links.map((link, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={link.label}
                  onChange={(e) => updateLink(index, "label", e.target.value)}
                  className="flex-1 bg-black/50 border-2 border-white/20 px-3 py-2 text-white font-mono text-sm placeholder-white/30 focus:border-lime-400 transition-colors"
                  placeholder="GitHub"
                />
                <input
                  type="url"
                  value={link.url}
                  onChange={(e) => updateLink(index, "url", e.target.value)}
                  className="flex-[2] bg-black/50 border-2 border-white/20 px-3 py-2 text-white font-mono text-sm placeholder-white/30 focus:border-lime-400 transition-colors"
                  placeholder="https://github.com/..."
                />
                <button
                  type="button"
                  onClick={() => removeLink(index)}
                  className="w-10 h-10 flex items-center justify-center border border-white/20 text-white/40 hover:border-red-400 hover:text-red-400 transition-colors"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addLink}
            className="mt-3 px-4 py-2 border border-dashed border-white/20 text-white/40 font-mono text-xs hover:border-lime-400 hover:text-lime-400 transition-colors"
          >
            + ADD LINK
          </button>
        </div>

        {/* Submit */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSaving}
            className="w-full md:w-auto bg-lime-400 text-black font-display font-bold text-lg px-8 py-4 border-2 border-lime-400 chunky-border btn-press disabled:opacity-50 disabled:cursor-not-allowed hover:bg-lime-300 transition-colors"
          >
            {isSaving ? (
              <span className="glitch-loader">SAVING...</span>
            ) : (
              "SAVE PROFILE →"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
