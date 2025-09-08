const nav = document.querySelector(".nav"),
  searchIcon = document.querySelector("#searchIcon"),
  navOpenBtn = document.querySelector(".navOpenBtn"),
  navCloseBtn = document.querySelector(".navCloseBtn");

// --- Zoeken ---
if (searchIcon) {
  searchIcon.addEventListener("click", () => {
    nav.classList.toggle("openSearch");
    nav.classList.remove("openNav");
    if (nav.classList.contains("openSearch")) {
      return searchIcon.classList.replace("uil-search", "uil-times");
    }
    searchIcon.classList.replace("uil-times", "uil-search");
  });
}

// --- Mobiel menu open/dicht ---
if (navOpenBtn) {
  navOpenBtn.addEventListener("click", () => {
    nav.classList.add("openNav");
    nav.classList.remove("openSearch");
    if (searchIcon) {
      searchIcon.classList.replace("uil-times", "uil-search");
    }
  });
}

if (navCloseBtn) {
  navCloseBtn.addEventListener("click", () => {
    nav.classList.remove("openNav");
  });
}

// --- Submenu fix (iPhone/mobiel) ---
(function () {
  const parents = document.querySelectorAll(".nav .has-submenu");
  const anchors = document.querySelectorAll(".nav .has-submenu > a");

  const isMobileLike = () =>
    window.matchMedia("(max-width: 768px)").matches ||
    window.matchMedia("(pointer: coarse)").matches ||
    nav.classList.contains("openNav");

  function closeAll() {
    parents.forEach((p) => p.classList.remove("open"));
  }

  anchors.forEach((a) => {
    a.addEventListener("click", function (e) {
      if (!isMobileLike()) return; // Desktop = gewoon link volgen

      const li = this.parentElement;
      const alreadyOpen = li.classList.contains("open");

      if (!alreadyOpen) {
        e.preventDefault(); // Voorkomt direct navigeren
        closeAll();
        li.classList.add("open"); // Open submenu
      }
      // Als al open => tweede klik gaat gewoon naar de pagina
    });
  });

  // Klik buiten menu sluit submenu's
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".nav")) closeAll();
  });

  // Escape sluit submenu's
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAll();
  });

  // Reset bij resize naar desktop
  let resizeTO;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTO);
    resizeTO = setTimeout(() => {
      if (!isMobileLike()) closeAll();
    }, 150);
  });
})();
