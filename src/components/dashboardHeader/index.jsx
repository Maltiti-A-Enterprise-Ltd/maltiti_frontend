import React, {useEffect, useRef, useState} from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { HiSearch } from "react-icons/hi";
import { AiOutlineClose } from "react-icons/ai";

const DashboardHeader = (props) => {

    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
    const [isNotificationMenuOpen, setIsNotificationMenuOpen] = useState(false)
    const [isSearchOpen, setIsSearchOpen] = useState(false)

    const wrapperRef = useRef(null);
    useEffect(() => {
         //Alert if clicked on outside of element
        function handleClickOutside(event) {
          if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
            setIsProfileMenuOpen(false);
            setIsNotificationMenuOpen(false);
          }
        }
        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
          // Unbind the event listener on clean up
          document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);
  

  // function for toggling profile menu
  const toggleProfileMenu = (event) => {
    setIsProfileMenuOpen(opened => !opened);
  }

  const toggleNotificationMenu = (event) => {
    setIsNotificationMenuOpen(opened => !opened);
  }

  const toggleSearchMenu = (event) => {
    setIsSearchOpen(opened => !opened);
  }

    return(
        <header className="flex-shrink-0 border-b border-green-100">
        <div className="flex items-center justify-between p-2">
            <div className="flex items-center space-x-3">
            <button onClick={props.onClick} className="p-2 rounded-md hover:text-green-100">
                <GiHamburgerMenu size={25}/>
            </button>
            </div>
            <div className="relative flex items-center space-x-3">
            
            <button onClick={toggleSearchMenu}
                className="md:hidden p-2 bg-gray-100 rounded-full focus:outline-none focus:ring hover:bg-gray-200"
            >
                <HiSearch size={20}/>
            </button>

            <div className="items-center space-x-3 md:flex">
                <div className="relative" x-data="{ isOpen: false }">
                
                <div className="absolute right-0 p-1 bg-red-400 rounded-full animate-ping"></div>
                <div className="absolute right-0 p-1 bg-red-400 border rounded-full"></div>
                <button
                    onClick={toggleNotificationMenu} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 focus:outline-none focus:ring"
                >
                    <svg
                    className="w-6 h-6 text-gray-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                    </svg>
                </button>

                <div ref={wrapperRef}
                     className={`${isNotificationMenuOpen ? "" : "hidden"} absolute z-50 w-48 max-w-md mt-3 transform bg-white rounded-md shadow-lg  -translate-x-3/4 min-w-max`}
                >
                    <div className="p-4 font-medium border-b">
                    <span className="text-gray-800">Notification</span>
                    </div>
                    <ul className="flex flex-col p-2 my-2 space-y-1">
                    <li>
                        <a href="#g" className="block px-2 py-1 transition rounded-md hover:bg-gray-100">Link</a>
                    </li>
                    <li>
                        <a href="#g" className="block px-2 py-1 transition rounded-md hover:bg-gray-100">Another Link</a>
                    </li>
                    </ul>
                    <div className="flex items-center justify-center p-4 text-blue-700 underline border-t">
                    <a href="#g">See All</a>
                    </div>
                </div>
                </div>
            </div>
            <div className="relative">
                <button onClick={toggleProfileMenu} className="p-1 bg-gray-200 rounded-full focus:outline-none focus:ring">
                <img
                    className="object-cover w-8 h-8 rounded-full"
                    src="https://avatars0.githubusercontent.com/u/57622665?s=460&u=8f581f4c4acd4c18c33a87b3e6476112325e8b38&v=4"
                    alt="Ahmed Kamel"
                />
                </button>
                <div className="absolute right-0 p-1 bg-green-400 rounded-full bottom-3 animate-ping"></div>
                <div className="absolute right-0 p-1 bg-green-400 border border-white rounded-full bottom-3"></div>

                <div ref={wrapperRef}
                className={`${isProfileMenuOpen ? "" : "hidden"} absolute z-50 w-48 max-w-md mt-3 transform bg-white rounded-md shadow-lg  -translate-x-3/4 min-w-max`}
                >
                <div className="flex flex-col p-4 space-y-1 font-medium border-b">
                    <span className="text-gray-800"></span>
                    <span className="text-sm text-gray-400"></span>
                </div>
                <ul className="flex flex-col p-2 my-2 space-y-1">
                    <li>
                    <a href="#g" className="block px-2 py-1 transition rounded-md hover:bg-gray-100">Settings</a>
                    </li>
                </ul>
                <div className="flex items-center justify-center p-4 text-blue-700 underline border-t">
                    <li className="cursor-pointer list-none" onClick={props.signOut}>Logout</li>
                </div>
                </div>
            </div>
            </div>
        </div>
        </header>
    );
}

export default DashboardHeader;