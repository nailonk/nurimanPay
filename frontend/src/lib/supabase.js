import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://yhlcbzuknnmwoxqjdlmz.supabase.co"
const supabaseAnonKey = "sb_publishable_bPxRjKORQed_79Ka_asOHQ_KVHQgyn4"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)