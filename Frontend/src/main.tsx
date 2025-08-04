// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store.ts";
import "./index.css";
import App from "./App.tsx";
import { AuthLayout } from "./components/index.ts";
import {
  Home,
  Login,
  Signup,
  DashboardLayout,
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
      {
        path: "/Dashboard",
        element: (
          <AuthLayout authentication={true}>
            <DashboardLayout />
          </AuthLayout>
        ),
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
    </Provider>
);
