import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Le client Supabase n'existe que si les variables d'environnement sont
// définies au build. Sans elles, l'app fonctionne en mode démo (localStorage).
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase: SupabaseClient | null =
  url && anonKey ? createClient(url, anonKey) : null;

export const isCloud = supabase !== null;
