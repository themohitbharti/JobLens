// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store.ts";
import "./index.css";
import App from "./App.tsx";
import { AuthLayout, Dashboard } from "./components/index.ts";
import {
  Home,
  Login,
  Signup,
  DashboardLayout,
  ResumeScan,
  ResumeScanResult,
  SectionAnalysisDetail,
  LinkedinStats,
  ResumeCompare,
  ResumeCompareResult,
  LinkedinCompare,
  LinkedinScan,
  LinkedinScanResult,
  LinkedinSectionAnalysisDetail,
  LinkedinCompareResult,
  Settings,
  // VerifyOTP,
  // UploadItem,
  // ProductDetails,
  // UserProfile,
  // UserProducts,
} from "./pages/index.ts";
import { AuthProvider } from "./contexts/AuthProvider.tsx";
// import Categories from "./pages/Discover.tsx";
import { Toaster } from "react-hot-toast";
import { ResumeStats } from "./pages/index.ts";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: (
          <AuthLayout authentication={false}>
            <Home />
          </AuthLayout>
        ),
      },
      {
        path: "/login",
        element: (
          <AuthLayout authentication={false}>
            <Login />
          </AuthLayout>
        ),
      },
      {
        path: "/signup",
        element: (
          <AuthLayout authentication={false}>
            <Signup />
          </AuthLayout>
        ),
      },
      // Dashboard routes with permanent sidebar
      {
        path: "/",
        element: (
          <AuthLayout authentication={true}>
            <DashboardLayout />
          </AuthLayout>
        ),
        children: [
          {
            path: "/dashboard",
            element: <Dashboard />,
          },
          {
            path: "/resume-scan",
            element: <ResumeScan />,
          },
          {
            path: "/resume-scan-result/:scanId",
            element: <ResumeScanResult />,
          },
          {
            path: "/resume-scan-result/:scanId/section/:sectionName",
            element: <SectionAnalysisDetail />,
          },
          // Add more dashboard routes here
          {
            path: "/resume-stats",
            element: <ResumeStats />,
          },
          {
            path: "/compare-resumes",
            element: <ResumeCompare />,
          },
          {
            path: "/compare-resume-result",
            element: <ResumeCompareResult />,
          },
          {
            path: "/linkedin-builder",
            element: <LinkedinScan />,
          },
          {
            path: "/linkedin-builder-result/:scanId",
            element: <LinkedinScanResult />,
          },
          {
            path: "/linkedin-builder-result/:scanId/section/:sectionName",
            element: <LinkedinSectionAnalysisDetail />,
          },
          {
            path: "/compare-linkedin",
            element: <LinkedinCompare />,
          },
          {
            path: "/compare-linkedin-result",
            element: <LinkedinCompareResult />,
          },
          {
            path: "/linkedin-stats",
            element: <LinkedinStats />,
          },
          {
            path: "/settings",
            element: <Settings />,
          },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster position="bottom-right" />
    </AuthProvider>
  </Provider>,
);
