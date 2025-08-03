import React from "react";

export const AppLoader: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-5">
        {/* Logo Container */}
        <div className="relative h-24 w-24 animate-bounce">
          {/* Bold J Letter */}
          <div className="absolute left-4 top-1 h-20 w-16">
            {/* J Vertical - Much Bolder */}
            <div className="absolute right-3 top-0 h-14 w-4 rounded-t-lg bg-black"></div>

            {/* J Curve - Much Bolder */}
            <div className="absolute bottom-2 left-0 h-8 w-8 rounded-bl-3xl border-b-[10px] border-l-[10px] border-black"></div>

            {/* Small Red Tie on J */}
            <div className="absolute right-1 top-1 h-7 w-2">
              {/* Tie Knot */}
              <div className="relative h-2 w-2 rounded-sm bg-red-500">
                <div className="absolute -top-0.5 left-0 h-1 w-2 rounded-sm bg-red-600"></div>
              </div>

              {/* Tie Body - Curved following J */}
              <div
                className="mx-auto mt-0.5 h-5 w-1.5 -rotate-3 transform bg-gradient-to-b from-red-500 to-red-600"
                style={{
                  clipPath: "polygon(10% 0%, 90% 0%, 80% 100%, 20% 100%)",
                  backgroundImage:
                    "repeating-linear-gradient(45deg, #ef4444 0px, #ef4444 2px, #dc2626 2px, #dc2626 4px)",
                }}
              ></div>
            </div>
          </div>

          {/* Large Magnifying Glass Circle */}
          <div className="absolute -right-2 -top-2 h-16 w-16 animate-pulse">
            {/* Main Lens Circle - Changed to red theme */}
            <div className="relative h-14 w-14 rounded-full border-[5px] border-black bg-gradient-to-br from-red-100 to-red-200 shadow-xl">
              {/* Glass effect */}
              <div className="absolute inset-1 rounded-full bg-gradient-to-tr from-transparent via-white/20 to-transparent"></div>

              {/* Lens reflections */}
              <div className="absolute left-2 top-2 h-3 w-3 rounded-full bg-white opacity-80"></div>
              <div className="absolute left-4 top-4 h-1.5 w-1.5 rounded-full bg-white opacity-50"></div>
            </div>

            {/* Magnifying Glass Handle - Diagonal */}
            <div className="absolute bottom-0 right-0 h-8 w-2 origin-top rotate-45 transform rounded-full bg-black shadow-lg">
              {/* Handle grip lines */}
              <div className="absolute left-0 top-2 h-0.5 w-full bg-gray-600"></div>
              <div className="absolute left-0 top-4 h-0.5 w-full bg-gray-600"></div>
            </div>

            {/* Handle connection to lens */}
            <div className="absolute bottom-1 right-1 h-2 w-2 rounded-full bg-black"></div>
          </div>
        </div>

        {/* Brand Text */}
        <div className="text-center text-3xl font-bold tracking-wide">
          <span className="text-black">Job</span>
          <span className="text-red-600">Lens</span>
        </div>

        {/* Loading Dots - Changed to red theme */}
        <div className="mt-2 flex gap-2">
          <span className="h-2 w-2 animate-bounce rounded-full bg-red-500 [animation-delay:-0.3s]"></span>
          <span className="h-2 w-2 animate-bounce rounded-full bg-red-500 [animation-delay:-0.15s]"></span>
          <span className="h-2 w-2 animate-bounce rounded-full bg-red-500"></span>
        </div>

        {/* Loading Text */}
        <p className="animate-pulse text-sm text-slate-500">
          Loading your dashboard...
        </p>
      </div>
    </div>
  );
};
