import React from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeftCircle } from "react-icons/fi";
import logo from "../../images/logo.svg";
import missing from "../../images/404.svg";

function Missing() {
  const navigate = useNavigate();
  const goBack = () => navigate(-1);
  return (
    <div>
      {/* <div className="flex flex-col space-y-6 md:space-y-0 md:flex-row justify-between mr-8 mt-8 ml-12"> */}
      <div className="min-h-screen bg-blue-100 flex items-center self-center p-20 overflow-auto relative">
        <div className="flex-1 min-h-full rounded-3xl bg-white shadow-xl p-20 text-gray-800 relative md:flex items-center text-center md:text-left">
          <div className="w-full md:w-1/2">
            <div className="mb-20">
              <img alt="logo" src={logo} width={70} height={70} />
            </div>
            <div className="mb-10 md:mb-20 text-gray-600 font-light">
              <h1 className="font-black uppercase text-3xl lg:text-5xl text-green-100 mb-10">
                You seem to be lost!
              </h1>
              <p>The page you&apos;re looking for isn&apos;t available.</p>
              <p>Try searching again or use the Go Back button below.</p>
            </div>
            <div className="mb-20 md:mb-0">
              <button
                onClick={goBack}
                className="text-xl outline-none transform transition-all flex hover:scale-100 text-green-500 hover:text-black gap-x-2"
              >
                <FiArrowLeftCircle className="self-center" /> Go back
              </button>
            </div>
          </div>
          <div className="w-full md:w-1/2 text-center">
            <img src={missing} alt="404" />
          </div>
        </div>
        <div className="w-64 md:w-96 h-96 md:h-full bg-blue-200 bg-opacity-30 absolute -top-64 md:-top-96 right-20 md:right-32 rounded-full pointer-events-none -rotate-45 transform" />
        <div className="w-96 h-full bg-yellow-200 bg-opacity-20 absolute -bottom-96 right-64 rounded-full pointer-events-none -rotate-45 transform" />
      </div>
    </div>
    // </div>
  );
}

export default Missing;
