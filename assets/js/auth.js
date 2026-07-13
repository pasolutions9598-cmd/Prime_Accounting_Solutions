/* ===========================================================
   Prime Accounting Solutions
   auth.js
   Part 1
=========================================================== */

import { supabase } from "./supabase.js";

/* ===========================================================
   LOGIN
=========================================================== */

export async function login(email, password) {

    try {

        const { data, error } =
            await supabase.auth.signInWithPassword({

                email,
                password

            });

        if (error) throw error;

        return {
            success: true,
            user: data.user
        };

    } catch (err) {

        console.error(err);

        return {
            success: false,
            message: err.message
        };

    }

}

/* ===========================================================
   LOGOUT
=========================================================== */

export async function logout() {

    await supabase.auth.signOut();

    window.location.href = "admin.html";

}

/* ===========================================================
   CHECK AUTH
=========================================================== */

export async function checkAuth() {

    const {

        data: { session }

    } = await supabase.auth.getSession();

    return !!session;

}

/* ===========================================================
   CURRENT USER
=========================================================== */

export async function getCurrentUser() {

    const {

        data: { user }

    } = await supabase.auth.getUser();

    return user;

}

/* ===========================================================
   AUTH STATE LISTENER
=========================================================== */

supabase.auth.onAuthStateChange((event, session) => {

    console.log("Auth State :", event);

    if (!session) {

        if (!window.location.pathname.includes("admin.html")) {

            window.location.href = "admin.html";

        }

    }

});
