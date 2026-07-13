/* ===========================================================
   Prime Accounting Solutions
   posts.js
   Part 1
=========================================================== */

import { supabase } from "./supabase.js";

/* ===========================================================
   DOM ELEMENTS
=========================================================== */

const postsTableBody =
    document.getElementById("postsTableBody");

const totalPostsCard =
    document.getElementById("totalPosts");

const publishedPostsCard =
    document.getElementById("publishedPostsCount");

const draftPostsCard =
    document.getElementById("draftPostsCount");

const refreshPostsBtn =
    document.getElementById("refreshPostsBtn");

/* ===========================================================
   GLOBAL STATE
=========================================================== */

let postsData = [];

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
   LOAD POSTS
=========================================================== */

export async function loadPosts() {

    try {

        const { data, error } = await supabase

            .from("posts")

            .select("*")

            .order("created_at", {

                ascending: false

            });

        if (error) throw error;

        postsData = data || [];

        renderPostsTable();

        updatePostStats();

    }

    catch (err) {

        console.error("Load Posts Error :", err);

    }

}

/* ===========================================================
   RENDER POSTS TABLE
=========================================================== */

function renderPostsTable() {

    if (!postsTableBody) return;

    postsTableBody.innerHTML = "";

    if (!postsData.length) {

        postsTableBody.innerHTML = `

        <tr>

            <td colspan="7">

                No Posts Found

            </td>

        </tr>`;

        return;

    }

    postsData.forEach(post => {

        postsTableBody.innerHTML += `

        <tr>

            <td>

                <img
                    src="${post.image_url || ''}"
                    width="50"
                    height="50"
                    style="border-radius:8px;object-fit:cover;">

            </td>

            <td>${post.title || "-"}</td>

            <td>${post.category || "-"}</td>

            <td>${post.type || "-"}</td>

            <td>${post.status || "-"}</td>

            <td>${formatDate(post.created_at)}</td>

            <td>

                <button
                    class="viewPostBtn"
                    data-id="${post.id}">

                    View

                </button>

            </td>

        </tr>

        `;

    });

}

/* ===========================================================
   UPDATE STATISTICS
=========================================================== */

function updatePostStats() {

    if (totalPostsCard)

        totalPostsCard.textContent =
            postsData.length;

    if (publishedPostsCard)

        publishedPostsCard.textContent =

            postsData.filter(

                x => x.status === "published"

            ).length;

    if (draftPostsCard)

        draftPostsCard.textContent =

            postsData.filter(

                x => x.status === "draft"

            ).length;

}

/* ===========================================================
   REFRESH POSTS
=========================================================== */

export async function refreshPosts() {

    await loadPosts();

}

/* ===========================================================
   EVENTS
=========================================================== */

if (refreshPostsBtn) {

    refreshPostsBtn.addEventListener(

        "click",

        refreshPosts

    );

}

/* ===========================================================
   INIT
=========================================================== */

export async function initPosts() {

    console.log(

        "Posts Module Loaded"

    );

    await loadPosts();

}

document.addEventListener(

    "DOMContentLoaded",

    () => {

        initPosts();

    }

);
/* ===========================================================
   POSTS.JS
   PART 2A
   Search + Filters
=========================================================== */

/* ===========================================================
   DOM ELEMENTS
=========================================================== */

const postSearchInput =
    document.getElementById("postSearch");

const postCategoryFilter =
    document.getElementById("postCategoryFilter");

const postStatusFilter =
    document.getElementById("postStatusFilter");

const postTypeFilter =
    document.getElementById("postTypeFilter");

/* ===========================================================
   FILTERED POSTS
=========================================================== */

let filteredPosts = [];

/* ===========================================================
   APPLY FILTERS
=========================================================== */

function applyPostFilters() {

    const search =

        (postSearchInput?.value || "")
        .trim()
        .toLowerCase();

    const category =

        postCategoryFilter?.value || "";

    const status =

        postStatusFilter?.value || "";

    const type =

        postTypeFilter?.value || "";

    filteredPosts = postsData.filter(post => {

        const matchSearch =

            !search ||

            (post.title || "")
                .toLowerCase()
                .includes(search) ||

            (post.category || "")
                .toLowerCase()
                .includes(search) ||

            (post.type || "")
                .toLowerCase()
                .includes(search);

        const matchCategory =

            !category ||

            post.category === category;

        const matchStatus =

            !status ||

            post.status === status;

        const matchType =

            !type ||

            post.type === type;

        return (

            matchSearch &&

            matchCategory &&

            matchStatus &&

            matchType

        );

    });

    renderFilteredPosts();

}

/* ===========================================================
   RENDER FILTERED POSTS
=========================================================== */

function renderFilteredPosts() {

    if (!postsTableBody) return;

    postsTableBody.innerHTML = "";

    if (!filteredPosts.length) {

        postsTableBody.innerHTML = `

        <tr>

            <td colspan="7">

                No Matching Posts Found

            </td>

        </tr>

        `;

        return;

    }

    filteredPosts.forEach(post => {

        postsTableBody.innerHTML += `

        <tr>

            <td>

                <img
                    src="${post.image_url || ""}"
                    width="50"
                    height="50"
                    style="border-radius:8px;object-fit:cover;">

            </td>

            <td>${post.title || "-"}</td>

            <td>${post.category || "-"}</td>

            <td>${post.type || "-"}</td>

            <td>${post.status || "-"}</td>

            <td>${formatDate(post.created_at)}</td>

            <td>

                <button
                    class="viewPostBtn"
                    data-id="${post.id}">

                    View

                </button>

            </td>

        </tr>

        `;

    });

}

/* ===========================================================
   SEARCH EVENT
=========================================================== */

if (postSearchInput) {

    postSearchInput.addEventListener(

        "input",

        applyPostFilters

    );

}

/* ===========================================================
   CATEGORY FILTER
=========================================================== */

if (postCategoryFilter) {

    postCategoryFilter.addEventListener(

        "change",

        applyPostFilters

    );

}

/* ===========================================================
   STATUS FILTER
=========================================================== */

if (postStatusFilter) {

    postStatusFilter.addEventListener(

        "change",

        applyPostFilters

    );

}

/* ===========================================================
   TYPE FILTER
=========================================================== */

if (postTypeFilter) {

    postTypeFilter.addEventListener(

        "change",

        applyPostFilters

    );

}

/* ===========================================================
   RESET FILTERS
=========================================================== */

export function resetPostFilters() {

    if (postSearchInput)

        postSearchInput.value = "";

    if (postCategoryFilter)

        postCategoryFilter.value = "";

    if (postStatusFilter)

        postStatusFilter.value = "";

    if (postTypeFilter)

        postTypeFilter.value = "";

    filteredPosts = [...postsData];

    renderFilteredPosts();

}

/* ===========================================================
   UPDATE FILTERED DATA
=========================================================== */

export function refreshFilteredPosts() {

    filteredPosts = [...postsData];

    applyPostFilters();

      }
