import React, { useState } from "react";
import { motion } from "framer-motion";
import tw from "twin.macro";
import styled from "styled-components";
import { css } from "styled-components/macro"; //eslint-disable-line
import { Transition } from "@headlessui/react";
import useAnimatedNavToggler from "../../helpers/useAnimatedNavToggler.js";
import logo from "../../images/logo.svg";
import { ReactComponent as MenuIcon } from "feather-icons/dist/icons/menu.svg";
import { ReactComponent as CloseIcon } from "feather-icons/dist/icons/x.svg";
import { AiOutlineShoppingCart } from "react-icons/ai"
import AnchorLink from "react-anchor-link-smooth-scroll";

const Header = tw.header`
  flex justify-between items-center
   mx-auto
`;

export const NavLinks = tw.div`inline-block`;

export const NavLink = tw.a`
  text-lg text-black my-2 lg:text-sm lg:mx-6 lg:my-0
  font-semibold tracking-wide transition duration-300
  pb-1 border-b-2 border-transparent hover:border-green-500 hocus:text-green-500
`;

export const PrimaryLink = tw(NavLink)`
  lg:mx-0
  px-8 py-3 rounded bg-green-500 text-gray-100
  hocus:bg-green-700 hocus:text-gray-200
  border-b-0 lg:mr-20!
`;

export const LogoLink = styled(NavLink)`
  ${tw`flex items-center font-black border-b-0 text-sm! ml-16!`};

  img {
    ${tw`w-16 mr-2`}
  }
`;

export const MobileNavLinksContainer = tw.nav`flex flex-1 items-center justify-between`;
export const NavToggle = tw.button`
  lg:hidden mr-20 z-20 focus:outline-none text-green-500 hocus:text-black transition duration-300
`;
export const MobileNavLinks = motion(styled.div`
  ${tw`fixed inset-x-0 top-0 z-10 p-8 mx-4 my-6 text-center text-gray-900 bg-white border rounded-lg lg:hidden`}
  ${NavLinks} {
    ${tw`flex flex-col items-center`}
  }
`);

export const DesktopNavLinks = tw.nav`
  hidden lg:flex flex-1 justify-between items-center
`;

export const NavBar = ({ roundedHeaderButton = false, logoLink, links, className, collapseBreakpointClass = "lg" }) => {

  const defaultLinks = [
    <NavLinks key={1}>
      <NavLink><AnchorLink href="#about">About</AnchorLink></NavLink>
      <NavLink><AnchorLink href="#shop">Shop</AnchorLink></NavLink>
      <NavLink><AnchorLink href="#faqs">Faqs</AnchorLink></NavLink>
      <NavLink><AnchorLink href="#contactus">Contact Us</AnchorLink></NavLink>
      <NavLink href="/login" tw="lg:ml-12!">
        Login
      </NavLink>
      <PrimaryLink css={roundedHeaderButton && tw`rounded-full`}href="/signup">Sign Up</PrimaryLink>
    </NavLinks>
  ];

  const { showNavLinks, animation, toggleNavbar } = useAnimatedNavToggler();
  const collapseBreakpointCss = collapseBreakPointCssMap[collapseBreakpointClass];

  const defaultLogoLink = (
    <LogoLink href="/login">
      <img src={logo} alt="logo" />
    </LogoLink>
  );

  logoLink = logoLink || defaultLogoLink;
  links = links || defaultLinks;

  const [isCartOpen, setIsCartOpen] = useState(false);

  // function for toggling notification menu
  const toggleCart = (event) => {
    setIsCartOpen(opened => !opened)
  }

  return (
    <Header className={className || "header-light border-b-2 fixed z-50 bg-white left-0 right-0 top-0 h-32"}>
      <DesktopNavLinks css={collapseBreakpointCss.desktopNavLinks}>
        {logoLink}
        {links}
      </DesktopNavLinks>
      <MobileNavLinksContainer css={collapseBreakpointCss.mobileNavLinksContainer}>
        {logoLink}
        <MobileNavLinks initial={{ x: "150%", display: "none" }} animate={animation} css={collapseBreakpointCss.mobileNavLinks}>
          {links}
        </MobileNavLinks>
        <NavToggle onClick={toggleNavbar} className={showNavLinks ? "open" : "closed"}>
          {showNavLinks ? <CloseIcon tw="w-6 h-6" /> : <MenuIcon tw="w-6 h-6" />}
        </NavToggle>
      </MobileNavLinksContainer>
      <NavLink href="#g" className="mr-[5%] flex border-none" onClick={toggleCart}>
        <span aria-hidden="true" className="inline-block w-5 h-5 leading-tight text-center transform translate-x-12 translate-y-0 bg-red-600 rounded-full">
            0
        </span>
        <AiOutlineShoppingCart size={40}/>
      </NavLink>
      {isCartOpen ?
        <Transition
          show={isCartOpen}
          enter="transition transform duration-300"
          enterFrom="translate-x-full opacity-30  ease-in"
          enterTo="translate-x-0 opacity-100 ease-out"
          leave="transition transform duration-300"
          leaveFrom="translate-x-0 opacity-100 ease-out"
          leaveTo="translate-x-full opacity-0 ease-in"
          className="fixed inset-y-0 right-0 z-50 flex flex-col font-normal text-black bg-white shadow-lg w-144 max-md:w-96 max-sm:w-72"
          // style={{backdropFilter:"blur(14px)"}}
        >
          <div className="flex items-center justify-between flex-shrink-0 p-2 ml-[2%]">
            <h6 className="p-2 text-lg">Your cart</h6>
            <button className="p-2 rounded-md focus:outline-none focus:ring" onClick={toggleCart}>
              <svg
                className="w-6 h-6 text-gray-600 hover:text-red-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <span className="ml-[4%] uppercase flex"><AiOutlineShoppingCart/>&nbsp;&nbsp;0 Products in your cart</span>
          <div className="ml-[2%] flex justify-center items-center max-h-full p-4 overflow-hidden hover:overflow-y-scroll">           
              <span className="">Your cart is empty</span> 
              {/* Todo */}
          </div>
        </Transition>
        :
        <></>
      }
    </Header>
  );
};

const collapseBreakPointCssMap = {
  sm: {
    mobileNavLinks: tw`sm:hidden`,
    desktopNavLinks: tw`sm:flex`,
    mobileNavLinksContainer: tw`sm:hidden`
  },
  md: {
    mobileNavLinks: tw`md:hidden`,
    desktopNavLinks: tw`md:flex`,
    mobileNavLinksContainer: tw`md:hidden`
  },
  lg: {
    mobileNavLinks: tw`lg:hidden`,
    desktopNavLinks: tw`lg:flex`,
    mobileNavLinksContainer: tw`lg:hidden`
  },
  xl: {
    mobileNavLinks: tw`lg:hidden`,
    desktopNavLinks: tw`lg:flex`,
    mobileNavLinksContainer: tw`lg:hidden`
  }
};
