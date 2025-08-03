import { Link, useLocation } from "react-router-dom";
import { Logo } from "../ui/Logo";
import Button from "../ui/Button";
import Container from "../ui/Container";

const Header = () => {
  const location = useLocation();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Features", path: "/features" },
    { name: "FAQ", path: "/faq" },
    { name: "Get Started", path: "/get-started" },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
      <Container>
        <div className="flex h-20 items-center justify-between">
          {/* Logo - Made bigger */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Logo size="large" />
            </Link>
          </div>

          {/* Navigation - Made bigger with hover effects */}
          <nav className="hidden items-center space-x-10 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`relative text-base font-semibold transition-all duration-300 ease-out hover:-translate-y-1 hover:text-red-600 ${
                  isActive(item.path)
                    ? "border-b-2 border-red-600 pb-1 text-red-600"
                    : "text-gray-700"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Auth Buttons - Made bigger */}
          <div className="flex items-center space-x-6">
            <Link
              to="/login"
              className="text-base font-semibold text-gray-700 transition-all duration-300 ease-out hover:-translate-y-1 hover:text-red-600"
            >
              Login
            </Link>
            <Link to="/signup">
              <Button
                variant="gradient"
                className="px-8 py-3 text-base font-semibold text-white"
              >
                Sign Up
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button - Made bigger */}
          <div className="md:hidden">
            <button
              type="button"
              className="text-gray-700 transition-all duration-300 ease-out hover:-translate-y-1 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              aria-label="Toggle navigation menu"
            >
              <svg
                className="h-8 w-8"
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
