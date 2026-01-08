
export enum UserRole {
  TENANT = 'TENANT', // Owner
  SEEKER = 'SEEKER', // Hunter
  NONE = 'NONE'
}

export enum PropertyType {
  ROOM = 'ROOM',
  HOSTEL_PG = 'HOSTEL_PG',
  APARTMENT = 'APARTMENT'
}

export enum RoomType {
  SINGLE = 'Single Sharing',
  DOUBLE = 'Double Sharing',
  TRIPLE = 'Triple Sharing',
  BHK1 = '1 BHK',
  BHK2 = '2 BHK',
  FLAT_SHARE = 'Flat Share'
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other' | 'Prefer not';
  role: UserRole;
  permanentAddress: string;
  currentAddress: string;
  profileComplete: boolean;
}

export interface Property {
  id: string;
  ownerId: string;
  propertyType: PropertyType;
  roomType: RoomType;
  rent: number;
  address: string;
  coordinates: Coordinates;
  images: string[];
  description: string;
  createdAt: string;
  verified: boolean;
}

export interface Message {
  id: string;
  requestId: string;
  senderId: string;
  text: string;
  timestamp: string;
}

export interface AccommodationRequest {
  id: string;
  propertyId: string;
  ownerId: string;
  seekerId: string;
  message: string;
  status: 'new' | 'responded' | 'closed';
  createdAt: string;
}

export interface WishlistItem {
  userId: string;
  propertyId: string;
}
