import { Outlet, useLocation } from "react-router-dom";
import "./App.css";
import { Header, Footer } from "./components/index";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";

function App() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  // Only show footer on the home page
  const showFooterRoutes = ["/", "/login", "/signup"];

  // Show footer only if current path matches exactly
  const shouldShowFooter = showFooterRoutes.includes(location.pathname);

  return (
    <div className="flex min-h-screen flex-col bg-transparent">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      {shouldShowFooter && <Footer />}
      <ToastContainer />
    </div>
  );
}

export default App;
