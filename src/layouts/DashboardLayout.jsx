import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <div className="w-full min-h-screen bg-gray-100">
      <Outlet />
    </div>
  );
}