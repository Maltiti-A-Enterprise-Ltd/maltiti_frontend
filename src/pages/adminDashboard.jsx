import { Button } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Aside } from "../components/aside";
import DashboardHeader from "../components/dashboardHeader";

const Dashboard = () => {
    const [isSideBarOpen, setIsSideBarOpen] = useState(false)
    const user = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate()

    const hamburger = () => {
        setIsSideBarOpen(opened => !opened)
    }

    const logout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        navigate("/")
    }
    
    return(
        <div className="antialiased text-gray-900 bg-white">
            <div
                className="flex h-screen overflow-y-hidden bg-white"
                x-data="setup()"
                x-init="$refs.loading.classList.add('hidden')"
            >
                {/* <div x-ref="loading" class="fixed inset-0 z-[200] flex items-center justify-center text-white bg-black bg-opacity-50"
                    style={{backdropFilter:"blur(14px)"}}
                >
                    Loading.....
                </div>
                <div class="fixed inset-0 z-10 bg-black bg-opacity-20 lg:hidden"
                    style={{backdropFilter:"blur(14px)"}}
                ></div> */}
                <Aside isSideBarOpen={isSideBarOpen}/>
                <div className="flex flex-col flex-1 h-full overflow-hidden">
                    <DashboardHeader onClick={hamburger} isSideBarOpen={isSideBarOpen}/>
                </div>
            </div>
        {/* Welcome to Admin Dashboard<br/>
        Name: {user['name']} <br/>
        Email: {user['email']}<br/>
        Role: {user['roles'][0]}<br/>
        <Button onClick={logout}>Logout</Button> */}
        </div>
        
    );
}

export default Dashboard;