import React, { Component } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "./index.css";
import tw from "twin.macro";
import ripples from "../../images/Ripples_Foundation_Logo.png";
import gsa from "../../images/GSA-Logo.png";
import fda from "../../images/Food_and_Drug_Authority.png";
import globalSA from "../../images/globalsheaalliance.png";
import ecocert from "../../images/Ecocert.png";
import pum from "../../images/pum.jfif";
import meda from "../../images/meda.png";
import { SectionHeading } from "../misc/Headings.js";

const TextContent = tw.div`lg:py-8 text-center`;
const Heading = tw(
  SectionHeading,
)`mt-4 font-black text-3xl sm:text-4xl lg:text-5xl text-center leading-tight`;
const Description = tw.p`mt-4 text-center text-sm md:text-base lg:text-lg font-medium leading-relaxed text-secondary-100`;
// eslint-disable-next-line react/prefer-stateless-function
export default class AutoPlay extends Component {
  render() {
    const settings = {
      dots: true,
      infinite: true,
      adaptiveHeight: 50000,
      slidesToShow: 3,
      slidesToScroll: 1,
      autoplay: true,
      speed: 2000,
      autoplaySpeed: 2000,
      cssEase: "linear",
    };
    return (
      <section className="mb-24 mt-24">
        <TextContent>
          <Heading>Partners, Affiliations & Certifications</Heading>
          <Description>
            Below are organizations and certification bodies we are affiliated
            to
          </Description>
        </TextContent>
        <Slider {...settings} className="flex">
          <div>
            <img alt="Ripples foundation" src={ripples} width={200} />
          </div>
          <div>
            <img alt="Ghana Standard Authority" src={gsa} />
          </div>
          <div>
            <img alt="Food and Drug Authority" src={fda} width={180} />
          </div>
          <div>
            <img alt="Global Shea Alliance" src={globalSA} width={180} />
          </div>
          <div>
            <img alt="Ecocert" src={ecocert} width={160} />
          </div>
          <div>
            <img alt="PUM" src={pum} width={150} />
            <img alt="MEDA" src={meda} width={150} />
          </div>
        </Slider>
      </section>
    );
  }
}
