import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Input, Button, Logo } from "../index";
import { registerUser } from "../../api/auth";
import axios from "axios";

interface SignupFormInputs {
  fullName: string;
  email: string;
  password: string;
}

interface SignupProps {
  onOTPSent?: (userData: {
    email: string;
    fullName: string;
    password: string;
  }) => void;
}

function Signup({ onOTPSent }: SignupProps) {
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { register, handleSubmit } = useForm<SignupFormInputs>();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<SignupFormInputs> = async (data) => {
    try {
      setError(null);
      setSuccessMsg(null);
      setIsLoading(true);

      const res = await registerUser(data);

      if (res?.success) {
        setSuccessMsg(res.message); // "OTP sent to email..."

        // Use the callback if provided, otherwise navigate to separate route
        if (onOTPSent) {
          setTimeout(() => {
            onOTPSent({
              email: data.email,
              fullName: data.fullName,
              password: data.password,
            });
          }, 1500);
        } else {
          // Fallback to route navigation if no callback provided
          setTimeout(() => {
            navigate("/verify-otp", {
              state: {
                email: data.email,
                fullName: data.fullName,
                password: data.password,
              },
            });
          }, 2000);
        }
      } else {
        throw new Error(res.message || "Signup failed");
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || "Signup failed");
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Something went wrong");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-5rem)]">
      {/* Left side - Signup Form */}
      <div className="flex flex-1 items-center justify-center bg-white px-8 py-12">
        <div className="w-full max-w-md">
          {/* Back link */}
          <Link
            to="/"
            className="mb-8 inline-flex items-center text-sm text-gray-600 hover:text-gray-800"
          >
            <svg
              className="mr-2 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back
          </Link>

          {/* Logo */}
          <div className="mb-8">
            <Logo size="default" />
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Sign Up</h1>
          </div>

          {/* Error/Success messages */}
          {error && (
            <div className="mb-6 rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {successMsg && (
            <div className="mb-6 rounded-md bg-green-50 p-4">
              <p className="text-sm text-green-600">{successMsg}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Input
                label="Full Name"
                type="text"
                placeholder="Enter your full name"
                className="w-full rounded-lg border border-red-300 bg-white px-4 py-3 text-black placeholder-gray-400 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                onFocus={() => setError(null)}
                {...register("fullName", { required: "Full name is required" })}
              />
            </div>

            <div>
              <Input
                label="Email"
                type="email"
                placeholder="Enter your email"
                className="w-full rounded-lg border border-red-300 bg-white px-4 py-3 text-black placeholder-gray-400 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                onFocus={() => setError(null)}
                {...register("email", { required: "Email is required" })}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full rounded-lg border border-red-300 bg-white px-4 py-3 pr-12 text-black placeholder-gray-400 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                  onFocus={() => setError(null)}
                  {...register("password", {
                    required: "Password is required",
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {showPassword ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                      />
                    ) : (
                      <>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </>
                    )}
                  </svg>
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="gradient"
              className="w-full px-8 py-3 text-base font-semibold text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="mr-2 h-5 w-5 animate-spin text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing up...
                </span>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>

          {/* Login link */}
          <p className="mt-8 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-red-600 hover:text-red-500"
            >
              Login
            </Link>
          </p>
        </div>
      </div>

      {/* Right side - Illustration */}
      <div className="hidden flex-1 items-center justify-center bg-gradient-to-r from-red-500 via-red-600 to-rose-500 lg:flex">
        <div className="max-w-md text-center text-white">
          <div className="mb-8">
            {/* User Registration illustration SVG */}
            <svg
              className="mx-auto h-64 w-64"
              viewBox="0 0 400 400"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Background circle */}
              <circle
                cx="200"
                cy="200"
                r="150"
                fill="white"
                fillOpacity="0.1"
                stroke="white"
                strokeWidth="2"
                strokeOpacity="0.3"
              />

              {/* User Icon */}
              <circle cx="200" cy="160" r="40" fill="white" fillOpacity="0.9" />
              <circle cx="200" cy="145" r="15" fill="#ef4444" />
              <path
                d="M170 185 Q200 170 230 185"
                fill="#ef4444"
                fillOpacity="0.8"
              />

              {/* Document/Form behind user */}
              <rect
                x="140"
                y="220"
                width="120"
                height="100"
                rx="8"
                fill="white"
                fillOpacity="0.95"
                stroke="white"
                strokeWidth="2"
              />

              {/* Form fields */}
              <rect x="150" y="235" width="80" height="4" fill="#ef4444" />
              <rect x="150" y="245" width="60" height="3" fill="#6b7280" />

              <rect x="150" y="260" width="70" height="4" fill="#ef4444" />
              <rect x="150" y="270" width="90" height="3" fill="#6b7280" />

              <rect x="150" y="285" width="75" height="4" fill="#ef4444" />
              <rect x="150" y="295" width="85" height="3" fill="#6b7280" />

              {/* Checkmark indicating successful registration */}
              <circle cx="320" cy="120" r="25" fill="white" fillOpacity="0.9" />
              <path
                d="M310 120 L318 128 L330 110"
                stroke="#ef4444"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Floating elements - stars/sparkles */}
              <circle cx="120" cy="80" r="3" fill="white" fillOpacity="0.6" />
              <circle cx="300" cy="70" r="4" fill="white" fillOpacity="0.5" />
              <circle cx="350" cy="180" r="2" fill="white" fillOpacity="0.7" />
              <circle cx="80" cy="150" r="3" fill="white" fillOpacity="0.4" />
              <circle cx="320" cy="320" r="3" fill="white" fillOpacity="0.6" />
              <circle cx="100" cy="330" r="2" fill="white" fillOpacity="0.5" />

              {/* Plus signs indicating adding new user */}
              <g stroke="white" strokeWidth="3" fill="none" opacity="0.7">
                <path
                  d="M90 200 L90 210 M85 205 L95 205"
                  strokeLinecap="round"
                />
                <path
                  d="M340 250 L340 260 M335 255 L345 255"
                  strokeLinecap="round"
                />
              </g>

              {/* Connection lines */}
              <path
                d="M200 200 Q250 220 300 180"
                stroke="white"
                strokeWidth="2"
                fill="none"
                opacity="0.4"
                strokeDasharray="5,5"
              />
            </svg>
          </div>

          <h2 className="mb-4 text-3xl font-bold">
            Join thousands of professionals and showcase your talent!
          </h2>

          <p className="text-lg opacity-90">
            Create your account and start building the career you deserve
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
