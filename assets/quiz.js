/* ============================================================================
   quiz.js — reusable interactive components for the course
   No dependencies. No build step. Works from file://

   Components (all opt-in via data attributes):
     1. [data-quiz]      multiple-choice drill with immediate feedback + score
     2. [data-reveal]    show/hide a model answer
     3. [data-checklist] persistent tick-list with progress
     4. [data-tally]     two-button counter for use during a live meeting
     5. [data-recall]    autosaving free-recall textarea (retrieval practice)
   ========================================================================= */

(function () {
  "use strict";

  var STORE_PREFIX = "tmeval:";

  /* ------------------------------------------------------------- helpers -- */

  function storeGet(key, fallback) {
    try {
      var v = window.localStorage.getItem(STORE_PREFIX + key);
      return v === null ? fallback : v;
    } catch (e) {
      return fallback;
    }
  }

  function storeSet(key, value) {
    try {
      window.localStorage.setItem(STORE_PREFIX + key, value);
    } catch (e) {
      /* private mode / file:// restrictions — fail silently */
    }
  }

  /* A stable key for this page so different lessons don't collide. */
  function pageKey() {
    return window.location.pathname.split("/").pop() || "index";
  }

  function all(selector, root) {
    return Array.prototype.slice.call(
      (root || document).querySelectorAll(selector)
    );
  }

  /* --------------------------------------------------------------- quiz -- */

  function initQuiz(quiz) {
    var items = all(".quiz__item", quiz);
    var answered = 0;
    var correct = 0;

    var scoreEl = document.createElement("div");
    scoreEl.className = "quiz__score";
    scoreEl.hidden = true;

    var resetBtn = document.createElement("button");
    resetBtn.type = "button";
    resetBtn.className = "quiz__reset";
    resetBtn.textContent = "Reset";
    resetBtn.hidden = true;

    scoreEl.appendChild(document.createTextNode(""));
    scoreEl.appendChild(resetBtn);

    var scoreText = document.createElement("span");
    scoreEl.insertBefore(scoreText, resetBtn);

    quiz.appendChild(scoreEl);

    function renderScore() {
      if (answered === 0) {
        scoreEl.hidden = true;
        resetBtn.hidden = true;
        return;
      }
      scoreEl.hidden = false;
      resetBtn.hidden = false;
      var verdict;
      if (correct === answered && answered === items.length) {
        verdict = " — full marks.";
      } else if (correct / answered >= 0.8) {
        verdict = " — solid.";
      } else if (correct / answered >= 0.5) {
        verdict = " — review and try again.";
      } else {
        verdict = " — re-read the section above, then reset.";
      }
      scoreText.textContent =
        "Answered " + answered + " of " + items.length +
        " · Correct " + correct + verdict;
    }

    items.forEach(function (item, index) {
      var answer = parseInt(item.getAttribute("data-answer"), 10);
      var opts = all(".quiz__opt", item);

      var prompt = item.querySelector(".quiz__prompt");
      if (prompt && !prompt.querySelector(".n")) {
        var n = document.createElement("span");
        n.className = "n";
        n.textContent = index + 1 + ".";
        prompt.insertBefore(n, prompt.firstChild);
      }

      var fb = item.querySelector(".quiz__fb");
      if (!fb) {
        fb = document.createElement("p");
        fb.className = "quiz__fb";
        fb.hidden = true;
        item.appendChild(fb);
      }

      var locked = false;

      opts.forEach(function (btn, i) {
        btn.addEventListener("click", function () {
          if (locked) return;
          locked = true;
          answered += 1;

          var isRight = i === answer;
          if (isRight) correct += 1;

          opts.forEach(function (other, j) {
            other.disabled = true;
            if (j === answer) {
              other.classList.add("is-correct");
            } else if (j === i) {
              other.classList.add("is-wrong");
            } else {
              other.classList.add("is-dim");
            }
          });

          var msg = isRight
            ? item.getAttribute("data-why-right")
            : item.getAttribute("data-why-wrong");

          if (msg) {
            fb.textContent = msg;
            fb.hidden = false;
            fb.classList.add(isRight ? "good" : "bad");
          }

          item.dataset.state = isRight ? "right" : "wrong";
          renderScore();
        });
      });
    });

    resetBtn.addEventListener("click", function () {
      answered = 0;
      correct = 0;
      items.forEach(function (item) {
        delete item.dataset.state;
        var fb = item.querySelector(".quiz__fb");
        if (fb) {
          fb.hidden = true;
          fb.textContent = "";
          fb.classList.remove("good", "bad");
        }
        all(".quiz__opt", item).forEach(function (btn) {
          btn.disabled = false;
          btn.classList.remove("is-correct", "is-wrong", "is-dim");
        });
      });
      renderScore();
      quiz.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    renderScore();
  }

  /* ------------------------------------------------------------- reveal -- */

  function initReveal(box) {
    var btn = box.querySelector("[data-reveal]");
    var body = box.querySelector(".reveal__body");
    if (!btn || !body) return;

    var showLabel = btn.getAttribute("data-label-show") || "Show model answer";
    var hideLabel = btn.getAttribute("data-label-hide") || "Hide model answer";

    /* Style is applied here rather than in markup so lessons can stay minimal. */
    btn.classList.add("reveal__btn");
    btn.textContent = showLabel;

    btn.addEventListener("click", function () {
      var opening = body.hidden;
      body.hidden = !opening;
      btn.textContent = opening ? hideLabel : showLabel;
      if (opening) {
        body.setAttribute("tabindex", "-1");
        body.focus({ preventScroll: true });
      }
    });
  }

  /* ---------------------------------------------------------- checklist -- */

  function initChecklist(list) {
    var key = pageKey() + ":" + (list.getAttribute("data-key") || "list");
    var boxes = all('input[type="checkbox"]', list);
    var progress = document.createElement("p");
    progress.className = "progress";
    list.parentNode.insertBefore(progress, list.nextSibling);

    function save() {
      var state = boxes.map(function (b) {
        return b.checked ? "1" : "0";
      }).join("");
      storeSet(key, state);
    }

    function render() {
      var done = boxes.filter(function (b) {
        return b.checked;
      }).length;
      progress.textContent = done + " of " + boxes.length + " complete";
    }

    var saved = storeGet(key, "");
    if (saved) {
      boxes.forEach(function (b, i) {
        if (saved[i] === "1") b.checked = true;
      });
    }

    boxes.forEach(function (b) {
      b.addEventListener("change", function () {
        save();
        render();
      });
    });

    render();
  }

  /* -------------------------------------------------------------- tally -- */

  function initTally(box) {
    var key = pageKey() + ":" + (box.getAttribute("data-key") || "tally");
    var btns = all(".tally__btn", box);
    var counts = {};

    btns.forEach(function (b) {
      counts[b.getAttribute("data-kind")] = 0;
    });

    var savedRaw = storeGet(key, "");
    if (savedRaw) {
      try {
        var parsed = JSON.parse(savedRaw);
        Object.keys(parsed).forEach(function (k) {
          if (k in counts) counts[k] = parsed[k] || 0;
        });
      } catch (e) {
        /* ignore malformed */
      }
    }

    function save() {
      storeSet(key, JSON.stringify(counts));
    }

    function render() {
      btns.forEach(function (b) {
        var kind = b.getAttribute("data-kind");
        var out = b.querySelector(".t-count");
        if (out) out.textContent = String(counts[kind]);
      });
    }

    btns.forEach(function (b) {
      var kind = b.getAttribute("data-kind");
      function bump() {
        counts[kind] += 1;
        render();
        save();
      }
      b.addEventListener("click", bump);
      b.addEventListener("keydown", function (ev) {
        if (ev.key === "Enter" || ev.key === " " || ev.key === "Spacebar") {
          ev.preventDefault();
          bump();
        }
      });
    });

    var reset = document.createElement("button");
    reset.type = "button";
    reset.className = "tally__reset";
    reset.textContent = "Reset";
    reset.addEventListener("click", function () {
      Object.keys(counts).forEach(function (k) {
        counts[k] = 0;
      });
      render();
      save();
    });
    box.appendChild(reset);

    render();
  }

  /* ------------------------------------------------------------- recall -- */

  function initRecall(box) {
    var key = pageKey() + ":" + (box.getAttribute("data-key") || "recall");
    var ta = box.querySelector("textarea");
    if (!ta) return;

    ta.value = storeGet(key, "");

    var badge = document.createElement("span");
    badge.className = "saved";
    badge.hidden = true;
    var btnRow = box.querySelector(".recall__actions");
    if (btnRow) btnRow.appendChild(badge);

    var timer = null;
    ta.addEventListener("input", function () {
      if (timer) window.clearTimeout(timer);
      timer = window.setTimeout(function () {
        storeSet(key, ta.value);
        if (btnRow) {
          badge.textContent = "saved";
          badge.hidden = false;
          window.setTimeout(function () {
            badge.hidden = true;
          }, 1400);
        }
      }, 400);
    });
  }

  /* ------------------------------------------------------------- rewrite -- */

  /*  Per-item drill. Each item shows its own prompt permanently and owns its
      own answer field, so the learner never has to scroll or copy the question.
      Markup:
        <div class="rewrite" data-rewrite data-key="k">
          <div class="rewrite__item">
            <div class="rewrite__head">
              <span class="rewrite__n">Advice"></span>
              <p class="rewrite__advice">"..."</p>
            </div>
            <div class="rewrite__body">
              <label>Your feedback version</label>
              <textarea class="rewrite__input"></textarea>
              <div class="rewrite__bar">
                <button type="button" data-item-reveal>Show model answer</button>
              </div>
              <div class="rewrite__model" hidden>...</div>
            </div>
          </div>
          <div class="rewrite__all">
            <button type="button" data-reveal-all>Show all model answers</button>
          </div>
        </div>
  */
  function initRewrite(box) {
    var baseKey = pageKey() + ":" + (box.getAttribute("data-key") || "rewrite");
    var items = all(".rewrite__item", box);

    items.forEach(function (item, i) {
      var ta = item.querySelector(".rewrite__input");
      var btn = item.querySelector("[data-item-reveal]");
      var model = item.querySelector(".rewrite__model");

      if (btn) {
        btn.classList.add("reveal__btn");
        btn.setAttribute("data-label-show", btn.textContent.trim());
        btn.setAttribute("data-label-hide", "Hide model answer");
        btn.setAttribute("data-item-index", String(i));
        btn.addEventListener("click", function () {
          if (!model) return;
          var opening = model.hidden;
          model.hidden = !opening;
          btn.textContent = opening
            ? btn.getAttribute("data-label-hide")
            : btn.getAttribute("data-label-show");
        });
      }

      if (ta) {
        var k = baseKey + ":" + i;
        ta.value = storeGet(k, "");
        var t = null;
        ta.addEventListener("input", function () {
          if (t) window.clearTimeout(t);
          t = window.setTimeout(function () {
            storeSet(k, ta.value);
          }, 400);
        });
      }
    });

    var allBtn = box.querySelector("[data-reveal-all]");
    if (allBtn) {
      allBtn.classList.add("reveal__btn");
      allBtn.textContent = "Show all model answers";
      var open = false;
      allBtn.addEventListener("click", function () {
        open = !open;
        items.forEach(function (item) {
          var model = item.querySelector(".rewrite__model");
          var btn = item.querySelector("[data-item-reveal]");
          if (model) model.hidden = !open;
          if (btn) {
            btn.textContent = open
              ? btn.getAttribute("data-label-hide")
              : btn.getAttribute("data-label-show");
          }
        });
        allBtn.textContent = open ? "Hide all model answers" : "Show all model answers";
      });
    }
  }

  /* ------------------------------------------------------- tables (mobile) -- */

  /*  Narrow screens cannot show a two-column definition table. Two-column tables
      that are NOT two-way contrasts collapse into stacked blocks; wide data tables
      get a horizontal scroll container. Markup is untouched — this reads the DOM. */
  function enhanceTables() {
    all("table").forEach(function (table) {
      if (table.closest(".table-scroll")) return;

      var firstRow = table.querySelector("tr");
      if (!firstRow) return;
      var cols = firstRow.children.length;

      /* A two-way contrast must stay side by side — the pairing is the point. */
      if (table.classList.contains("compare")) return;

      if (cols <= 2) {
        /* Carry the column headers down into each cell so stacking keeps meaning. */
        var heads = all("thead th", table);
        if (heads.length) {
          all("tbody tr", table).forEach(function (tr) {
            all("td", tr).forEach(function (td, i) {
              if (i > 0 && heads[i]) {
                td.setAttribute("data-label", heads[i].textContent.trim());
              }
            });
          });
        }
        table.classList.add("table--stack");
      } else {
        var box = document.createElement("div");
        box.className = "table-scroll";
        table.parentNode.insertBefore(box, table);
        box.appendChild(table);
      }
    });
  }

  /* --------------------------------------------------- back to top (phone) -- */

  function initTopLink() {
    if (document.querySelector(".toplink")) return;

    var a = document.createElement("a");
    a.className = "toplink";
    a.href = "#";
    a.setAttribute("aria-label", "Back to top");
    a.textContent = "\u2191";
    a.addEventListener("click", function (ev) {
      ev.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    document.body.appendChild(a);

    function onScroll() {
      a.classList.toggle("is-visible", window.scrollY > 900);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* --------------------------------------------------------------- boot -- */

  function boot() {
    enhanceTables();
    initTopLink();
    all("[data-quiz]").forEach(initQuiz);
    all("[data-reveal-box]").forEach(initReveal);
    all("[data-checklist]").forEach(initChecklist);
    all("[data-tally]").forEach(initTally);
    all("[data-recall]").forEach(initRecall);
    all("[data-rewrite]").forEach(initRewrite);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
