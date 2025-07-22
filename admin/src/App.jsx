import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { Routes, Route } from "react-router-dom";
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

export const backendUrl = import.meta.env.VITE_BACKEND_URL;
export const currency = "AED ";

const App = () => {
  const [token, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : ""
  );
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
            <Sidebar onSidebarToggle={handleSidebarToggle} />
            <div
              className={`flex-1 px-4 md:px-6 py-8 transition-all duration-300 ${
                sidebarOpen ? "ml-16 md:ml-64" : "ml-16"
              }`}
            >
              <Routes>
                <Route path="/" element={<Dashboard token={token} />} />
                <Route path="/add" element={<Add token={token} />} />
                <Route path="/list" element={<List token={token} />} />
                <Route path="/orders" element={<Orders token={token} />} />
                <Route path="/edit/:id" element={<Edit token={token} />} />
                <Route path="/blog" element={<Blog token={token} />} />
                <Route path="/addblog" element={<AddBlog token={token} />} />
                <Route
                  path="/editblog/:id"
                  element={<EditBlog token={token} />}
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
