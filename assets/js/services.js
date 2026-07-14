/* ===========================================================
   Prime Accounting Solutions
   services.js
   Part 1
=========================================================== */

import { supabase } from "./supabase.js";

/* ===========================================================
   DOM ELEMENTS
=========================================================== */

const serviceTableBody =
    document.getElementById("serviceTableBody");

const totalServicesCard =
    document.getElementById("totalServices");

const activeServicesCard =
    document.getElementById("activeServices");

const refreshServicesBtn =
    document.getElementById("refreshServicesBtn");

/* ===========================================================
   GLOBAL STATE
=========================================================== */

let servicesData = [];

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
   LOAD SERVICES
=========================================================== */

export async function loadServices() {

    try {

        const { data, error } = await supabase

            .from("services")

            .select("*")

            .order("created_at", {

                ascending: false

            });

        if (error) throw error;

        servicesData = data || [];

        renderServicesTable();

        updateServiceStats();

    }

    catch (err) {

        console.error(

            "Services Error:",

            err

        );

    }

}

/* ===========================================================
   RENDER TABLE
=========================================================== */

function renderServicesTable() {

    if (!serviceTableBody) return;

    serviceTableBody.innerHTML = "";

    if (!servicesData.length) {

        serviceTableBody.innerHTML = `

            <tr>

                <td colspan="8">

                    No Services Found

                </td>

            </tr>

        `;

        return;

    }

    servicesData.forEach(service => {

        serviceTableBody.innerHTML += `

            <tr>

                <td>

                    <img
                        src="${service.image_url || ""}"
                        width="55"
                        height="55"
                        style="
                            object-fit:cover;
                            border-radius:8px;
                        ">

                </td>

                <td>${service.title || "-"}</td>

                <td>${service.category || "-"}</td>

                <td>${service.price || "-"}</td>

                <td>

                    <span class="status-badge ${service.status}">

                        ${service.status || "-"}

                    </span>

                </td>

                <td>

                    ${service.featured ? "Yes" : "No"}

                </td>

                <td>

                    ${formatDate(service.created_at)}

                </td>

                <td>

                    <button
                        class="viewServiceBtn"
                        data-id="${service.id}">

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

function updateServiceStats() {

    if (totalServicesCard)

        totalServicesCard.textContent =

            servicesData.length;

    if (activeServicesCard)

        activeServicesCard.textContent =

            servicesData.filter(

                item => item.status === "active"

            ).length;

}

/* ===========================================================
   REFRESH
=========================================================== */

export async function refreshServices() {

    await loadServices();

}

/* ===========================================================
   EVENTS
=========================================================== */

if (refreshServicesBtn) {

    refreshServicesBtn.addEventListener(

        "click",

        refreshServices

    );

}

/* ===========================================================
   INIT
=========================================================== */

export async function initServices() {

    console.log(

        "Services Module Loaded"

    );

    await loadServices();

}

document.addEventListener(

    "DOMContentLoaded",

    () => {

        initServices();

    }

);
/* ===========================================================
   SERVICES.JS
   PART 2A
   Search + Filters
=========================================================== */

/* ===========================================================
   DOM ELEMENTS
=========================================================== */

const serviceSearch =
    document.getElementById("serviceSearch");

const serviceCategoryFilter =
    document.getElementById("serviceCategoryFilter");

const serviceStatusFilter =
    document.getElementById("serviceStatusFilter");

const servicePriceFilter =
    document.getElementById("servicePriceFilter");

/* ===========================================================
   FILTERED DATA
=========================================================== */

let filteredServices = [];

/* ===========================================================
   APPLY FILTERS
=========================================================== */

export function applyServiceFilters() {

    const keyword =
        (serviceSearch?.value || "")
        .trim()
        .toLowerCase();

    const category =
        serviceCategoryFilter?.value || "";

    const status =
        serviceStatusFilter?.value || "";

    const price =
        servicePriceFilter?.value || "";

    filteredServices = servicesData.filter(service => {

        const matchKeyword =

            !keyword ||

            (service.title || "")
                .toLowerCase()
                .includes(keyword) ||

            (service.category || "")
                .toLowerCase()
                .includes(keyword) ||

            (service.description || "")
                .toLowerCase()
                .includes(keyword);

        const matchCategory =

            !category ||

            service.category === category;

        const matchStatus =

            !status ||

            service.status === status;

        const matchPrice =

            !price ||

            service.price === price;

        return (

            matchKeyword &&
            matchCategory &&
            matchStatus &&
            matchPrice

        );

    });

    renderFilteredServices();

}

/* ===========================================================
   RENDER FILTERED TABLE
=========================================================== */

function renderFilteredServices() {

    if (!serviceTableBody) return;

    serviceTableBody.innerHTML = "";

    if (!filteredServices.length) {

        serviceTableBody.innerHTML = `

            <tr>

                <td colspan="8">

                    No Matching Services Found

                </td>

            </tr>

        `;

        return;

    }

    filteredServices.forEach(service => {

        serviceTableBody.innerHTML += `

            <tr>

                <td>

                    <img
                        src="${service.image_url || ""}"
                        width="55"
                        height="55"
                        style="
                            border-radius:8px;
                            object-fit:cover;
                        ">

                </td>

                <td>${service.title || "-"}</td>

                <td>${service.category || "-"}</td>

                <td>${service.price || "-"}</td>

                <td>

                    <span class="status-badge ${service.status}">

                        ${service.status}

                    </span>

                </td>

                <td>

                    ${service.featured ? "Yes" : "No"}

                </td>

                <td>

                    ${formatDate(service.created_at)}

                </td>

                <td>

                    <button
                        class="viewServiceBtn"
                        data-id="${service.id}">

                        👁

                    </button>

                    <button
                        class="editServiceBtn"
                        data-id="${service.id}">

                        ✏

                    </button>

                    <button
                        class="deleteServiceBtn"
                        data-id="${service.id}">

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

export function resetServiceFilters() {

    if (serviceSearch)
        serviceSearch.value = "";

    if (serviceCategoryFilter)
        serviceCategoryFilter.value = "";

    if (serviceStatusFilter)
        serviceStatusFilter.value = "";

    if (servicePriceFilter)
        servicePriceFilter.value = "";

    filteredServices = [...servicesData];

    renderFilteredServices();

}

/* ===========================================================
   REFRESH FILTERS
=========================================================== */

export function refreshServiceFilters() {

    filteredServices = [...servicesData];

    applyServiceFilters();

}

/* ===========================================================
   EVENTS
=========================================================== */

serviceSearch?.addEventListener(

    "input",

    applyServiceFilters

);

serviceCategoryFilter?.addEventListener(

    "change",

    applyServiceFilters

);

serviceStatusFilter?.addEventListener(

    "change",

    applyServiceFilters

);

servicePriceFilter?.addEventListener(

    "change",

    applyServiceFilters

);
/* ===========================================================
   SERVICES.JS
   PART 2B
   View Service Modal
=========================================================== */

/* ===========================================================
   MODAL ELEMENTS
=========================================================== */

const serviceModal =
    document.getElementById("serviceModal");

const serviceModalBody =
    document.getElementById("serviceModalBody");

const closeServiceModal =
    document.getElementById("closeServiceModal");

/* ===========================================================
   OPEN MODAL
=========================================================== */

function openServiceModal() {

    if (!serviceModal) return;

    serviceModal.style.display = "flex";

}

/* ===========================================================
   CLOSE MODAL
=========================================================== */

function closeServiceViewer() {

    if (!serviceModal) return;

    serviceModal.style.display = "none";

}

/* ===========================================================
   VIEW SERVICE
=========================================================== */

export async function viewService(serviceId) {

    try {

        const { data, error } = await supabase

            .from("services")

            .select("*")

            .eq("id", serviceId)

            .single();

        if (error) throw error;

        if (!serviceModalBody) return;

        serviceModalBody.innerHTML = `

            <div class="service-view-container">

                <img
                    src="${data.image_url || ""}"
                    class="service-view-image">

                <h2>

                    ${data.title || "-"}

                </h2>

                <div class="service-meta">

                    <span>

                        📂 ${data.category || "-"}

                    </span>

                    <span>

                        💰 ${data.price || "-"}

                    </span>

                    <span>

                        📌 ${data.status || "-"}

                    </span>

                </div>

                <div class="service-featured">

                    <strong>Featured :</strong>

                    ${data.featured ? "Yes ⭐" : "No"}

                </div>

                <hr>

                <div class="service-description">

                    ${data.description || ""}

                </div>

            </div>

        `;

        openServiceModal();

    }

    catch (err) {

        console.error(

            "View Service Error:",

            err

        );

        alert(

            "Unable to load service."

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

            ".viewServiceBtn"

        );

        if (!btn) return;

        viewService(

            btn.dataset.id

        );

    }

);

/* ===========================================================
   CLOSE BUTTON
=========================================================== */

closeServiceModal?.addEventListener(

    "click",

    closeServiceViewer

);

/* ===========================================================
   ESC CLOSE
=========================================================== */

document.addEventListener(

    "keydown",

    (e) => {

        if (e.key === "Escape") {

            closeServiceViewer();

        }

    }

);

/* ===========================================================
   OUTSIDE CLICK
=========================================================== */

serviceModal?.addEventListener(

    "click",

    (e) => {

        if (e.target === serviceModal) {

            closeServiceViewer();

        }

    }

);
