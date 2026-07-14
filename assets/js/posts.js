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
