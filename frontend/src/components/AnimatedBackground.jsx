import React from "react";

/**
 * AnimatedBackground
 * Blurred, abstract gradient blobs that adapt to light/dark mode.
 * Drop this as a sibling behind your page content, e.g.:
 *
 *   <div className="relative min-h-screen overflow-hidden">
 *     <AnimatedBackground />
 *     <div className="relative z-10">...your page...</div>
 *   </div>
 *
 * Dark mode uses Tailwind's `dark:` variant, so make sure your
 * tailwind.config has darkMode: "class" (or "media") set up.
 */
function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-white dark:bg-[#05070f] transition-colors duration-500">
      {/* base wash */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-[#05070f] dark:via-[#070a16] dark:to-[#0a0620]" />

      {/* Light mode blobs */}
      <div className="absolute -top-32 -left-32 h-[28rem] w-[28rem] rounded-full bg-indigo-200/60 blur-3xl animate-blob dark:opacity-0 transition-opacity duration-700" />
      <div className="absolute top-1/3 -right-40 h-[30rem] w-[30rem] rounded-full bg-sky-200/50 blur-3xl animate-blob animation-delay-2000 dark:opacity-0 transition-opacity duration-700" />
      <div className="absolute -bottom-40 left-1/4 h-[26rem] w-[26rem] rounded-full bg-rose-200/50 blur-3xl animate-blob animation-delay-4000 dark:opacity-0 transition-opacity duration-700" />
      <div className="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-violet-200/40 blur-3xl animate-blob animation-delay-3000 dark:opacity-0 transition-opacity duration-700" />

      {/* Dark mode blobs (neon on near-black / dark blue) */}
      <div className="absolute -top-32 -left-32 h-[28rem] w-[28rem] rounded-full bg-fuchsia-500/30 blur-3xl animate-blob opacity-0 dark:opacity-100 transition-opacity duration-700" />
      <div className="absolute top-1/3 -right-40 h-[30rem] w-[30rem] rounded-full bg-cyan-400/25 blur-3xl animate-blob animation-delay-2000 opacity-0 dark:opacity-100 transition-opacity duration-700" />
      <div className="absolute -bottom-40 left-1/4 h-[26rem] w-[26rem] rounded-full bg-indigo-500/30 blur-3xl animate-blob animation-delay-4000 opacity-0 dark:opacity-100 transition-opacity duration-700" />
      <div className="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-emerald-400/20 blur-3xl animate-blob animation-delay-3000 opacity-0 dark:opacity-100 transition-opacity duration-700" />

      {/* subtle grain/noise overlay to stop flat blur banding */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,rgba(0,0,0,0.03)_100%)] dark:bg-[radial-gradient(circle_at_50%_50%,transparent_0%,rgba(0,0,0,0.4)_100%)]" />

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -40px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.95); }
        }
        .animate-blob {
          animation: blob 14s infinite ease-in-out;
        }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-3000 { animation-delay: 3s; }
        .animation-delay-4000 { animation-delay: 4s; }

        @media (prefers-reduced-motion: reduce) {
          .animate-blob { animation: none; }
        }
      `}</style>
    </div>
  );
}

export default AnimatedBackground;
