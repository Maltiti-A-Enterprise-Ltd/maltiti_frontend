import React from "react";
import { AiFillHome, AiOutlineClose } from "react-icons/ai";
import { MdLogout, MdOutlineProductionQuantityLimits } from "react-icons/md";
import { NavLink } from "react-router-dom";
import Logo from "../logo";


export const Aside = (props) => {
    return(
        <aside className={`fixed inset-y-0 z-10 flex flex-col flex-shrink-0 w-64 max-h-screen overflow-hidden transition-all transform bg-white border-green-100 border-r shadow-lg  lg:z-auto lg:static lg:shadow-none ${props.isSideBarOpen ? "" : "w-20"}`}>
        <div className={`flex items-center justify-between flex-shrink-0 p-2 ${props.isSideBarOpen ? "" : "lg:justify-center"}`}>
          <span className={`p-2 ${props.isSideBarOpen ? "ml-16" : ""}`}>
            <span><Logo/></span>
          </span>
          <button onClick={props.onClick} className={`${props.isSideBarOpen ? "max-[1024px]:relative" : "hidden"} p-2 rounded-md lg:hidden`}>
            <AiOutlineClose size={20}/>
          </button>
        </div>
        <nav className="flex-1 overflow-hidden hover:overflow-y-auto">
          <ul className="p-3 overflow-hidden">
            <li>
              <NavLink
                to="home"
                style={({ isActive }) => isActive ? {color:"white", backgroundColor:"#0F6938"} : undefined}
                className={`${props.isSideBarOpen ? "justify-start" : "justify-center"} flex items-center p-2 text-xl space-x-2 rounded-md hover:bg-green-100 hover:text-white`}
              >
                <span>
                <AiFillHome size={25}/>
                </span>
                <span className={`${props.isSideBarOpen ? "" : "hidden"}`}>Home</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="products"
                style={({ isActive }) => isActive ? {color:"white", backgroundColor:"#0F6938"} : undefined}
                className={`${props.isSideBarOpen ? "justify-start" : "justify-center"} flex items-center p-2 text-xl space-x-2 rounded-md hover:bg-green-100 hover:text-white`}
              >
                <span>
                <MdOutlineProductionQuantityLimits size={25}/>
                </span>
                <span className={`${props.isSideBarOpen ? "" : "hidden"}`}>Prdocuts</span>
              </NavLink>
            </li>
          </ul>
        </nav>
       
        <div className="flex-shrink-0 p-2 border-t max-h-14">
          <button
            onClick={props.logout}
            className="flex items-center justify-center w-full px-4 py-2 space-x-1 font-medium tracking-wider uppercase bg-gray-100 border rounded-md  focus:outline-none focus:ring"
          >
            <span>
              <MdLogout size={25}/>
            </span>
            <span className={`${props.isSideBarOpen ? "" : "hidden"}`}> Logout </span>
          </button>
        </div>
      </aside>
    );
}
