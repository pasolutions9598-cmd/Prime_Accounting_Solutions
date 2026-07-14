/* ===========================================================
   Prime Accounting Solutions
   supabase.js
   Production Ready
=========================================================== */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

/* ===========================================================
   SUPABASE CONFIG
=========================================================== */

const SUPABASE_URL =
    "https://ariqthzhspzktpoylqci.supabase.co";

const SUPABASE_ANON_KEY =
    "sb_publishable_GYSUR2xyPzrHvD0fapWjuA_6gr6_RTp";

/* ===========================================================
   CREATE CLIENT
=========================================================== */

export const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
        auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true
        }
    }
);

/* ===========================================================
   TEST CONNECTION
=========================================================== */

export async function testConnection() {

    try {

        const { error } = await supabase
            .from("posts")
            .select("id")
            .limit(1);

        if (error) {

            console.error("Supabase Error:", error);

            return false;

        }

        console.log("✅ Supabase Connected");

        return true;

    } catch (err) {

        console.error(err);

        return false;

    }

          }
