import { CardMedia, Tooltip } from "@mui/material";
import "./index.css";

const ShopCard = (props) => {
  return (
    <div
      onClick={props.selectProduct}
      className="relative cursor-pointer shop-card hover:shadow-md flex w-full max-w-xs flex-col overflow-hidden rounded-lg border border-gray-100 bg-white shadow-md"
    >
      <div className="relative mx-3 mt-3 grid place-items-center overflow-hidden rounded-xl">
        <img src={props.image} alt={"product image"} className="h-64" />
      </div>
      <div className="mt-4 px-5 pb-5">
        <a href="#">
          <Tooltip title={props.name}>
            <h5 className="text-lg truncate max-w-xs tracking-tight text-slate-900">
              {props.name}
            </h5>
          </Tooltip>
        </a>
        <div className="mt-2 max-s mb-5 flex items-center justify-between">
          <p>
            <span className="text-lg font-bold text-slate-900">
              GH&#8373; {props.price}
            </span>
            {/*<span className="text-sm text-slate-900 line-through">$699</span>*/}
          </p>
          <div className="flex items-center">
            <span className="mr-2 uppercase ml-3 px-2.5 py-0.5 text-xs font-semibold">
              {props.property}
            </span>
          </div>
        </div>
        <button
          onClick={props.click}
          className="flex w-full items-center justify-center rounded-md bg-green-100 px-5 py-[0.6rem] text-center text-sm font-medium text-white hover:bg-[#142C1C] focus:outline-none focus:ring-4 focus:ring-blue-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mr-2 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          Add to cart
        </button>
      </div>
    </div>
  );
};

export default ShopCard;
