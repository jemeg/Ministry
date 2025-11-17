
// main.js
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';


// TODO: ضع هنا القيم الحقيقية من لوحة Supabase
export const SUPABASE_URL = 'https://mtviilkrpdcskikjsvle.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10dmlpbGtycGRjc2tpa2pzdmxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzMzA4NjgsImV4cCI6MjA3ODkwNjg2OH0.Zqo2qsAO2mcFLxhtLCgs9T8OlijT2Hx_xCqXfgwfu4E';


export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
