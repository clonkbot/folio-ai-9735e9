import { useConvexAuth } from "convex/react";
import { AuthScreen } from "./components/AuthScreen";
import { Portfolio } from "./components/Portfolio";
import "./styles.css";

export default function App() {
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="glitch-loader">
          <span className="font-display text-4xl text-lime-400">LOADING</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white relative overflow-x-hidden">
      {/* Noise overlay */}
      <div className="noise-overlay" />

      {/* Grid background */}
      <div className="grid-bg" />

      {isAuthenticated ? <Portfolio /> : <AuthScreen />}

      {/* Footer */}
      <footer className="relative z-10 py-6 border-t border-white/5">
        <p className="text-center text-xs text-white/30 font-mono tracking-wider">
          Requested by @web-user · Built by @clonkbot
        </p>
      </footer>
    </div>
  );
}
