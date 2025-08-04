import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Input, Button, Logo, LoadingSpinner } from "../index";
import axios from "axios";
import axiosInstance from "../../api/axiosInstance";
import { useDispatch } from "react-redux";
import { login } from "../../store/authSlice";
import { loginUser } from "../../api/auth";
import { setAccessToken } from "../../api/axiosInstance";

interface OTPFormInputs {
  otp: string;
}

interface VerifyOTPFormProps {
  userData: { email: string; fullName: string; password: string };
  onBack?: () => void;
}

function VerifyOTPForm({ userData, onBack }: VerifyOTPFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { register, handleSubmit } = useForm<OTPFormInputs>();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { email, fullName, password } = userData;

  const onSubmit: SubmitHandler<OTPFormInputs> = async (data) => {
    try {
      setError(null);
      setSuccessMsg(null);
      setIsLoading(true);

      const payload = {
        email,
        otp: data.otp,
        fullName,
        password,
      };

      // First verify the OTP
      const response = await axiosInstance.post("/user/verify-otp", payload);
      const res = response.data;

      if (res?.success) {
        setSuccessMsg(res.message || "Account verified successfully");

        // Now automatically log the user in
        try {
          const loginResponse = await loginUser({
            email,
            password,
          });

          if (loginResponse?.success) {
            const { accessToken } = loginResponse.data[0];
            const user = loginResponse.user;

            setAccessToken(accessToken);
            dispatch(login(user));

            setTimeout(() => {
              navigate("/dashboard");
            }, 2000);
          } else {
            throw new Error(loginResponse.message || "Auto-login failed");
          }
        } catch (loginError) {
          console.error("Auto-login failed:", loginError);
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        }
      } else {
        throw new Error(res.message || "Verification failed");
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || "Verification failed");
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
      {/* Left side - OTP Form */}
      <div className="flex flex-1 items-center justify-center bg-white px-8 py-12">
        <div className="w-full max-w-md">
          {/* Back link */}
          {onBack ? (
            <button
              onClick={onBack}
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
              Back to Sign Up
            </button>
          ) : (
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
          )}

          {/* Logo */}
          <div className="mb-8">
            <Logo size="default" />
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Verify Your Account</h1>
            <p className="mt-2 text-gray-600">
              Please enter the OTP sent to {email}
            </p>
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
                label="OTP Code"
                type="text"
                placeholder="Enter the 4-digit code"
                className="w-full rounded-lg border border-red-300 bg-white px-4 py-3 text-black placeholder-gray-400 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                onFocus={() => setError(null)}
                {...register("otp", { required: "OTP is required" })}
              />
            </div>

            <Button
              type="submit"
              variant="gradient"
              className="w-full px-8 py-3 text-base font-semibold text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <LoadingSpinner size="sm" className="mr-2" />
                  Verifying...
                </span>
              ) : (
                "Verify Account"
              )}
            </Button>
          </form>

          {/* Login link */}
          <p className="mt-8 text-center text-sm text-gray-600">
            Didn't receive the code?{" "}
            <button
              type="button"
              className="font-medium text-red-600 hover:text-red-500"
              onClick={() => {
                // Add resend OTP logic here if needed
                console.log("Resend OTP");
              }}
            >
              Resend
            </button>
          </p>
        </div>
      </div>

      {/* Right side - Same illustration as signup */}
      <div className="hidden flex-1 items-center justify-center bg-gradient-to-r from-red-500 via-red-600 to-rose-500 lg:flex">
        <div className="max-w-md text-center text-white">
          <div className="mb-8">
            {/* Verification illustration SVG */}
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

              {/* Email icon */}
              <rect
                x="140"
                y="160"
                width="120"
                height="80"
                rx="8"
                fill="white"
                fillOpacity="0.9"
              />
              <path
                d="M140 160 L200 200 L260 160"
                stroke="#ef4444"
                strokeWidth="3"
                fill="none"
              />

              {/* OTP code visualization */}
              <rect x="160" y="180" width="15" height="20" rx="3" fill="#ef4444" />
              <rect x="185" y="180" width="15" height="20" rx="3" fill="#ef4444" />
              <rect x="210" y="180" width="15" height="20" rx="3" fill="#ef4444" />
              <rect x="235" y="180" width="15" height="20" rx="3" fill="#ef4444" />

              {/* Checkmark */}
              <circle cx="300" cy="120" r="25" fill="white" fillOpacity="0.9" />
              <path
                d="M290 120 L298 128 L310 110"
                stroke="#ef4444"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Floating elements */}
              <circle cx="120" cy="80" r="3" fill="white" fillOpacity="0.6" />
              <circle cx="320" cy="320" r="3" fill="white" fillOpacity="0.6" />
            </svg>
          </div>

          <h2 className="mb-4 text-3xl font-bold">
            Almost there!
          </h2>

          <p className="text-lg opacity-90">
            Check your email and enter the verification code to complete your registration
          </p>
        </div>
      </div>
    </div>
  );
}

export default VerifyOTPForm;