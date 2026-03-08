export type LocationInfo = {
  name: string;
  address: string;
  poBox: string;
  digitalAddress: string;
  phone: string[];
  email: string;
  coordinates: {
    lat: number;
    lng: number;
  };
};

export const maltitiLocationInfo: LocationInfo = {
  name: 'Maltiti A. Enterprise Ltd',
  address:
    'Ghana, Northern Region, Tamale, Kumbungu Highway, Malshegu, Behind Star Oil Filling Station',
  poBox: 'TL 2501, Tamale',
  digitalAddress: 'NS-94-7460',
  phone: ['0242381560', '0557309018'],
  email: 'info@maltitiaenterprise.com',
  coordinates: {
    // Approximate coordinates for Malshegu, Tamale (adjust if you have exact coordinates)
    lat: 9.4778122,
    lng: -0.88135407,
  },
};
