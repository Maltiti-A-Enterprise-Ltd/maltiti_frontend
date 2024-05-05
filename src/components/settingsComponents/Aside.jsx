import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

const Aside = () => {
  const [deleteModal, setDeleteModal] = useState(false);
  const dispatch = useDispatch();
  const status = "idle";
  const role = "user";

  return (
    <ul className="flex lg:w-full lg:max-w-max bg-gray-100 w-60 border-r-2 shadow-md rounded-lg p-2 mr-4 gap-y-5 flex-col border-[#EAECF0]">
      <li className={"border-b cursor-pointer border-gray-500"}>
        <NavLink
          to="general"
          style={({ isActive }) =>
            isActive ? { backgroundColor: "#cefad0" } : undefined
          }
          className="flex p-2 space-x-2 rounded-md hover:bg-[#cefad0] hover:text-primary"
        >
          <span>General</span>
        </NavLink>
      </li>
      <li className={"border-b cursor-pointer border-gray-500"}>
        <NavLink
          to="change-password"
          style={({ isActive }) =>
            isActive ? { backgroundColor: "#cefad0" } : undefined
          }
          className="flex p-2 space-x-2 rounded-md hover:bg-[#cefad0] hover:text-primary"
        >
          <span>Change Password</span>
        </NavLink>
      </li>
      {/*<li className={"border-b cursor-pointer border-gray-500"}>*/}
      {/*  <NavLink*/}
      {/*    to="orders"*/}
      {/*    style={({ isActive }) =>*/}
      {/*      isActive ? { backgroundColor: "#cefad0" } : undefined*/}
      {/*    }*/}
      {/*    className="flex p-2 space-x-2 rounded-md hover:bg-[#cefad0] hover:text-primary"*/}
      {/*  >*/}
      {/*    <span>My Orders</span>*/}
      {/*  </NavLink>*/}
      {/*</li>*/}
      <li
        className={"border-b cursor-pointer border-gray-500"}
        onClick={() => setDeleteModal(true)}
      >
        <div className="flex p-2 text-[#FC3115] space-x-2 rounded-md hover:bg-[#cefad0] hover:text-primary">
          <span>Delete Account</span>
        </div>
      </li>
    </ul>
  );
};

export default Aside;
