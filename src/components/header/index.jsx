/* eslint-disable */
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import tw from "twin.macro";
import styled from "styled-components";
import { css } from "styled-components/macro"; //eslint-disable-line
import { Transition } from "@headlessui/react";
import { ReactComponent as MenuIcon } from "feather-icons/dist/icons/menu.svg";
import { ReactComponent as CloseIcon } from "feather-icons/dist/icons/x.svg";
import { AiOutlineShoppingCart } from "react-icons/ai";
import AnchorLink from "react-anchor-link-smooth-scroll";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../images/logo.svg";
import useAnimatedNavToggler from "../../helpers/useAnimatedNavToggler.js";
import { useDispatch, useSelector } from "react-redux";
import {
  Avatar,
  CircularProgress,
  Divider,
  LinearProgress,
  ListItemIcon,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { Logout, Settings } from "@mui/icons-material";
import {
  generateOtp,
  logout,
  savePhoneNumber,
  toggleOpenCodeVerification,
  toggleOpenPhoneVerification,
} from "../../features/user/userSlice";
import {
  getCart,
  removeFromCart,
  updateCartQuantity,
  updateQuantity,
} from "../../features/cart/cartSlice";
import "./index.css";
import DeleteIcon from "@mui/icons-material/Delete";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import Button from "@mui/material/Button";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import InfoIcon from "@mui/icons-material/Info";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import PhoneInput from "react-phone-input-2";
import VerificationInput from "react-verification-input";
import Badge from "@mui/material/Badge";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { stringAvatar } from "../../utility/avatarUtils";
import { modalStyle } from "../../utility/constants";

const Header = tw.header`
  flex justify-between items-center
   mx-auto
`;

export const NavLinks = tw.div`flex justify-center items-center self-center`;

export const NavLink = tw.a`
  text-lg text-black my-2 lg:text-sm lg:mx-6 lg:my-0
  font-semibold tracking-wide transition duration-300
  pb-1 border-b-2 border-transparent hover:border-green-500 hocus:text-green-500
`;

export const PrimaryLink = tw(NavLink)`
  lg:mx-0
  lg:px-8 lg:py-3 px-3 py-1 rounded bg-green-500 text-gray-100
  hocus:bg-green-700 hocus:text-gray-200
  border-b-0 lg:mr-20!
`;

export const LogoLink = styled(NavLink)`
  ${tw`flex items-center font-black border-b-0 text-sm! ml-16!`};

  img {
    ${tw`w-10 mr-2`}
  }
`;

export const MobileNavLinksContainer = tw.nav`flex flex-1 items-center justify-between`;
export const NavToggle = tw.button`
  lg:hidden z-20 focus:outline-none text-green-500 hocus:text-black transition duration-300
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

export function NavBar({
  roundedHeaderButton = false,
  logoLink,
  links,
  className,
  collapseBreakpointClass = "lg",
}) {
  const location = useLocation();
  const user = useSelector((state) => state.user.user);
  const verifyStatus = useSelector((state) => state.user.verifyStatus);
  const generateStatus = useSelector((state) => state.user.generateStatus);
  const cartTotal = useSelector((state) => state.cart.cartTotal);
  const openPhoneVerification = useSelector(
    (state) => state.user.openPhoneVerification,
  );
  const openCodeVerification = useSelector(
    (state) => state.user.openCodeVerification,
  );
  const cart = useSelector((state) => state.cart.cart);
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const shake = useSelector((state) => state.cart.shake);
  const totalPrice = useSelector((state) => state.cart.totalPrice);
  const removeStatus = useSelector((state) => state.cart.removeStatus);
  const addingStatus = useSelector((state) => state.cart.adding);
  const ref = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      dispatch(getCart(user.user.id));
    }
  }, []);

  useEffect(() => {
    shake
      ? ref.current.classList.add("shake")
      : ref.current.classList.remove("shake");
  }, [shake]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const defaultLinks = [
    <NavLinks key={1}>
      {location.pathname === "/" ? (
        <>
          <NavLink>
            <AnchorLink href="#about">About</AnchorLink>
          </NavLink>
          <NavLink>
            <Link to="/shop">Shop</Link>
          </NavLink>
          <NavLink>
            <AnchorLink href="#faqs">Faqs</AnchorLink>
          </NavLink>
          <NavLink>
            <AnchorLink href="#contactus">Contact Us</AnchorLink>
          </NavLink>
        </>
      ) : (
        <>
          <NavLink>
            <Link to="/">Home</Link>
          </NavLink>
          <NavLink></NavLink>
          <NavLink></NavLink>
          <NavLink></NavLink>
          <NavLink></NavLink>
        </>
      )}
    </NavLinks>,
  ];

  const userLinks = [
    <NavLinks>
      {user ? (
        <div>
          {user.user.image ? (
            <Avatar
              onClick={handleClick}
              alt={user.user.name}
              src={user.user.image}
              sx={{ width: 24, height: 24 }}
            />
          ) : (
            <Avatar
              className={"cursor-pointer"}
              onClick={handleClick}
              {...stringAvatar(user.user.name)}
              sx={{ width: 30, height: 30, fontSize: "small" }}
            />
          )}
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                mt: 1.5,
                "& .MuiAvatar-root": {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                "&::before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem onClick={() => navigate("/orders")}>
              <Avatar /> My Orders
            </MenuItem>
            <Divider />
            <MenuItem onClick={() => navigate("/settings")}>
              <ListItemIcon>
                <Settings fontSize="small" />
              </ListItemIcon>
              Settings
            </MenuItem>
            <MenuItem onClick={() => dispatch(logout())}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </div>
      ) : (
        <>
          <NavLink href="/login" tw="lg:ml-12! max-lg:mr-3">
            Login
          </NavLink>
          <PrimaryLink
            css={roundedHeaderButton && tw`rounded-full`}
            href="/signup"
          >
            Sign Up
          </PrimaryLink>
        </>
      )}
    </NavLinks>,
  ];

  const { showNavLinks, animation, toggleNavbar } = useAnimatedNavToggler();
  const collapseBreakpointCss =
    collapseBreakPointCssMap[collapseBreakpointClass];

  const defaultLogoLink = (
    <LogoLink href="/login">
      <img src={logo} alt="logo" />
    </LogoLink>
  );

  logoLink = logoLink || defaultLogoLink;
  links = links || defaultLinks;

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [timer, setTimer] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);

  // function for toggling notification menu
  const toggleCart = (event) => {
    setIsCartOpen((opened) => !opened);
  };

  const handleQuantityUpdate = (id, quantity) => {
    dispatch(
      updateQuantity({
        id,
        quantity,
      }),
    );
    if (timer) {
      clearTimeout(timer);
      setTimer(null);
    }
    setTimer(
      setTimeout(() => {
        dispatch(updateCartQuantity({ id, quantity }));
      }, 1000),
    );
  };

  return (
    <Header
      id="header-shop"
      className={
        className ||
        "header-light border-b-2 fixed z-50 bg-white left-0 right-0 top-0 h-20"
      }
    >
      <Modal
        open={openPhoneVerification}
        onClose={() => dispatch(toggleOpenPhoneVerification())}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        disableEscapeKeyDown={generateStatus === "loading"}
      >
        <Box sx={modalStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Phone Number Verification
          </Typography>
          <p className={"text-xs mb-5"}>
            You need to verify your phone number to continue
          </p>
          <PhoneInput
            specialLabel={"Enter your phone number"}
            country={"gh"}
            inputStyle={{
              borderColor: "green",
            }}
            value={phoneNumber}
            onChange={(phone) => setPhoneNumber(phone)}
          />
          {error && (
            <p className={"text-xs mt-1 text-red-500"}>
              Enter a valid phone number
            </p>
          )}
          <div className={"mt-4"}>
            {generateStatus === "loading" ? (
              <Box sx={{ textAlign: "center", marginTop: "1rem" }}>
                <CircularProgress color={"success"} />
              </Box>
            ) : (
              <Button
                color={"success"}
                variant="contained"
                onClick={() => {
                  if (phoneNumber.length > 10) {
                    setError(false);
                    dispatch(generateOtp(phoneNumber));
                  } else {
                    setError(true);
                  }
                }}
              >
                Verify
              </Button>
            )}
          </div>
        </Box>
      </Modal>
      <Modal
        open={openCodeVerification}
        onClose={() => dispatch(toggleOpenCodeVerification())}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        disableEscapeKeyDown={verifyStatus === "loading"}
      >
        <Box sx={modalStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Phone Number Verification
          </Typography>
          <p className={"text-xs mb-5"}>Enter code to verify</p>
          <VerificationInput
            value={code}
            onChange={(value) => setCode(value)}
          />
          {error && (
            <p className={"text-xs mt-1 text-red-500"}>Enter a valid code</p>
          )}
          <div className={"mt-4"}>
            {verifyStatus === "loading" ? (
              <Box sx={{ textAlign: "center", marginTop: "1rem" }}>
                <CircularProgress color={"success"} />
              </Box>
            ) : (
              <Button
                disabled={code.length !== 6}
                color={"success"}
                variant="contained"
                onClick={() => {
                  if (code.length === 6) {
                    setError(false);
                    dispatch(savePhoneNumber({ phoneNumber, code }));
                  } else {
                    setError(true);
                  }
                }}
              >
                Verify
              </Button>
            )}
          </div>
        </Box>
      </Modal>
      <DesktopNavLinks css={collapseBreakpointCss.desktopNavLinks}>
        {logoLink}
      </DesktopNavLinks>
      <DesktopNavLinks css={collapseBreakpointCss.desktopNavLinks}>
        {links}
      </DesktopNavLinks>
      <MobileNavLinksContainer
        css={collapseBreakpointCss.mobileNavLinksContainer}
      >
        {logoLink}
        <MobileNavLinks
          initial={{ x: "150%", display: "none" }}
          animate={animation}
          css={collapseBreakpointCss.mobileNavLinks}
        >
          {links}
        </MobileNavLinks>
        <NavToggle
          onClick={toggleNavbar}
          className={showNavLinks ? "open ml-[100%] mt-4 w-full" : "closed"}
        >
          {showNavLinks && <CloseIcon tw="w-6 h-6" />}
        </NavToggle>
      </MobileNavLinksContainer>
      <NavLink ref={ref} id="cart" className="cursor-pointer flex border-none">
        {userLinks}{" "}
      </NavLink>
      <NavLink
        ref={ref}
        id="cart"
        className={`${addingStatus === "loading" ? "animate-bounce " : "animate-pulse "} mx-5 cursor-pointer flex border-none`}
        onClick={toggleCart}
      >
        <Badge badgeContent={cartTotal} color="success">
          <ShoppingCartIcon color="action" />
        </Badge>
      </NavLink>
      <div className={"mr-5"}>
        <NavToggle
          onClick={toggleNavbar}
          className={showNavLinks ? "open" : "closed"}
        >
          {!showNavLinks && <MenuIcon tw="w-6 h-6" />}
        </NavToggle>
      </div>
      {isCartOpen ? (
        <Transition
          show={isCartOpen}
          enter="transition transform duration-300"
          enterFrom="translate-x-full opacity-30  ease-in"
          enterTo="translate-x-0 opacity-100 ease-out"
          leave="transition transform duration-300"
          leaveFrom="translate-x-0 opacity-100 ease-out"
          leaveTo="translate-x-full opacity-0 ease-in"
          className="fixed overflow-y-auto inset-y-0 right-0 flex flex-col font-normal bg-white text-black shadow-lg w-144 z-50 max-md:w-96 max-sm:w-72"
          style={{ backdropFilter: "blur(100px)", background: "#cefad0" }}
        >
          <div className={"sticky top-0 bg-white pb-5"}>
            {removeStatus === "loading" && <LinearProgress color="success" />}
            <div className="flex items-center justify-between flex-shrink-0 p-2 ml-[2%]">
              <h6 className="p-2 text-lg">Your cart</h6>
              <button
                className="p-2 rounded-md focus:outline-none focus:ring"
                onClick={toggleCart}
              >
                <svg
                  className="w-6 h-6 text-gray-600 hover:text-red-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            {!!cart.length && (
              <div className={"flex text-lg mb-2 justify-between mx-10"}>
                <span className="flex font-bold">Subtotal</span>
                <div className={"font-bold"}>
                  <span>GH&#8373; {totalPrice}</span>
                </div>
              </div>
            )}
            <div
              className={
                "mx-10 mb-2 gap-x-1 flex items-center justify-center text-xs"
              }
            >
              <InfoIcon color={"error"} fontSize={"small"} />
              <span>
                Shipping or delivery fees will be calculated during checkout
              </span>
            </div>
            <div className={"flex justify-between mx-10"}>
              <span className="uppercase flex">
                <AiOutlineShoppingCart />
                &nbsp;&nbsp;{cartTotal} Products in your cart
              </span>
              {!!cart.length && (
                <div className={""}>
                  <Button
                    color={"success"}
                    variant="contained"
                    endIcon={<ShoppingCartCheckoutIcon />}
                    onClick={() => {
                      if (user.user.phoneNumber) {
                        navigate(`/checkout/${user.user.id}`);
                      } else {
                        dispatch(toggleOpenPhoneVerification());
                      }
                    }}
                  >
                    Checkout
                  </Button>
                </div>
              )}
            </div>
          </div>
          <div className="ml-[2%] flex justify-center items-center max-h-full p-4">
            {!cart.length && <span className="">Your cart is empty</span>}
          </div>
          {!!cart.length && (
            <ul
              role="list"
              className="-my-6 space-y-3 divide-y divide-gray-200"
            >
              {cart.map((item) => (
                <li className="flex rounded-md bg-gray-200 px-3 mx-5 py-6">
                  <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>

                  <div className="ml-4 flex flex-1 flex-col">
                    <div>
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <h3>
                          <a>{item.product.name}</a>
                        </h3>
                        <p className="ml-4 text-sm">
                          GH&#8373; {item.product.retail}
                        </p>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        {item.product.weight}g
                      </p>
                    </div>
                    <div className="flex flex-1 items-end justify-between text-sm">
                      <div className={"space-x-2 items-center flex"}>
                        <span
                          className={
                            "rounded-full hover:bg-green-100 cursor-pointer flex w-full h-full item-center justify-center text-white bg-gray-700"
                          }
                          onClick={() =>
                            handleQuantityUpdate(item.id, item.quantity - 1)
                          }
                        >
                          <RemoveIcon fontSize={"inherit"} />
                        </span>
                        <input
                          value={item.quantity}
                          className={
                            "p-1 rounded-md outline-none w-[30px] text-center"
                          }
                          onChange={(event) =>
                            handleQuantityUpdate(item.id, event.target.value)
                          }
                        />
                        <span
                          onClick={() =>
                            handleQuantityUpdate(item.id, item.quantity + 1)
                          }
                          className={
                            "rounded-full hover:bg-green-100 cursor-pointer flex w-full h-full item-center justify-center text-white bg-gray-700"
                          }
                        >
                          <AddIcon fontSize={"inherit"} />
                        </span>
                      </div>
                      <div className="flex">
                        <button
                          onClick={() => dispatch(removeFromCart(item.id))}
                          type="button"
                          className="font-medium text-red"
                        >
                          <DeleteIcon color={"error"} />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Transition>
      ) : (
        <></>
      )}
    </Header>
  );
}

const collapseBreakPointCssMap = {
  sm: {
    mobileNavLinks: tw`sm:hidden`,
    desktopNavLinks: tw`sm:flex`,
    mobileNavLinksContainer: tw`sm:hidden`,
  },
  md: {
    mobileNavLinks: tw`md:hidden`,
    desktopNavLinks: tw`md:flex`,
    mobileNavLinksContainer: tw`md:hidden`,
  },
  lg: {
    mobileNavLinks: tw`lg:hidden`,
    desktopNavLinks: tw`lg:flex`,
    mobileNavLinksContainer: tw`lg:hidden`,
  },
  xl: {
    mobileNavLinks: tw`lg:hidden`,
    desktopNavLinks: tw`lg:flex`,
    mobileNavLinksContainer: tw`lg:hidden`,
  },
};
