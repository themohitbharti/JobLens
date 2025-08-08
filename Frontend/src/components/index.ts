// Auth components
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import VerifyOTP from "./auth/VerifyOTP";
import AuthLayout from "./auth/AuthLayout";

// UI components
import Button from "./ui/Button";
import Input from "./ui/Input";
import { Logo } from "./ui/Logo";
import Container from "./ui/Container";

// Common components
import LoadingSpinner from "./common/LoadingSpinner";
import { AppLoader } from "./common/AppLoader";

// Layout components
import Header from "./layout/Header/Header";
import Footer from "./layout/Footer/Footer";
import Sidebar from "./layout/Sidebar";
import Dashboard from "./layout/Dashboard";

// Home component
import Home from "./Home/Home";

// Resume Scan
import ScanStatistics from "./resume/ScanStatistics";
import FeaturesList from "./resume/FeaturesList";
import VisualElements from "./resume/VisualElements";
import ResumeUpload from "./resume/ResumeUpload"
export {
  // Auth
  Login,
  Signup,
  VerifyOTP,
  AuthLayout,

  // UI
  Button,
  Input,
  Logo,
  Container,

  // Common
  AppLoader,
  LoadingSpinner,

  // Layout
  Header,
  Footer,
  Sidebar,
  Dashboard,

  // Home
  Home,

  //Resume Scan
  ScanStatistics,
  FeaturesList,
  VisualElements,
  ResumeUpload
};
