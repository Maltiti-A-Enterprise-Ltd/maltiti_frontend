import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, CircularProgress } from "@mui/material";
import { stringAvatar } from "../../utility/avatarUtils";

const ProfilePicture = (props) => {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const status = "idle";
  const handleFileSelect = (event) => {
    const image = event.target.files[0];
  };

  return (
    <div>
      <div className="flex items-center flex-row gap-x-6">
        <div className="align-middle rounded-full border-4 border-[white] shadow-sm focus:shadow-outline-purple focus:outline-none">
          {user.user.image ? (
            <Avatar
              alt={user.user.name}
              src={user.user.image}
              sx={{ width: 40, height: 24 }}
            />
          ) : (
            <Avatar
              className={"cursor-pointer"}
              {...stringAvatar(user.user.name)}
              sx={{ width: 90, height: 90, fontSize: "40px" }}
            />
          )}
        </div>
        <div className="">
          <h5 className="text-xl min-w-full max-md:text-lg max-sm:text-md font-bold">
            {user.user.name}
          </h5>
          <p className="font-light text-sm">{user.user.email}</p>
        </div>
      </div>
      <div className="mt-4 ml-4 mb-8 text-primary">
        {status === "loading" ? (
          <CircularProgress color="inherit" />
        ) : (
          <label
            htmlFor="profile-pic"
            className="bg-green-100 text-xs hover:bg-[black] text-[white] px-4 py-2 rounded-md cursor-pointer"
          >
            Upload Profile Picture
          </label>
        )}
        <input
          id="profile-pic"
          type="file"
          className="hidden"
          onChange={handleFileSelect}
          accept="image/*"
        />
      </div>
    </div>
  );
};

export default ProfilePicture;
