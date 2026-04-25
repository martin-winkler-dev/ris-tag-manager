// default RIS tags
export const TAG_CONFIG = Object.freeze({
    TY: Object.freeze({
        name: "Type of Reference", // first tag -- dont display
    }),
    AU: Object.freeze({
        name: "Author",
    }),
    TI: Object.freeze({
        name: "Title",
    }),
    T2: Object.freeze({
        name: "Secondary Title (Journal/Book)",
    }),
    PY: Object.freeze({
        name: "Publication Year",
    }),
    VL: Object.freeze({
        name: "Volume",
    }),
    IS: Object.freeze({
        name: "Issue",
    }),
    SP: Object.freeze({
        name: "Start Page",
    }),
    EP: Object.freeze({
        name: "End Page",
    }),
    SN: Object.freeze({
        name: "ISSN/ISBN",
    }),
    DO: Object.freeze({
        name: "DOI",
    }),
    UR: Object.freeze({
        name: "URL",
    }),
    AB: Object.freeze({
        name: "Abstract",
    }),
    KW: Object.freeze({
        name: "Keywords",
    }),
    N1: Object.freeze({
        name: "Notes",
    }),
    N2: Object.freeze({
        name: "Abstract/Notes (Secondary)",
    }),
    AN: Object.freeze({
        name: "Accession Number",
    }),
    DB: Object.freeze({
        name: "Database Name",
    }),
    DP: Object.freeze({
        name: "Database Provider",
    }),
    LA: Object.freeze({
        name: "Language",
    }),
    CY: Object.freeze({
        name: "City",
    }),
    PB: Object.freeze({
        name: "Publisher",
    }),
    AD: Object.freeze({
        name: "Author Address",
    }),
    ER: Object.freeze({
        name: "End of Record", // last tag -- dont display
    }),
});

// default action buttons
export const DEFAULT_ACTIONS = Object.freeze([
    { name: "Delete all Keywords (KW)", tag: "KW" },
    { name: "Delete all Abstracts (AB)", tag: "AB" },
    { name: "Delete all Notes (N1)", tag: "N1" },
    { name: "Delete all URLs (UR)", tag: "UR" },
]);