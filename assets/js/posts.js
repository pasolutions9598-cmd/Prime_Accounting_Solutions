/* ==========================================================
   Prime Accounting Solutions
   posts.js
   Part 1 - Load Posts
========================================================== */

import { supabase } from "./supabase.js";

/* ==========================================================
   DOM ELEMENTS
========================================================== */

const postsTableBody =
    document.getElementById("postsTableBody");

const postSearch =
    document.getElementById("postSearch");

const categoryFilter =
    document.getElementById("postCategoryFilter");

const statusFilter =
    document.getElementById("postsStatusFilter");

const newPostBtn =
    document.getElementById("newPostBtn");

/* ==========================================================
   POSTS ARRAY
========================================================== */

let allPosts = [];

/* ==========================================================
   LOAD POSTS
========================================================== */

export async function loadPosts() {

    if (!postsTableBody) return;

    postsTableBody.innerHTML =
        `<tr><td colspan="6">Loading...</td></tr>`;

    try {

        const { data, error } = await supabase
            .from("posts")
            .select("*")
            .order("created_at", {
                ascending: false
            });

        if (error) throw error;

        allPosts = data || [];

        renderPosts(allPosts);

    } catch (err) {

        console.error(err);

        postsTableBody.innerHTML =
            `<tr><td colspan="6">Unable to load posts.</td></tr>`;

    }

}

/* ==========================================================
   RENDER POSTS
========================================================== */

function renderPosts(posts) {

    postsTableBody.innerHTML = "";

    if (!posts.length) {

        postsTableBody.innerHTML =

        `<tr>
            <td colspan="6">
                No Posts Found
            </td>
        </tr>`;

        return;

    }

    posts.forEach(post => {

        postsTableBody.innerHTML += `

<tr>

<td>

<img
src="${post.image_url || post.image || 'assets/images/no-image.png'}"
style="
width:55px;
height:55px;
border-radius:8px;
object-fit:cover;
">

</td>

<td>${post.title ?? "-"}</td>

<td>${post.category ?? "-"}</td>

<td>${post.status ?? "-"}</td>

<td>

${post.created_at
? new Date(post.created_at).toLocaleDateString()
: "-"}

</td>

<td>

<button
class="editPostBtn"
data-id="${post.id}">
✏️
</button>

<button
class="deletePostBtn"
data-id="${post.id}">
🗑️
</button>

</td>

</tr>

`;

    });

}

/* ==========================================================
   SEARCH & FILTER
========================================================== */

function applyFilters() {

    let filtered = [...allPosts];

    const keyword =
        postSearch?.value
            .trim()
            .toLowerCase() || "";

    const category =
        categoryFilter?.value || "";

    const status =
        statusFilter?.value || "";

    if (keyword) {

        filtered = filtered.filter(post =>

            (post.title || "")
                .toLowerCase()
                .includes(keyword)

            ||

            (post.category || "")
                .toLowerCase()
                .includes(keyword)

            ||

            (post.type || "")
                .toLowerCase()
                .includes(keyword)

        );

    }

    if (category) {

        filtered = filtered.filter(

            post => post.category === category

        );

    }

    if (status) {

        filtered = filtered.filter(

            post => post.status === status

        );

    }

    renderPosts(filtered);

}

/* ==========================================================
   DELETE POST
========================================================== */

async function deletePost(id) {

    if (!confirm("Delete this post?"))
        return;

    try {

        const { error } = await supabase

            .from("posts")

            .delete()

            .eq("id", id);

        if (error) throw error;

        await loadPosts();

    } catch (err) {

        console.error(err);

        alert("Unable to delete post.");

    }

}

/* ==========================================================
   TABLE EVENTS
========================================================== */

document.addEventListener("click", e => {

    const btn = e.target;

    if (btn.classList.contains("deletePostBtn")) {

        deletePost(btn.dataset.id);

    }

    if (btn.classList.contains("editPostBtn")) {

        alert(
            "Edit Post feature will be connected after the Post Editor modal is added."
        );

    }

});

/* ==========================================================
   FILTER EVENTS
========================================================== */

postSearch?.addEventListener(
    "input",
    applyFilters
);

categoryFilter?.addEventListener(
    "change",
    applyFilters
);

statusFilter?.addEventListener(
    "change",
    applyFilters
);

/* ==========================================================
   NEW POST BUTTON
========================================================== */

newPostBtn?.addEventListener(
    "click",
    () => {

        alert(
            "Post Editor modal will be added in the next step."
        );

    }
);

/* ==========================================================
   INITIALIZE
========================================================== */

export async function initPosts() {

    console.log(
        "Posts Module Initialized"
    );

    await loadPosts();

}

/* ==========================================================
   AUTO START
========================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initPosts();

    }
);
