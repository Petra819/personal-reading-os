import { createClient } from "@/lib/supabase/server";

export async function getAuthenticatedSupabase() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;

  if (error || typeof userId !== "string" || !userId) {
    return null;
  }

  return { supabase, userId };
}
