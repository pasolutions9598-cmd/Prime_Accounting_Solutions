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
/* ==========================================================
   dashboard.js
   Part 2 - Recent Data
========================================================== */

/* ==========================================================
   DOM REFERENCES
========================================================== */

const recentLeadsTable =
    document.getElementById("recentLeadsTable");

const recentPostsTable =
    document.getElementById("recentPostsTable");

const recentActivity =
    document.getElementById("recentActivity");

/* ==========================================================
   LOAD RECENT LEADS
========================================================== */

async function loadRecentLeads() {

    if (!recentLeadsTable) return;

    try {

        const { data, error } = await supabase
            .from("leads")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(5);

        if (error) throw error;

        if (!data.length) {

            recentLeadsTable.innerHTML =
                "<tr><td colspan='4'>No Leads Found</td></tr>";

            return;

        }

        recentLeadsTable.innerHTML = "";

        data.forEach(lead => {

            recentLeadsTable.innerHTML += `
                <tr>
                    <td>${lead.name ?? "-"}</td>
                    <td>${lead.phone ?? "-"}</td>
                    <td>${lead.service ?? "-"}</td>
                    <td>${lead.status ?? "New"}</td>
                </tr>
            `;

        });

    } catch (err) {

        console.error(err);

    }

}

/* ==========================================================
   LOAD RECENT POSTS
========================================================== */

async function loadRecentPosts() {

    if (!recentPostsTable) return;

    try {

        const { data, error } = await supabase
            .from("posts")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(5);

        if (error) throw error;

        if (!data.length) {

            recentPostsTable.innerHTML =
                "<tr><td colspan='4'>No Posts Found</td></tr>";

            return;

        }

        recentPostsTable.innerHTML = "";

        data.forEach(post => {

            recentPostsTable.innerHTML += `
                <tr>
                    <td>${post.title}</td>
                    <td>${post.category}</td>
                    <td>${post.status}</td>
                    <td>${new Date(post.created_at).toLocaleDateString()}</td>
                </tr>
            `;

        });

    } catch (err) {

        console.error(err);

    }

}

/* ==========================================================
   LOAD RECENT ACTIVITY
========================================================== */

async function loadRecentActivity() {

    if (!recentActivity) return;

    recentActivity.innerHTML = "";

    try {

        const { data } = await supabase
            .from("posts")
            .select("title,created_at")
            .order("created_at", {
                ascending: false
            })
            .limit(5);

        if (!data || !data.length) {

            recentActivity.innerHTML =
                "<p>No Activity Found</p>";

            return;

        }

        data.forEach(item => {

            recentActivity.innerHTML += `

                <div class="activity-item">

                    <strong>
                        New Post Published
                    </strong>

                    <p>${item.title}</p>

                    <small>

                        ${new Date(item.created_at)
                            .toLocaleString()}

                    </small>

                </div>

            `;

        });

    } catch (err) {

        console.error(err);

    }

}

/* ==========================================================
   LOAD ALL DASHBOARD DATA
========================================================== */

export async function loadDashboardData() {

    await Promise.all([

        loadRecentLeads(),

        loadRecentPosts(),

        loadRecentActivity()

    ]);

}

/* ==========================================================
   UPDATE INIT
========================================================== */

const oldInitDashboard = initDashboard;

initDashboard = async function () {

    await oldInitDashboard();

    await loadDashboardData();

};
