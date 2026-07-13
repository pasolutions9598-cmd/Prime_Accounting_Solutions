/* ==========================================================
   Prime Accounting Solutions
   dashboard.js
   Part 1 - Dashboard Initialization & Statistics
========================================================== */

import { supabase } from "./supabase.js";

/* ==========================================================
   DOM ELEMENTS
========================================================== */

const totalLeadsEl = document.getElementById("totalLeads");
const totalPostsEl = document.getElementById("totalPosts");
const totalTestimonialsEl = document.getElementById("totalTestimonials");
const totalServicesEl = document.getElementById("totalServices");
const totalVisitorsEl = document.getElementById("totalVisitors");

/* ==========================================================
   UPDATE CARD
========================================================== */

function updateCard(element, value) {

    if (!element) return;

    element.textContent = value;

}

/* ==========================================================
   FETCH TOTAL LEADS
========================================================== */

async function loadTotalLeads() {

    try {

        const { count, error } = await supabase
            .from("leads")
            .select("*", {
                count: "exact",
                head: true
            });

        if (error) throw error;

        updateCard(totalLeadsEl, count || 0);

    } catch (err) {

        console.error("Leads Error:", err);

        updateCard(totalLeadsEl, "-");

    }

}

/* ==========================================================
   FETCH TOTAL POSTS
========================================================== */

async function loadTotalPosts() {

    try {

        const { count, error } = await supabase
            .from("posts")
            .select("*", {
                count: "exact",
                head: true
            });

        if (error) throw error;

        updateCard(totalPostsEl, count || 0);

    } catch (err) {

        console.error("Posts Error:", err);

        updateCard(totalPostsEl, "-");

    }

}

/* ==========================================================
   FETCH TOTAL TESTIMONIALS
========================================================== */

async function loadTotalTestimonials() {

    try {

        const { count, error } = await supabase
            .from("testimonials")
            .select("*", {
                count: "exact",
                head: true
            });

        if (error) throw error;

        updateCard(totalTestimonialsEl, count || 0);

    } catch (err) {

        console.error("Testimonials Error:", err);

        updateCard(totalTestimonialsEl, "-");

    }

}

/* ==========================================================
   FETCH TOTAL SERVICES
========================================================== */

async function loadTotalServices() {

    try {

        const { count, error } = await supabase
            .from("services")
            .select("*", {
                count: "exact",
                head: true
            });

        if (error) throw error;

        updateCard(totalServicesEl, count || 0);

    } catch (err) {

        console.error("Services Error:", err);

        updateCard(totalServicesEl, "-");

    }

}

/* ==========================================================
   FETCH VISITORS
========================================================== */

async function loadTotalVisitors() {

    try {

        const { count, error } = await supabase
            .from("visitors")
            .select("*", {
                count: "exact",
                head: true
            });

        if (error) throw error;

        updateCard(totalVisitorsEl, count || 0);

    } catch (err) {

        console.error("Visitors Error:", err);

        updateCard(totalVisitorsEl, "-");

    }

}

/* ==========================================================
   LOAD DASHBOARD STATS
========================================================== */

export async function loadDashboardStats() {

    await Promise.all([

        loadTotalLeads(),
        loadTotalPosts(),
        loadTotalTestimonials(),
        loadTotalServices(),
        loadTotalVisitors()

    ]);

}

/* ==========================================================
   REFRESH DASHBOARD
========================================================== */

export async function refreshDashboard() {

    await loadDashboardStats();

}

/* ==========================================================
   INITIALIZE DASHBOARD
========================================================== */

export async function initDashboard() {

    console.log("Dashboard Initialized");

    await loadDashboardStats();

}

/* ==========================================================
   AUTO START
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    initDashboard();

});
