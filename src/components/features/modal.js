import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

export function MyVerticallyCenteredModal(props) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Modal heading
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>Centered Modal</h4>
        <p>
          <h1>Rabiatu Abukari</h1>
          Founder and CEO Rabiatu Gurunpaga Abukari started Maltiti A.
          Enterprise Limited as a very small business two decades ago. Rabiatu
          is an inspiring woman. She makes sure that over 5000 women produce
          good quality products, she trains them, and she is on a mission of
          mechanizing the manual processes.
          <br /> Because of her commitment the women earn more and the level of
          education and prosperity increases. In addition, Rabiatu helps the
          women with mobile savings as well as health insurance. The growth of
          the company creates new communities, allowing more women to work. Part
          of the proceeds are used to send children to school. <br />
          Rabiatu: “We’re at a major turning point with Maltiti. In recent years
          we have worked hard to get the production of shea butter and black
          soap off the ground. Thanks to the efforts of hundreds of strong
          Ghanaian women we have succeeded. In the coming years, we want to
          continue to build on the quality of our products. In the first
          instance, we will focus on our home market in Ghana. Of course, we
          also want to play an increasing role in the international markets in
          the long term.”
          <br />
          <br />
          <h1>Products</h1>
          The company has been instrumental in the processing, marketing and
          distribution of shea butter, shea butter based products (soap, lotion,
          creams, pomade) rice, soya, other non-timber forest products (Baobab,
          dawadawa), essential oils such as kapok, moringa, baobab, mango, shea,
          neem and many other organic products. The company is very much purpose
          driven. It is not just about making profit; it is also about improving
          the lives of thousands of families. <br />
          <h1>Farming</h1>
          <br />
          <br />
          Maltiti A. Enterprise Limited started Maltiti farms in 2018. The
          company total farm size as at April, 2021 is 307 acres. The main crops
          we cultivate includes maize, rice, soy. The company aim is to expand
          Maltiti farms to 2000 acres by the year 2023.
          <br />
          <br />
          <h1>Mission Statement</h1>
          <p>
            Improve lives of women in Northern Ghana with the power of shea nut
            and other organic products
          </p>
          <h1>Maltiti's Vision</h1>
          <p>
            The biggest exporter of shea butter and other essential organic
            products across the globe
          </p>
          <h2>Maltiti main Objectives</h2>
          <ul>
            <li>
              Training and empowering shea cooperatives as well providing them
              good market.
            </li>
            <li>
              Production of cosmetics derived from shea butter and export.
            </li>
            <li>Production of natural oils and export.</li>
            <li>Free soap making training to disable groups.</li>
            <li>Farming and supply of rice, soy and maize.</li>
            <li>Provide start-up capital to shea butter producers.</li>
          </ul>
          <h2>Core values of the company</h2>
          <ul>
            <li>Meeting customers’ orders and time lines.</li>
            <li>
              Respect and value the contribution of women towards community
              development.
            </li>
            <li>Protect and preserve shea trees for the future generations.</li>
          </ul>
          <br />
          <br />
          <h1>Certification</h1>
          Within the Maltiti shea value chain, ten shea collection cooperatives
          and five shea butter producing centres are organic, Fair Trade and
          Fairtrade Sustainability Alliance certified. All our products is
          certified by Ghana Standard Authority and Food and Drug Authority.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}
