import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Input, Button, Logo } from "../index";
import { loginUser } from "../../api/auth";
import { login as loginAction } from "../../store/authSlice";
import axios from "axios";
import { setAccessToken } from "../../api/axiosInstance";

interface LoginFormInputs {
  email: string;
  password: string;
}

function Login() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm<LoginFormInputs>();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    try {
      setError(null);
      setIsLoading(true);

      const res = await loginUser(data);

      if (res?.success) {
        const { accessToken } = res.data[0];
        const user = res.user;

        setAccessToken(accessToken);
        dispatch(loginAction(user));
        navigate("/");
      } else {
        throw new Error(res.message || "Login failed");
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || "Login failed");
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
      {/* Left side - Login Form */}
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
            <h1 className="text-3xl font-bold text-gray-900">Login</h1>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

            <div className="flex items-center justify-between">
              <Link
                to="/forgot-password"
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Forgot Password?
              </Link>
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 text-sm text-gray-600"
                >
                  Remember me
                </label>
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
                  Logging in...
                </span>
              ) : (
                "Login"
              )}
            </Button>
          </form>

          {/* Sign up link */}
          <p className="mt-8 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-medium text-red-600 hover:text-red-500"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>

      {/* Right side - Illustration */}
      <div className="hidden flex-1 items-center justify-center bg-gradient-to-r from-red-500 via-red-600 to-rose-500 lg:flex">
        <div className="max-w-md text-center text-white">
          <div className="mb-8">
            {/* Resume with Magnifying Glass illustration SVG */}
            <svg
              className="mx-auto h-64 w-64"
              viewBox="0 0 400 400"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Resume Document */}
              <rect
                x="80"
                y="60"
                width="200"
                height="280"
                rx="8"
                fill="white"
                fillOpacity="0.95"
                stroke="white"
                strokeWidth="2"
              />

              {/* Resume Header */}
              <rect x="100" y="80" width="80" height="6" fill="#1f2937" />
              <rect x="100" y="95" width="60" height="4" fill="#6b7280" />
              <rect x="100" y="105" width="70" height="4" fill="#6b7280" />

              {/* Profile Picture */}
              <circle cx="230" cy="100" r="25" fill="#e5e7eb" />
              <circle cx="230" cy="95" r="8" fill="#9ca3af" />
              <path d="M215 115 Q230 105 245 115" fill="#9ca3af" />

              {/* Section Headers */}
              <rect x="100" y="140" width="40" height="5" fill="#ef4444" />
              <rect x="100" y="155" width="140" height="3" fill="#1f2937" />
              <rect x="100" y="165" width="120" height="3" fill="#1f2937" />
              <rect x="100" y="175" width="130" height="3" fill="#1f2937" />

              <rect x="100" y="200" width="50" height="5" fill="#ef4444" />
              <rect x="100" y="215" width="100" height="3" fill="#1f2937" />
              <rect x="100" y="225" width="110" height="3" fill="#1f2937" />

              <rect x="100" y="250" width="35" height="5" fill="#ef4444" />
              <rect x="100" y="265" width="90" height="3" fill="#1f2937" />
              <rect x="100" y="275" width="85" height="3" fill="#1f2937" />
              <rect x="100" y="285" width="95" height="3" fill="#1f2937" />

              {/* Magnifying Glass */}
              <circle
                cx="280"
                cy="220"
                r="45"
                fill="none"
                stroke="white"
                strokeWidth="6"
                fillOpacity="0.1"
              />
              <circle cx="280" cy="220" r="35" fill="white" fillOpacity="0.2" />

              {/* Magnifying Glass Handle */}
              <line
                x1="315"
                y1="255"
                x2="340"
                y2="280"
                stroke="white"
                strokeWidth="8"
                strokeLinecap="round"
              />

              {/* Magnified Content (resume details under glass) */}
              <g opacity="0.8">
                <rect x="260" y="205" width="40" height="2" fill="#1f2937" />
                <rect x="260" y="210" width="35" height="2" fill="#1f2937" />
                <rect x="260" y="215" width="38" height="2" fill="#1f2937" />
                <rect x="260" y="225" width="25" height="3" fill="#ef4444" />
                <rect x="260" y="232" width="30" height="1.5" fill="#6b7280" />
                <rect x="260" y="236" width="33" height="1.5" fill="#6b7280" />
              </g>

              {/* Floating elements - stars/sparkles */}
              <circle cx="120" cy="40" r="3" fill="white" fillOpacity="0.6" />
              <circle cx="300" cy="50" r="4" fill="white" fillOpacity="0.5" />
              <circle cx="350" cy="90" r="2" fill="white" fillOpacity="0.7" />
              <circle cx="60" cy="120" r="3" fill="white" fillOpacity="0.4" />
              <circle cx="320" cy="350" r="3" fill="white" fillOpacity="0.6" />
              <circle cx="90" cy="360" r="2" fill="white" fillOpacity="0.5" />

              {/* Checkmarks for quality */}
              <g stroke="white" strokeWidth="3" fill="none" opacity="0.7">
                <path
                  d="M330 120 L335 125 L345 115"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M340 160 L345 165 L355 155"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            </svg>
          </div>

          <h2 className="mb-4 text-3xl font-bold">
            Build your perfect profile and let recruiters discover your
            potential!
          </h2>

          <p className="text-lg opacity-90">
            Create a standout resume that gets noticed by top employers
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
