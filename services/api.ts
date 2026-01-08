
import { User, Property, UserRole, WishlistItem, AccommodationRequest, Message } from '../types';
import { MOCK_PROPERTIES } from '../constants';

const STORAGE_KEYS = {
  USERS: 'tolet_users',
  PROPERTIES: 'tolet_properties',
  WISHLIST: 'tolet_wishlist',
  REQUESTS: 'tolet_requests',
  MESSAGES: 'tolet_messages',
  CURRENT_USER: 'tolet_current_user'
};

const getFromStorage = <T,>(key: string, defaultValue: T): T => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : defaultValue;
};

const saveToStorage = <T,>(key: string, data: T) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Initialize properties with mock data if empty
if (!localStorage.getItem(STORAGE_KEYS.PROPERTIES)) {
  saveToStorage(STORAGE_KEYS.PROPERTIES, MOCK_PROPERTIES);
}

export const api = {
  // Auth
  getCurrentUser: (): User | null => getFromStorage(STORAGE_KEYS.CURRENT_USER, null),
  
  login: async (email: string): Promise<User> => {
    const users = getFromStorage<User[]>(STORAGE_KEYS.USERS, []);
    let user = users.find(u => u.email === email);
    if (!user) {
      // For demo, create user if not exists
      user = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        fullName: '',
        phone: '',
        age: 18,
        gender: 'Prefer not',
        role: UserRole.NONE,
        permanentAddress: '',
        currentAddress: '',
        profileComplete: false
      };
      users.push(user);
      saveToStorage(STORAGE_KEYS.USERS, users);
    }
    saveToStorage(STORAGE_KEYS.CURRENT_USER, user);
    return user;
  },

  updateProfile: async (userData: Partial<User>): Promise<User> => {
    const current = api.getCurrentUser();
    if (!current) throw new Error("Not logged in");
    const updated = { ...current, ...userData, profileComplete: true };
    const users = getFromStorage<User[]>(STORAGE_KEYS.USERS, []);
    const index = users.findIndex(u => u.id === current.id);
    if (index > -1) users[index] = updated;
    else users.push(updated);
    saveToStorage(STORAGE_KEYS.USERS, users);
    saveToStorage(STORAGE_KEYS.CURRENT_USER, updated);
    return updated;
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  },

  // Properties
  getProperties: async (filters?: { type?: string, minPrice?: number, maxPrice?: number }): Promise<Property[]> => {
    let props = getFromStorage<Property[]>(STORAGE_KEYS.PROPERTIES, []);
    if (filters) {
      if (filters.type) props = props.filter(p => p.propertyType === filters.type);
      if (filters.minPrice) props = props.filter(p => p.rent >= filters.minPrice!);
      if (filters.maxPrice) props = props.filter(p => p.rent <= filters.maxPrice!);
    }
    return props;
  },

  addProperty: async (propData: Omit<Property, 'id' | 'createdAt' | 'verified'>): Promise<Property> => {
    const props = getFromStorage<Property[]>(STORAGE_KEYS.PROPERTIES, []);
    const newProp: Property = {
      ...propData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      verified: false
    };
    props.push(newProp);
    saveToStorage(STORAGE_KEYS.PROPERTIES, props);
    return newProp;
  },

  // Wishlist
  toggleWishlist: async (propertyId: string): Promise<boolean> => {
    const user = api.getCurrentUser();
    if (!user) return false;
    let wishlist = getFromStorage<WishlistItem[]>(STORAGE_KEYS.WISHLIST, []);
    const exists = wishlist.some(item => item.userId === user.id && item.propertyId === propertyId);
    if (exists) {
      wishlist = wishlist.filter(item => !(item.userId === user.id && item.propertyId === propertyId));
    } else {
      wishlist.push({ userId: user.id, propertyId });
    }
    saveToStorage(STORAGE_KEYS.WISHLIST, wishlist);
    return !exists;
  },

  getWishlist: async (): Promise<Property[]> => {
    const user = api.getCurrentUser();
    if (!user) return [];
    const wishlist = getFromStorage<WishlistItem[]>(STORAGE_KEYS.WISHLIST, []);
    const propertyIds = wishlist.filter(item => item.userId === user.id).map(item => item.propertyId);
    const props = await api.getProperties();
    return props.filter(p => propertyIds.includes(p.id));
  },

  // Requests & Messages
  sendRequest: async (propertyId: string, ownerId: string, message: string): Promise<AccommodationRequest> => {
    const user = api.getCurrentUser();
    if (!user) throw new Error("Not logged in");
    const requests = getFromStorage<AccommodationRequest[]>(STORAGE_KEYS.REQUESTS, []);
    const newRequest: AccommodationRequest = {
      id: Math.random().toString(36).substr(2, 9),
      propertyId,
      ownerId,
      seekerId: user.id,
      message,
      status: 'new',
      createdAt: new Date().toISOString()
    };
    requests.push(newRequest);
    saveToStorage(STORAGE_KEYS.REQUESTS, requests);
    return newRequest;
  },

  getRequests: async (): Promise<AccommodationRequest[]> => {
    const user = api.getCurrentUser();
    if (!user) return [];
    const requests = getFromStorage<AccommodationRequest[]>(STORAGE_KEYS.REQUESTS, []);
    return requests.filter(r => r.ownerId === user.id || r.seekerId === user.id);
  }
};
