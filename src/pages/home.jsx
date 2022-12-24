import React, {useState} from "react";
import { NavBar } from "../components/header";
import tw from "twin.macro";
import Hero from "../components/hero/TwoColumnWithVideo.js";
import AnimationRevealPage from "../helpers/AnimationRevealPage.js";
import HeroImage from "../images/hero.jpg"
import MainFeature from "../components/features/TwoColWithButton.js";
// import founder from "../images/ceo.jpg";
import ceo from "../images/founder.jpg"
import { MyVerticallyCenteredModal } from "../components/features/modal";

const Home = () => {
    const Subheading = tw.span`tracking-wider text-sm font-medium`;
    const HighlightedText = tw.span`bg-green-500 text-gray-100 px-4 transform -skew-x-12 inline-block mt-2`;
    // const HighlightedTextInverse = tw.span`bg-gray-100 text-green-500 px-4 transform -skew-x-12 inline-block`;
    const Description = tw.span`inline-block`;
    const imageCss = tw`rounded-[2.5rem]`;
    const [modalShow, setModalShow] = useState(false);
    return(
        <div>
            <AnimationRevealPage>
            <NavBar/>
            <Hero
                heading={<>Quality & Affordable <HighlightedText>Organic Products Across the Globe</HighlightedText></>}
                description="We want to improve the lives of thousands of families in Northern Ghana with the power of the shea nut"
                imageSrc={HeroImage}
                imageCss={imageCss}
                imageDecoratorBlob={true}
                primaryButtonText="Shop Now"
                watchVideoButtonText="About US"
            />
            <MainFeature
                subheading={<Subheading>Established Since 2002</Subheading>}
                heading={
                    <>
                        We've been serving for
                        <wbr /> <HighlightedText>over 2 decades.</HighlightedText>
                    </>
                }
                description={
                    <Description>
                        Founder and CEO Rabiatu Gurunpaga Abukari started Maltiti as a very small business two decades ago.
                        <br />
                        <br />
                        Rabiatu is an inspiring woman. She makes sure that the women produce good quality, she trains them, and she on a mission to mechanize the manual processes.
                    </Description>
                }
                buttonRounded={false}
                textOnLeft={false}
                primaryButtonText="Read More"
                imageSrc={ceo}
                imageCss={imageCss}
                imageDecoratorBlob={true}
                imageDecoratorBlobCss={tw`-translate-x-1/2 opacity-25 left-1/2 md:w-32 md:h-32`}
                modal={() => setModalShow(true)}
            />
            </AnimationRevealPage>
            <MyVerticallyCenteredModal 
            show={modalShow}
            onHide={() => setModalShow(false)}
            />
        </div>
    );
}
export default Home;