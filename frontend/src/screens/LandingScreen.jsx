import React from "react";
import landingPic from "../assets/landingpic.jpg";

function LandingScreen() {
  return (
    <div
      role="banner"
      className="relative h-screen flex flex-col justify-center items-center text-center text-white px-4 bg-cover bg-center"
      style={{ backgroundImage: `url(${landingPic})` }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/45" />

      {/* Content */}
      <div className="relative z-10">
        <h1 className="text-8xl font-bold m-0 tracking-wide">Insight Forge</h1>
        <p className="text-2xl mt-3 max-w-[700px]">
          Data-driven insights for smarter decisions.
        </p>
      </div>
    </div>
  );
}

export default LandingScreen;
