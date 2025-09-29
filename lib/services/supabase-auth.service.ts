import { createClient } from '../supabase/client';
import { createClient as createServerClient } from '../supabase/server';

export class SupabaseAuthService {
  private static instance: SupabaseAuthService;
  
  static getInstance(): SupabaseAuthService {
    if (!SupabaseAuthService.instance) {
      SupabaseAuthService.instance = new SupabaseAuthService();
    }
    return SupabaseAuthService.instance;
  }

  // Client-side methods
  async signUp(email: string, password: string, userData: {
    prenom: string;
    nom: string;
    date_naissance: Date;
    canton: string;
    situation_familiale: string;
    nombre_enfants: number;
    profession: string;
  }) {
    const supabase = createClient();
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    });

    if (error) throw error;
    return data;
  }

  async signIn(email: string, password: string) {
    const supabase = createClient();
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    return data;
  }

  async signOut() {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  async getCurrentUser() {
    const supabase = createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  }

  // Server-side methods
  static async getServerUser() {
    const supabase = createServerClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) return null;
    return user;
  }

  static async getUserProfile(userId: string) {
    const supabase = createServerClient();
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (error) throw error;
    return data;
  }

  static async getUserFinancialProfile(userId: string) {
    const supabase = createServerClient();
    
    const { data, error } = await supabase
      .from('financial_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
      
    if (error && error.code !== 'PGRST116') throw error; // Ignore "not found" error
    return data;
  }

  static async getUserGoals(userId: string) {
    const supabase = createServerClient();
    
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data || [];
  }

  static async updateProfile(userId: string, profileData: any) {
    const supabase = createServerClient();
    
    const { data, error } = await supabase
      .from('profiles')
      .upsert({ 
        id: userId, 
        ...profileData,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
      
    if (error) throw error;
    return data;
  }

  static async updateFinancialProfile(userId: string, financialData: any) {
    const supabase = createServerClient();
    
    const { data, error } = await supabase
      .from('financial_profiles')
      .upsert({ 
        user_id: userId, 
        ...financialData,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
      
    if (error) throw error;
    return data;
  }

  static async createGoal(userId: string, goalData: any) {
    const supabase = createServerClient();
    
    const { data, error } = await supabase
      .from('goals')
      .insert({ 
        user_id: userId, 
        ...goalData 
      })
      .select()
      .single();
      
    if (error) throw error;
    return data;
  }
}