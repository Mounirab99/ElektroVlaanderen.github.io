/* ========================================
   SNAP360 - Navigatie & Submenu via klik
   ======================================== */

// Basis selectors (safe als elementen ontbreken)
const nav         = document.querySelector(".nav");
const navOpenBtn  = document.querySelector(".navOpenBtn");
const navCloseBtn = document.querySelector(".navCloseBtn");
const searchIcon  = document.querySelector("#searchIcon");

/* -------------------------
   Zoeken (optioneel)
-------------------------- */
if (searchIcon && nav) {
  searchIcon.addEventListener("click", () => {
    nav.classList.toggle("openSearch");
    nav.classList.remove("openNav");
    if (nav.classList.contains("openSearch")) {
      searchIcon.classList.replace("uil-search", "uil-times");
    } else {
      searchIcon.classList.replace("uil-times", "uil-search");
    }
  });
}

/* -------------------------
   Hamburger open/dicht
-------------------------- */
if (navOpenBtn && nav) {
  navOpenBtn.addEventListener("click", () => {
    nav.classList.add("openNav");
    nav.classList.remove("openSearch");
    if (searchIcon) searchIcon.classList.replace("uil-times", "uil-search");
  });
}

if (navCloseBtn && nav) {
  navCloseBtn.addEventListener("click", () => {
    nav.classList.remove("openNav");
    closeAllSubmenus();
  });
}

// Sluit het mobiele menu (en submenu’s) bij scroll – voorkomt “vastgeplakt” menu
window.addEventListener("scroll", () => {
  if (!nav) return;
  if (nav.classList.contains("openNav")) {
    nav.classList.remove("openNav");
    closeAllSubmenus();
  }
});

// Reset states bij resize naar desktop
let resizeTO;
window.addEventListener("resize", () => {
  clearTimeout(resizeTO);
  resizeTO = setTimeout(() => {
    if (!nav) return;
    // Sluit open states bij layout switch
    nav.classList.remove("openNav", "openSearch");
    closeAllSubmenus();
  }, 150);
});

/* -------------------------
   Submenu via klik (mobiel + desktop)
-------------------------- */
const submenuParents = document.querySelectorAll(".nav .has-submenu");
const submenuAnchors = document.querySelectorAll(".nav .has-submenu > a");

// helpers
function closeAllSubmenus(except) {
  submenuParents.forEach((p) => {
    if (p !== except) {
      p.classList.remove("open");
      const a = p.querySelector(":scope > a");
      if (a) a.setAttribute("aria-expanded", "false");
    }
  });
}

submenuAnchors.forEach((anchor) => {
  // toegankelijkheid & pijltje-rotatie via CSS [aria-expanded="true"]
  anchor.setAttribute("role", "button");
  anchor.setAttribute("aria-expanded", "false");

  anchor.addEventListener("click", (e) => {
    const li = anchor.parentElement;
    const href = anchor.getAttribute("href") || "#";
    const isHash = href === "#" || href === "";

    // 1e klik => openen + navigatie blokkeren
    if (!li.classList.contains("open")) {
      e.preventDefault();
      closeAllSubmenus(li);
      li.classList.add("open");
      anchor.setAttribute("aria-expanded", "true");
      return;
    }

    // 2e klik: als href "#" -> sluiten (niet navigeren)
    if (li.classList.contains("open") && isHash) {
      e.preventDefault();
      li.classList.remove("open");
      anchor.setAttribute("aria-expanded", "false");
      return;
    }

    // 2e klik met echte URL -> laat navigeren
  });

  // Keyboard support (Enter/Space)
  anchor.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      anchor.click();
    }
  });
});

// Klik buiten nav => submenu’s dicht
document.addEventListener("click", (e) => {
  if (!e.target.closest(".nav")) closeAllSubmenus();
});

// Escape => submenu’s dicht
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeAllSubmenus();
});
