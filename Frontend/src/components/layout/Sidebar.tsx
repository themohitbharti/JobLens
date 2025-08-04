import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Logo } from "../ui/Logo";
import {
  HomeIcon,
  DocumentTextIcon,
  ChartBarIcon,
  DocumentDuplicateIcon,
  UserIcon,
  CogIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { logoutUser } from "../../api/auth";
import { logout } from "../../store/authSlice";
import { setAccessToken } from "../../api/axiosInstance";
import toast from "react-hot-toast";
import axios from "axios";

interface SidebarProps {
  className?: string;
}

const Sidebar = ({ className = "" }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const navigationItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: HomeIcon,
    },
    {
      name: "Resume Scan",
      href: "/resume-scan",
      icon: DocumentTextIcon,
    },
    {
      name: "Resume Stats",
      href: "/resume-stats",
      icon: ChartBarIcon,
    },
    {
      name: "Compare Resumes",
      href: "/compare-resumes",
      icon: DocumentDuplicateIcon,
    },
    {
      name: "LinkedIn Builder",
      href: "/linkedin-builder",
      icon: UserIcon,
    },
    {
      name: "Compare LinkedIn",
      href: "/compare-linkedin",
      icon: DocumentDuplicateIcon,
    },
    {
      name: "LinkedIn Stats",
      href: "/linkedin-stats",
      icon: ChartBarIcon,
    },
  ];

  const bottomItems = [
    {
      name: "Settings",
      href: "/settings",
      icon: CogIcon,
    },
    {
      name: "Log Out",
      href: "/logout",
      icon: ArrowRightOnRectangleIcon,
      isLogout: true,
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);

      // Call the logout API - this should invalidate the refresh token on the server
      await logoutUser()
        .then((res) => {
          if (res.success) {
            toast.success(res.message || "Logged out successfully");
          }
        })
        .catch((error) => {
          console.error("Logout API error:", error);
          // Continue with local logout even if API call fails
        })
        .finally(() => {
          // Always perform these actions regardless of API success/failure
          // Clear the access token
          setAccessToken(null);

          // Update Redux state
          dispatch(logout());

          // Navigate to login page
          navigate("/login");
        });
    } catch (error) {
      console.error("Logout error:", error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Logout failed");
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className={`flex h-screen bg-white shadow-xl ${className}`}>
      <div
        className={`relative flex flex-col border-r border-gray-200 bg-white transition-all duration-300 ease-in-out ${
          isCollapsed ? "w-16" : "w-64"
        }`}
      >
        {/* Header with Logo */}
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4">
          <div className="flex items-center">
            <Logo size={isCollapsed ? "small" : "default"} />
          </div>

          {/* Collapse Toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <svg
              className={`h-5 w-5 transition-transform ${
                isCollapsed ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
              />
            </svg>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.name}
                to={item.href}
                className={`group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  active
                    ? "bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-md"
                    : "text-gray-700 hover:bg-red-50 hover:text-red-600"
                }`}
              >
                <Icon
                  className={`h-5 w-5 flex-shrink-0 transition-colors ${
                    active
                      ? "text-white"
                      : "text-gray-400 group-hover:text-red-500"
                  }`}
                />
                {!isCollapsed && (
                  <span className="ml-3 truncate">{item.name}</span>
                )}

                {/* Active indicator */}
                {active && !isCollapsed && (
                  <div className="ml-auto h-2 w-2 rounded-full bg-white opacity-75"></div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 px-3 py-4">
          <div className="space-y-1">
            {bottomItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              if (item.isLogout) {
                return (
                  <button
                    key={item.name}
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className={`group flex w-full items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                      isLoggingOut
                        ? "cursor-not-allowed opacity-50"
                        : "text-red-600 hover:bg-red-50 hover:text-red-700"
                    }`}
                  >
                    <Icon
                      className={`h-5 w-5 flex-shrink-0 transition-colors ${
                        isLoggingOut
                          ? "text-red-400"
                          : "text-red-500 group-hover:text-red-600"
                      }`}
                    />
                    {!isCollapsed && (
                      <span className="ml-3 truncate">
                        {isLoggingOut ? "Logging out..." : item.name}
                      </span>
                    )}
                  </button>
                );
              }

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                    active
                      ? "bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-md"
                      : "text-gray-700 hover:bg-red-50 hover:text-red-600"
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 flex-shrink-0 transition-colors ${
                      active
                        ? "text-white"
                        : "text-gray-400 group-hover:text-red-500"
                    }`}
                  />
                  {!isCollapsed && (
                    <span className="ml-3 truncate">{item.name}</span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* User Info Section (when expanded) */}
        {!isCollapsed && (
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-rose-500">
                <span className="text-sm font-medium text-white">MB</span>
              </div>
              <div className="ml-3 min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900">
                  Mohit Bharti
                </p>
                <p className="truncate text-xs text-gray-500">Free Plan</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
