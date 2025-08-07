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
            <h1 className="text-3xl font-bold text-gray-900">
              Verify Your Account
            </h1>
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

      {/* Right side - Illustration */}
      <div className="relative hidden flex-1 items-center justify-center bg-gradient-to-r from-red-500 via-red-600 to-rose-500 lg:flex">
        {/* Full background image */}
        <img
          src="/resume-hero-image (1).jpg"
          alt="Resume Hero"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ zIndex: 0 }}
        />
        {/* Overlay card */}
        <div className="relative z-10 mx-auto flex w-[90%] max-w-xl flex-col items-center justify-center rounded-2xl bg-white/40 p-8 shadow-2xl backdrop-blur-lg">
          <h2 className="mb-4 text-center text-3xl font-extrabold text-white drop-shadow-lg md:text-4xl">
            Continue your journey
            <br />
            of resume building excellence
          </h2>
          <p className="text-center text-lg font-medium text-white opacity-95 drop-shadow-lg md:text-xl">
            Create professional resumes that stand out
            <br />
            and unlock new opportunities with every application!
          </p>
        </div>
      </div>
    </div>
  );
}

export default VerifyOTPForm;
