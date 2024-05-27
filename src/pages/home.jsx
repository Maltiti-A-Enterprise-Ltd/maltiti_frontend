import React, { useState } from "react";
import tw from "twin.macro";
import { NavBar } from "../components/header";
import Hero from "../components/hero/TwoColumnWithVideo";
import AnimationRevealPage from "../helpers/AnimationRevealPage";
import HeroImage from "../images/hero.jpg";
import MainFeature from "../components/features/TwoColWithButton";
import TabGrid from "../components/cards/TabCardGrid";
import ceo from "../images/founder.jpg";
import Features from "../components/features/ThreeColSimple";
import chefIconImageSrc from "../images/vecteezy_isometric-flat-illustration-concept-courses-and-online_.jpg";
import celebrationIconImageSrc from "../images/icons8-good-quality.gif";
import shopIconImageSrc from "../images/icons8-in-transit.gif";
import MainFeature2 from "../components/features/TwoColSingleFeatureWithStats2";
import alternate from "../images/alternate.jpg";
import Testimonial from "../components/testimonials/ThreeColumnWithProfileImage";
import Footer from "../components/footers/MiniCenteredFooter";
import Contactus from "../components/forms/TwoColContactUsWithIllustration";
import FAQ from "../components/faqs/SimpleWithSideImage";
import customerSupportIllustrationSrc from "../images/customer-support-illustration.svg";
import Testimonial1 from "../components/testimonials/TwoColumnWithImageAndProfilePictureReview";
import SimpleSlider from "../components/partners/index";
import Blog from "../components/blog";
import { Location } from "../components/features/Location";
import darnisha from "../images/darnisha.jpg";
import darnishaSide from "../images/darnishaSide.jpg";
import { HighlightedText } from "../components/styleTW";
import { AppBar, Dialog, Slide, Toolbar, Typography } from "@mui/material";
import AboutCeo from "../components/features/AboutCeo";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function Home() {
  const Subheading = tw.span`tracking-wider text-sm font-medium`;
  // const HighlightedTextInverse = tw.span`bg-gray-100 text-green-500 px-4 transform -skew-x-12 inline-block`;
  const Description = tw.span`inline-block`;
  const imageCss = tw`rounded-[2.5rem]`;
  const [modalShow, setModalShow] = useState(false);

  return (
    <div className="overflow-x-hidden overflow-y-hidden">
      <NavBar />
      <AnimationRevealPage>
        <Hero
          heading={
            <>
              Quality & Affordable{" "}
              <HighlightedText>
                Organic Products Across the Globe
              </HighlightedText>
            </>
          }
          description="We want to improve the lives of thousands of families in Northern Ghana with the power of the shea nut"
          imageSrc={HeroImage}
          imageCss={imageCss}
          imageDecoratorBlob
          primaryButtonText="Shop Now"
          watchVideoButtonText="About US"
        />
        <MainFeature
          subheading={<Subheading>Established Since 2002</Subheading>}
          heading={
            <>
              We&apos;ve been serving for
              <wbr /> <HighlightedText>over 2 decades.</HighlightedText>
            </>
          }
          description={
            <Description>
              Founder and CEO Rabiatu Gurunpaga Abukari started Maltiti as a
              very small business two decades ago.
              <br />
              Rabiatu is an inspiring woman. She makes sure that the women
              produce good quality, she trains them, and she on a mission to
              mechanize the manual processes.
            </Description>
          }
          buttonRounded={false}
          textOnLeft={false}
          primaryButtonText="Read More"
          imageSrc={ceo}
          imageCss={imageCss}
          imageDecoratorBlob
          imageDecoratorBlobCss={tw`-translate-x-1/2 opacity-25 left-1/2 md:w-32 md:h-32`}
          modal={() => setModalShow(true)}
        />
        <TabGrid
          heading={
            <>
              Check our best selling <HighlightedText>Products</HighlightedText>
            </>
          }
        />
        <Features
          heading={
            <>
              Amazing <HighlightedText>Services.</HighlightedText>
            </>
          }
          cards={[
            {
              imageSrc: shopIconImageSrc,
              title: "Worldwide Export",
              description: "We ship our products across the globe",
              url: "#",
            },
            {
              imageSrc: chefIconImageSrc,
              title: "Training Services",
              description:
                "We offer training services in the production of shea butter and other products",
              url: "#",
            },
            {
              imageSrc: celebrationIconImageSrc,
              title: "Quality Products Distribution",
              description: "Distribution of quality organic products.",
              url: "#",
            },
          ]}
          imageContainerCss={tw`p-2!`}
          imageCss={tw`w-20! h-20!`}
        />
        <MainFeature2
          subheading={<Subheading>A Reputed Brand</Subheading>}
          heading={
            <>
              Why <HighlightedText>Choose Us ?</HighlightedText>
            </>
          }
          statistics={[
            {
              key: "Orders",
              value: "1000+",
            },
            {
              key: "Rural women",
              value: "5000+",
            },
            {
              key: "Communities",
              value: "30+",
            },
            {
              key: "Awards and Certificates",
              value: "20+",
            },
          ]}
          primaryButtonText="Order Now"
          primaryButtonUrl="#shop"
          imageInsideDiv={false}
          imageSrc={alternate}
          imageCss={Object.assign(tw`bg-cover`, imageCss)}
          imageContainerCss={tw`h-auto md:w-1/2`}
          imageDecoratorBlob
          imageDecoratorBlobCss={tw`-translate-x-1/2 opacity-25 left-1/2 md:w-32 md:h-32`}
          textOnLeft
        />
        <Testimonial1
          subheading="Testimonials"
          heading={
            <>
              {/* eslint-disable-next-line react/no-unknown-property */}
              Our Clients <span tw="text-primary-500">Love Us.</span>
            </>
          }
          description="Here are what some of our amazing customers are saying about our marketing professionals."
          testimonials={[
            {
              imageSrc: darnishaSide,
              profileImageSrc: darnisha,
              quote:
                "I travel to Tamale, Ghana to meet with Maltiti annually for the last several years. I purchase their incredibly quality shea butter alone with oils, soaps and even delicious honey! Comparing with other cooperatives the quality and service does not compare with that of Maltiti. I am welcomed, treated like a family and provided with excellent service and outstanding products. I proudly brag in Oakland that I carry the finest, purest Shea butter in the world. I believe that to be true. I have yet to experience Shea butter quality better than what Maltiti provides. The soaps and oils are also of excellent price and quality",
              customerName: "Darnisha Wright",
              customerTitle:
                "CEO, Ubuntu1865 African Marketplace, Oakland CA - USA",
            },
            // {
            // imageSrc:
            //     "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1024&q=80",
            // profileImageSrc:
            //     "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=512&h=512&q=80",
            // quote:
            //     "Sinor Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.",
            // customerName: "Adam Cuppy",
            // customerTitle: "Founder, Nestle"
            // }
          ]}
          textOnLeft
        />
        <Location
          subheading="Find us using google map"
          heading={
            <>
              Our <HighlightedText>Location</HighlightedText>
            </>
          }
        />
        <Testimonial
          subheading=""
          heading={
            <>
              Key <HighlightedText>Members.</HighlightedText>
            </>
          }
        />
        <FAQ
          imageSrc={customerSupportIllustrationSrc}
          imageContain
          imageShadow={false}
          subheading="FAQs"
          heading={
            <>
              {/* eslint-disable-next-line react/no-unknown-property */}
              Do you have <span tw="text-primary-500">Questions ?</span>
            </>
          }
        />
        <Contactus />
        <Blog />
        <SimpleSlider />
        <Footer />
      </AnimationRevealPage>
      <Dialog
        fullScreen
        open={modalShow}
        onClose={() => setModalShow(false)}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Maltiti A. Enterprise Ltd
            </Typography>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => setModalShow(false)}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <AboutCeo />
      </Dialog>
    </div>
  );
}
export default Home;
