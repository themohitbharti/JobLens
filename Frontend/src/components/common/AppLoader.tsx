import { useEffect, useState } from "react";
import { Logo } from "../ui/Logo";

export const AppLoader = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          return 100;
        }
        // Simulate realistic loading with varying speeds
        const increment = Math.random() * 15 + 5; // Random increment between 5-20
        return Math.min(prevProgress + increment, 100);
      });
    }, 150);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="mb-6 animate-bounce">
          <Logo size="large" />
        </div>

        {/* Progress Bar Container */}
        <div className="mb-4 w-48 overflow-hidden rounded-full bg-gray-200 shadow-inner">
          <div
            className="h-1.5 bg-gradient-to-r from-red-500 via-red-600 to-rose-500 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          >
            {/* Shimmer effect */}
            <div className="h-full w-full animate-pulse bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
          </div>
        </div>

        {/* Loading Dots */}
        <div className="mt-2 flex justify-center space-x-1">
          <div
            className="h-2 w-2 animate-bounce rounded-full bg-red-500"
            style={{ animationDelay: "0ms" }}
          ></div>
          <div
            className="h-2 w-2 animate-bounce rounded-full bg-red-500"
            style={{ animationDelay: "150ms" }}
          ></div>
          <div
            className="h-2 w-2 animate-bounce rounded-full bg-red-500"
            style={{ animationDelay: "300ms" }}
          ></div>
        </div>
      </div>
    </div>
  );
};
