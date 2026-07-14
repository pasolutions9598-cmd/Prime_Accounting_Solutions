/* ===========================================================
   Prime Accounting Solutions
   analytics.js
   Part 1
=========================================================== */

import { supabase } from "./supabase.js";

/* ===========================================================
   DOM ELEMENTS
=========================================================== */

const totalVisitorsCard =
    document.getElementById("totalVisitors");

const totalLeadsCard =
    document.getElementById("totalLeads");

const totalPostsCard =
    document.getElementById("totalPosts");

const totalTestimonialsCard =
    document.getElementById("totalTestimonials");

const totalServicesCard =
    document.getElementById("totalServices");

const refreshAnalyticsBtn =
    document.getElementById("refreshAnalyticsBtn");

/* ===========================================================
   GLOBAL STATE
=========================================================== */

let analyticsData = {

    visitors: 0,

    leads: 0,

    posts: 0,

    testimonials: 0,

    services: 0

};

/* ===========================================================
   LOAD ANALYTICS
=========================================================== */

export async function loadAnalytics() {

    try {

        const [

            visitors,

            leads,

            posts,

            testimonials,

            services

        ] = await Promise.all([

            supabase
                .from("visitors")
                .select("*", {
                    count: "exact",
                    head: true
                }),

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
                })

        ]);

        analyticsData = {

            visitors:
                visitors.count || 0,

            leads:
                leads.count || 0,

            posts:
                posts.count || 0,

            testimonials:
                testimonials.count || 0,

            services:
                services.count || 0

        };

        renderAnalytics();

    }

    catch (err) {

        console.error(

            "Analytics Error:",

            err

        );

    }

}

/* ===========================================================
   RENDER ANALYTICS
=========================================================== */

function renderAnalytics() {

    if (totalVisitorsCard)

        totalVisitorsCard.textContent =
            analyticsData.visitors;

    if (totalLeadsCard)

        totalLeadsCard.textContent =
            analyticsData.leads;

    if (totalPostsCard)

        totalPostsCard.textContent =
            analyticsData.posts;

    if (totalTestimonialsCard)

        totalTestimonialsCard.textContent =
            analyticsData.testimonials;

    if (totalServicesCard)

        totalServicesCard.textContent =
            analyticsData.services;

}

/* ===========================================================
   REFRESH
=========================================================== */

export async function refreshAnalytics() {

    await loadAnalytics();

}

/* ===========================================================
   EVENTS
=========================================================== */

if (refreshAnalyticsBtn) {

    refreshAnalyticsBtn.addEventListener(

        "click",

        refreshAnalytics

    );

}

/* ===========================================================
   INIT
=========================================================== */

export async function initAnalytics() {

    console.log(

        "Analytics Module Loaded"

    );

    await loadAnalytics();

}

document.addEventListener(

    "DOMContentLoaded",

    () => {

        initAnalytics();

    }

);
/* ===========================================================
   ANALYTICS.JS
   PART 2A
   Monthly Analytics + Date Filter
=========================================================== */

/* ===========================================================
   DOM ELEMENTS
=========================================================== */

const analyticsMonthFilter =
    document.getElementById("analyticsMonthFilter");

const monthlyLeadsCard =
    document.getElementById("monthlyLeads");

const monthlyPostsCard =
    document.getElementById("monthlyPosts");

const monthlyTestimonialsCard =
    document.getElementById("monthlyTestimonials");

const monthlyServicesCard =
    document.getElementById("monthlyServices");

const monthlyVisitorsCard =
    document.getElementById("monthlyVisitors");

/* ===========================================================
   MONTHLY DATA
=========================================================== */

let monthlyAnalytics = {

    leads: 0,

    posts: 0,

    testimonials: 0,

    services: 0,

    visitors: 0

};

/* ===========================================================
   LOAD MONTHLY ANALYTICS
=========================================================== */

export async function loadMonthlyAnalytics() {

    try {

        const selectedMonth =

            analyticsMonthFilter?.value ||

            new Date().getMonth() + 1;

        const selectedYear =

            new Date().getFullYear();

        const [

            leads,

            posts,

            testimonials,

            services,

            visitors

        ] = await Promise.all([

            supabase
                .from("leads")
                .select("created_at"),

            supabase
                .from("posts")
                .select("created_at"),

            supabase
                .from("testimonials")
                .select("created_at"),

            supabase
                .from("services")
                .select("created_at"),

            supabase
                .from("visitors")
                .select("created_at")

        ]);

        monthlyAnalytics.leads =

            (leads.data || []).filter(item => {

                const d = new Date(item.created_at);

                return (

                    d.getMonth() + 1 == selectedMonth &&

                    d.getFullYear() == selectedYear

                );

            }).length;

        monthlyAnalytics.posts =

            (posts.data || []).filter(item => {

                const d = new Date(item.created_at);

                return (

                    d.getMonth() + 1 == selectedMonth &&

                    d.getFullYear() == selectedYear

                );

            }).length;

        monthlyAnalytics.testimonials =

            (testimonials.data || []).filter(item => {

                const d = new Date(item.created_at);

                return (

                    d.getMonth() + 1 == selectedMonth &&

                    d.getFullYear() == selectedYear

                );

            }).length;

        monthlyAnalytics.services =

            (services.data || []).filter(item => {

                const d = new Date(item.created_at);

                return (

                    d.getMonth() + 1 == selectedMonth &&

                    d.getFullYear() == selectedYear

                );

            }).length;

        monthlyAnalytics.visitors =

            (visitors.data || []).filter(item => {

                const d = new Date(item.created_at);

                return (

                    d.getMonth() + 1 == selectedMonth &&

                    d.getFullYear() == selectedYear

                );

            }).length;

        renderMonthlyAnalytics();

    }

    catch (err) {

        console.error(

            "Monthly Analytics Error:",

            err

        );

    }

}

/* ===========================================================
   RENDER MONTHLY DATA
=========================================================== */

function renderMonthlyAnalytics() {

    if (monthlyLeadsCard)

        monthlyLeadsCard.textContent =

            monthlyAnalytics.leads;

    if (monthlyPostsCard)

        monthlyPostsCard.textContent =

            monthlyAnalytics.posts;

    if (monthlyTestimonialsCard)

        monthlyTestimonialsCard.textContent =

            monthlyAnalytics.testimonials;

    if (monthlyServicesCard)

        monthlyServicesCard.textContent =

            monthlyAnalytics.services;

    if (monthlyVisitorsCard)

        monthlyVisitorsCard.textContent =

            monthlyAnalytics.visitors;

}

/* ===========================================================
   MONTH FILTER EVENT
=========================================================== */

analyticsMonthFilter?.addEventListener(

    "change",

    loadMonthlyAnalytics

);

/* ===========================================================
   REFRESH MONTHLY DATA
=========================================================== */

export async function refreshMonthlyAnalytics() {

    await loadMonthlyAnalytics();

          }
