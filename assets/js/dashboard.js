/* ===========================================================
   Prime Accounting Solutions
   dashboard.js
   Production Ready
   Part 1
=========================================================== */

import { supabase } from "./supabase.js";

/* ===========================================================
   DOM ELEMENTS
=========================================================== */

const totalLeads =
    document.getElementById("totalLeads");

const totalPosts =
    document.getElementById("totalPosts");

const totalTestimonials =
    document.getElementById("totalTestimonials");

const totalServices =
    document.getElementById("totalServices");

const totalVisitors =
    document.getElementById("totalVisitors");

const recentLeadsTable =
    document.getElementById("recentLeadsTable");

const recentPostsTable =
    document.getElementById("recentPostsTable");

const recentActivity =
    document.getElementById("recentActivity");

/* ===========================================================
   HELPERS
=========================================================== */

function setValue(element, value) {

    if (!element) return;

    element.textContent = value;

}

function showEmptyTable(table, message) {

    if (!table) return;

    table.innerHTML = `
        <tr>
            <td colspan="10">${message}</td>
        </tr>
    `;

}

/* ===========================================================
   DASHBOARD COUNTERS
=========================================================== */

async function loadCounters() {

    try {

        const [

            leads,

            posts,

            testimonials,

            services,

            visitors

        ] = await Promise.all([

            supabase
                .from("leads")
                .select("*", {
                    count: "exact",
                    head: true
                }),

            supabase
                .from("posts")
                .select("*", {
                    count: "exact",
                    head: true
                }),

            supabase
                .from("testimonials")
                .select("*", {
                    count: "exact",
                    head: true
                }),

            supabase
                .from("services")
                .select("*", {
                    count: "exact",
                    head: true
                }),

            supabase
                .from("visitors")
                .select("*", {
                    count: "exact",
                    head: true
                })

        ]);

        setValue(
            totalLeads,
            leads.count ?? 0
        );

        setValue(
            totalPosts,
            posts.count ?? 0
        );

        setValue(
            totalTestimonials,
            testimonials.count ?? 0
        );

        setValue(
            totalServices,
            services.count ?? 0
        );

        setValue(
            totalVisitors,
            visitors.count ?? 0
        );

    } catch (err) {

        console.error(
            "Dashboard Counter Error",
            err
        );

        setValue(totalLeads, "-");
        setValue(totalPosts, "-");
        setValue(totalTestimonials, "-");
        setValue(totalServices, "-");
        setValue(totalVisitors, "-");

    }

}

/* ===========================================================
   RECENT LEADS
=========================================================== */

async function loadRecentLeads() {

    if (!recentLeadsTable) return;

    try {

        const {

            data,

            error

        } = await supabase

            .from("leads")

            .select("*")

            .order(
                "created_at",
                {
                    ascending: false
                }
            )

            .limit(5);

        if (error) throw error;

        if (!data.length) {

            showEmptyTable(
                recentLeadsTable,
                "No Leads Found"
            );

            return;

        }

        recentLeadsTable.innerHTML = "";

        data.forEach(item => {

            recentLeadsTable.innerHTML += `

<tr>

<td>${item.name ?? "-"}</td>

<td>${item.phone ?? "-"}</td>

<td>${item.service ?? "-"}</td>

<td>${item.status ?? "New"}</td>

</tr>

`;

        });

    } catch (err) {

        console.error(err);

        showEmptyTable(
            recentLeadsTable,
            "Unable to Load Leads"
        );

    }

    }
/* ===========================================================
   RECENT POSTS
=========================================================== */

async function loadRecentPosts() {

    if (!recentPostsTable) return;

    try {

        const {
            data,
            error
        } = await supabase
            .from("posts")
            .select("*")
            .order("created_at", {
                ascending: false
            })
            .limit(5);

        if (error) throw error;

        if (!data || data.length === 0) {

            showEmptyTable(
                recentPostsTable,
                "No Posts Found"
            );

            return;

        }

        recentPostsTable.innerHTML = "";

        data.forEach(post => {

            recentPostsTable.innerHTML += `

<tr>

<td>${post.title ?? "-"}</td>

<td>${post.category ?? "-"}</td>

<td>${post.status ?? "-"}</td>

<td>${post.created_at
    ? new Date(post.created_at).toLocaleDateString()
    : "-"}</td>

</tr>

`;

        });

    } catch (err) {

        console.error(err);

        showEmptyTable(
            recentPostsTable,
            "Unable to Load Posts"
        );

    }

}

/* ===========================================================
   RECENT ACTIVITY
=========================================================== */

async function loadRecentActivity() {

    if (!recentActivity) return;

    try {

        const {
            data,
            error
        } = await supabase
            .from("posts")
            .select("title,created_at")
            .order("created_at", {
                ascending: false
            })
            .limit(5);

        if (error) throw error;

        if (!data || data.length === 0) {

            recentActivity.innerHTML =
                "<p>No Recent Activity</p>";

            return;

        }

        recentActivity.innerHTML = "";

        data.forEach(item => {

            recentActivity.innerHTML += `

<div class="activity-item">

<h4>New Post Published</h4>

<p>${item.title ?? "-"}</p>

<small>

${item.created_at
    ? new Date(item.created_at).toLocaleString()
    : "-"}

</small>

</div>

`;

        });

    } catch (err) {

        console.error(err);

        recentActivity.innerHTML =
            "<p>Unable to Load Activity</p>";

    }

}

/* ===========================================================
   LOAD COMPLETE DASHBOARD
=========================================================== */

export async function loadDashboard() {

    await Promise.all([

        loadCounters(),

        loadRecentLeads(),

        loadRecentPosts(),

        loadRecentActivity()

    ]);

}

/* ===========================================================
   REFRESH DASHBOARD
=========================================================== */

export async function refreshDashboard() {

    await loadDashboard();

}

/* ===========================================================
   INITIALIZE DASHBOARD
=========================================================== */

export async function initDashboard() {

    console.log(
        "Dashboard Initialized"
    );

    await loadDashboard();

}

/* ===========================================================
   AUTO START
=========================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initDashboard();

    }
);
