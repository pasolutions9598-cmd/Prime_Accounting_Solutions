/* ===========================================================
   Prime Accounting Solutions
   services.js
   Production Ready
   Part 1
=========================================================== */

import { supabase } from "./supabase.js";

/* ===========================================================
   DOM ELEMENTS
=========================================================== */

const serviceTableBody =
    document.getElementById("serviceTableBody");

const serviceSearch =
    document.getElementById("serviceSearch");

const serviceCategoryFilter =
    document.getElementById("serviceCategoryFilter");

const serviceStatusFilter =
    document.getElementById("serviceStatusFilter");

const servicePriceFilter =
    document.getElementById("servicePriceFilter");

const newServiceBtn =
    document.getElementById("newServiceBtn");

/* ===========================================================
   GLOBAL STATE
=========================================================== */

let allServices = [];

/* ===========================================================
   LOAD SERVICES
=========================================================== */

export async function loadServices() {

    if (!serviceTableBody) return;

    serviceTableBody.innerHTML = `
        <tr>
            <td colspan="8">
                Loading Services...
            </td>
        </tr>
    `;

    try {

        const { data, error } =
            await supabase

                .from("services")

                .select("*")

                .order("created_at", {

                    ascending: false

                });

        if (error) throw error;

        allServices = data || [];

        renderServices(allServices);

    } catch (err) {

        console.error(err);

        serviceTableBody.innerHTML = `
            <tr>
                <td colspan="8">
                    Unable to load services.
                </td>
            </tr>
        `;

    }

}

/* ===========================================================
   RENDER SERVICES
=========================================================== */

function renderServices(services) {

    serviceTableBody.innerHTML = "";

    if (!services.length) {

        serviceTableBody.innerHTML = `
            <tr>
                <td colspan="8">
                    No Services Found
                </td>
            </tr>
        `;

        return;

    }

    services.forEach(service => {

        serviceTableBody.innerHTML += `

<tr>

<td>

<img
src="${service.image_url || service.image || "assets/images/no-image.png"}"
style="
width:60px;
height:60px;
border-radius:8px;
object-fit:cover;
">

</td>

<td>${service.title || service.name || "-"}</td>

<td>${service.category || "-"}</td>

<td>

₹${service.price ?? "-"}

</td>

<td>

${service.status || "active"}

</td>

<td>

${service.featured ? "⭐ Yes" : "—"}

</td>

<td>

${service.created_at
? new Date(service.created_at).toLocaleDateString()
: "-"}

</td>

<td>

<button
class="editServiceBtn"
data-id="${service.id}">

✏️

</button>

<button
class="deleteServiceBtn"
data-id="${service.id}">

🗑️

</button>

</td>

</tr>

`;

    });

}
/* ===========================================================
   SEARCH & FILTER
=========================================================== */

function applyFilters() {

    let filtered = [...allServices];

    const keyword =
        serviceSearch?.value
            .trim()
            .toLowerCase() || "";

    const category =
        serviceCategoryFilter?.value || "";

    const status =
        serviceStatusFilter?.value || "";

    const price =
        servicePriceFilter?.value || "";

    if (keyword) {

        filtered = filtered.filter(service =>

            (service.title || service.name || "")
                .toLowerCase()
                .includes(keyword)

            ||

            (service.category || "")
                .toLowerCase()
                .includes(keyword)

        );

    }

    if (category) {

        filtered = filtered.filter(

            service => service.category === category

        );

    }

    if (status) {

        filtered = filtered.filter(

            service => service.status === status

        );

    }

    if (price) {

        filtered = filtered.filter(

            service =>

                String(service.price) === price

        );

    }

    renderServices(filtered);

}

/* ===========================================================
   DELETE SERVICE
=========================================================== */

async function deleteService(id) {

    if (!confirm("Delete this service?"))
        return;

    try {

        const { error } = await supabase

            .from("services")

            .delete()

            .eq("id", id);

        if (error) throw error;

        await loadServices();

    } catch (err) {

        console.error(err);

        alert("Unable to delete service.");

    }

}

/* ===========================================================
   TABLE EVENTS
=========================================================== */

document.addEventListener("click", e => {

    const btn = e.target;

    if (btn.classList.contains("deleteServiceBtn")) {

        deleteService(btn.dataset.id);

    }

    if (btn.classList.contains("editServiceBtn")) {

        alert(
            "Edit Service modal will be connected in the next update."
        );

    }

});

/* ===========================================================
   FILTER EVENTS
=========================================================== */

serviceSearch?.addEventListener(
    "input",
    applyFilters
);

serviceCategoryFilter?.addEventListener(
    "change",
    applyFilters
);

serviceStatusFilter?.addEventListener(
    "change",
    applyFilters
);

servicePriceFilter?.addEventListener(
    "change",
    applyFilters
);

/* ===========================================================
   NEW SERVICE BUTTON
=========================================================== */

newServiceBtn?.addEventListener(
    "click",
    () => {

        alert(
            "Add Service modal will be connected in the next update."
        );

    }
);

/* ===========================================================
   INITIALIZE
=========================================================== */

export async function initServices() {

    console.log(
        "Services Module Initialized"
    );

    await loadServices();

}

/* ===========================================================
   AUTO START
=========================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initServices();

    }
);
