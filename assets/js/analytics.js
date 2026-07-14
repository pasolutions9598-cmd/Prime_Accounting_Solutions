/* ===========================================================
   Prime Accounting Solutions
   analytics.js
   Production Ready
   Part 1
=========================================================== */

import { supabase } from "./supabase.js";

/* ===========================================================
   DOM ELEMENTS
=========================================================== */

const monthFilter =
    document.getElementById("analyticsMonthFilter");

const refreshBtn =
    document.getElementById("refreshAnalyticsBtn");

const monthlyVisitors =
    document.getElementById("monthlyVisitors");

const monthlyLeads =
    document.getElementById("monthlyLeads");

const monthlyPosts =
    document.getElementById("monthlyPosts");

const monthlyTestimonials =
    document.getElementById("monthlyTestimonials");

const monthlyServices =
    document.getElementById("monthlyServices");

/* ===========================================================
   HELPERS
=========================================================== */

function setValue(element, value) {

    if (!element) return;

    element.textContent = value;

}

function getSelectedMonth() {

    return Number(monthFilter?.value || new Date().getMonth() + 1);

}

function isCurrentMonth(dateString) {

    if (!dateString) return false;

    const date = new Date(dateString);

    return (
        date.getMonth() + 1 === getSelectedMonth()
    );

}

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

            supabase.from("visitors").select("*"),

            supabase.from("leads").select("*"),

            supabase.from("posts").select("*"),

            supabase.from("testimonials").select("*"),

            supabase.from("services").select("*")

        ]);

        setValue(

            monthlyVisitors,

            (visitors.data || []).filter(v =>
                isCurrentMonth(v.created_at)
            ).length

        );

        setValue(

            monthlyLeads,

            (leads.data || []).filter(v =>
                isCurrentMonth(v.created_at)
            ).length

        );

        setValue(

            monthlyPosts,

            (posts.data || []).filter(v =>
                isCurrentMonth(v.created_at)
            ).length

        );

        setValue(

            monthlyTestimonials,

            (testimonials.data || []).filter(v =>
                isCurrentMonth(v.created_at)
            ).length

        );

        setValue(

            monthlyServices,

            (services.data || []).filter(v =>
                isCurrentMonth(v.created_at)
            ).length

        );

    } catch (err) {

        console.error("Analytics Error", err);

    }

   }
/* ===========================================================
   REFRESH ANALYTICS
=========================================================== */

refreshBtn?.addEventListener(
    "click",
    async () => {

        await loadAnalytics();

    }
);

/* ===========================================================
   MONTH FILTER
=========================================================== */

monthFilter?.addEventListener(
    "change",
    async () => {

        await loadAnalytics();

    }
);

/* ===========================================================
   EXPORT CSV
=========================================================== */

const exportCsvBtn =
    document.getElementById("exportCsvBtn");

exportCsvBtn?.addEventListener(
    "click",
    () => {

        alert(
            "CSV Export will be connected in the next update."
        );

    }
);

/* ===========================================================
   EXPORT PDF
=========================================================== */

const exportPdfBtn =
    document.getElementById("exportPdfBtn");

exportPdfBtn?.addEventListener(
    "click",
    () => {

        alert(
            "PDF Export will be connected in the next update."
        );

    }
);

/* ===========================================================
   CHART PLACEHOLDER
=========================================================== */

function initializeCharts() {

    console.log(
        "Charts Ready"
    );

    /*
      Chart.js integration
      will be added here.
    */

}

/* ===========================================================
   INITIALIZE ANALYTICS
=========================================================== */

export async function initAnalytics() {

    console.log(
        "Analytics Module Initialized"
    );

    initializeCharts();

    await loadAnalytics();

}

/* ===========================================================
   AUTO START
=========================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initAnalytics();

    }
);
