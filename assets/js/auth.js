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
/* ===========================================================
   AUTH.JS
   PART 2
=========================================================== */

/* ===========================================================
   RESET PASSWORD EMAIL
=========================================================== */

export async function resetPassword(email) {

    try {

        const { error } = await supabase.auth.resetPasswordForEmail(
            email,
            {
                redirectTo:
                    window.location.origin +
                    "/admin.html"
            }
        );

        if (error) throw error;

        return {
            success: true,
            message:
                "Password reset link has been sent."
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
   UPDATE PASSWORD
=========================================================== */

export async function updatePassword(newPassword) {

    try {

        const { error } =
            await supabase.auth.updateUser({

                password: newPassword

            });

        if (error) throw error;

        return {

            success: true

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
   LOGIN FORM HANDLER
=========================================================== */

export async function handleLogin(event) {

    event.preventDefault();

    const email =
        document.getElementById("email")?.value.trim();

    const password =
        document.getElementById("password")?.value;

    if (!email || !password) {

        alert("Please enter Email & Password");

        return;

    }

    const result =
        await login(email, password);

    if (result.success) {

        window.location.href =
            "dashboard.html";

    } else {

        alert(result.message);

    }

}

/* ===========================================================
   AUTO SESSION RESTORE
=========================================================== */

export async function restoreSession() {

    const {

        data: { session }

    } = await supabase.auth.getSession();

    if (!session) return false;

    return true;

}

/* ===========================================================
   INITIALIZE LOGIN PAGE
=========================================================== */

export function initLogin() {

    const loginForm =
        document.getElementById("loginForm");

    if (loginForm) {

        loginForm.addEventListener(
            "submit",
            handleLogin
        );

    }

}

/* ===========================================================
   AUTO INIT
=========================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initLogin();

    }
);
