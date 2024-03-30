import Button from "@mui/material/Button";
import { Checkbox, FormControlLabel, TextField, Tooltip } from "@mui/material";
import React, { useState } from "react";
import { usePlacesWidget } from "react-google-autocomplete";
import { useDispatch, useSelector } from "react-redux";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  completeCheckout,
  getTransportation,
} from "../../features/cart/cartSlice";
import InfoIcon from "@mui/icons-material/Info";

const CheckoutComponent = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.cart);
  const transportation = useSelector((state) => state.cart.transportation);
  const totalPrice = useSelector((state) => state.cart.totalPrice);
  const user = useSelector((state) => state.user.user);
  const [city, setCity] = useState("");
  const { ref } = usePlacesWidget({
    apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
    onPlaceSelected: (place) => {
      const selectedCity = place.address_components[0].long_name;
      setCity(selectedCity);
      const country = place.address_components[3].long_name;
      console.log("country: " + country);
      if (country === "Ghana") {
        const location = selectedCity === "Tamale" ? "local" : "other";
        dispatch(getTransportation(location));
      }
    },
  });

  return (
    <main className="w-full flex item-center justify-center my-[3%] h-screen font-normal text-black">
      <div className={"flex flex-row mt-24 gap-5"}>
        <div
          className={
            "border px-5 bg-gray-200 basis-2/3 border-gray-200 shadow rounded-lg"
          }
        >
          <h2 className={"font-bold mt-10 text-2xl"}>Checkout</h2>
          <div>
            <div style={{ marginTop: "10px" }}>
              <span style={{ color: "black" }}>Name</span>
              <TextField
                fullWidth
                defaultValue={user.user.name}
                color="success"
                variant="outlined"
                size={"small"}
              />
            </div>
          </div>
          <div>
            <div style={{ marginTop: "10px" }}>
              <span style={{ color: "black" }}>Contact</span>
              <TextField
                fullWidth
                defaultValue={user.user.phoneNumber}
                color="success"
                disabled={true}
                variant="outlined"
                size={"small"}
              />
            </div>
            <span className={"text-xs text-gray-700"}>
              Head over to settings if you want to change your contact
            </span>
          </div>
          <div>
            <div style={{ marginTop: "10px" }}>
              <span style={{ color: "black" }}>
                Select your shipping address
              </span>
              <TextField
                id={"autocomplete"}
                fullWidth
                color="success"
                variant="outlined"
                inputRef={ref}
                size={"small"}
              />
            </div>
          </div>
          <span className={"text-xs text-gray-700"}>
            If you are ordering outside of Ghana, a representative will contact
            via phone or email to proceed with your order
          </span>
          <div>
            <div style={{ marginTop: "10px" }}>
              <span style={{ color: "black" }}>
                Please enter any additional information that may help in
                shipping
              </span>
              <TextField
                fullWidth
                color="success"
                variant="outlined"
                size={"small"}
                multiline
                rows={4}
              />
            </div>
          </div>
        </div>
        <div
          className={
            "border h-fit px-5 bg-gray-200 basis-1/3 border-gray-200 rounded-lg"
          }
        >
          <div>
            <h2 className={"font-bold mt-10 text-2xl"}>Order Summary</h2>
            <div className={"flex mt-2 gap-y-1 flex-col text-xs"}>
              {cart.map((item) => (
                <div className={"flex justify-between"}>
                  <div className={"flex gap-x-2"}>
                    <span>X{item.quantity}</span>
                    <span>{item.product.name}</span>
                  </div>
                  <div className={"flex gap-x-2"}>
                    <span>&#8373; {item.product.retail}</span>
                    <DeleteIcon fontSize={"small"} color={"error"} />
                  </div>
                </div>
              ))}
            </div>
            <hr
              style={{
                color: "#e8e8e8",
                backgroundColor: "#d2d2d2",
                height: 1,
                marginTop: 8,
              }}
            />
            <hr
              style={{
                color: "#e8e8e8",
                backgroundColor: "#d2d2d2",
                height: 1,
                marginTop: 8,
              }}
            />
            <div className={"flex text-sm mt-2 justify-between"}>
              <span>Sub Total</span>
              <span>&#8373; {totalPrice}</span>
            </div>
            <div className={"flex text-sm mt-2 justify-between"}>
              <span>Delivery</span>
              {transportation ? (
                <span>&#8373; {transportation}</span>
              ) : (
                <Tooltip title="Please select a location to calculate charges">
                  <span className={"flex gap-x-1 items-center"}>
                    <InfoIcon fontSize={"small"} />
                    <span>TBD</span>
                  </span>
                </Tooltip>
              )}
            </div>
            <div className={"flex text-sm mt-2 justify-between"}>
              <span>Discount</span>
              <span>---</span>
            </div>
            <hr
              style={{
                color: "#e8e8e8",
                backgroundColor: "#d2d2d2",
                height: 1,
                marginTop: 8,
              }}
            />
            <hr
              style={{
                color: "#e8e8e8",
                backgroundColor: "#d2d2d2",
                height: 1,
                marginTop: 8,
              }}
            />
            <div className={"flex font-bold text-lg mt-2 justify-between"}>
              <span>Order Total</span>
              {transportation ? (
                <span>&#8373; {totalPrice + transportation}</span>
              ) : (
                <Tooltip title="Please select a location to calculate charges">
                  <span className={"flex gap-x-1 items-center"}>
                    <InfoIcon fontSize={"small"} />
                    <span>TBD</span>
                  </span>
                </Tooltip>
              )}
            </div>
            {city === "Tamale" && (
              <div className={"border bg-[#e9fce9] rounded-lg pl-4 mt-2"}>
                <FormControlLabel
                  control={<Checkbox color={"success"} />}
                  label="Pay on delivery"
                />
              </div>
            )}
            <p className={"text-xs mt-2"}>
              By completing your purchase you agree to these Terms of Service
            </p>
            <div className={"mt-5 pb-10"}>
              <Button
                onClick={() => dispatch(completeCheckout())}
                variant="contained"
                color={"success"}
              >
                Complete Checkout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CheckoutComponent;
