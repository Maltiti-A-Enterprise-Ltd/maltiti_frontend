import React from "react";
import tw from "twin.macro";
import styled from "styled-components";
import {Container as ContainerBase } from "../../components/misc/Layouts.js"
import logo from "../../images/logo.svg";
import { ReactComponent as FacebookIcon } from "../../images/facebook-icon.svg";
import { ReactComponent as LinkedInIcon } from "../../images/linkedin-icon.svg";
import {AiFillInstagram} from "react-icons/ai"
import {MdEmail} from "react-icons/md"
import AnchorLink from "react-anchor-link-smooth-scroll";
import { email, facebook, instagram, linkedin } from "../constants/index.js";


const Container = tw(ContainerBase)`bg-gray-100 text-gray-100 -mx-8 -mb-8`
const Content = tw.div`max-w-screen-xl mx-auto py-20 lg:py-24`;
const date = new Date();
let year = date.toLocaleString('en-us', {year: 'numeric'});

const Row = tw.div`flex items-center justify-center flex-col px-8`

const LogoContainer = tw.div`flex items-center justify-center md:justify-start`;
const LogoImg = tw.img`w-12`;
const LogoText = tw.h5`ml-2 text-2xl text-black font-black tracking-wider`;

const LinksContainer = tw.div`mt-8 font-medium flex flex-wrap justify-center items-center flex-col sm:flex-row`
const Link = tw.a`border-b-2 border-transparent text-black hocus:text-green-300 hocus:border-green-300 pb-1 transition duration-300 mt-2 mx-4`;

const SocialLinksContainer = tw.div`mt-10`;
const SocialLink = styled.a`
  ${tw`cursor-pointer inline-block text-black hover:text-green-500 transition duration-300 mx-4`}
  svg {
    ${tw`w-5 h-5`}
  }
`;

const CopyrightText = tw.p`text-center mt-10 font-medium tracking-wide text-sm text-gray-600`
export default () => {
  return (
    <Container>
      <Content>
        <Row>
          <LogoContainer>
            <LogoImg src={logo} />
            <LogoText>Maltiti A. Enterprise Limited</LogoText>
          </LogoContainer>
          <LinksContainer>
            <Link><AnchorLink href="#home">Home</AnchorLink></Link>
            <Link><AnchorLink href="#about">About</AnchorLink></Link>
            <Link><AnchorLink href="#shop">Shop</AnchorLink></Link>
            <Link><AnchorLink href="#faqs">Faqs</AnchorLink></Link>
            <Link><AnchorLink href="#contactus">Contact Us</AnchorLink></Link>
          </LinksContainer>
          <SocialLinksContainer>
            <SocialLink href={facebook} target="_blank">
              <FacebookIcon />
            </SocialLink>
            <SocialLink href={linkedin} target="_blank">
              <LinkedInIcon/>
            </SocialLink>
            <SocialLink href={instagram} target="_blank">
              <AiFillInstagram />
            </SocialLink>
            <SocialLink href={`mailto:${email}`} target="_blank">
              <MdEmail />
            </SocialLink>
          </SocialLinksContainer>
          <CopyrightText>
            &copy; Copyright {year}, Maltiti A. Enterprise Limited. All Rights Reserved.
          </CopyrightText>
        </Row>
      </Content>
    </Container>
  );
};
