import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [profileLoading, setProfileLoading] = useState(false);

    // Fetch profile from profiles table
    // Ensure profile row exists in the profiles table
    const ensureProfileExists = async (userId) => {
        // First try to fetch existing profile
        const { data: existing } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (existing) return existing;

        // Profile doesn't exist — create it from Google metadata
        const { data: { user: authUser } } = await supabase.auth.getUser();
        const meta = authUser?.user_metadata || {};

        const { data, error } = await supabase
            .from('profiles')
            .upsert({
                id: userId,
                full_name: meta.full_name || meta.name || '',
                avatar_url: meta.avatar_url || meta.picture || '',
            }, { onConflict: 'id' })
            .select()
            .single();

        if (error) {
            console.warn('Profile upsert warning:', error.message);
        }
        return data;
    };

    const fetchProfile = async (userId) => {
        setProfileLoading(true);
        try {
            let { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error && error.code === 'PGRST116') {
                // No profile exists yet — create one from Google metadata
                console.log('No profile found, creating one...');
                data = await ensureProfileExists(userId);
            }

            if (data) {
                setProfile(data);
            } else {
                console.warn('Could not fetch or create profile for user:', userId);
            }
        } catch (err) {
            console.error('Error fetching profile:', err);
        } finally {
            setProfileLoading(false);
        }
    };

    const updateProfile = async (updates) => {
        if (!user) return;
        try {
            const { data, error } = await supabase
                .from('profiles')
                .update(updates)
                .eq('id', user.id)
                .select()
                .single();

            if (error) throw error;
            setProfile(data);
            return data;
        } catch (err) {
            console.error('Error updating profile:', err);
            throw err;
        }
    };

    useEffect(() => {
        // Get the initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchProfile(session.user.id);
            }
            setLoading(false);
        });

        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setSession(session);
                setUser(session?.user ?? null);
                if (session?.user) {
                    fetchProfile(session.user.id);
                } else {
                    setProfile(null);
                }
                setLoading(false);
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    const signInWithGoogle = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin,
            },
        });
        if (error) {
            console.error('Error signing in with Google:', error.message);
        }
    };

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Error signing out:', error.message);
        }
        setProfile(null);
    };

    // Check if profile needs completion
    const isProfileComplete = profile && profile.college && profile.branch && profile.semester;

    const value = {
        user,
        session,
        profile,
        loading,
        profileLoading,
        isProfileComplete,
        signInWithGoogle,
        signOut,
        updateProfile,
        ensureProfileExists: () => user && ensureProfileExists(user.id),
        refreshProfile: () => user && fetchProfile(user.id),
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
