import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Logo } from "../ui/Logo";
import { logoutUser } from "../../api/auth";
import { logout } from "../../store/authSlice";
import { setAccessToken } from "../../api/axiosInstance";
import toast from "react-hot-toast";
import axios from "axios";

interface SidebarProps {
  className?: string;
}

// Custom SVG Icons
const DashboardIcon = () => (
  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
  </svg>
);

const ResumeScanIcon = () => (
  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 2 2h8c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
    {/* Scanner beam */}
    <path d="M7 12h10v1H7z" opacity="0.7"/>
    <path d="M7 14h6v1H7z" opacity="0.5"/>
  </svg>
);

const ResumeStatsIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const CompareResumesIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
    {/* VS indicator */}
    <circle cx="12" cy="12" r="2" fill="currentColor" opacity="0.6"/>
    <text x="12" y="13" textAnchor="middle" fontSize="8" fill="white">VS</text>
  </svg>
);

const LinkedInBuilderIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
    {/* LinkedIn square base */}
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    {/* Builder/edit indicator */}
    <path d="M16 2l2 2-10 10-2-2z" stroke="white" strokeWidth="0.8" fill="white" opacity="0.8"/>
    <circle cx="17" cy="3" r="1" fill="#0077b5" stroke="white" strokeWidth="0.5"/>
  </svg>
);

const LinkedInCompareIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
    {/* Left LinkedIn profile */}
    <path d="M10 2H2C1.45 2 1 2.45 1 3v8c0 .55.45 1 1 1h8c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1zm-2 7H4V6h4v3zm0-4H4V4h4v1z" />
    {/* Right LinkedIn profile */}
    <path d="M22 2h-8c-.55 0-1 .45-1 1v8c0 .55.45 1 1 1h8c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1zm-2 7h-4V6h4v3zm0-4h-4V4h4v1z" />
    {/* VS indicator between them */}
    <circle cx="12" cy="7" r="1.5" fill="#0077b5"/>
    <text x="12" y="8" textAnchor="middle" fontSize="6" fill="white">VS</text>
    {/* Connection lines */}
    <path d="M10 7h2M14 7h2" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
  </svg>
);

const LinkedInStatsIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
    {/* LinkedIn base */}
    <rect x="2" y="2" width="20" height="14" rx="2" fill="currentColor" opacity="0.2"/>
    <path d="M20.447 14h-3.554v-3.569c0-.828-.027-1.837-1.052-1.837-.853 0-1.136.845-1.136 1.739V14H11.351V7h2.414v.961h.046c.277-.5.937-1.05 1.93-1.05 2.061 0 2.444 1.37 2.444 3.155V14zM7.337 5.933c-.744 0-1.263-.626-1.263-1.265 0-.638.52-1.263 1.263-1.263.74 0 1.264.625 1.264 1.263 0 .639-.525 1.265-1.264 1.265zM8.782 14H5.555V7h3.227v7z"/>
    {/* Stats bars */}
    <rect x="3" y="17" width="2" height="4" fill="#0077b5"/>
    <rect x="6" y="19" width="2" height="2" fill="#0077b5"/>
    <rect x="9" y="16" width="2" height="5" fill="#0077b5"/>
    <rect x="12" y="18" width="2" height="3" fill="#0077b5"/>
    <rect x="15" y="15" width="2" height="6" fill="#0077b5"/>
    <rect x="18" y="17" width="2" height="4" fill="#0077b5"/>
  </svg>
);

const SettingsIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const LogoutIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

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
      icon: DashboardIcon,
    },
    {
      name: "Resume Scan",
      href: "/resume-scan",
      icon: ResumeScanIcon,
    },
    {
      name: "Resume Stats",
      href: "/resume-stats",
      icon: ResumeStatsIcon,
    },
    {
      name: "Compare Resumes",
      href: "/compare-resumes",
      icon: CompareResumesIcon,
    },
    {
      name: "LinkedIn Builder",
      href: "/linkedin-builder",
      icon: LinkedInBuilderIcon,
    },
    {
      name: "Compare LinkedIn",
      href: "/compare-linkedin",
      icon: LinkedInCompareIcon,
    },
    {
      name: "LinkedIn Stats",
      href: "/linkedin-stats",
      icon: LinkedInStatsIcon,
    },
  ];

  const bottomItems = [
    {
      name: "Settings",
      href: "/settings",
      icon: SettingsIcon,
    },
    {
      name: "Log Out",
      href: "/logout",
      icon: LogoutIcon,
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
          isCollapsed ? "w-17" : "w-64"
        }`}
      >
        {/* Header with Logo */}
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4">
          <div className="flex items-center">
            {isCollapsed ? (
              // Show only the logo symbol when collapsed
              <div className="flex items-center">
                <svg
                  viewBox="0 0 50 43"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  data-logo="logo-symbol"
                >
                  <g transform="translate(0, 1) rotate(0)">
                    <path
                      fill="#FF0A0A"
                      d="M37.8473 40.43C44.2801 40.2989 49.4526 35.0373 49.4526 28.5688C49.4526 25.4231 48.2038 22.4061 45.9809 20.1818L26.2421 0.429993V12.707C26.2421 14.7603 27.0573 16.7295 28.5082 18.1814L33.1321 22.8084L33.1448 22.8207L40.8979 30.5789C41.1497 30.8309 41.1497 31.2394 40.8979 31.4913C40.6461 31.7433 40.2379 31.7433 39.9861 31.4913L37.3136 28.8171H12.5917L9.91919 31.4913C9.6674 31.7433 9.25916 31.7433 9.00737 31.4913C8.75558 31.2394 8.75558 30.8309 9.00737 30.5789L16.7605 22.8207L16.7732 22.8084L21.397 18.1814C22.8479 16.7295 23.6632 14.7603 23.6632 12.707V0.429993L3.92441 20.1818C1.70154 22.4061 0.452637 25.4231 0.452637 28.5688C0.452637 35.0373 5.62517 40.2989 12.0579 40.43H37.8473Z"
                    />
                  </g>
                </svg>
              </div>
            ) : (
              // Show full logo when expanded
              <Logo size="default" />
            )}
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
                <div className={`flex-shrink-0 transition-colors ${
                  active
                    ? "text-white"
                    : "text-gray-400 group-hover:text-red-500"
                }`}>
                  <Icon />
                </div>
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
                    <div className={`flex-shrink-0 transition-colors ${
                      isLoggingOut
                        ? "text-red-400"
                        : "text-red-500 group-hover:text-red-600"
                    }`}>
                      <Icon />
                    </div>
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
                  <div className={`flex-shrink-0 transition-colors ${
                    active
                      ? "text-white"
                      : "text-gray-400 group-hover:text-red-500"
                  }`}>
                    <Icon />
                  </div>
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