
import { User, Property, UserRole, WishlistItem, AccommodationRequest } from '../types';
import { supabase, isSupabaseConfigured } from './supabase';
import { MOCK_PROPERTIES } from '../constants';

export const api = {
  // Authentication
  getCurrentUser: async (): Promise<User | null> => {
    if (!isSupabaseConfigured) return null;
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      return profile;
    } catch (e) {
      return null;
    }
  },
  
  login: async (email: string, password?: string): Promise<User | null> => {
    if (!isSupabaseConfigured) throw new Error("Database not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment.");
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: password || 'temporary_password_123' 
    });

    if (error) throw error;
    return api.getCurrentUser();
  },

  signUp: async (email: string, password?: string): Promise<User | null> => {
    if (!isSupabaseConfigured) throw new Error("Database not configured.");
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password: password || 'temporary_password_123'
    });

    if (error) throw error;
    
    if (data.user) {
      await supabase.from('profiles').insert([
        { id: data.user.id, email: data.user.email, role: UserRole.NONE, profile_complete: false }
      ]);
    }
    
    return api.getCurrentUser();
  },

  updateProfile: async (userData: Partial<User>): Promise<User> => {
    if (!isSupabaseConfigured) throw new Error("Database not configured.");
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not logged in");

    const { data, error } = await supabase
      .from('profiles')
      .update({
        full_name: userData.fullName,
        phone: userData.phone,
        age: userData.age,
        gender: userData.gender,
        role: userData.role,
        permanent_address: userData.permanentAddress,
        current_address: userData.currentAddress,
        profile_complete: true
      })
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  logout: async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
  },

  // Properties
  getProperties: async (filters?: { type?: string, minPrice?: number, maxPrice?: number }): Promise<Property[]> => {
    if (!isSupabaseConfigured) {
      console.warn("Using mock data because Supabase is not configured.");
      return MOCK_PROPERTIES as any;
    }

    let query = supabase.from('properties').select('*');
    
    if (filters) {
      if (filters.type) query = query.eq('property_type', filters.type);
      if (filters.minPrice) query = query.gte('rent', filters.minPrice);
      if (filters.maxPrice) query = query.lte('rent', filters.maxPrice);
    }

    const { data, error } = await query;
    if (error) throw error;
    
    return data.map(p => ({
      id: p.id,
      ownerId: p.owner_id,
      propertyType: p.property_type,
      roomType: p.room_type,
      rent: p.rent,
      address: p.address,
      coordinates: p.coordinates,
      images: p.images,
      description: p.description,
      createdAt: p.created_at,
      verified: p.verified
    }));
  },

  addProperty: async (propData: Omit<Property, 'id' | 'createdAt' | 'verified'>): Promise<Property> => {
    if (!isSupabaseConfigured) throw new Error("Database not configured.");
    
    const { data, error } = await supabase
      .from('properties')
      .insert([{
        owner_id: propData.ownerId,
        property_type: propData.propertyType,
        room_type: propData.roomType,
        rent: propData.rent,
        address: propData.address,
        description: propData.description,
        coordinates: propData.coordinates,
        images: propData.images,
        verified: false
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
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
      .single();

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

    const { data: wishlistData } = await supabase
      .from('wishlist')
      .select('property_id')
      .eq('user_id', user.id);

    if (!wishlistData || wishlistData.length === 0) return [];

    const ids = wishlistData.map(w => w.property_id);
    const props = await api.getProperties();
    return props.filter(p => ids.includes(p.id));
  },

  // Requests
  sendRequest: async (propertyId: string, ownerId: string, message: string): Promise<AccommodationRequest> => {
    if (!isSupabaseConfigured) throw new Error("Database not configured.");
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
      .or(`owner_id.eq.${user.id},seeker_id.eq.${user.id}`);

    if (error) throw error;
    return data;
  }
};
