// import { createClient } from '@supabase/supabase-js';

// const supabaseUrl = 'https://gorswnaodamspmfoswgs.supabase.co';
// const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdvcnN3bmFvZGFtc3BtZm9zd2dzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0MTQ0NzcsImV4cCI6MjA2Nzk5MDQ3N30.ML3yaCGSZrQwWGhELsko1lNu0I5wnddyoDtY5fB_vVw';

// export const supabase = createClient(supabaseUrl, supabaseAnonKey);


// src/supabaseClient.js

import { createClient } from '@supabase/supabase-js';

// Your Supabase project URL and anon key
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Export default for easier imports
export default supabase;

