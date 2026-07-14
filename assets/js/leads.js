/* ===========================================================
   Prime Accounting Solutions
   leads.js
   Production Ready
   Part 1
=========================================================== */

import { supabase } from "./supabase.js";

/* ===========================================================
   DOM ELEMENTS
=========================================================== */

const leadTableBody =
    document.getElementById("leadTableBody");

const leadSearch =
    document.getElementById("leadSearch");

const leadStatusFilter =
    document.getElementById("leadStatusFilter");

const refreshLeadsBtn =
    document.getElementById("refreshLeadsBtn");

/* ===========================================================
   GLOBAL STATE
=========================================================== */

let allLeads = [];

/* ===========================================================
   LOAD LEADS
=========================================================== */

export async function loadLeads() {

    if (!leadTableBody) return;

    try {

        const {

            data,

            error

        } = await supabase

            .from("leads")

            .select("*")

            .order("created_at", {

                ascending: false

            });

        if (error) throw error;

        allLeads = data || [];

        renderLeads(allLeads);

    } catch (err) {

        console.error(err);

        leadTableBody.innerHTML = `

<tr>

<td colspan="7">

Unable to load leads.

</td>

</tr>

`;

    }

}

/* ===========================================================
   RENDER TABLE
=========================================================== */

function renderLeads(leads) {

    if (!leadTableBody) return;

    if (!leads.length) {

        leadTableBody.innerHTML = `

<tr>

<td colspan="7">

No Leads Found

</td>

</tr>

`;

        return;

    }

    leadTableBody.innerHTML = "";

    leads.forEach(lead => {

        leadTableBody.innerHTML += `

<tr>

<td>${lead.name ?? "-"}</td>

<td>${lead.company ?? "-"}</td>

<td>${lead.phone ?? "-"}</td>

<td>${lead.email ?? "-"}</td>

<td>${lead.status ?? "New"}</td>

<td>

${lead.created_at
? new Date(
lead.created_at
).toLocaleDateString()
: "-"}

</td>

<td>

<button
class="editLeadBtn"
data-id="${lead.id}">
Edit
</button>

<button
class="deleteLeadBtn"
data-id="${lead.id}">
Delete
</button>

</td>

</tr>

`;

    });

}
/* ===========================================================
   SEARCH
=========================================================== */

function applyFilters() {

    let filtered = [...allLeads];

    const keyword =
        leadSearch?.value
            .trim()
            .toLowerCase() || "";

    const status =
        leadStatusFilter?.value || "";

    if (keyword) {

        filtered = filtered.filter(lead =>

            (lead.name || "")
                .toLowerCase()
                .includes(keyword)

            ||

            (lead.company || "")
                .toLowerCase()
                .includes(keyword)

            ||

            (lead.phone || "")
                .toLowerCase()
                .includes(keyword)

            ||

            (lead.email || "")
                .toLowerCase()
                .includes(keyword)

        );

    }

    if (status) {

        filtered = filtered.filter(

            lead => lead.status === status

        );

    }

    renderLeads(filtered);

}

/* ===========================================================
   DELETE LEAD
=========================================================== */

async function deleteLead(id) {

    if (!confirm("Delete this lead?"))
        return;

    try {

        const { error } = await supabase

            .from("leads")

            .delete()

            .eq("id", id);

        if (error) throw error;

        await loadLeads();

    } catch (err) {

        console.error(err);

        alert("Unable to delete lead.");

    }

}

/* ===========================================================
   TABLE EVENTS
=========================================================== */

document.addEventListener("click", e => {

    const btn = e.target;

    if (btn.classList.contains("deleteLeadBtn")) {

        deleteLead(btn.dataset.id);

    }

    if (btn.classList.contains("editLeadBtn")) {

        alert(
            "Edit Lead modal will be connected in the next update."
        );

    }

});

/* ===========================================================
   FILTER EVENTS
=========================================================== */

leadSearch?.addEventListener(
    "input",
    applyFilters
);

leadStatusFilter?.addEventListener(
    "change",
    applyFilters
);

/* ===========================================================
   REFRESH BUTTON
=========================================================== */

refreshLeadsBtn?.addEventListener(
    "click",
    loadLeads
);

/* ===========================================================
   INITIALIZE
=========================================================== */

export async function initLeads() {

    console.log(
        "Leads Module Initialized"
    );

    await loadLeads();

}

/* ===========================================================
   AUTO START
=========================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initLeads();

    }
);
