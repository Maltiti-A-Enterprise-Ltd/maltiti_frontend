import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Route, Routes, useNavigate } from "react-router-dom";
import { logOut } from "../actions";
import { Aside } from "../components/aside";
import DashboardHeader from "../components/dashboardHeader";
import Products from "../components/products";
import Home from "../components/home";
import Missing from "../components/missing";

const Dashboard = () => {
    const dispatch = useDispatch()
    const [isSideBarOpen, setIsSideBarOpen] = useState(false)
    const navigate = useNavigate()

    const hamburger = () => {
        setIsSideBarOpen(opened => !opened)
    }

    const logout = () => {
        localStorage.removeItem('maltiti-token')
        localStorage.removeItem('maltiti-user')
        dispatch(logOut())
        navigate("/")
    }
    
    return(
        <div className="antialiased text-gray-900 bg-white">
            <div className="flex h-screen overflow-y-hidden bg-white">
                <Aside isSideBarOpen={isSideBarOpen} onClick={hamburger} logout={logout}/>
                <div className="flex flex-col flex-1 h-full overflow-hidden">
                    <DashboardHeader onClick={hamburger} isSideBarOpen={isSideBarOpen} logout={logout}/>
                    <Routes>
                        <Route path="/home" element={<Home/>}></Route>
                        <Route path="/products" element={<Products/>}/>
                        <Route path="/*" element={<Missing />} />
                    </Routes>
                </div>
            </div>
        </div>
        
    );
}

export default Dashboard;