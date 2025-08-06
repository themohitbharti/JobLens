import { Link } from "react-router-dom";
import { FaLinkedin, FaTwitter, FaGithub } from "react-icons/fa";
import { Logo } from "../../ui/Logo";

const Footer = () => {
  return (
    <footer
      className="border-t border-gray-700/30"
      style={{
        background: "linear-gradient(135deg, hsl(0 90% 26%), hsl(3 84% 55%))",
      }}
    >
      <div className="mx-auto max-w-7xl px-8 py-12 lg:px-16">
        <div className="flex flex-wrap">
          <div className="w-full p-6 md:w-1/2 lg:w-5/12">
            <div className="flex h-full flex-col justify-between">
              <div className="mb-4 flex items-center">
                <Logo size="default" className="text-white" />
              </div>
              <p className="mb-8 text-sm leading-relaxed text-white/90">
                Your professional profile builder. Create stunning resumes and
                portfolios that get you noticed by top employers.
              </p>
              <div className="flex space-x-4">
                <Link
                  to="/"
                  className="text-white/80 transition-colors hover:text-white"
                >
                  <FaLinkedin size={20} />
                </Link>
                <Link
                  to="/"
                  className="text-white/80 transition-colors hover:text-white"
                >
                  <FaTwitter size={20} />
                </Link>
                <Link
                  to="/"
                  className="text-white/80 transition-colors hover:text-white"
                >
                  <FaGithub size={20} />
                </Link>
              </div>
              <div className="mt-8">
                <p className="text-sm text-white/70">
                  &copy; {new Date().getFullYear()} JobLens. All Rights
                  Reserved.
                </p>
              </div>
            </div>
          </div>

          <div className="w-full p-6 md:w-1/2 lg:w-2/12">
            <div className="h-full">
              <h3 className="mb-5 text-sm font-bold uppercase tracking-wider text-white">
                Features
              </h3>
              <ul>
                <li className="mb-4">
                  <Link
                    className="text-base font-medium text-white/90 transition-all duration-200 hover:font-semibold hover:text-white"
                    to="/resume-builder"
                  >
                    Resume Builder
                  </Link>
                </li>
                <li className="mb-4">
                  <Link
                    className="text-base font-medium text-white/90 transition-all duration-200 hover:font-semibold hover:text-white"
                    to="/portfolio"
                  >
                    Portfolio
                  </Link>
                </li>
                <li className="mb-4">
                  <Link
                    className="text-base font-medium text-white/90 transition-all duration-200 hover:font-semibold hover:text-white"
                    to="/templates"
                  >
                    Templates
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-base font-medium text-white/90 transition-all duration-200 hover:font-semibold hover:text-white"
                    to="/job-tracker"
                  >
                    Job Tracker
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="w-full p-6 md:w-1/2 lg:w-2/12">
            <div className="h-full">
              <h3 className="mb-5 text-sm font-bold uppercase tracking-wider text-white">
                Support
              </h3>
              <ul>
                <li className="mb-4">
                  <Link
                    className="text-base font-medium text-white/90 transition-all duration-200 hover:font-semibold hover:text-white"
                    to="/help"
                  >
                    Help Center
                  </Link>
                </li>
                <li className="mb-4">
                  <Link
                    className="text-base font-medium text-white/90 transition-all duration-200 hover:font-semibold hover:text-white"
                    to="/guides"
                  >
                    Career Guides
                  </Link>
                </li>
                <li className="mb-4">
                  <Link
                    className="text-base font-medium text-white/90 transition-all duration-200 hover:font-semibold hover:text-white"
                    to="/contact"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-base font-medium text-white/90 transition-all duration-200 hover:font-semibold hover:text-white"
                    to="/feedback"
                  >
                    Feedback
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="w-full p-6 md:w-1/2 lg:w-3/12">
            <div className="h-full">
              <h3 className="mb-5 text-sm font-bold uppercase tracking-wider text-white">
                Company
              </h3>
              <ul>
                <li className="mb-4">
                  <Link
                    className="text-base font-medium text-white/90 transition-all duration-200 hover:font-semibold hover:text-white"
                    to="/about"
                  >
                    About Us
                  </Link>
                </li>
                <li className="mb-4">
                  <Link
                    className="text-base font-medium text-white/90 transition-all duration-200 hover:font-semibold hover:text-white"
                    to="/privacy"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li className="mb-4">
                  <Link
                    className="text-base font-medium text-white/90 transition-all duration-200 hover:font-semibold hover:text-white"
                    to="/terms"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-base font-medium text-white/90 transition-all duration-200 hover:font-semibold hover:text-white"
                    to="/careers"
                  >
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
