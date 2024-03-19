import React from "react";
import styled from "styled-components";
import tw from "twin.macro";
import { css } from "styled-components/macro"; //eslint-disable-line
import { ContentWithPaddingXl, Container } from "../misc/Layouts.js";
import {
  SectionHeading as Heading,
  Subheading as SubheadingBase,
} from "../misc/Headings.js";
import { ReactComponent as SvgDecoratorBlob1 } from "../../images/svg-decorator-blob-7.svg";
import { ReactComponent as SvgDecoratorBlob2 } from "../../images/svg-decorator-blob-8.svg";
import ceo from "../../images/founder.jpg";
import titi from "../../images/titi.jpg";
import muhammed from "../../images/muhammed.jpg";
import kasim from "../../images/kasim.png";
import suhuyini from "../../images/suhuyini.jpg";

const Subheading = tw(SubheadingBase)`text-center`;
const Testimonials = tw.div`flex flex-col lg:flex-row items-center lg:items-stretch`;
const TestimonialContainer = tw.div`mt-16 lg:w-1/3`;
const Testimonial = tw.div`px-4 text-center max-w-xs mx-auto flex flex-col items-center`;
const Image = tw.img`w-20 h-20 rounded-full`;
const Quote = tw.blockquote`mt-5 text-gray-600 font-medium leading-loose`;
const CustomerName = tw.p`mt-5 text-gray-900 font-semibold uppercase text-sm tracking-wide`;

const DecoratorBlob1 = styled(SvgDecoratorBlob1)`
  ${tw`pointer-events-none -z-20 absolute left-0 top-0 h-56 w-56 opacity-20 transform -translate-x-2/3 -translate-y-12 text-teal-400`}
`;
const DecoratorBlob2 = styled(SvgDecoratorBlob2)`
  ${tw`pointer-events-none -z-20 absolute right-0 bottom-0 h-64 w-64 opacity-20 transform translate-x-2/3 text-yellow-500`}
`;

export default function ({
  subheading = "Testimonials",
  heading = "Customer's Review",
  testimonials = [
    {
      imageSrc: ceo,
      quote:
        "It is my utmost believe that I can change the lives of many with power of shea nuts and so help me God",
      customerName: "Rabiatu Abukari",
      role: "CEO / Founder",
    },
    {
      imageSrc: kasim,
      quote:
        "I want to be an active change agent to many rural communities in Northern Ghana with a strong ability to research and communicate effectively",
      customerName: "Kassim Imoro",
      role: "Manager / Board Member",
    },
    {
      imageSrc: titi,
      quote:
        "Maltiti is on its way to breaking strongly into the european market and digitization and social media is going to be very key to achieving such a goal",
      customerName: "Bilal Abubakari",
      role: "Board Secretary / Board Member",
    },
  ],
  testimonials1 = [
    {
      imageSrc: muhammed,
      quote:
        "I have been working with Maltiti for more than 5 years and it has indeed been a very enriching experience. This organization offers opportunities for everyone especially women",
      customerName: "Kantako Muhammed",
      role: "Operations Manager / Board Member",
    },
    {
      imageSrc: suhuyini,
      quote:
        "Maltiti is strongly involved to the bottom so every woman is paid and treated fairly on activities regarding production. This puts smiles on women in the communties producing shea butter.",
      customerName: "Abubakari Mohammed Suhuyini",
      role: "Financial Accountant / Board Member",
    },
  ],
}) {
  return (
    <Container>
      <ContentWithPaddingXl>
        {subheading && <Subheading>{subheading}</Subheading>}
        <Heading>{heading}</Heading>
        <Testimonials>
          {testimonials.map((testimonial) => (
            <TestimonialContainer key={testimonial.customerName}>
              <Testimonial>
                <Image src={testimonial.imageSrc} />
                <Quote>&quot;{testimonial.quote}&quot;</Quote>
                <CustomerName>- {testimonial.customerName}</CustomerName>
                <CustomerName>- {testimonial.role}</CustomerName>
              </Testimonial>
            </TestimonialContainer>
          ))}
        </Testimonials>
        <Testimonials>
          {testimonials1.map((testimonial) => (
            <TestimonialContainer key={testimonial.customerName}>
              <Testimonial>
                <Image src={testimonial.imageSrc} />
                <Quote>&quot;{testimonial.quote}&quot;</Quote>
                <CustomerName>- {testimonial.customerName}</CustomerName>
                <CustomerName>- {testimonial.role}</CustomerName>
              </Testimonial>
            </TestimonialContainer>
          ))}
        </Testimonials>
      </ContentWithPaddingXl>

      <DecoratorBlob1 />
      <DecoratorBlob2 />
    </Container>
  );
}
