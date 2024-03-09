import React from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';
import { GoogleMap, MarkerF, LoadScript } from '@react-google-maps/api';
import { SectionHeading, Subheading as SubheadingBase } from '../misc/Headings';
import { Container, ContentWithPaddingXl } from '../misc/Layouts';
import { ReactComponent as SvgDecoratorBlob3 } from '../../images/svg-decorator-blob-3.svg';

const Heading = tw(SectionHeading)``;
const Subheading = tw(SubheadingBase)`text-center mb-3`;

const DecoratorBlob = styled(SvgDecoratorBlob3)`
  ${tw`pointer-events-none absolute right-0 bottom-0 w-64 opacity-25 transform translate-x-32 translate-y-40`}
`;

const containerStyle = {
  width: '100%',
  height: '400px'
};
const center = {
  lat: 9.4778122,
  lng: -0.88135407
};

export function Location({ heading = '', subheading = '' }) {
  /*
   * This componets accepts a prop - `cards` which is an array of object denoting the cards. Each object in the cards array can have the following keys (Change it according to your need, you can also add more objects to have more cards in this feature component):
   *  1) imageSrc - the image shown at the top of the card
   *  2) title - the title of the card
   *  3) description - the description of the card
   *  4) url - the url that the card should goto on click
   */
  return (
    <Container>
      <ContentWithPaddingXl>
        {subheading && <Subheading>{subheading}</Subheading>}
        {heading && <Heading>{heading}</Heading>}
      </ContentWithPaddingXl>
      <LoadScript googleMapsApiKey="AIzaSyC7kp94PJXor3UxV6ThQRZeqmQRn7LaFao">
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={14}>
          <MarkerF position={{ lat: 9.4778122, lng: -0.88135407 }} />
        </GoogleMap>
      </LoadScript>

      <DecoratorBlob />
    </Container>
  );
}
