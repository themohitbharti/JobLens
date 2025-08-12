import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "../components/index";
import { useEffect, useRef } from "react";

const DashboardLayout = () => {
  const location = useLocation();
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Scroll the main content container to top
    if (mainRef.current) {
      mainRef.current.scrollTo(0, 0);
    }
  }, [location]);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <main ref={mainRef} className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
