/* ===========================================================
   Prime Accounting Solutions
   app.js
   Production Ready
   Part 1
=========================================================== */

import { checkAuth, logout } from "./auth.js";

/* ===========================================================
   DOM
=========================================================== */

const loginScreen = document.getElementById("loginScreen");
const adminWrapper = document.getElementById("adminWrapper");

const sidebar = document.getElementById("sidebar");

const pageContainer = document.getElementById("pageContainer");

const pages = document.querySelectorAll(".page");

const menuItems = document.querySelectorAll(".menu-item");

const menuToggle = document.getElementById("menuToggle");

const logoutBtn = document.getElementById("logoutBtn");

const loader = document.getElementById("globalLoader");

const currentDate = document.getElementById("currentDate");

const themeToggle = document.getElementById("themeToggle");

/* ===========================================================
   GLOBAL STATE
=========================================================== */

let activePage = "dashboardPage";

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
   TOAST
=========================================================== */

export function showToast(message, type = "success") {

    const container =
        document.getElementById("toastContainer");

    if (!container) return;

    const toast =
        document.createElement("div");

    toast.className =
        `toast ${type}`;

    toast.textContent =
        message;

    container.appendChild(toast);

    setTimeout(() => {

        toast.remove();

    }, 3000);

}

/* ===========================================================
   SHOW PAGE
=========================================================== */

export function showPage(pageId) {

    pages.forEach(page => {

        page.classList.remove("active-page");

    });

    const target =
        document.getElementById(pageId);

    if (target) {

        target.classList.add("active-page");

        activePage = pageId;

    }

    menuItems.forEach(item => {

        item.classList.remove("active");

        if (
            item.dataset.page + "Page"
            === pageId
        ) {

            item.classList.add("active");

        }

    });

}

/* ===========================================================
   SIDEBAR
=========================================================== */

menuItems.forEach(item => {

    item.addEventListener("click", e => {

        e.preventDefault();

        const page =
            item.dataset.page + "Page";

        showPage(page);

        if (
            window.innerWidth < 992
        ) {

            sidebar.classList.remove("active");

        }

    });

});
/* ===========================================================
   MOBILE MENU
=========================================================== */

if (menuToggle) {

    menuToggle.addEventListener("click", () => {

        sidebar.classList.toggle("active");

    });

}

/* ===========================================================
   CURRENT DATE
=========================================================== */

function updateDate() {

    if (!currentDate) return;

    currentDate.textContent =
        new Date().toLocaleDateString(
            "en-IN",
            {
                weekday: "long",
                day: "2-digit",
                month: "long",
                year: "numeric"
            }
        );

}

/* ===========================================================
   THEME TOGGLE (PREPARED)
=========================================================== */

if (themeToggle) {

    themeToggle.addEventListener("click", () => {

        document.body.classList.toggle("light-theme");

    });

}

/* ===========================================================
   LOGIN / ADMIN PANEL
=========================================================== */

async function initializeApp() {

    showLoader();

    try {

        const loggedIn =
            await checkAuth();

        if (loggedIn) {

            if (loginScreen)
                loginScreen.style.display = "none";

            if (adminWrapper)
                adminWrapper.style.display = "flex";

            showPage("dashboardPage");

        } else {

            if (loginScreen)
                loginScreen.style.display = "flex";

            if (adminWrapper)
                adminWrapper.style.display = "none";

        }

        updateDate();

    } catch (err) {

        console.error(err);

        showToast(
            "Application failed to load",
            "error"
        );

    } finally {

        hideLoader();

    }

}

/* ===========================================================
   LOGOUT
=========================================================== */

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        async () => {

            showLoader();

            try {

                await logout();

            } catch (err) {

                console.error(err);

            } finally {

                hideLoader();

            }

        }
    );

}

/* ===========================================================
   WINDOW RESIZE
=========================================================== */

window.addEventListener("resize", () => {

    if (window.innerWidth >= 992) {

        sidebar?.classList.remove("active");

    }

});

/* ===========================================================
   START APPLICATION
=========================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeApp();

    }
);

/* ===========================================================
   EXPORTS
=========================================================== */

export default {

    showPage,

    showLoader,

    hideLoader,

    showToast

};
