import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";
import { userAPI } from "../api/userApis";
import { updateUser } from "../store/authSlice";
import toast from "react-hot-toast";

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  location: string;
  jobTitle: string;
  company: string;
  bio: string;
}

interface PasswordChange {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface Preferences {
  targetIndustry: string;
  experienceLevel: string;
  targetJobTitle: string;
  emailNotifications: boolean;
  weeklyReports: boolean;
  scanReminders: boolean;
}

// Add this new interface for user details
export interface UserDetailsResponse {
  success: boolean;
  message: string;
  data: {
    _id: string;
    email: string;
    fullName: string;
    googleId?: string;
    coverImage?: string;
    createdAt: string;
    updatedAt: string;
    dailyScans: Array<{
      date: string;
      totalCount: number;
      resumeCount: number;
      linkedinCount: number;
      _id: string;
    }>;
    resumeStats: {
      totalScans: number;
      weeklyScans: number;
      weeklyAvg: number;
      bestScore: number;
      lastScanDate?: string;
      improvementTrend: number;
    };
    linkedinStats: {
      totalScans: number;
      weeklyScans: number;
      weeklyAvg: number;
      bestScore: number;
      lastScanDate?: string;
      improvementTrend: number;
    };
    lastResumes: Array<{
      scanId: string;
      overallScore: number;
      scanDate: string;
    }>;
    lastLinkedins: Array<{
      scanId: string;
      overallScore: number;
      scanDate: string;
    }>;
    scansLeft: number;
  };
}

// Add these new interfaces for profile updates
export interface UpdateProfileRequest {
  fullName: string;
  // Add more fields as they become available in the backend
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface UpdatePreferencesRequest {
  targetIndustry: string;
  experienceLevel: string;
  targetJobTitle: string;
  emailNotifications: boolean;
  weeklyReports: boolean;
  scanReminders: boolean;
}

export interface UpdateProfileResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      _id: string;
      fullName: string;
      email: string;
      // Add other profile fields as needed
    };
  };
}

const Settings = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  const [activeTab, setActiveTab] = useState<
    "profile" | "security" | "preferences"
  >("profile");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(true);

  // Profile state - initialize with user data
  const [profile, setProfile] = useState<UserProfile>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    location: "",
    jobTitle: "",
    company: "",
    bio: "",
  });

  // Password change state
  const [passwordChange, setPasswordChange] = useState<PasswordChange>({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Preferences state
  const [preferences, setPreferences] = useState<Preferences>({
    targetIndustry: "Technology",
    experienceLevel: "mid",
    targetJobTitle: "Software Engineer",
    emailNotifications: true,
    weeklyReports: true,
    scanReminders: false,
  });

  // Fetch user profile on component mount using existing API
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoadingDetails(true);
        const response = await userAPI.getUserProfile();
        if (response.success) {
          const userData = response.data;

          // Parse full name into first and last name
          const nameParts = userData.fullName.split(" ");
          const firstName = nameParts[0] || "";
          const lastName = nameParts.slice(1).join(" ") || "";

          setProfile({
            firstName,
            lastName,
            email: userData.email,
            phoneNumber: "", // Not in current user model
            location: "", // Not in current user model
            jobTitle: "", // Not in current user model
            company: "", // Not in current user model
            bio: "", // Not in current user model
          });
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        toast.error("Failed to load user profile");
      } finally {
        setIsLoadingDetails(false);
      }
    };

    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const handleProfileSave = async () => {
    setIsLoading(true);
    try {
      const fullName = `${profile.firstName} ${profile.lastName}`.trim();

      if (!fullName) {
        toast.error("Full name is required");
        return;
      }

      // Use the existing editUserProfile API
      const response = await userAPI.updateProfile({ fullName });
      if (response.success) {
        toast.success("Profile updated successfully!");

        // Update the user in Redux store
        if (user) {
          dispatch(updateUser({ ...user, fullName }));
        }
      } else {
        toast.error(response.message || "Failed to update profile");
      }
    } catch (error) {
      toast.error("Failed to update profile");
      console.error("Profile update error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordChange.newPassword !== passwordChange.confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }

    if (passwordChange.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);
    try {
      const response = await userAPI.changePassword({
        oldPassword: passwordChange.oldPassword,
        newPassword: passwordChange.newPassword,
      });

      if (response.success) {
        toast.success("Password changed successfully!");
        setPasswordChange({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        toast.error(response.message || "Failed to change password");
      }
    } catch (error) {
      toast.error("Failed to change password");
      console.error("Password change error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreferencesSave = async () => {
    setIsLoading(true);
    try {
      const response = await userAPI.updatePreferences({
        targetIndustry: preferences.targetIndustry,
        experienceLevel: preferences.experienceLevel,
        targetJobTitle: preferences.targetJobTitle,
        emailNotifications: preferences.emailNotifications,
        weeklyReports: preferences.weeklyReports,
        scanReminders: preferences.scanReminders,
      });

      if (response.success) {
        toast.success("Preferences updated successfully!");
      } else {
        toast.error(response.message || "Failed to update preferences");
      }
    } catch (error) {
      toast.error("Failed to update preferences");
      console.error("Preferences update error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state while fetching user profile
  if (isLoadingDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="flex h-64 items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-red-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="mb-2 bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 bg-clip-text text-5xl font-bold text-transparent">
              Settings
            </h1>
            <p className="text-2xl font-semibold text-gray-700">
              Manage your profile and preferences
            </p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Export Data
            </button>
            <button
              onClick={handleProfileSave}
              disabled={isLoading}
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-red-600 hover:to-pink-600 disabled:opacity-50"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Save All Changes
            </button>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="rounded-2xl bg-white p-8 shadow-lg">
          {/* Settings Navigation Tabs */}
          <div className="mb-8 flex space-x-1 rounded-lg bg-gray-100 p-1">
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all ${
                activeTab === "profile"
                  ? "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Profile
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all ${
                activeTab === "security"
                  ? "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              Security
            </button>
            <button
              onClick={() => setActiveTab("preferences")}
              className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all ${
                activeTab === "preferences"
                  ? "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
              </svg>
              Preferences
            </button>
          </div>

          {/* Profile Tab Content */}
          {activeTab === "profile" && (
            <div className="space-y-8">
              {/* Profile Picture Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-gradient-to-r from-red-500 to-pink-500 p-2">
                    <svg
                      className="h-5 w-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Profile Picture
                  </h3>
                </div>

                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-r from-orange-400 to-red-500 text-2xl font-bold text-white">
                      {profile.firstName.charAt(0)}
                      {profile.lastName.charAt(0)}
                    </div>
                    <button className="absolute -bottom-1 -right-1 rounded-full bg-red-500 p-2 text-white hover:bg-red-600">
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="flex flex-col gap-3">
                    <button className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 px-4 py-2 text-sm font-medium text-white hover:from-red-600 hover:to-pink-600">
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      Upload New
                    </button>
                    <button className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      Remove
                    </button>
                  </div>
                </div>
              </div>

              {/* Personal Information Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-gradient-to-r from-red-500 to-pink-500 p-2">
                    <svg
                      className="h-5 w-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Personal Information
                  </h3>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={profile.firstName}
                      onChange={(e) =>
                        setProfile({ ...profile, firstName: e.target.value })
                      }
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={profile.lastName}
                      onChange={(e) =>
                        setProfile({ ...profile, lastName: e.target.value })
                      }
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={profile.email}
                        disabled
                        className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-gray-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                      />
                      <svg
                        className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={profile.phoneNumber}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            phoneNumber: e.target.value,
                          })
                        }
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                      />
                      <svg
                        className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Location
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={profile.location}
                        onChange={(e) =>
                          setProfile({ ...profile, location: e.target.value })
                        }
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                      />
                      <svg
                        className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Job Title
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={profile.jobTitle}
                        onChange={(e) =>
                          setProfile({ ...profile, jobTitle: e.target.value })
                        }
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                      />
                      <svg
                        className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Company
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={profile.company}
                        onChange={(e) =>
                          setProfile({ ...profile, company: e.target.value })
                        }
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                      />
                      <svg
                        className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 14l9-5-9-5-9 5 9 5z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Bio
                  </label>
                  <textarea
                    value={profile.bio}
                    onChange={(e) =>
                      setProfile({ ...profile, bio: e.target.value })
                    }
                    rows={4}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Security Tab Content */}
          {activeTab === "security" && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-gradient-to-r from-red-500 to-pink-500 p-2">
                  <svg
                    className="h-5 w-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Change Password
                </h3>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={passwordChange.oldPassword}
                    onChange={(e) =>
                      setPasswordChange({
                        ...passwordChange,
                        oldPassword: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={passwordChange.newPassword}
                    onChange={(e) =>
                      setPasswordChange({
                        ...passwordChange,
                        newPassword: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={passwordChange.confirmPassword}
                    onChange={(e) =>
                      setPasswordChange({
                        ...passwordChange,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>
              </div>

              <button
                onClick={handlePasswordChange}
                disabled={isLoading}
                className="rounded-lg bg-gradient-to-r from-red-500 to-pink-500 px-6 py-2 font-medium text-white hover:from-red-600 hover:to-pink-600 disabled:opacity-50"
              >
                Change Password
              </button>
            </div>
          )}

          {/* Preferences Tab Content */}
          {activeTab === "preferences" && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-gradient-to-r from-red-500 to-pink-500 p-2">
                  <svg
                    className="h-5 w-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Career Preferences
                </h3>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Target Industry
                  </label>
                  <select
                    value={preferences.targetIndustry}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        targetIndustry: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                  >
                    <option value="Technology">Technology</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Finance">Finance</option>
                    <option value="Education">Education</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Retail">Retail</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Experience Level
                  </label>
                  <select
                    value={preferences.experienceLevel}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        experienceLevel: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                  >
                    <option value="entry">Entry Level (0-2 years)</option>
                    <option value="mid">Mid Level (3-5 years)</option>
                    <option value="senior">Senior Level (6-10 years)</option>
                    <option value="executive">Executive (10+ years)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Target Job Title
                  </label>
                  <input
                    type="text"
                    value={preferences.targetJobTitle}
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        targetJobTitle: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-md font-semibold text-gray-900">
                  Notification Preferences
                </h4>
                <div className="space-y-3">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={preferences.emailNotifications}
                      onChange={(e) =>
                        setPreferences({
                          ...preferences,
                          emailNotifications: e.target.checked,
                        })
                      }
                      className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                    />
                    <span className="text-sm text-gray-700">
                      Email notifications for scan results
                    </span>
                  </label>

                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={preferences.weeklyReports}
                      onChange={(e) =>
                        setPreferences({
                          ...preferences,
                          weeklyReports: e.target.checked,
                        })
                      }
                      className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                    />
                    <span className="text-sm text-gray-700">
                      Weekly progress reports
                    </span>
                  </label>

                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={preferences.scanReminders}
                      onChange={(e) =>
                        setPreferences({
                          ...preferences,
                          scanReminders: e.target.checked,
                        })
                      }
                      className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                    />
                    <span className="text-sm text-gray-700">
                      Scan reminders and tips
                    </span>
                  </label>
                </div>
              </div>

              <button
                onClick={handlePreferencesSave}
                disabled={isLoading}
                className="rounded-lg bg-gradient-to-r from-red-500 to-pink-500 px-6 py-2 font-medium text-white hover:from-red-600 hover:to-pink-600 disabled:opacity-50"
              >
                Save Preferences
              </button>
            </div>
          )}
        </div>

        {/* Bottom Action Button for Profile Tab */}
        {activeTab === "profile" && (
          <div className="text-center">
            <button
              onClick={handleProfileSave}
              disabled={isLoading}
              className="rounded-lg bg-gradient-to-r from-red-500 to-pink-500 px-8 py-3 font-medium text-white hover:from-red-600 hover:to-pink-600 disabled:opacity-50"
            >
              <svg
                className="mr-2 inline-block h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Save Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
