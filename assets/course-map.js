/* ============================================================================
   course-map.js — single source of truth for course navigation
   ----------------------------------------------------------------------------
   Adding a lesson means editing the manifest below ONCE. Every page that
   contains <nav class="lessonmap" data-lessonmap></nav> renders its chips from
   here, so lesson numbering can never drift out of sync across the course.

   Set a lesson's `file` to its slug (without .html) once it is written, and the
   chip becomes a live link. Leave it null and the chip renders as "planned".
   ========================================================================= */

(function () {
  "use strict";

  var MANIFEST = {
    lessons: [
      { n: "01", file: "0001-you-are-not-a-judge", title: "You Are Not a Judge" },
      { n: "02", file: "0002-the-anatomy-of-a-speech", title: "The Anatomy of a Speech" },
      { n: "03", file: "0003-purpose-and-structure", title: "Purpose and Structure" },
      { n: "04", file: "0004-voice-pitch-tone-volume-pace", title: "Voice: Pitch, Tone, Volume, Pace" },
      { n: "05", file: null, title: "Body Language" },
      { n: "06", file: null, title: "Scoring Honestly" },
      { n: "07", file: null, title: "Structuring the Evaluation Itself" },
      { n: "08", file: null, title: "Delivering It" },
      { n: "09", file: null, title: "The Excellent Tier" }
    ],
    references: [
      { n: "01", file: "0001-glossary", title: "Glossary of Terms" },
      { n: "02", file: "0002-what-makes-an-evaluation-excellent", title: "The Excellence Ladder" },
      { n: "03", file: "0003-evaluators-quick-card", title: "Evaluator's Quick Card" }
    ]
  };

  /* Pages live in /lessons/ or /reference/ and link across to each other, so the
     prefix depends on where the current page sits — including for a repo served
     from a GitHub Pages subpath. */
  var path = window.location.pathname;
  var inSubdir = /\/(lessons|reference)\//.test(path);
  var up = inSubdir ? "../" : "";
  var current = path.split("/").pop() || "index.html";

  function href(kind, file) {
    return up + (kind === "lessons" ? "lessons/" : "reference/") + file + ".html";
  }

  function chip(kind, entry, isCurrent) {
    var a = document.createElement("a");
    a.textContent = entry.n;

    if (entry.file) {
      a.href = href(kind, entry.file);
      a.title = isCurrent ? entry.title + " (you are here)" : entry.title;
      if (isCurrent) {
        a.className = "is-current";
        a.setAttribute("aria-current", "page");
      }
    } else {
      a.className = "is-planned";
      a.title = entry.title + " — not yet written";
      a.setAttribute("aria-disabled", "true");
    }
    return a;
  }

  function renderGroup(container, label, kind, entries) {
    var heading = document.createElement("span");
    heading.className = "lm-label";
    heading.textContent = label;
    container.appendChild(heading);

    entries.forEach(function (entry) {
      var target = entry.file ? entry.file + ".html" : null;
      container.appendChild(chip(kind, entry, target === current));
    });
  }

  function boot() {
    var maps = document.querySelectorAll("[data-lessonmap]");
    if (!maps.length) return;

    Array.prototype.forEach.call(maps, function (map) {
      map.innerHTML = "";
      renderGroup(map, "Lessons", "lessons", MANIFEST.lessons);
      renderGroup(map, "Reference", "reference", MANIFEST.references);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
