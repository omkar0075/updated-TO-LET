
import { User, Property, UserRole, WishlistItem, AccommodationRequest } from '../types';
import { supabase, isSupabaseConfigured } from './supabase';
import { MOCK_PROPERTIES } from '../constants';

// Mapping functions to convert between DB snake_case and Frontend camelCase
const mapProperty = (p: any): Property => ({
  id: p.id,
  ownerId: p.owner_id,
  propertyType: p.property_type,
  roomType: p.room_type,
  rent: p.rent,
  address: p.address,
  coordinates: { lat: Number(p.latitude), lng: Number(p.longitude) },
  images: p.images || [],
  description: p.description,
  createdAt: p.created_at,
  verified: p.verified
});

const mapUser = (u: any): User => ({
  id: u.id,
  email: u.email,
  fullName: u.full_name,
  phone: u.phone,
  age: u.age,
  gender: u.gender,
  role: u.role as UserRole,
  permanentAddress: u.permanent_address,
  currentAddress: u.current_address,
  profileComplete: u.profile_complete
});

export const api = {
  // Authentication & Profile
  getCurrentUser: async (): Promise<User | null> => {
    if (!isSupabaseConfigured) return null;
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: profile, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error || !profile) return null;
      return mapUser(profile);
    } catch (e) {
      return null;
    }
  },
  
  login: async (email: string, password?: string): Promise<User | null> => {
    if (!isSupabaseConfigured) {
      console.warn("Supabase not configured. Login is simulated.");
      return null; 
    }
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: password || 'temporary_password_123' 
    });

    if (error) {
      return api.signUp(email, password);
    }
    return api.getCurrentUser();
  },

  signUp: async (email: string, password?: string): Promise<User | null> => {
    if (!isSupabaseConfigured) throw new Error("Supabase is not configured.");
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password: password || 'temporary_password_123'
    });

    if (error) throw error;
    
    if (data.user) {
      const { error: profileError } = await supabase.from('users').insert([
        { 
          id: data.user.id, 
          email: data.user.email, 
          role: 'NONE', 
          profile_complete: false 
        }
      ]);
    }
    
    return api.getCurrentUser();
  },

  updateProfile: async (userData: Partial<User>): Promise<User> => {
    if (!isSupabaseConfigured) throw new Error("Supabase is not configured.");
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not logged in");

    const updates: any = {};
    if (userData.fullName !== undefined) updates.full_name = userData.fullName;
    if (userData.phone !== undefined) updates.phone = userData.phone;
    if (userData.age !== undefined) updates.age = userData.age;
    if (userData.gender !== undefined) updates.gender = userData.gender;
    if (userData.role !== undefined) updates.role = userData.role;
    if (userData.permanentAddress !== undefined) updates.permanent_address = userData.permanentAddress;
    if (userData.currentAddress !== undefined) updates.current_address = userData.currentAddress;
    if (userData.profileComplete !== undefined) updates.profile_complete = userData.profileComplete;

    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw error;
    return mapUser(data);
  },

  logout: async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
  },

  // Properties
  getProperties: async (filters?: { type?: string, minPrice?: number, maxPrice?: number }): Promise<Property[]> => {
    if (!isSupabaseConfigured) {
      // Return mock data as a fallback so the app isn't empty
      return MOCK_PROPERTIES as any;
    }

    let query = supabase.from('properties').select('*').order('created_at', { ascending: false });
    
    if (filters) {
      if (filters.type) query = query.eq('property_type', filters.type);
      if (filters.minPrice) query = query.gte('rent', filters.minPrice);
      if (filters.maxPrice) query = query.lte('rent', filters.maxPrice);
    }

    const { data, error } = await query;
    if (error) {
      return MOCK_PROPERTIES as any;
    }
    
    return data.map(mapProperty);
  },

  addProperty: async (propData: Omit<Property, 'id' | 'createdAt' | 'verified'>): Promise<Property> => {
    if (!isSupabaseConfigured) throw new Error("Supabase is not configured.");
    
    const { data, error } = await supabase
      .from('properties')
      .insert([{
        owner_id: propData.ownerId,
        property_type: propData.propertyType,
        room_type: propData.roomType,
        rent: propData.rent,
        address: propData.address,
        description: propData.description,
        latitude: propData.coordinates.lat,
        longitude: propData.coordinates.lng,
        images: propData.images,
        verified: false
      }])
      .select()
      .single();

    if (error) throw error;
    return mapProperty(data);
  },

  // Wishlist
  toggleWishlist: async (propertyId: string): Promise<boolean> => {
    if (!isSupabaseConfigured) return false;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data: existing } = await supabase
      .from('wishlist')
      .select('*')
      .eq('user_id', user.id)
      .eq('property_id', propertyId)
      .maybeSingle();

    if (existing) {
      await supabase.from('wishlist').delete().eq('id', existing.id);
      return false;
    } else {
      await supabase.from('wishlist').insert([{ user_id: user.id, property_id: propertyId }]);
      return true;
    }
  },

  getWishlist: async (): Promise<Property[]> => {
    if (!isSupabaseConfigured) return [];
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data: wishlistItems, error } = await supabase
      .from('wishlist')
      .select('property_id')
      .eq('user_id', user.id);

    if (error || !wishlistItems || wishlistItems.length === 0) return [];

    const ids = wishlistItems.map(w => w.property_id);
    const { data: properties, error: propsError } = await supabase
      .from('properties')
      .select('*')
      .in('id', ids);

    if (propsError || !properties) return [];
    return properties.map(mapProperty);
  },

  // Requests
  sendRequest: async (propertyId: string, ownerId: string, message: string): Promise<AccommodationRequest> => {
    if (!isSupabaseConfigured) throw new Error("Supabase is not configured.");
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not logged in");

    const { data, error } = await supabase
      .from('requests')
      .insert([{
        property_id: propertyId,
        owner_id: ownerId,
        seeker_id: user.id,
        message,
        status: 'new'
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  getRequests: async (): Promise<AccommodationRequest[]> => {
    if (!isSupabaseConfigured) return [];
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('requests')
      .select('*')
      .or(`owner_id.eq.${user.id},seeker_id.eq.${user.id}`)
      .order('created_at', { ascending: false });

    if (error) return [];
    return data;
  }
};
