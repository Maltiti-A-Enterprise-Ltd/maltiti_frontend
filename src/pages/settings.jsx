import { NavBar } from "../components/header";
import AnimationRevealPage from "../helpers/AnimationRevealPage";
import ProfilePicture from "../components/settingsComponents/profilePicture";
import Aside from "../components/settingsComponents/Aside";
import { Route, Routes } from "react-router-dom";
import General from "../components/settingsComponents/General";
import Orders from "../components/settingsComponents/Orders";

const Settings = () => {
  return (
    <div>
      <NavBar />
      <AnimationRevealPage>
        <div className="grid grid-flow-row items-center justify-center mt-20 mb-10">
          <ProfilePicture />
          <div className="w-full flex">
            <Aside />
            <Routes>
              <Route path="/general" index={true} element={<General />} />
              {/*<Route path="/orders" element={<Orders />} />*/}
            </Routes>
          </div>
        </div>
      </AnimationRevealPage>
    </div>
  );
};

export default Settings;
