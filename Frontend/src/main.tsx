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
  ResumeScanResult, // Add this import
  SectionAnalysisDetail,
  // VerifyOTP,
  // UploadItem,
  // ProductDetails,
  // UserProfile,
  // UserProducts,
} from "./pages/index.ts";
import { AuthProvider } from "./contexts/AuthProvider.tsx";
// import Categories from "./pages/Discover.tsx";
import { Toaster } from "react-hot-toast";

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
            element: <div>Resume Stats Coming Soon</div>,
          },
          {
            path: "/compare-resumes",
            element: <div>Compare Resumes Coming Soon</div>,
          },
          {
            path: "/linkedin-builder",
            element: <div>LinkedIn Builder Coming Soon</div>,
          },
          {
            path: "/compare-linkedin",
            element: <div>Compare LinkedIn Coming Soon</div>,
          },
          {
            path: "/linkedin-stats",
            element: <div>LinkedIn Stats Coming Soon</div>,
          },
          {
            path: "/settings",
            element: <div>Settings Coming Soon</div>,
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
