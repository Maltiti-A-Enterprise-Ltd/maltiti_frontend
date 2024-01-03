/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getCartTotal,
  removeToCart,
  decreaseItemQuantity,
  increaseItemQuantity,
} from "../../redux/cartSlice";
//import swal from "sweetalert";
import { Link } from "react-router-dom";

const Cart = () => {
  const dispatch = useDispatch();

  const { cart, totalQuantity, totalPrice } = useSelector(
    (state) => state.allCart
  );

  useEffect(() => {
    dispatch(getCartTotal());
  }, [cart, dispatch]);

  const handleRemove = (id) => {
    // swal({
    //   title: "Are you sure?",
    //   text: "You want delete it?,No problem,Add other Products!",
    //   icon: "warning",
    //   buttons: true,
    //   dangerMode: true,
    // }).then((willDelete) => {
    //   if (willDelete) {
    //     dispatch(removeToCart(id));
    //     swal("Poof! Your Product has been deleted!", {
    //       icon: "success",
    //     });
    //   } else {
    //     swal("Your Product is safe, Enjoy Shopping!");
    //   }
    // });
  };

  return (
    <>
      <section className="h-full bg-back-color">
        <div className="pt-20">
          <div className="container flex justify-around">
            <h1 className="mt-5 mb-5 mr-10 text-2xl font-bold">
              <Link to="/">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  fill="none"
                  viewBox="0 0 24 24"
                  id="left-arrow"
                >
                  <path
                    fill="#000"
                    fillRule="evenodd"
                    d="M12 3.5C16.6944 3.5 20.5 7.30558 20.5 12C20.5 16.6944 16.6944 20.5 12 20.5C7.30558 20.5 3.5 
         16.6944 3.5 12C3.5 7.30558 7.30558 3.5 12 3.5ZM21.5 12C21.5 6.75329 17.2467 2.5 12 2.5C6.75329
          2.5 2.5 6.75329 2.5 12C2.5 17.2467 6.75329 21.5 12 21.5C17.2467 21.5 21.5 17.2467 21.5 12Z"
                    clipRule="evenodd"
                  ></path>
                  <path
                    fill="#000"
                    fillRule="evenodd"
                    d="M17.5 12C17.5 11.7239 
          17.2761 11.5 17 11.5H7.5C7.22386 11.5 7 11.7239 7 12C7 12.2761 7.22386 12.5 7.5 12.5H17C
          17.2761 12.5 17.5 12.2761 17.5 12Z"
                    clipRule="evenodd"
                  ></path>
                  <path
                    fill="#000"
                    fillRule="evenodd"
                    d="M10.8536 8.14645C10.6583 7.95118 10.3417 7.95118 10.1464 8.14645L6.64645 11.6464C6.45118 11.8417 6.45118 12.1583 6.64645 12.3536L10.1464 15.8536C10.3417 16.0488 10.6583 16.0488 10.8536 15.8536C11.0488 15.6583 11.0488 15.3417 10.8536 15.1464L7.70711 12L10.8536 8.
        85355C11.0488 8.65829 11.0488 8.34171 10.8536 8.14645Z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </Link>
            </h1>
            <h1 className="mt-5 mb-5 text-2xl font-bold text-center">
              Cart Items
            </h1>
          </div>
          <div className="justify-center max-w-5xl px-6 mx-auto md:flex md:space-x-6 xl:px-0">
            <div className="rounded-lg md:w-2/3 ">
              {cart.map((ele) => (
                <div className="justify-between p-6 mb-6 rounded-lg shadow-md bg-ince sm:flex sm:justify-start">
                  <img
                    alt=""
                    src={ele.image} ///imageSrc
                    className="w-full rounded-lg sm:w-40"
                  />
                  <div className="sm:ml-4 sm:flex sm:w-full sm:justify-between">
                    <div className="mt-5 sm:mt-0">
                      <h2 className="text-2xl font-bold text-totalCard">
                        {ele.title}
                      </h2>

                      <p
                        className="mt-3 bg-blue-100 hover:bg-blue-200 text-blue-800 text-xs font-semibold mr-2 
                    px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-blue-400 border border-blue-400 inline-flex
                     items-center justify-center"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5"
                          viewBox="0 0 30 30"
                          id="rupee"
                        >
                          <path
                            fill="none"
                            stroke="#000"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M20 6H10M20 11H10M10 6h2a5 5 0 0 1 5 5h0a5 5 0 0 1-5 5h-2l8 8"
                          ></path>
                        </svg>
                        {ele.price}
                      </p>
                    </div>
                    <div className="flex justify-between mt-4 sm:space-y-6 sm:block sm:space-x-6">
                      <button
                        className="flex justify-center px-4 py-2 mr-0 text-base font-bold transition duration-200 ease-in-out border border-red-600 rounded cursor-pointer md:w-auto undefined hover:scale-110 focus:outline-none hover:bg-red-700 hover:text-teal-100 bg-white-100 text-black-700"
                        onClick={() => handleRemove(ele.id)}
                      >
                        Remove
                      </button>

                      <div className="flex items-center border-gray-100">
                        <span
                          className="cursor-pointer rounded-l bg-gray-100 py-1 px-3.5 duration-100 hover:bg-bgbtn hover:text-blue-50"
                          onClick={() => dispatch(decreaseItemQuantity(ele.id))}
                        >
                          {" "}
                          -{" "}
                        </span>
                        <input
                          className="w-8 h-8 text-xs text-center bg-white border outline-none"
                          type="number"
                          value={ele.quantity}
                          min="1"
                        />
                        <span
                          className="px-3 py-1 duration-100 bg-gray-100 rounded-r cursor-pointer hover:bg-bgbtn hover:text-blue-50"
                          onClick={() => dispatch(increaseItemQuantity(ele.id))}
                        >
                          {" "}
                          +{" "}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="h-full p-6 mt-6 border rounded-lg shadow-md bg-totalCard md:mt-0 md:w-1/3">
              <div className="flex justify-between mb-2">
                <p className="text-gray-700 head">Subtotal</p>
                <p className="text-gray-700 head">{totalQuantity}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-700 head">Shipping</p>
                <p className="text-gray-700 head">0</p>
              </div>
              <hr className="my-4" />
              <div className="flex justify-between">
                <p className="text-lg font-bold head">Total</p>
                <div className="mr-0">
                  <p className="flex justify-end mb-1 text-lg font-bold head">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5"
                      viewBox="0 0 24 24"
                      id="ghana-cedi"
                    >
                      <text
                        x="50%"
                        y="50%"
                        text-anchor="middle"
                        alignment-baseline="middle"
                        font-size="16"
                        font-weight="bold"
                      >
                        ₵
                      </text>
                    </svg>

                    <span className="text-2xl"> {totalPrice}</span>
                  </p>
                  {/* <p className="text-sm text-gray-700 head">maltiti</p> */}
                </div>
              </div>
              <button className="flex justify-center w-full px-4 py-2 mt-6 text-base font-bold text-white transition duration-200 ease-in-out bg-green-500 border border-teal-600 rounded cursor-pointer undefined hover:scale-110 focus:outline-none hover:bg-teal-700 hover:text-teal-100 ">
                Checkout
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Cart;
