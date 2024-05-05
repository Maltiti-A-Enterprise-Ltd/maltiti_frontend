import "./lineItem.css";

export const LineItem = ({ cart, index }) => {
  return (
    <div className="lineItem">
      <div>{index + 1}</div>
      <div>
        <span className={"line"}>{cart?.product.name}</span>
      </div>
      {/*<div>*/}
      {/*  <input name="description" type="text" value={"Whatever it is"} />*/}
      {/*</div>*/}
      <div>
        <span className={"line"}>{cart?.quantity}</span>
      </div>
      <div className="currency">
        <span className={"line"}>{cart?.product?.retail}</span>
      </div>
      <div className="currency">
        <span className={"line"}>{cart?.quantity * cart?.product?.retail}</span>
      </div>
    </div>
  );
};
