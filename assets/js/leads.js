/* ===========================================================
   Prime Accounting Solutions
   leads.js
   Part 1
=========================================================== */

import { supabase } from "./supabase.js";

/* ===========================================================
   DOM ELEMENTS
=========================================================== */

const leadsTableBody =
    document.getElementById("leadsTableBody");

const totalLeadsCard =
    document.getElementById("totalLeads");

const newLeadsCard =
    document.getElementById("newLeads");

const contactedLeadsCard =
    document.getElementById("contactedLeads");

const convertedLeadsCard =
    document.getElementById("convertedLeads");

const refreshLeadsBtn =
    document.getElementById("refreshLeadsBtn");

/* ===========================================================
   GLOBAL STATE
=========================================================== */

let leadsData = [];

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
   LOAD LEADS
=========================================================== */

export async function loadLeads() {

    try {

        const { data, error } = await supabase

            .from("leads")

            .select("*")

            .order("created_at", {

                ascending: false

            });

        if (error) throw error;

        leadsData = data || [];

        renderLeadsTable();

        updateLeadStats();

    }

    catch (err) {

        console.error("Load Leads Error :", err);

    }

}

/* ===========================================================
   RENDER TABLE
=========================================================== */

function renderLeadsTable() {

    if (!leadsTableBody) return;

    leadsTableBody.innerHTML = "";

    if (!leadsData.length) {

        leadsTableBody.innerHTML =

        `<tr>

            <td colspan="8">

                No Leads Found

            </td>

        </tr>`;

        return;

    }

    leadsData.forEach(lead => {

        leadsTableBody.innerHTML += `

        <tr>

            <td>${lead.name || "-"}</td>

            <td>${lead.phone || "-"}</td>

            <td>${lead.email || "-"}</td>

            <td>${lead.service || "-"}</td>

            <td>${lead.status || "New"}</td>

            <td>${formatDate(lead.created_at)}</td>

            <td>

                <button
                    class="viewLeadBtn"
                    data-id="${lead.id}">

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

function updateLeadStats() {

    if (totalLeadsCard)

        totalLeadsCard.textContent =

            leadsData.length;

    if (newLeadsCard)

        newLeadsCard.textContent =

            leadsData.filter(

                x => x.status === "New"

            ).length;

    if (contactedLeadsCard)

        contactedLeadsCard.textContent =

            leadsData.filter(

                x => x.status === "Contacted"

            ).length;

    if (convertedLeadsCard)

        convertedLeadsCard.textContent =

            leadsData.filter(

                x => x.status === "Converted"

            ).length;

}

/* ===========================================================
   REFRESH
=========================================================== */

export async function refreshLeads() {

    await loadLeads();

}

/* ===========================================================
   EVENTS
=========================================================== */

if (refreshLeadsBtn) {

    refreshLeadsBtn.addEventListener(

        "click",

        refreshLeads

    );

}

/* ===========================================================
   INIT
=========================================================== */

export async function initLeads() {

    console.log(

        "Leads Module Loaded"

    );

    await loadLeads();

}

document.addEventListener(

    "DOMContentLoaded",

    () => {

        initLeads();

    }

);
/* ===========================================================
   LEADS.JS
   PART 2A
   Search & Status Filter
=========================================================== */

/* ===========================================================
   DOM ELEMENTS
=========================================================== */

const leadSearchInput =
    document.getElementById("leadSearch");

const leadStatusFilter =
    document.getElementById("leadStatusFilter");

/* ===========================================================
   FILTERED DATA
=========================================================== */

let filteredLeads = [];

/* ===========================================================
   APPLY FILTERS
=========================================================== */

function applyLeadFilters() {

    const searchText =
        (leadSearchInput?.value || "")
        .trim()
        .toLowerCase();

    const status =
        leadStatusFilter?.value || "";

    filteredLeads = leadsData.filter(lead => {

        const matchSearch =

            !searchText ||

            (lead.name || "")
                .toLowerCase()
                .includes(searchText) ||

            (lead.email || "")
                .toLowerCase()
                .includes(searchText) ||

            (lead.phone || "")
                .toLowerCase()
                .includes(searchText) ||

            (lead.service || "")
                .toLowerCase()
                .includes(searchText);

        const matchStatus =

            !status ||

            (lead.status || "")
                .toLowerCase() ===
            status.toLowerCase();

        return matchSearch && matchStatus;

    });

    renderFilteredLeads();

}

/* ===========================================================
   RENDER FILTERED TABLE
=========================================================== */

function renderFilteredLeads() {

    if (!leadsTableBody) return;

    leadsTableBody.innerHTML = "";

    if (!filteredLeads.length) {

        leadsTableBody.innerHTML = `

        <tr>

            <td colspan="8">

                No Matching Leads Found

            </td>

        </tr>

        `;

        return;

    }

    filteredLeads.forEach(lead => {

        leadsTableBody.innerHTML += `

        <tr>

            <td>${lead.name || "-"}</td>

            <td>${lead.phone || "-"}</td>

            <td>${lead.email || "-"}</td>

            <td>${lead.service || "-"}</td>

            <td>${lead.status || "New"}</td>

            <td>${formatDate(lead.created_at)}</td>

            <td>

                <button
                    class="viewLeadBtn"
                    data-id="${lead.id}">

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

if (leadSearchInput) {

    leadSearchInput.addEventListener(

        "input",

        applyLeadFilters

    );

}

/* ===========================================================
   STATUS FILTER EVENT
=========================================================== */

if (leadStatusFilter) {

    leadStatusFilter.addEventListener(

        "change",

        applyLeadFilters

    );

}

/* ===========================================================
   UPDATE LOAD FUNCTION
=========================================================== */

const oldLoadLeads = loadLeads;

loadLeads = async function () {

    await oldLoadLeads();

    filteredLeads = [...leadsData];

    renderFilteredLeads();

};
/* ===========================================================
   LEADS.JS
   PART 2B
   View Lead Modal
=========================================================== */

/* ===========================================================
   DOM ELEMENTS
=========================================================== */

const leadModal =
    document.getElementById("leadModal");

const leadModalBody =
    document.getElementById("leadModalBody");

const closeLeadModalBtn =
    document.getElementById("closeLeadModal");

/* ===========================================================
   OPEN MODAL
=========================================================== */

function openLeadModal() {

    if (!leadModal) return;

    leadModal.style.display = "flex";

}

/* ===========================================================
   CLOSE MODAL
=========================================================== */

function closeLeadModal() {

    if (!leadModal) return;

    leadModal.style.display = "none";

}

if (closeLeadModalBtn) {

    closeLeadModalBtn.addEventListener(

        "click",

        closeLeadModal

    );

}

/* ===========================================================
   VIEW LEAD
=========================================================== */

export async function viewLead(id) {

    try {

        const {

            data,

            error

        } = await supabase

            .from("leads")

            .select("*")

            .eq("id", id)

            .single();

        if (error) throw error;

        if (!leadModalBody) return;

        leadModalBody.innerHTML = `

            <div class="lead-details">

                <div class="detail-row">
                    <strong>Name</strong>
                    <span>${data.name || "-"}</span>
                </div>

                <div class="detail-row">
                    <strong>Phone</strong>
                    <span>${data.phone || "-"}</span>
                </div>

                <div class="detail-row">
                    <strong>Email</strong>
                    <span>${data.email || "-"}</span>
                </div>

                <div class="detail-row">
                    <strong>Service</strong>
                    <span>${data.service || "-"}</span>
                </div>

                <div class="detail-row">
                    <strong>Status</strong>
                    <span>${data.status || "New"}</span>
                </div>

                <div class="detail-row">
                    <strong>Company</strong>
                    <span>${data.company || "-"}</span>
                </div>

                <div class="detail-row">
                    <strong>Message</strong>
                    <p>${data.message || "-"}</p>
                </div>

                <div class="detail-row">
                    <strong>Created</strong>
                    <span>

                        ${new Date(
                            data.created_at
                        ).toLocaleString("en-IN")}

                    </span>
                </div>

            </div>

        `;

        openLeadModal();

    }

    catch (err) {

        console.error(

            "View Lead Error :",

            err

        );

        alert(

            "Unable to load lead."

        );

    }

}

/* ===========================================================
   TABLE EVENTS
=========================================================== */

document.addEventListener(

    "click",

    (e) => {

        const btn =
            e.target.closest(".viewLeadBtn");

        if (!btn) return;

        viewLead(btn.dataset.id);

    }

);

/* ===========================================================
   ESC KEY CLOSE
=========================================================== */

document.addEventListener(

    "keydown",

    (e) => {

        if (

            e.key === "Escape"

        ) {

            closeLeadModal();

        }

    }

);

/* ===========================================================
   OUTSIDE CLICK
=========================================================== */

if (leadModal) {

    leadModal.addEventListener(

        "click",

        (e) => {

            if (

                e.target === leadModal

            ) {

                closeLeadModal();

            }

        }

    );

                      }
/* ===========================================================
   LEADS.JS
   PART 2C
   WhatsApp • Call • Email Actions
=========================================================== */

/* ===========================================================
   OPEN WHATSAPP
=========================================================== */

export function openWhatsApp(phone) {

    if (!phone) {

        alert("Phone number not available.");

        return;

    }

    const cleanPhone = phone.replace(/\D/g, "");

    const message = encodeURIComponent(

        "Hello,\n\nThank you for contacting Prime Accounting Solutions.\nHow can we help you today?"

    );

    window.open(

        `https://wa.me/${cleanPhone}?text=${message}`,

        "_blank"

    );

}

/* ===========================================================
   CALL LEAD
=========================================================== */

export function callLead(phone) {

    if (!phone) {

        alert("Phone number not available.");

        return;

    }

    window.location.href = `tel:${phone}`;

}

/* ===========================================================
   EMAIL LEAD
=========================================================== */

export function emailLead(email) {

    if (!email) {

        alert("Email address not available.");

        return;

    }

    const subject = encodeURIComponent(

        "Prime Accounting Solutions"

    );

    const body = encodeURIComponent(

`Hello,

Thank you for contacting Prime Accounting Solutions.

Please let us know how we can assist you.

Regards,
Prime Accounting Solutions
https://pasolutions9598-cmd.github.io/Prime_Accounting_Solutions/`

    );

    window.location.href =

        `mailto:${email}?subject=${subject}&body=${body}`;

}

/* ===========================================================
   ACTION BUTTON EVENTS
=========================================================== */

document.addEventListener("click", (e) => {

    /* WhatsApp */

    const whatsappBtn = e.target.closest(".whatsappLeadBtn");

    if (whatsappBtn) {

        openWhatsApp(

            whatsappBtn.dataset.phone

        );

        return;

    }

    /* Call */

    const callBtn = e.target.closest(".callLeadBtn");

    if (callBtn) {

        callLead(

            callBtn.dataset.phone

        );

        return;

    }

    /* Email */

    const emailBtn = e.target.closest(".emailLeadBtn");

    if (emailBtn) {

        emailLead(

            emailBtn.dataset.email

        );

        return;

    }

});
