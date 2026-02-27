import { createClient } from '@supabase/supabase-js';

// Vite වලදී environment variables access කරන්නේ මෙහෙමයි
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// URL එක හෝ Key එක නැතිනම් error එකක් පෙන්වනවා
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or Anon Key is missing. Check your .env file.');
}

// Supabase client එක නිර්මාණය කර export කිරීම
export const supabase = createClient(supabaseUrl, supabaseAnonKey);