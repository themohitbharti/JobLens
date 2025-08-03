import React from "react";

interface LogoProps {
  size?: "small" | "default" | "large";
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = "default",
  className = "",
}) => {
  const sizeClasses = {
    small: "w-8 h-8",
    default: "w-12 h-12",
    large: "w-16 h-16",
  };

  const textSizeClasses = {
    small: "text-sm",
    default: "text-lg",
    large: "text-xl",
  };

  const logoSize = sizeClasses[size];
  const textSize = textSizeClasses[size];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Logo Icon */}
      <div className={`relative ${logoSize} flex-shrink-0`}>
        {/* Bold J Letter */}
        <div className="absolute left-1 top-0 h-8 w-6">
          {/* J Vertical */}
          <div className="absolute right-1 top-0 h-6 w-1.5 rounded-sm bg-slate-800"></div>

          {/* J Curve */}
          <div className="absolute bottom-0 left-0 h-3 w-3 rounded-bl-lg border-b-[3px] border-l-[3px] border-slate-800"></div>

          {/* Small Tie */}
          <div className="absolute right-0.5 top-0.5 h-3 w-1">
            {/* Tie Knot */}
            <div className="relative h-1 w-1 rounded-sm bg-red-500">
              <div className="absolute -top-0.5 left-0 h-0.5 w-1 rounded-sm bg-red-600"></div>
            </div>

            {/* Tie Body */}
            <div
              className="mx-auto mt-0.5 h-2 w-0.5 bg-gradient-to-b from-red-500 to-red-600"
              style={{
                clipPath: "polygon(0 0, 100% 0, 85% 100%, 15% 100%)",
                backgroundImage:
                  "repeating-linear-gradient(45deg, #ef4444 0px, #ef4444 1px, #dc2626 1px, #dc2626 2px)",
              }}
            ></div>
          </div>
        </div>

        {/* Magnifying Glass */}
        <div className="absolute -right-1 -top-1 h-10 w-8 rotate-12 transform">
          {/* Lens Circle */}
          <div className="relative h-6 w-6 rounded-full border-2 border-blue-600 bg-gradient-to-br from-blue-50 to-blue-100">
            {/* Inner lens ring */}
            <div className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full border border-blue-700 bg-gradient-to-br from-transparent to-blue-50/30"></div>

            {/* Lens reflections */}
            <div className="absolute left-1 top-1 h-1.5 w-1.5 rounded-full bg-white opacity-90"></div>
            <div className="absolute left-1.5 top-1.5 h-0.5 w-0.5 rounded-full bg-white opacity-60"></div>
          </div>

          {/* Handle */}
          <div className="absolute bottom-0 right-0.5 h-4 w-0.5 origin-top rotate-45 transform rounded-full bg-gradient-to-b from-slate-600 to-slate-800">
            {/* Handle grip */}
            <div className="absolute left-0 top-1 h-0.5 w-full rounded-full bg-slate-500"></div>
            <div className="absolute left-0 top-2 h-0.5 w-full rounded-full bg-slate-500"></div>
          </div>

          {/* Handle connection */}
          <div className="absolute bottom-1 right-1 h-1 w-1 rotate-45 transform rounded-full bg-slate-700"></div>
        </div>
      </div>

      {/* Brand Text (only show for default and large sizes) */}
      {size !== "small" && (
        <div className={`font-bold tracking-wide ${textSize}`}>
          <span className="text-slate-800">Job</span>
          <span className="text-blue-600">Lens</span>
        </div>
      )}
    </div>
  );
};
