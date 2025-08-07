import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Logo, Button, Container } from "../../index";
import { RootState } from "../../../store/store";
import { logout as logoutAction } from "../../../store/authSlice";
import { logoutUser } from "../../../api/auth";
import { setAccessToken } from "../../../api/axiosInstance";
import toast from "react-hot-toast";
import axios from "axios";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  // Get authentication status from Redux
  const isAuthenticated = useSelector((state: RootState) => state.auth.isLoggedIn);
  const user = useSelector((state: RootState) => state.auth.user);

  // Function to get page title based on current route
  const getPageTitle = () => {
    const path = location.pathname;
    switch (path) {
      case "/Dashboard":
      case "/dashboard":
        return "Dashboard";
      case "/resume-scan":
        return "Resume Scan";
      case "/resume-stats":
        return "Resume Stats";
      case "/compare-resumes":
        return "Compare Resumes";
      case "/linkedin-builder":
        return "LinkedIn Builder";
      case "/compare-linkedin":
        return "Compare LinkedIn";
      case "/linkedin-stats":
        return "LinkedIn Stats";
      case "/settings":
        return "Settings";
      default:
        return "JobLens";
    }
  };

  // Function to navigate to home page with specific section
  const navigateToSection = (sectionId: string) => {
    if (location.pathname === "/") {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    } else {
      navigate(`/#${sectionId}`);
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 100);
    }
  };

  const handleLogout = async () => {
    try {
      // Call the logout API
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
          dispatch(logoutAction());

          // Navigate to home page
          navigate("/");
        });
    } catch (error) {
      console.error("Logout error:", error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Logout failed");
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  // Render authenticated header
  if (isAuthenticated) {
    return (
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur-sm">
        <Container>
          <div className="flex h-20 items-center justify-between">
            {/* Logo - Positioned to the left */}
            <div className="flex items-center -ml-8 mr-10">
              <Link to="/Dashboard" className="flex items-center">
                <Logo size="default" />
              </Link>
            </div>

            {/* Page Title - Positioned slightly to the left, bigger and gradient */}
            <div className="flex-1 text-left ml-8">
              <h1 
                className="text-5xl font-extrabold bg-clip-text text-transparent"
                style={{
                  background: "linear-gradient(135deg, hsl(0 114% 50%), hsl(35 14% 65%))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {getPageTitle()}
              </h1>
            </div>

            {/* Profile Section - Right side */}
            <div className="flex items-center space-x-4">
              {/* User Profile Dropdown */}
              <div className="relative group">
                <button className="flex items-center space-x-3 rounded-lg px-3 py-2 transition-all duration-200 hover:bg-gray-50">
                  {/* Profile Avatar */}
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-rose-500 text-white font-semibold">
                    {user?.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
                  </div>
                  
                  {/* User Info - Hidden on mobile */}
                  <div className="hidden text-left sm:block">
                    <p className="text-sm font-semibold text-gray-700">
                      {user?.fullName || "User"}
                    </p>
                    <p className="text-xs text-gray-500">Free Plan</p>
                  </div>

                  {/* Dropdown Arrow */}
                  <svg
                    className="h-4 w-4 text-gray-400 transition-transform duration-200 group-hover:rotate-180"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-lg border border-gray-200 bg-white py-2 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{user?.fullName}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                  </div>
                  
                  <Link
                    to="/settings"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <svg className="mr-3 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Settings
                  </Link>
                  
                  <hr className="my-2 border-gray-200" />
                  
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                  >
                    <svg className="mr-3 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </header>
    );
  }

  // ...existing code for non-authenticated header...
  // Render non-authenticated header (original design)
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur-sm">
      <Container>
        <div className="flex h-20 items-center justify-between">
          {/* Logo - Made bigger */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Logo size="large" />
            </Link>
          </div>

          {/* Navigation - Enhanced with animations */}
          <nav className="hidden items-center space-x-8 md:flex">
            <button
              onClick={() => navigateToSection("home")}
              className="group relative px-3 py-2 text-base font-semibold text-gray-700 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:text-red-600"
            >
              Home
              <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-red-500 to-rose-500 transition-all duration-300 ease-out group-hover:w-full"></span>
              <span className="absolute inset-0 rounded-lg bg-red-500/0 transition-all duration-300 ease-out group-hover:bg-red-500/5"></span>
            </button>

            <button
              onClick={() => navigateToSection("features")}
              className="group relative px-3 py-2 text-base font-semibold text-gray-700 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:text-red-600"
            >
              Features
              <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-red-500 to-rose-500 transition-all duration-300 ease-out group-hover:w-full"></span>
              <span className="absolute inset-0 rounded-lg bg-red-500/0 transition-all duration-300 ease-out group-hover:bg-red-500/5"></span>
            </button>

            <button
              onClick={() => navigateToSection("faq")}
              className="group relative px-3 py-2 text-base font-semibold text-gray-700 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:text-red-600"
            >
              FAQ
              <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-red-500 to-rose-500 transition-all duration-300 ease-out group-hover:w-full"></span>
              <span className="absolute inset-0 rounded-lg bg-red-500/0 transition-all duration-300 ease-out group-hover:bg-red-500/5"></span>
            </button>

            <button
              onClick={() => navigateToSection("contact")}
              className="group relative px-3 py-2 text-base font-semibold text-gray-700 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:text-red-600"
            >
              Contact
              <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-red-500 to-rose-500 transition-all duration-300 ease-out group-hover:w-full"></span>
              <span className="absolute inset-0 rounded-lg bg-red-500/0 transition-all duration-300 ease-out group-hover:bg-red-500/5"></span>
            </button>
          </nav>

          {/* Auth Buttons - Enhanced with animations */}
          <div className="flex items-center space-x-6">
            <Link
              to="/login"
              className="group relative text-base font-semibold text-gray-700 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:text-red-600"
            >
              Login
              <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-red-500 to-rose-500 transition-all duration-300 ease-out group-hover:w-full"></span>
            </Link>
            <Link to="/signup">
              <Button
                variant="gradient"
                className="group px-8 py-3 text-base font-semibold text-white transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-lg hover:shadow-red-500/25"
                style={{
                  background:
                    "linear-gradient(135deg, hsl(0 84% 60%), hsl(15 84% 65%))",
                }}
              >
                Sign Up
                <svg
                  className="ml-2 h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button - Enhanced */}
          <div className="md:hidden">
            <button
              type="button"
              className="group text-gray-700 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              aria-label="Toggle navigation menu"
            >
              <svg
                className="h-8 w-8 transition-transform duration-300 ease-out group-hover:scale-110"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </button>
          </div>
        </div>
      </Container>
    </header>
  );
};

export default Header;