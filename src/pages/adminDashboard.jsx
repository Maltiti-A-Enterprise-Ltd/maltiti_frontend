import React, { useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Aside from "../components/aside";
import DashboardHeader from "../components/dashboardHeader";
import Products from "../components/products";
import Home from "../components/home";
import Missing from "../components/missing";
import useLogout from "../utility/useLogout";

function Dashboard() {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const navigate = useNavigate();
  const logout = useLogout();

  const hamburger = () => {
    setIsSideBarOpen((opened) => !opened);
  };

  const signOut = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="antialiased text-gray-900 bg-white">
      <div className="flex h-screen overflow-y-hidden bg-white">
        <Aside
          isSideBarOpen={isSideBarOpen}
          onClick={hamburger}
          signOut={() => signOut()}
        />
        <div className="flex flex-col flex-1 h-full overflow-hidden">
          <DashboardHeader
            onClick={hamburger}
            isSideBarOpen={isSideBarOpen}
            signOut={() => signOut()}
          />
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/*" element={<Missing />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
