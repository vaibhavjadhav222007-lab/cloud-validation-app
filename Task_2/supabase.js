import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";


const supabaseUrl = "https://puuyegrgfqtrzmclanrw.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1dXllZ3JnZnF0cnptY2xhbnJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2ODU2NTgsImV4cCI6MjA5MjI2MTY1OH0.u_vHTjJTAd2E6wU25MYVzTDSzlfSbmhC2jZcrNsgQAw";

const supabase = createClient(supabaseUrl, supabaseKey);

export { supabase };