import { Outlet } from "react-router-dom";
import {Sidebar} from "../components/index";

const DashboardLayout = () => (
  <div className="flex h-screen bg-gray-50">
    <Sidebar />
    <div className="flex flex-1 flex-col overflow-hidden">
      <main className="flex-1 overflow-y-auto p-6">
        <Outlet />
      </main>
    </div>
  </div>
);

export default DashboardLayout;

