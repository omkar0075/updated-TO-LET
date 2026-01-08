
export const PRIMARY_COLOR = '#0066ff';
export const SUCCESS_COLOR = '#22c55e';
export const DANGER_COLOR = '#ef4444';

export const INDIAN_PHONE_REGEX = /^[6-9]\d{9}$/;

export const MOCK_PROPERTIES = [
  {
    id: 'p1',
    ownerId: 'u2',
    propertyType: 'ROOM',
    roomType: 'Single Sharing',
    rent: 8500,
    address: 'Viman Nagar, Pune, Maharashtra 411014',
    coordinates: { lat: 18.5679, lng: 73.9143 },
    images: ['https://picsum.photos/seed/p1/600/400', 'https://picsum.photos/seed/p1b/600/400'],
    description: 'Cozy single room for students near Symbiosis.',
    createdAt: new Date().toISOString(),
    verified: true
  },
  {
    id: 'p2',
    ownerId: 'u2',
    propertyType: 'HOSTEL_PG',
    roomType: 'Double Sharing',
    rent: 6500,
    address: 'Koramangala 4th Block, Bengaluru, Karnataka 560034',
    coordinates: { lat: 12.9339, lng: 77.6231 },
    images: ['https://picsum.photos/seed/p2/600/400'],
    description: 'Affordable double sharing PG for boys.',
    createdAt: new Date().toISOString(),
    verified: false
  }
];
