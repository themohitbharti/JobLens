import { Link, useNavigate, useLocation } from "react-router-dom";
import { Logo } from "../ui/Logo";
import Button from "../ui/Button";
import Container from "../ui/Container";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Function to navigate to home page with specific section
  const navigateToSection = (sectionId: string) => {
    // If we're already on the home page, just scroll
    if (location.pathname === "/") {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    } else {
      // Navigate to home page with hash
      navigate(`/#${sectionId}`);

      // Small delay to ensure page has loaded before scrolling
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
              {/* Animated underline */}
              <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-red-500 to-rose-500 transition-all duration-300 ease-out group-hover:w-full"></span>
              {/* Subtle glow effect on hover */}
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
