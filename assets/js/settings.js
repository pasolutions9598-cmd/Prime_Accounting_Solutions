/* ===========================================================
   Prime Accounting Solutions
   settings.js
   Production Ready
   Part 1
=========================================================== */

import { supabase } from "./supabase.js";

/* ===========================================================
   DOM ELEMENTS
=========================================================== */

const companyName =
    document.getElementById("companyName");

const companyTagline =
    document.getElementById("companyTagline");

const companyDescription =
    document.getElementById("companyDescription");

const companyEmail =
    document.getElementById("companyEmail");

const companyPhone =
    document.getElementById("companyPhone");

const companyWebsite =
    document.getElementById("companyWebsite");

const companyAddress =
    document.getElementById("companyAddress");

const refreshSettingsBtn =
    document.getElementById("refreshSettingsBtn");

const saveSettingsBtn =
    document.getElementById("saveSettingsBtn");

/* ===========================================================
   LOAD SETTINGS
=========================================================== */

export async function loadSettings() {

    try {

        const {

            data,

            error

        } = await supabase

            .from("settings")

            .select("*")

            .limit(1)

            .single();

        if (error) throw error;

        if (!data) return;

        companyName.value =
            data.company_name || "";

        companyTagline.value =
            data.tagline || "";

        companyDescription.value =
            data.description || "";

        companyEmail.value =
            data.email || "";

        companyPhone.value =
            data.phone || "";

        companyWebsite.value =
            data.website || "";

        companyAddress.value =
            data.address || "";

    } catch (err) {

        console.error(
            "Settings Load Error",
            err
        );

    }

}

/* ===========================================================
   SAVE SETTINGS
=========================================================== */

export async function saveSettings() {

    try {

        const payload = {

            id: 1,

            company_name:
                companyName.value,

            tagline:
                companyTagline.value,

            description:
                companyDescription.value,

            email:
                companyEmail.value,

            phone:
                companyPhone.value,

            website:
                companyWebsite.value,

            address:
                companyAddress.value

        };

        const { error } = await supabase

            .from("settings")

            .upsert(payload);

        if (error) throw error;

        alert(
            "Settings Saved Successfully."
        );

    } catch (err) {

        console.error(err);

        alert(
            "Unable to save settings."
        );

    }

}
/* ===========================================================
   REFRESH SETTINGS
=========================================================== */

refreshSettingsBtn?.addEventListener(
    "click",
    async () => {

        await loadSettings();

    }
);

/* ===========================================================
   SAVE SETTINGS
=========================================================== */

saveSettingsBtn?.addEventListener(
    "click",
    async () => {

        await saveSettings();

    }
);

/* ===========================================================
   RESET FORM
=========================================================== */

export function resetSettingsForm() {

    companyName.value = "";
    companyTagline.value = "";
    companyDescription.value = "";
    companyEmail.value = "";
    companyPhone.value = "";
    companyWebsite.value = "";
    companyAddress.value = "";

}

/* ===========================================================
   INITIALIZE SETTINGS
=========================================================== */

export async function initSettings() {

    console.log(
        "Settings Module Initialized"
    );

    await loadSettings();

}

/* ===========================================================
   AUTO START
=========================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initSettings();

    }
);
