/* ===========================================================
   Prime Accounting Solutions
   app.js
   Part 1
=========================================================== */

import { checkAuth, logout } from "./auth.js";

/* ===========================================================
   DOM ELEMENTS
=========================================================== */

const pageSections = document.querySelectorAll(".page-section");

const sidebarItems = document.querySelectorAll("[data-page]");

const sidebar = document.getElementById("sidebar");

const loader = document.getElementById("loader");

const toast = document.getElementById("toast");

/* ===========================================================
   GLOBAL STATE
=========================================================== */

let currentPage = "dashboardPage";

/* ===========================================================
   SHOW PAGE
=========================================================== */

export function showPage(pageId) {

    pageSections.forEach(section => {

        section.style.display = "none";

    });

    const targetPage = document.getElementById(pageId);

    if (targetPage) {

        targetPage.style.display = "block";

        currentPage = pageId;

    }

    sidebarItems.forEach(item => {

        item.classList.remove("active");

        if (item.dataset.page === pageId) {

            item.classList.add("active");

        }

    });

}

/* ===========================================================
   SIDEBAR EVENTS
=========================================================== */

sidebarItems.forEach(item => {

    item.addEventListener("click", () => {

        const page = item.dataset.page;

        if (!page) return;

        showPage(page);

    });

});

/* ===========================================================
   LOADER
=========================================================== */

export function showLoader() {

    if (loader) {

        loader.style.display = "flex";

    }

}

export function hideLoader() {

    if (loader) {

        loader.style.display = "none";

    }

}

/* ===========================================================
   TOAST PLACEHOLDER
=========================================================== */

export function showToast(message, type = "success") {

    if (!toast) return;

    toast.innerText = message;

    toast.className = "";

    toast.classList.add(type);

    toast.style.display = "block";

    setTimeout(() => {

        toast.style.display = "none";

    }, 3000);

}

/* ===========================================================
   APP INIT
=========================================================== */

async function initializeApp() {

    const loggedIn = await checkAuth();

    if (!loggedIn) {

        window.location.href = "admin.html";

        return;

    }

    showPage(currentPage);

}

/* ===========================================================
   LOGOUT
=========================================================== */

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", async () => {

        await logout();

    });

}

/* ===========================================================
   START APPLICATION
=========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    initializeApp();

});
