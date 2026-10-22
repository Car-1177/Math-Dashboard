import { createClient } from "@supabase/supabase-js";

const url = "https://hkekagqzpqyutmhliypv.supabase.co";
const key = "sb_publishable_zy2KBJNCmQNz1B6wel4wDg_ewrIUAdN";

export const supabase = createClient(url, key);