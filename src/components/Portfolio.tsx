import { useState } from "react";
import { useQuery, useMutation, useAction } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "../../convex/_generated/api";
import { BioGenerator } from "./BioGenerator";
import { ProjectsSection } from "./ProjectsSection";
import { ProfileEditor } from "./ProfileEditor";

type Tab = "preview" | "bio" | "projects" | "settings";

export function Portfolio() {
  const { signOut } = useAuthActions();
  const profile = useQuery(api.profiles.get);
  const [activeTab, setActiveTab] = useState<Tab>("preview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: "preview", label: "PREVIEW", icon: "◉" },
    { id: "bio", label: "AI BIO", icon: "⚡" },
    { id: "projects", label: "PROJECTS", icon: "▦" },
    { id: "settings", label: "SETTINGS", icon: "⚙" },
  ];

  return (
    <div className="relative z-10">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-md border-b-2 border-lime-400/30">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="font-display text-2xl md:text-3xl font-black text-lime-400 glitch-text tracking-tighter">
            FOLIO<span className="text-cyan-400">.AI</span>
          </h1>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 font-mono text-sm transition-all ${
                  activeTab === tab.id
                    ? "bg-lime-400 text-black"
                    : "text-white/60 hover:text-lime-400 hover:bg-white/5"
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => signOut()}
              className="hidden md:block px-4 py-2 border border-red-500/50 text-red-400 font-mono text-xs hover:bg-red-500/10 transition-colors"
            >
              LOGOUT
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-10 h-10 flex items-center justify-center border border-lime-400/50 text-lime-400"
            >
              {mobileMenuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-lime-400/20 bg-[#0a0a0a]/95 backdrop-blur-md">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full px-6 py-4 font-mono text-sm text-left transition-all flex items-center gap-3 ${
                  activeTab === tab.id
                    ? "bg-lime-400/20 text-lime-400"
                    : "text-white/60"
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
            <button
              onClick={() => signOut()}
              className="w-full px-6 py-4 text-left text-red-400 font-mono text-sm border-t border-white/10"
            >
              LOGOUT
            </button>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {activeTab === "preview" && <PortfolioPreview profile={profile} />}
        {activeTab === "bio" && <BioGenerator profile={profile} />}
        {activeTab === "projects" && <ProjectsSection />}
        {activeTab === "settings" && <ProfileEditor profile={profile} />}
      </main>
    </div>
  );
}

function PortfolioPreview({ profile }: { profile: any }) {
  const projects = useQuery(api.projects.list);

  if (!profile) {
    return (
      <div className="text-center py-20">
        <div className="inline-block border-2 border-dashed border-lime-400/30 p-12">
          <p className="text-lime-400/60 font-mono mb-4">NO PROFILE YET</p>
          <p className="text-white/40 font-mono text-sm">
            Head to SETTINGS to create your profile,
            <br />
            then use AI BIO to generate something epic.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-stagger">
      {/* Hero Section */}
      <section className="mb-16">
        <div className="relative">
          {/* Decorative accent */}
          <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-lime-400 via-cyan-400 to-transparent" />

          <div className="pl-4 md:pl-8">
            <p className="font-mono text-cyan-400 text-sm mb-2 tracking-wider">
              // {profile.vibe?.toUpperCase() || "CHAOTIC"} MODE
            </p>
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-black text-white leading-none mb-4 glitch-text">
              {profile.name || "ANON"}
            </h1>
            <p className="font-display text-xl md:text-2xl text-lime-400/80 mb-6">
              {profile.tagline || "Digital creator"}
            </p>

            {/* Bio */}
            <div className="max-w-3xl">
              <p className="text-white/70 font-mono text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                {profile.bio || "No bio yet. Generate one with AI!"}
              </p>
            </div>

            {/* Skills */}
            {profile.skills && profile.skills.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-2">
                {profile.skills.map((skill: string, i: number) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-white/5 border border-lime-400/30 text-lime-400 font-mono text-xs"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}

            {/* Links */}
            {profile.links && profile.links.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-3">
                {profile.links.map((link: { label: string; url: string }, i: number) => (
                  <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-cyan-400/10 border border-cyan-400/50 text-cyan-400 font-mono text-sm hover:bg-cyan-400/20 transition-colors"
                  >
                    {link.label} →
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      {projects && projects.length > 0 && (
        <section>
          <h2 className="font-display text-2xl font-bold text-white mb-8 flex items-center gap-3">
            <span className="text-lime-400">▦</span> PROJECTS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project: { _id: string; title: string; description: string; imageBase64?: string; tags: string[]; url?: string }) => (
              <div
                key={project._id}
                className="group bg-white/5 border-2 border-white/10 hover:border-lime-400/50 transition-all relative overflow-hidden"
              >
                {/* Project Image */}
                {project.imageBase64 ? (
                  <div className="aspect-video bg-black/50 overflow-hidden">
                    <img
                      src={`data:image/png;base64,${project.imageBase64}`}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-gradient-to-br from-lime-400/10 to-cyan-400/10 flex items-center justify-center">
                    <span className="text-4xl opacity-30">▦</span>
                  </div>
                )}

                <div className="p-4">
                  <h3 className="font-display font-bold text-white text-lg mb-2 group-hover:text-lime-400 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-white/50 font-mono text-xs line-clamp-2 mb-3">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {project.tags.slice(0, 3).map((tag: string, i: number) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-black/50 text-lime-400/60 text-xs font-mono"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-lime-400/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Status bar */}
      <div className="mt-16 pt-8 border-t border-white/10">
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-white/30">
          <span>STATUS: <span className="text-lime-400">ONLINE</span></span>
          <span>•</span>
          <span>VIBE: <span className="text-cyan-400">{profile.vibe?.toUpperCase() || "CHAOTIC"}</span></span>
          <span>•</span>
          <span>PROJECTS: <span className="text-lime-400">{projects?.length || 0}</span></span>
        </div>
      </div>
    </div>
  );
}
