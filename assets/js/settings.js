/* ===========================================================
   Prime Accounting Solutions
   settings.js
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

const companyEmail =
    document.getElementById("companyEmail");

const companyPhone =
    document.getElementById("companyPhone");

const companyWebsite =
    document.getElementById("companyWebsite");

const companyAddress =
    document.getElementById("companyAddress");

const companyDescription =
    document.getElementById("companyDescription");

const saveSettingsBtn =
    document.getElementById("saveSettingsBtn");

const refreshSettingsBtn =
    document.getElementById("refreshSettingsBtn");

/* ===========================================================
   GLOBAL STATE
=========================================================== */

let settingsData = {};

/* ===========================================================
   LOAD SETTINGS
=========================================================== */

export async function loadSettings() {

    try {

        const { data, error } = await supabase

            .from("settings")

            .select("*")

            .limit(1)

            .single();

        if (error) throw error;

        settingsData = data || {};

        renderSettings();

    }

    catch (err) {

        console.error(

            "Settings Load Error:",

            err

        );

    }

}

/* ===========================================================
   RENDER SETTINGS
=========================================================== */

function renderSettings() {

    if (companyName)
        companyName.value =
            settingsData.company_name || "";

    if (companyTagline)
        companyTagline.value =
            settingsData.tagline || "";

    if (companyEmail)
        companyEmail.value =
            settingsData.email || "";

    if (companyPhone)
        companyPhone.value =
            settingsData.phone || "";

    if (companyWebsite)
        companyWebsite.value =
            settingsData.website || "";

    if (companyAddress)
        companyAddress.value =
            settingsData.address || "";

    if (companyDescription)
        companyDescription.value =
            settingsData.description || "";

}

/* ===========================================================
   SAVE SETTINGS
=========================================================== */

export async function saveSettings() {

    try {

        const payload = {

            company_name:
                companyName?.value.trim(),

            tagline:
                companyTagline?.value.trim(),

            email:
                companyEmail?.value.trim(),

            phone:
                companyPhone?.value.trim(),

            website:
                companyWebsite?.value.trim(),

            address:
                companyAddress?.value.trim(),

            description:
                companyDescription?.value.trim()

        };

        const { error } = await supabase

            .from("settings")

            .update(payload)

            .eq("id", settingsData.id);

        if (error) throw error;

        alert(

            "Settings Saved Successfully."

        );

        await loadSettings();

    }

    catch (err) {

        console.error(

            "Save Settings Error:",

            err

        );

        alert(

            "Unable to save settings."

        );

    }

}

/* ===========================================================
   REFRESH
=========================================================== */

export async function refreshSettings() {

    await loadSettings();

}

/* ===========================================================
   EVENTS
=========================================================== */

saveSettingsBtn?.addEventListener(

    "click",

    saveSettings

);

refreshSettingsBtn?.addEventListener(

    "click",

    refreshSettings

);

/* ===========================================================
   INIT
=========================================================== */

export async function initSettings() {

    console.log(

        "Settings Module Loaded"

    );

    await loadSettings();

}

document.addEventListener(

    "DOMContentLoaded",

    () => {

        initSettings();

    }

);
