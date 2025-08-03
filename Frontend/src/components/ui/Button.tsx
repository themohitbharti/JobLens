import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  bgColor?: string;
  textColor?: string;
  className?: string;
  variant?: "default" | "outline" | "gradient";
}

export default function Button({
  children,
  bgColor = "bg-red-600",
  textColor = "text-white",
  className = "",
  variant = "default",
  ...props
}: ButtonProps) {
  // Determine styling based on variant
  const variantStyles = () => {
    switch (variant) {
      case "outline":
        return "bg-transparent border border-current";
      case "gradient":
        return "bg-gradient-to-r from-red-600 via-red-700 to-rose-600 hover:from-red-700 hover:via-red-800 hover:to-rose-700 shadow-lg hover:shadow-xl";
      default:
        return `${bgColor}`;
    }
  };

  return (
    <button
      className={`transform cursor-pointer rounded-lg px-4 py-2 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-xl ${variantStyles()} ${textColor} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
