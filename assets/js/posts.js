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
/* ===========================================================
   POSTS.JS
   PART 2A
   Search + Filters (Production Ready)
=========================================================== */

/* ===========================================================
   DOM ELEMENTS
=========================================================== */

const postSearchInput =
    document.getElementById("postSearch");

const categoryFilter =
    document.getElementById("postCategoryFilter");

const statusFilter =
    document.getElementById("postStatusFilter");

const typeFilter =
    document.getElementById("postTypeFilter");

/* ===========================================================
   FILTERED POSTS
=========================================================== */

let filteredPosts = [];

/* ===========================================================
   APPLY FILTERS
=========================================================== */

export function applyPostFilters() {

    const keyword =
        (postSearchInput?.value || "")
        .trim()
        .toLowerCase();

    const category =
        categoryFilter?.value || "";

    const status =
        statusFilter?.value || "";

    const type =
        typeFilter?.value || "";

    filteredPosts = postsData.filter(post => {

        const matchKeyword =

            !keyword ||

            (post.title || "")
                .toLowerCase()
                .includes(keyword) ||

            (post.category || "")
                .toLowerCase()
                .includes(keyword) ||

            (post.content || "")
                .toLowerCase()
                .includes(keyword);

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

            matchKeyword &&
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
                        width="55"
                        height="55"
                        style="
                            object-fit:cover;
                            border-radius:8px;
                        ">

                </td>

                <td>${post.title || "-"}</td>

                <td>${post.category || "-"}</td>

                <td>${post.type || "-"}</td>

                <td>

                    <span class="status-badge ${post.status}">

                        ${post.status}

                    </span>

                </td>

                <td>

                    ${formatDate(post.created_at)}

                </td>

                <td>

                    <button
                        class="viewPostBtn"
                        data-id="${post.id}">

                        👁

                    </button>

                    <button
                        class="editPostBtn"
                        data-id="${post.id}">

                        ✏

                    </button>

                    <button
                        class="deletePostBtn"
                        data-id="${post.id}">

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

export function resetPostFilters() {

    if (postSearchInput)
        postSearchInput.value = "";

    if (categoryFilter)
        categoryFilter.value = "";

    if (statusFilter)
        statusFilter.value = "";

    if (typeFilter)
        typeFilter.value = "";

    filteredPosts = [...postsData];

    renderFilteredPosts();

}

/* ===========================================================
   EVENTS
=========================================================== */

postSearchInput?.addEventListener(

    "input",

    applyPostFilters

);

categoryFilter?.addEventListener(

    "change",

    applyPostFilters

);

statusFilter?.addEventListener(

    "change",

    applyPostFilters

);

typeFilter?.addEventListener(

    "change",

    applyPostFilters

);

/* ===========================================================
   REFRESH FILTERS
=========================================================== */

export function refreshPostFilters() {

    filteredPosts = [...postsData];

    applyPostFilters();

}
/* ===========================================================
   POSTS.JS
   PART 2B
   View Post Modal
=========================================================== */

/* ===========================================================
   MODAL ELEMENTS
=========================================================== */

const postModal =
    document.getElementById("postModal");

const postModalBody =
    document.getElementById("postModalBody");

const closePostModal =
    document.getElementById("closePostModal");

/* ===========================================================
   OPEN MODAL
=========================================================== */

function openPostModal() {

    if (!postModal) return;

    postModal.style.display = "flex";

}

/* ===========================================================
   CLOSE MODAL
=========================================================== */

function closePostViewer() {

    if (!postModal) return;

    postModal.style.display = "none";

}

/* ===========================================================
   VIEW POST
=========================================================== */

export async function viewPost(postId) {

    try {

        const { data, error } = await supabase

            .from("posts")

            .select("*")

            .eq("id", postId)

            .single();

        if (error) throw error;

        if (!postModalBody) return;

        postModalBody.innerHTML = `

            <div class="post-view-container">

                <img
                    src="${data.image_url || ""}"
                    class="post-view-image">

                <h2>

                    ${data.title || "-"}

                </h2>

                <div class="post-meta">

                    <span>

                        📂 ${data.category || "-"}

                    </span>

                    <span>

                        📰 ${data.type || "-"}

                    </span>

                    <span>

                        📌 ${data.status || "-"}

                    </span>

                </div>

                <div class="post-date">

                    Published :

                    ${new Date(

                        data.created_at

                    ).toLocaleString("en-IN")}

                </div>

                <hr>

                <div class="post-content">

                    ${data.content || ""}

                </div>

            </div>

        `;

        openPostModal();

    }

    catch (err) {

        console.error(

            "View Post Error :",

            err

        );

        alert(

            "Unable to load post."

        );

    }

}

/* ===========================================================
   BUTTON EVENTS
=========================================================== */

document.addEventListener(

    "click",

    (e) => {

        const btn =

            e.target.closest(

                ".viewPostBtn"

            );

        if (!btn) return;

        viewPost(

            btn.dataset.id

        );

    }

);

/* ===========================================================
   CLOSE BUTTON
=========================================================== */

if (closePostModal) {

    closePostModal.addEventListener(

        "click",

        closePostViewer

    );

}

/* ===========================================================
   ESC CLOSE
=========================================================== */

document.addEventListener(

    "keydown",

    (e) => {

        if (

            e.key === "Escape"

        ) {

            closePostViewer();

        }

    }

);

/* ===========================================================
   OUTSIDE CLICK
=========================================================== */

if (postModal) {

    postModal.addEventListener(

        "click",

        (e) => {

            if (

                e.target === postModal

            ) {

                closePostViewer();

            }

        }

    );

}
