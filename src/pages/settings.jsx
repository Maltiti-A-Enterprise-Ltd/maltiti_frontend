import { NavBar } from "../components/header";
import AnimationRevealPage from "../helpers/AnimationRevealPage";
// import ProfilePicture from "../components/settingsComponents/profilePicture";
// import Aside from "../components/settingsComponents/Aside";
// import { Route, Routes } from "react-router-dom";
// import General from "../components/settingsComponents/General";
// import Orders from "../components/settingsComponents/Orders";
import Box from "@mui/material/Box";
import * as React from "react";
import { Tab, Tabs } from "@mui/material";

const Settings = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <div>
      <NavBar />
      <AnimationRevealPage>
        {/*  <div className="grid grid-flow-row items-center justify-center mt-20 mb-10">*/}
        {/*    <ProfilePicture />*/}
        {/*    <div className="w-full flex">*/}
        {/*      <Aside />*/}
        {/*      <Routes>*/}
        {/*        <Route path="/general" index={true} element={<General />} />*/}
        {/*        /!*<Route path="/orders" element={<Orders />} />*!/*/}
        {/*      </Routes>*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*</AnimationRevealPage>*/}
        <div className="mt-20">
          <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              textColor="primary"
              indicatorColor="primary"
              centered
            >
              <Tab label="Item One" />
              <Tab label="Item Two" />
              <Tab label="Item Three" />
            </Tabs>
          </Box>
        </div>
      </AnimationRevealPage>
    </div>
  );
};

export default Settings;
