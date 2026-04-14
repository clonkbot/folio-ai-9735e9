import { useState } from "react";
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";

const VIBES = [
  { id: "chaotic", label: "CHAOTIC", emoji: "🌀", color: "text-pink-400" },
  { id: "hacker", label: "HACKER", emoji: "💀", color: "text-green-400" },
  { id: "corporate", label: "CORPORATE", emoji: "🏢", color: "text-blue-400" },
  { id: "minimal", label: "MINIMAL", emoji: "◻️", color: "text-gray-400" },
  { id: "unhinged", label: "UNHINGED", emoji: "🔥", color: "text-orange-400" },
];

const VIBE_PROMPTS: Record<string, string> = {
  chaotic: "Write in a chaotic, meme-infused, internet-brain style. Use unexpected metaphors, self-deprecating humor, and gen-z energy. Mix technical terms with absurdist observations.",
  hacker: "Write like an elite hacker from a 90s movie. Use technical jargon, references to the matrix, talk about 'the system', be cryptic and mysterious. Occasional l33t speak acceptable.",
  corporate: "Write in corporate buzzword style but make it satirical. Synergy, leverage, paradigm shifts, but with a hint of existential dread beneath the surface.",
  minimal: "Write extremely concise, almost zen-like. Short sentences. No fluff. Poetry in brevity. Each word earns its place.",
  unhinged: "Write completely unhinged. Stream of consciousness. No filter. Caffeine-fueled 3am energy. Capital letters for EMPHASIS. Parenthetical asides (lots of them).",
};

export function BioGenerator({ profile }: { profile: any }) {
  const [vibe, setVibe] = useState("chaotic");
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedBio, setGeneratedBio] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const chat = useAction(api.ai.chat);
  const saveBio = useMutation(api.bioGenerations.create);
  const updateProfileBio = useMutation(api.profiles.updateBio);
  const bioHistory = useQuery(api.bioGenerations.list);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Tell me something about yourself first!");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedBio(null);

    try {
      const systemPrompt = `You are a bio generator for a portfolio website. Generate a compelling, memorable bio (2-3 paragraphs, ~100-150 words) based on the user's input.

${VIBE_PROMPTS[vibe]}

The bio should:
- Be written in first person
- Feel authentic and memorable
- Highlight the person's unique qualities
- Be suitable for a professional portfolio but with personality

Do NOT include any headers, titles, or meta-commentary. Just output the bio text directly.`;

      const response = await chat({
        messages: [
          {
            role: "user",
            content: `Generate a portfolio bio for someone who describes themselves as: "${prompt}"`,
          },
        ],
        systemPrompt,
      });

      setGeneratedBio(response);

      // Save to history
      await saveBio({
        prompt,
        generatedBio: response,
        vibe,
      });
    } catch (err) {
      setError("Bio generation failed. The AI is taking a coffee break. Try again!");
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUseBio = async () => {
    if (!generatedBio) return;

    try {
      await updateProfileBio({ bio: generatedBio });
      setError(null);
    } catch (err) {
      setError("Failed to save bio. Make sure you've created a profile in Settings first!");
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-stagger">
      <div className="mb-8">
        <h2 className="font-display text-3xl md:text-4xl font-black text-white mb-2 flex items-center gap-3">
          <span className="text-lime-400">⚡</span> AI BIO GENERATOR
        </h2>
        <p className="text-white/50 font-mono text-sm">
          // Let chaos AI write your portfolio bio
        </p>
      </div>

      {/* Vibe Selector */}
      <div className="mb-8">
        <label className="block text-xs font-mono text-lime-400/70 mb-3 uppercase tracking-wider">
          Select your vibe
        </label>
        <div className="flex flex-wrap gap-2">
          {VIBES.map((v) => (
            <button
              key={v.id}
              onClick={() => setVibe(v.id)}
              className={`px-4 py-3 font-mono text-sm transition-all ${
                vibe === v.id
                  ? "bg-lime-400 text-black border-2 border-lime-400"
                  : "bg-white/5 text-white/60 border-2 border-white/10 hover:border-white/30"
              }`}
            >
              <span className="mr-2">{v.emoji}</span>
              {v.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="mb-6">
        <label className="block text-xs font-mono text-lime-400/70 mb-3 uppercase tracking-wider">
          Tell me about yourself
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="I'm a developer who loves building weird stuff at 3am, I collect mechanical keyboards, and I think the best code is the code you delete..."
          className="w-full bg-black/50 border-2 border-white/20 px-4 py-4 text-white font-mono text-sm placeholder-white/30 focus:border-lime-400 transition-colors resize-none h-32"
        />
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={isGenerating}
        className="w-full md:w-auto bg-lime-400 text-black font-display font-bold text-lg px-8 py-4 border-2 border-lime-400 chunky-border btn-press disabled:opacity-50 disabled:cursor-not-allowed hover:bg-lime-300 transition-colors"
      >
        {isGenerating ? (
          <span className="flex items-center justify-center gap-3">
            <span className="glitch-loader">GENERATING</span>
            <span className="animate-pulse">...</span>
          </span>
        ) : (
          "⚡ GENERATE BIO"
        )}
      </button>

      {/* Error */}
      {error && (
        <div className="mt-6 bg-red-500/20 border border-red-500 px-4 py-3 text-red-400 text-sm font-mono">
          {error}
        </div>
      )}

      {/* Generated Bio */}
      {generatedBio && (
        <div className="mt-8 p-6 bg-white/5 border-2 border-lime-400/50 relative">
          <div className="absolute -top-3 left-4 bg-[#0a0a0a] px-2 text-lime-400 font-mono text-xs">
            GENERATED BIO
          </div>
          <p className="text-white font-mono text-sm leading-relaxed whitespace-pre-wrap">
            {generatedBio}
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleUseBio}
              className="px-6 py-3 bg-cyan-400 text-black font-mono font-bold text-sm hover:bg-cyan-300 transition-colors"
            >
              USE THIS BIO →
            </button>
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="px-6 py-3 border border-white/30 text-white/60 font-mono text-sm hover:border-lime-400 hover:text-lime-400 transition-colors"
            >
              REGENERATE
            </button>
          </div>
        </div>
      )}

      {/* Bio History */}
      {bioHistory && bioHistory.length > 0 && (
        <div className="mt-12">
          <h3 className="font-display text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-cyan-400">↻</span> Previous Generations
          </h3>
          <div className="space-y-4">
            {bioHistory.slice(0, 5).map((item: { _id: string; vibe: string; generatedBio: string; createdAt: number }) => (
              <div
                key={item._id}
                className="p-4 bg-white/5 border border-white/10 hover:border-lime-400/30 transition-colors cursor-pointer group"
                onClick={() => setGeneratedBio(item.generatedBio)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-lime-400/60">
                    VIBE: {item.vibe.toUpperCase()}
                  </span>
                  <span className="text-xs font-mono text-white/30">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-white/50 font-mono text-xs line-clamp-2 group-hover:text-white/70 transition-colors">
                  {item.generatedBio}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
