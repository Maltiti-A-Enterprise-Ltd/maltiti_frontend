import React from "react";
import baobab from "../../images/baobab oil.jpg";

const ProductDetails = () => {
  return (
    <section className="overflow-hidden text-gray-600 body-font">
      <div className="container px-5 py-24 mx-auto">
        <div className="flex flex-wrap mx-auto lg:w-4/5">
          <img
            alt="title"
            className="lg:w-1/2 w-full lg:h-auto max-h-[600px] h-64 object-contain object-center rounded"
            src={baobab}
          />
          <div className="w-full mt-6 lg:w-1/2 lg:pl-10 lg:py-6 lg:mt-0">
            <h2 className="tracking-widest text-black uppercase mt tex10t-sm">
              Essential Oils
            </h2>
            <h1 className="mb-1 text-3xl font-medium text-gray-900 title-font">
              baobab oil
            </h1>
            <div className="flex mb-4">
              <span className="flex items-center">
                <svg
                  fill="currentColor"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  className="w-4 h-4 text-green-100"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                </svg>
                <svg
                  fill="currentColor"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  className="w-4 h-4 text-green-100"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                </svg>
                <svg
                  fill="currentColor"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  className="w-4 h-4 text-green-100"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                </svg>
                <svg
                  fill="currentColor"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  className="w-4 h-4 text-green-100"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                </svg>
                <svg
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  className="w-4 h-4 text-green-100"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                </svg>
                <span className="ml-16 text-gray-600">4 Reviews</span>
              </span>
            </div>
            <p className="mb-4 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quas
              dignissimos alias facere doloremque excepturi corporis asperiores
              at iste eveniet vero!
            </p>
            <hr className="h-1 my-1 bg-gray-400 border-t-0 opacity-50 width-0.1 " />
            <p className="mb-4 leading-relaxed">
              <h2 className="tracking-widest text-black uppecase mt tex10t-sm">
                ingredient
              </h2>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quas
            </p>

            <div className="flex items-center justify-between">
              <span className="text-2xl font-medium text-gray-900">
                ₵25
              </span>
              <div className="flex ">
                <button className="flex px-6 py-2 ml-auto mr-2 text-white bg-green-500 border-0 rounded focus:outline-none hover:bg-green-100">
                  Buy it now
                </button>
                <button className="flex px-6 py-2 ml-auto border border-green-500 rounded focus:outline-none hover:bg-green-600 hover:text-white">
                  Add to cart
                </button>
              </div>
              <button className="inline-flex items-center justify-center w-10 h-10 p-0 ml-4 text-gray-500 bg-gray-200 border-0 rounded-full">
                <svg
                  fill="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetails;
