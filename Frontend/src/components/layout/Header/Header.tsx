import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Logo, Button, Container } from "../../index";
import { RootState } from "../../../store/store";
import { logout as logoutAction } from "../../../store/authSlice";
import { logoutUser } from "../../../api/auth";
import { setAccessToken } from "../../../api/axiosInstance";
import toast from "react-hot-toast";
import axios from "axios";

const NAV_LINKS = [
  { label: "Home", section: "home" },
  { label: "Features", section: "features" },
  { label: "FAQ", section: "faq" },
  { label: "Contact", section: "contact" },
];

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isLoggedIn,
  );
  const user = useSelector((state: RootState) => state.auth.user);

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
      await logoutUser()
        .then((res) => {
          if (res.success) {
            toast.success(res.message || "Logged out successfully");
          }
        })
        .catch((error) => {
          console.error("Logout API error:", error);
        })
        .finally(() => {
          setAccessToken(null);
          dispatch(logoutAction());
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

  // --- HEADER LAYOUT ---
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur-sm">
      <Container>
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <div className="-ml-8 mr-8 flex items-center">
            <Link
              to={isAuthenticated ? "/Dashboard" : "/"}
              className="flex items-center"
            >
              <Logo size={isAuthenticated ? "default" : "large"} />
            </Link>
          </div>

          {/* Navigation - always visible */}
          <nav className="flex flex-1 items-center justify-center space-x-8 transition-all duration-300">
            {NAV_LINKS.map((link) => (
              <button
                key={link.section}
                onClick={() => navigateToSection(link.section)}
                className="group relative px-3 py-2 text-base font-semibold text-gray-700 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:text-red-600"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-red-500 to-rose-500 transition-all duration-300 ease-out group-hover:w-full"></span>
              </button>
            ))}
          </nav>

          {/* Right side: Auth/Profile or Dashboard button on home */}
          <div className="flex items-center space-x-6">
            {location.pathname === "/" && isAuthenticated ? (
              <Link to="/dashboard">
                <Button
                  variant="gradient"
                  className="px-6 py-2 text-base font-semibold text-white"
                  style={{
                    background:
                      "linear-gradient(135deg, hsl(0 84% 60%), hsl(15 84% 65%))",
                  }}
                >
                  Dashboard
                  <svg
                    className="ml-2 h-4 w-4"
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
            ) : isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {/* User Profile Dropdown */}
                <div className="group relative">
                  <button className="flex items-center space-x-3 rounded-lg px-3 py-2 transition-all duration-200 hover:bg-gray-50">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-rose-500 font-semibold text-white">
                      {user?.fullName
                        ? user.fullName.charAt(0).toUpperCase()
                        : "U"}
                    </div>
                    <div className="hidden text-left sm:block">
                      <p className="text-sm font-semibold text-gray-700">
                        {user?.fullName || "User"}
                      </p>
                      <p className="text-xs text-gray-500">Free Plan</p>
                    </div>
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
                  <div className="invisible absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-lg border border-gray-200 bg-white py-2 opacity-0 shadow-xl transition-all duration-200 group-hover:visible group-hover:opacity-100">
                    <div className="border-b border-gray-100 px-4 py-2">
                      <p className="text-sm font-medium text-gray-900">
                        {user?.fullName}
                      </p>
                      <p className="truncate text-xs text-gray-500">
                        {user?.email}
                      </p>
                    </div>
                    <Link
                      to="/settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 transition-colors duration-200 hover:bg-gray-50"
                    >
                      <svg
                        className="mr-3 h-4 w-4"
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
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      Settings
                    </Link>
                    <hr className="my-2 border-gray-200" />
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center px-4 py-2 text-sm text-red-600 transition-colors duration-200 hover:bg-red-50"
                    >
                      <svg
                        className="mr-3 h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      </Container>
    </header>
  );
};

export default Header;
