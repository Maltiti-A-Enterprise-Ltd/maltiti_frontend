import "./index.css";
import Logo from "../logo";
import { formatDate2 } from "../../utility/formatDate";
import { LineItems } from "./lineItems";
import logo from "../../images/logo.svg";

export const Invoice = ({ order }) => {
  const getSubTotal = () => {
    let total = 0;
    if (order?.__carts__) {
      for (const cart of order?.__carts__) {
        total += parseInt(cart?.product.retail);
      }
    }
    return total;
  };
  return (
    <div className="invoice">
      <div className={"bg-green-100 h-10"}></div>
      <div className="brand pad">
        <div>
          <img src="/Maltiti-Final.png" alt="logo" width={60} />
        </div>
        <div className={"company-address"}>
          <span>Maltiti A. Enterprise Ltd</span>
          <span className={"text-xs"}>
            Training, Organic Products and General Goods
          </span>
          <span className={"text-xs"}>P. O BOX TL 2501, Tamale.</span>
          <span className={"text-xs"}>Tel: 0242381560 / 0557309018</span>
          <span className={"text-xs"}>Digital Address: NS-94-7460</span>
          <span className={"text-xs"}>www.maltitiaenterprise.com</span>
          <span className={"text-xs"}>Email: info@maltitiaenterprise.com</span>
        </div>
      </div>
      <div className="addresses pad">
        <div className="from">
          <strong>{order?.name}</strong>
          <br />
          {order?.location}
          <br />
          {order?.__user__?.phoneNumber}
          <br />
          {order?.extraInfo}
        </div>
        <div>
          <div className="valueTable to">
            <div className="row">
              <div className="label">Customer #</div>
              <div className="value">
                {String(order?.__user__?.id).substring(0, 5).toUpperCase()}
              </div>
            </div>
            <div className="row">
              <div className="label">Invoice #</div>
              <div className="value">
                {" "}
                {String(order?.id).substring(0, 5).toUpperCase()}
              </div>
            </div>
            <div className="row">
              <div className="label">Date</div>
              <div className="value date">
                {order?.createdAt && formatDate2(order?.createdAt)}
              </div>
            </div>
          </div>
        </div>
      </div>
      <h2 className={"pad title"}>Invoice</h2>

      <div>
        <LineItems carts={order?.__carts__} />
      </div>

      <div className="totalContainer">
        <form>
          <div className="valueTable">
            <div className="row">
              <div className="label">Tax Rate (%)</div>
              <div className="value">
                <span>0</span>
              </div>
            </div>
          </div>
        </form>
        <form>
          <div className="valueTable">
            <div className="row">
              <div className="label">Subtotal</div>
              <div className="value currency">GH&#8373; {getSubTotal()}</div>
            </div>
            <div className="row">
              <div className="label">Transportation</div>
              <div className="value currency">
                GH&#8373; {parseInt(order?.amount) / 100 - getSubTotal()}
              </div>
            </div>
            <div className="row">
              <div className="label">Total</div>
              <div className="value currency">
                GH&#8373; {parseInt(order?.amount) / 100}
              </div>
            </div>
          </div>
        </form>
      </div>

      {/*<div className="pay">*/}
      {/*  <button className="payNow">Pay Now</button>*/}
      {/*</div>*/}

      {/*<div className="footer">*/}
      {/*  <div className="comments">*/}
      {/*    <h4>Notes</h4>*/}
      {/*    <p>*/}
      {/*      Demo by Kevin Firko, independent consulting developer at{" "}*/}
      {/*      <a href="https://bitcurve.com">Bitcurve</a>.*/}
      {/*    </p>*/}
      {/*    <p>*/}
      {/*      Check out my blog{" "}*/}
      {/*      <a href="https://firxworx.com">https://firxworx.com</a> and{" "}*/}
      {/*      <a href="https://firxworx.com/blog/coding/creating-an-invoice-component-with-dynamic-line-items-using-react/">*/}
      {/*        the related post*/}
      {/*      </a>{" "}*/}
      {/*      covering how to create a dynamic Invoice component in React.{" "}*/}
      {/*    </p>*/}
      {/*    <p>*/}
      {/*      Find the{" "}*/}
      {/*      <a href="https://github.com/firxworx/react-simple-invoice">*/}
      {/*        code on Github*/}
      {/*      </a>*/}
      {/*      .*/}
      {/*    </p>*/}
      {/*  </div>*/}
      {/*  <div className="closing">*/}
      {/*    <div>Thank-you for your business</div>*/}
      {/*  </div>*/}
      {/*</div>*/}
      <div className={"bg-green-100 mt-5 h-10"}></div>
    </div>
  );
};
