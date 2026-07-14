/* ===========================================================
   Prime Accounting Solutions
   testimonial.js
   Part 1
=========================================================== */

import { supabase } from "./supabase.js";

/* ===========================================================
   DOM ELEMENTS
=========================================================== */

const testimonialTableBody =
    document.getElementById("testimonialTableBody");

const totalTestimonialsCard =
    document.getElementById("totalTestimonials");

const featuredTestimonialsCard =
    document.getElementById("featuredTestimonials");

const refreshTestimonialsBtn =
    document.getElementById("refreshTestimonialsBtn");

/* ===========================================================
   GLOBAL STATE
=========================================================== */

let testimonialsData = [];

/* ===========================================================
   FORMAT DATE
=========================================================== */

function formatDate(date) {

    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {

        day: "2-digit",
        month: "short",
        year: "numeric"

    });

}

/* ===========================================================
   LOAD TESTIMONIALS
=========================================================== */

export async function loadTestimonials() {

    try {

        const { data, error } = await supabase

            .from("testimonials")

            .select("*")

            .order("created_at", {

                ascending: false

            });

        if (error) throw error;

        testimonialsData = data || [];

        renderTestimonialsTable();

        updateTestimonialStats();

    }

    catch (err) {

        console.error(
            "Testimonials Error:",
            err
        );

    }

}

/* ===========================================================
   RENDER TABLE
=========================================================== */

function renderTestimonialsTable() {

    if (!testimonialTableBody) return;

    testimonialTableBody.innerHTML = "";

    if (!testimonialsData.length) {

        testimonialTableBody.innerHTML = `

        <tr>

            <td colspan="7">

                No Testimonials Found

            </td>

        </tr>

        `;

        return;

    }

    testimonialsData.forEach(item => {

        testimonialTableBody.innerHTML += `

        <tr>

            <td>

                <img
                    src="${item.image_url || ""}"
                    width="55"
                    height="55"
                    style="
                        border-radius:50%;
                        object-fit:cover;
                    ">

            </td>

            <td>${item.client_name || "-"}</td>

            <td>${item.company || "-"}</td>

            <td>${item.rating || 5} ⭐</td>

            <td>

                ${item.featured ? "Yes" : "No"}

            </td>

            <td>

                ${formatDate(item.created_at)}

            </td>

            <td>

                <button
                    class="viewTestimonialBtn"
                    data-id="${item.id}">

                    View

                </button>

            </td>

        </tr>

        `;

    });

}

/* ===========================================================
   UPDATE STATS
=========================================================== */

function updateTestimonialStats() {

    if (totalTestimonialsCard)

        totalTestimonialsCard.textContent =
            testimonialsData.length;

    if (featuredTestimonialsCard)

        featuredTestimonialsCard.textContent =

            testimonialsData.filter(

                x => x.featured === true

            ).length;

}

/* ===========================================================
   REFRESH
=========================================================== */

export async function refreshTestimonials() {

    await loadTestimonials();

}

/* ===========================================================
   EVENTS
=========================================================== */

if (refreshTestimonialsBtn) {

    refreshTestimonialsBtn.addEventListener(

        "click",

        refreshTestimonials

    );

}

/* ===========================================================
   INIT
=========================================================== */

export async function initTestimonials() {

    console.log(

        "Testimonials Module Loaded"

    );

    await loadTestimonials();

}

document.addEventListener(

    "DOMContentLoaded",

    () => {

        initTestimonials();

    }

);
/* ===========================================================
   TESTIMONIAL.JS
   PART 2A
   Search + Filters
=========================================================== */

/* ===========================================================
   DOM ELEMENTS
=========================================================== */

const testimonialSearch =
    document.getElementById("testimonialSearch");

const ratingFilter =
    document.getElementById("ratingFilter");

const featuredFilter =
    document.getElementById("featuredFilter");

/* ===========================================================
   FILTERED DATA
=========================================================== */

let filteredTestimonials = [];

/* ===========================================================
   APPLY FILTERS
=========================================================== */

export function applyTestimonialFilters() {

    const keyword =
        (testimonialSearch?.value || "")
        .trim()
        .toLowerCase();

    const rating =
        ratingFilter?.value || "";

    const featured =
        featuredFilter?.value || "";

    filteredTestimonials = testimonialsData.filter(item => {

        const matchKeyword =

            !keyword ||

            (item.client_name || "")
                .toLowerCase()
                .includes(keyword) ||

            (item.company || "")
                .toLowerCase()
                .includes(keyword) ||

            (item.review || "")
                .toLowerCase()
                .includes(keyword);

        const matchRating =

            !rating ||

            Number(item.rating) === Number(rating);

        const matchFeatured =

            !featured ||

            String(item.featured) === featured;

        return (

            matchKeyword &&
            matchRating &&
            matchFeatured

        );

    });

    renderFilteredTestimonials();

}

/* ===========================================================
   RENDER FILTERED TABLE
=========================================================== */

function renderFilteredTestimonials() {

    if (!testimonialTableBody) return;

    testimonialTableBody.innerHTML = "";

    if (!filteredTestimonials.length) {

        testimonialTableBody.innerHTML = `

            <tr>

                <td colspan="7">

                    No Matching Testimonials Found

                </td>

            </tr>

        `;

        return;

    }

    filteredTestimonials.forEach(item => {

        testimonialTableBody.innerHTML += `

            <tr>

                <td>

                    <img
                        src="${item.image_url || ""}"
                        width="55"
                        height="55"
                        style="
                            border-radius:50%;
                            object-fit:cover;
                        ">

                </td>

                <td>${item.client_name || "-"}</td>

                <td>${item.company || "-"}</td>

                <td>${item.rating || 5} ⭐</td>

                <td>

                    ${item.featured ? "Yes" : "No"}

                </td>

                <td>

                    ${formatDate(item.created_at)}

                </td>

                <td>

                    <button
                        class="viewTestimonialBtn"
                        data-id="${item.id}">

                        👁

                    </button>

                    <button
                        class="editTestimonialBtn"
                        data-id="${item.id}">

                        ✏

                    </button>

                    <button
                        class="deleteTestimonialBtn"
                        data-id="${item.id}">

                        🗑

                    </button>

                </td>

            </tr>

        `;

    });

}

/* ===========================================================
   RESET FILTERS
=========================================================== */

export function resetTestimonialFilters() {

    if (testimonialSearch)
        testimonialSearch.value = "";

    if (ratingFilter)
        ratingFilter.value = "";

    if (featuredFilter)
        featuredFilter.value = "";

    filteredTestimonials = [...testimonialsData];

    renderFilteredTestimonials();

}

/* ===========================================================
   REFRESH FILTERS
=========================================================== */

export function refreshTestimonialFilters() {

    filteredTestimonials = [...testimonialsData];

    applyTestimonialFilters();

}

/* ===========================================================
   EVENTS
=========================================================== */

testimonialSearch?.addEventListener(

    "input",

    applyTestimonialFilters

);

ratingFilter?.addEventListener(

    "change",

    applyTestimonialFilters

);

featuredFilter?.addEventListener(

    "change",

    applyTestimonialFilters

);
/* ===========================================================
   TESTIMONIAL.JS
   PART 2B
   View Testimonial Modal
=========================================================== */

/* ===========================================================
   MODAL ELEMENTS
=========================================================== */

const testimonialModal =
    document.getElementById("testimonialModal");

const testimonialModalBody =
    document.getElementById("testimonialModalBody");

const closeTestimonialModal =
    document.getElementById("closeTestimonialModal");

/* ===========================================================
   OPEN MODAL
=========================================================== */

function openTestimonialModal() {

    if (!testimonialModal) return;

    testimonialModal.style.display = "flex";

}

/* ===========================================================
   CLOSE MODAL
=========================================================== */

function closeTestimonialViewer() {

    if (!testimonialModal) return;

    testimonialModal.style.display = "none";

}

/* ===========================================================
   VIEW TESTIMONIAL
=========================================================== */

export async function viewTestimonial(id) {

    try {

        const { data, error } = await supabase

            .from("testimonials")

            .select("*")

            .eq("id", id)

            .single();

        if (error) throw error;

        if (!testimonialModalBody) return;

        testimonialModalBody.innerHTML = `

            <div class="testimonial-view">

                <div class="testimonial-header">

                    <img
                        src="${data.image_url || ""}"
                        class="testimonial-avatar">

                    <div>

                        <h2>

                            ${data.client_name || "-"}

                        </h2>

                        <p>

                            ${data.company || "-"}

                        </p>

                    </div>

                </div>

                <div class="testimonial-rating">

                    ${"⭐".repeat(data.rating || 5)}

                </div>

                <div class="testimonial-featured">

                    <strong>

                        Featured :

                    </strong>

                    ${data.featured ? "Yes" : "No"}

                </div>

                <div class="testimonial-date">

                    <strong>

                        Date :

                    </strong>

                    ${new Date(
                        data.created_at
                    ).toLocaleString("en-IN")}

                </div>

                <hr>

                <div class="testimonial-review">

                    ${data.review || "-"}

                </div>

            </div>

        `;

        openTestimonialModal();

    }

    catch (err) {

        console.error(

            "View Testimonial Error:",

            err

        );

        alert(

            "Unable to load testimonial."

        );

    }

}

/* ===========================================================
   VIEW BUTTON
=========================================================== */

document.addEventListener(

    "click",

    (e) => {

        const btn = e.target.closest(

            ".viewTestimonialBtn"

        );

        if (!btn) return;

        viewTestimonial(

            btn.dataset.id

        );

    }

);

/* ===========================================================
   CLOSE BUTTON
=========================================================== */

if (closeTestimonialModal) {

    closeTestimonialModal.addEventListener(

        "click",

        closeTestimonialViewer

    );

}

/* ===========================================================
   ESC CLOSE
=========================================================== */

document.addEventListener(

    "keydown",

    (e) => {

        if (e.key === "Escape") {

            closeTestimonialViewer();

        }

    }

);

/* ===========================================================
   OUTSIDE CLICK
=========================================================== */

if (testimonialModal) {

    testimonialModal.addEventListener(

        "click",

        (e) => {

            if (

                e.target === testimonialModal

            ) {

                closeTestimonialViewer();

            }

        }

    );

                      }
