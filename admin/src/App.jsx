import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { Routes, Route, Navigate } from "react-router-dom";
import Add from "./pages/Add";
import List from "./pages/List";
import Orders from "./pages/Orders";
import { useState } from "react";
import Login from "./components/Login";
import { ToastContainer } from "react-toastify";
import { useEffect } from "react";
import Edit from "./pages/Edit";
import Dashboard from "./pages/Dashboard";
import Blog from "./pages/Blog";
import AddBlog from "./pages/AddBlog";
import EditBlog from "./pages/EditBlog";
import ContactSubmissions from "./pages/ContactSubmissions";
import StitchingRequests from "./pages/StitchingRequests";

export const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
export const currency = "AED ";

const decodeRoleFromToken = (token) => {
  try {
    const payload = token.split(".")[1];
    if (!payload) return "super_admin";
    const decoded = JSON.parse(atob(payload));
    return decoded?.role || "super_admin";
  } catch {
    return "super_admin";
  }
};

const hasRoleAccess = (role, allowedRoles = []) =>
  allowedRoles.length === 0 || allowedRoles.includes(role);

const App = () => {
  const [token, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : ""
  );
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const role = decodeRoleFromToken(token);

  useEffect(() => {
    localStorage.setItem("token", token);
  }, [token]);

  const handleSidebarToggle = (isOpen) => {
    setSidebarOpen(isOpen);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <ToastContainer />
      {token === "" ? (
        <Login setToken={setToken} />
      ) : (
        <>
          <Navbar setToken={setToken} />
          <div className="flex w-full">
            <Sidebar onSidebarToggle={handleSidebarToggle} role={role} />
            <div
              className={`flex-1 px-4 md:px-6 py-8 transition-all duration-300 ${
                sidebarOpen ? "ml-16 md:ml-64" : "ml-16"
              }`}
            >
              <Routes>
                <Route path="/" element={<Dashboard token={token} />} />
                <Route path="/add" element={hasRoleAccess(role, ["super_admin", "inventory_manager"]) ? <Add token={token} /> : <Navigate to="/" replace />} />
                <Route path="/list" element={hasRoleAccess(role, ["super_admin", "inventory_manager"]) ? <List token={token} /> : <Navigate to="/" replace />} />
                <Route path="/orders" element={hasRoleAccess(role, ["super_admin", "operations_manager"]) ? <Orders token={token} /> : <Navigate to="/" replace />} />
                <Route path="/contact-submissions" element={hasRoleAccess(role, ["super_admin", "operations_manager", "content_manager"]) ? <ContactSubmissions token={token} /> : <Navigate to="/" replace />} />
                <Route path="/stitching-requests" element={hasRoleAccess(role, ["super_admin", "operations_manager"]) ? <StitchingRequests token={token} /> : <Navigate to="/" replace />} />
                <Route path="/edit/:id" element={hasRoleAccess(role, ["super_admin", "inventory_manager"]) ? <Edit token={token} /> : <Navigate to="/" replace />} />
                <Route path="/blog" element={hasRoleAccess(role, ["super_admin", "content_manager"]) ? <Blog token={token} /> : <Navigate to="/" replace />} />
                <Route path="/addblog" element={hasRoleAccess(role, ["super_admin", "content_manager"]) ? <AddBlog token={token} /> : <Navigate to="/" replace />} />
                <Route
                  path="/editblog/:id"
                  element={hasRoleAccess(role, ["super_admin", "content_manager"]) ? <EditBlog token={token} /> : <Navigate to="/" replace />}
                />
              </Routes>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
