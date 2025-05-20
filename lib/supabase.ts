import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

function getSupabaseClient() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error(
      "Missing environment variable: NEXT_PUBLIC_SUPABASE_URL. Please check your .env file."
    );
  }
  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error(
      "Missing environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY. Please check your .env file."
    );
  }

  try {
    return createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
        },
      }
    );
  } catch (error) {
    console.error("Failed to initialize Supabase client:", error);
    throw new Error(
      "Failed to initialize Supabase client. Please check your configuration."
    );
  }
}

export const supabase = getSupabaseClient();
