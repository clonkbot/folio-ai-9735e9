import { useState } from "react";
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

export function ProjectsSection() {
  const projects = useQuery(api.projects.list);
  const createProject = useMutation(api.projects.create);
  const removeProject = useMutation(api.projects.remove);
  const generateImage = useAction(api.ai.generateImage);

  const [isAdding, setIsAdding] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: "",
    url: "",
    imageBase64: "",
  });
  const [error, setError] = useState<string | null>(null);

  const handleGenerateImage = async () => {
    if (!formData.title && !formData.description) {
      setError("Add a title or description first to generate an image!");
      return;
    }

    setIsGeneratingImage(true);
    setError(null);

    try {
      const prompt = `Abstract geometric digital art for a project called "${formData.title}". ${formData.description}. Modern, minimal, dark background with neon accents. Tech/developer aesthetic.`;
      const image = await generateImage({ prompt });
      if (image) {
        setFormData({ ...formData, imageBase64: image });
      } else {
        setError("Image generation failed. Try again!");
      }
    } catch (err) {
      setError("Image generation failed. Try again!");
      console.error(err);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError("Project needs a title!");
      return;
    }

    try {
      await createProject({
        title: formData.title,
        description: formData.description,
        tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
        url: formData.url || undefined,
        imageBase64: formData.imageBase64 || undefined,
      });

      setFormData({ title: "", description: "", tags: "", url: "", imageBase64: "" });
      setIsAdding(false);
      setError(null);
    } catch (err) {
      setError("Failed to add project. Try again!");
      console.error(err);
    }
  };

  const handleDelete = async (id: Id<"projects">) => {
    if (!confirm("Delete this project?")) return;
    try {
      await removeProject({ id });
    } catch (err) {
      setError("Failed to delete project.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-stagger">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl md:text-4xl font-black text-white mb-2 flex items-center gap-3">
            <span className="text-lime-400">▦</span> PROJECTS
          </h2>
          <p className="text-white/50 font-mono text-sm">
            // Showcase your work with AI-generated covers
          </p>
        </div>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="px-6 py-3 bg-lime-400 text-black font-display font-bold text-sm chunky-border btn-press hover:bg-lime-300 transition-colors"
          >
            + ADD PROJECT
          </button>
        )}
      </div>

      {error && (
        <div className="mb-6 bg-red-500/20 border border-red-500 px-4 py-3 text-red-400 text-sm font-mono">
          {error}
        </div>
      )}

      {/* Add Project Form */}
      {isAdding && (
        <form onSubmit={handleSubmit} className="mb-8 p-6 bg-white/5 border-2 border-lime-400/50">
          <h3 className="font-display text-xl font-bold text-white mb-6">New Project</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-lime-400/70 mb-2 uppercase tracking-wider">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-black/50 border-2 border-white/20 px-4 py-3 text-white font-mono placeholder-white/30 focus:border-lime-400 transition-colors"
                placeholder="My Awesome Project"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-lime-400/70 mb-2 uppercase tracking-wider">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-black/50 border-2 border-white/20 px-4 py-3 text-white font-mono text-sm placeholder-white/30 focus:border-lime-400 transition-colors resize-none h-24"
                placeholder="What does this project do?"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-lime-400/70 mb-2 uppercase tracking-wider">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="w-full bg-black/50 border-2 border-white/20 px-4 py-3 text-white font-mono placeholder-white/30 focus:border-lime-400 transition-colors"
                placeholder="react, typescript, ai"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-lime-400/70 mb-2 uppercase tracking-wider">
                URL (optional)
              </label>
              <input
                type="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className="w-full bg-black/50 border-2 border-white/20 px-4 py-3 text-white font-mono placeholder-white/30 focus:border-lime-400 transition-colors"
                placeholder="https://github.com/..."
              />
            </div>

            {/* Image Generator */}
            <div>
              <label className="block text-xs font-mono text-lime-400/70 mb-2 uppercase tracking-wider">
                Cover Image
              </label>
              {formData.imageBase64 ? (
                <div className="relative">
                  <img
                    src={`data:image/png;base64,${formData.imageBase64}`}
                    alt="Generated cover"
                    className="w-full aspect-video object-cover border border-lime-400/30"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, imageBase64: "" })}
                    className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white flex items-center justify-center hover:bg-red-400"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleGenerateImage}
                  disabled={isGeneratingImage}
                  className="w-full py-8 border-2 border-dashed border-white/20 text-white/50 font-mono text-sm hover:border-lime-400/50 hover:text-lime-400 transition-colors disabled:opacity-50"
                >
                  {isGeneratingImage ? (
                    <span className="glitch-loader">GENERATING IMAGE...</span>
                  ) : (
                    "⚡ GENERATE AI COVER IMAGE"
                  )}
                </button>
              )}
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              className="px-6 py-3 bg-lime-400 text-black font-mono font-bold text-sm hover:bg-lime-300 transition-colors"
            >
              ADD PROJECT →
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setFormData({ title: "", description: "", tags: "", url: "", imageBase64: "" });
              }}
              className="px-6 py-3 border border-white/30 text-white/60 font-mono text-sm hover:border-red-400 hover:text-red-400 transition-colors"
            >
              CANCEL
            </button>
          </div>
        </form>
      )}

      {/* Projects Grid */}
      {projects === undefined ? (
        <div className="text-center py-12">
          <span className="glitch-loader font-mono text-lime-400">LOADING...</span>
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-20">
          <div className="inline-block border-2 border-dashed border-lime-400/30 p-12">
            <p className="text-lime-400/60 font-mono mb-4">NO PROJECTS YET</p>
            <p className="text-white/40 font-mono text-sm">
              Add your first project to showcase your work.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project: { _id: any; title: string; description: string; imageBase64?: string; tags: string[]; url?: string }) => (
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
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-display font-bold text-white text-lg group-hover:text-lime-400 transition-colors">
                    {project.title}
                  </h3>
                  <button
                    onClick={() => handleDelete(project._id)}
                    className="w-8 h-8 flex items-center justify-center text-white/30 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                    title="Delete project"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-white/50 font-mono text-xs line-clamp-2 mt-2 mb-3">
                  {project.description || "No description"}
                </p>
                <div className="flex flex-wrap gap-1">
                  {project.tags.slice(0, 4).map((tag: string, i: number) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 bg-black/50 text-lime-400/60 text-xs font-mono"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                {project.url && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-block text-cyan-400 font-mono text-xs hover:underline"
                  >
                    View project →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
