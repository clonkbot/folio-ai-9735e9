import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";

export function AuthScreen() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signUp");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    try {
      await signIn("password", formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Auth failed. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnonymous = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signIn("anonymous");
    } catch (err) {
      setError("Anonymous login failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative z-10">
      <div className="w-full max-w-md animate-stagger">
        {/* Logo/Title */}
        <div className="text-center mb-12">
          <h1 className="font-display text-5xl md:text-7xl font-black text-lime-400 glitch-text tracking-tighter">
            FOLIO<span className="text-cyan-400">.AI</span>
          </h1>
          <p className="mt-4 text-white/60 font-mono text-sm tracking-wider">
            // AI-POWERED PORTFOLIO GENERATOR
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white/5 backdrop-blur-sm border-2 border-lime-400/50 p-6 md:p-8 relative scanlines">
          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-lime-400" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-lime-400" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-lime-400" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-lime-400" />

          <h2 className="font-display text-2xl font-bold text-white mb-6 rgb-split">
            {flow === "signIn" ? "WELCOME BACK" : "JOIN THE CHAOS"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-lime-400/70 mb-2 uppercase tracking-wider">
                Email
              </label>
              <input
                name="email"
                type="email"
                required
                className="w-full bg-black/50 border-2 border-white/20 px-4 py-3 text-white font-mono placeholder-white/30 focus:border-lime-400 transition-colors"
                placeholder="hacker@net.io"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-lime-400/70 mb-2 uppercase tracking-wider">
                Password
              </label>
              <input
                name="password"
                type="password"
                required
                className="w-full bg-black/50 border-2 border-white/20 px-4 py-3 text-white font-mono placeholder-white/30 focus:border-lime-400 transition-colors"
                placeholder="••••••••"
              />
            </div>
            <input name="flow" type="hidden" value={flow} />

            {error && (
              <div className="bg-red-500/20 border border-red-500 px-4 py-2 text-red-400 text-sm font-mono">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-lime-400 text-black font-display font-bold text-lg py-4 border-2 border-lime-400 chunky-border btn-press disabled:opacity-50 disabled:cursor-not-allowed hover:bg-lime-300 transition-colors"
            >
              {isLoading ? (
                <span className="glitch-loader inline-block">PROCESSING...</span>
              ) : flow === "signIn" ? (
                "ENTER →"
              ) : (
                "CREATE ACCOUNT →"
              )}
            </button>
          </form>

          <div className="mt-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-white/20" />
            <span className="text-white/40 text-xs font-mono">OR</span>
            <div className="flex-1 h-px bg-white/20" />
          </div>

          <button
            onClick={handleAnonymous}
            disabled={isLoading}
            className="w-full mt-4 bg-transparent border-2 border-cyan-400/50 text-cyan-400 font-mono text-sm py-3 hover:bg-cyan-400/10 transition-colors disabled:opacity-50"
          >
            CONTINUE AS GUEST →
          </button>

          <p className="mt-6 text-center text-white/50 text-sm font-mono">
            {flow === "signIn" ? "New here? " : "Already have an account? "}
            <button
              onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
              className="text-lime-400 hover:underline"
            >
              {flow === "signIn" ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>

        {/* Decorative elements */}
        <div className="mt-8 flex justify-center gap-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 bg-lime-400"
              style={{ opacity: 0.2 + i * 0.2 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
