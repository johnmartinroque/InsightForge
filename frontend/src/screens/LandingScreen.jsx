import React from "react";
import landingPic from "../assets/landingpic.jpg";

function LandingScreen() {
  return (
    <div
      role="banner"
      className="relative isolate h-screen flex items-center justify-center overflow-hidden px-6"
    >
      {/* Blurred background image */}
      <div
        className="absolute inset-0 bg-cover bg-center scale-120 blur-sm"
        style={{ backgroundImage: `url(${landingPic})` }}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/45" />

      {/* Gradient blob accents (top) */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-30 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-2xl py-32 sm:py-48 text-center text-white">
        <div className="hidden sm:mb-8 sm:flex sm:justify-center">
          <div className="relative rounded-full px-3 py-1 text-sm/6 text-gray-200 ring-1 ring-white/20 hover:ring-white/30">
            Now analyzing data smarter than ever.{" "}
            <a href="#" className="font-semibold text-indigo-400">
              <span aria-hidden="true" className="absolute inset-0" />
              Learn more <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </div>

        <h1 className="text-5xl font-bold tracking-tight text-balance sm:text-7xl">
          Insight Forge
        </h1>
        <p className="mt-8 text-lg font-medium text-pretty text-gray-200 sm:text-xl/8">
          Data-driven insights for smarter decisions.
        </p>

        <div className="mt-10 flex items-center justify-center gap-x-6">
          <a
            href="#"
            className="rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            Get started
          </a>
          <a href="#" className="text-sm/6 font-semibold text-white">
            Learn more <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>

      {/* Gradient blob accents (bottom) */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
        />
      </div>
    </div>
  );
}

export default LandingScreen;
