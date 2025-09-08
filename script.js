// SNAP360 - super simpele nav + submenu (klik)

// Wacht tot de DOM klaar is (voorkomt null errors)
document.addEventListener('DOMContentLoaded', () => {
  const nav         = document.querySelector('.nav');
  const navOpenBtn  = document.querySelector('.navOpenBtn');
  const navCloseBtn = document.querySelector('.navCloseBtn');

  if (!nav || !navOpenBtn || !navCloseBtn) {
    // Als één van de elementen mist, doe niets (voorkomt crashes)
    return;
  }

  // ---- Helper: alle submenu's dicht ----
  const closeAllSubmenus = (except = null) => {
    document.querySelectorAll('.nav .has-submenu').forEach(li => {
      if (li !== except) {
        li.classList.remove('open');
        const a = li.querySelector(':scope > a');
        if (a) a.setAttribute('aria-expanded', 'false');
      }
    });
  };

  // ---- Hamburger open/dicht ----
  navOpenBtn.addEventListener('click', (e) => {
    e.preventDefault();
    nav.classList.add('openNav');
    closeAllSubmenus();
  });

  navCloseBtn.addEventListener('click', (e) => {
    e.preventDefault();
    nav.classList.remove('openNav');
    closeAllSubmenus();
  });

  // Veiligheid: als je scrolt, dicht
  window.addEventListener('scroll', () => {
    if (nav.classList.contains('openNav')) {
      nav.classList.remove('openNav');
      closeAllSubmenus();
    }
  });

  // ---- Submenu via klik (1e klik open, 2e klik navigeert als het geen # is) ----
  document.querySelectorAll('.nav .has-submenu > a').forEach(anchor => {
    anchor.setAttribute('role', 'button');
    anchor.setAttribute('aria-expanded', 'false');

    anchor.addEventListener('click', (e) => {
      const li   = anchor.parentElement;
      const href = anchor.getAttribute('href') || '#';
      const isHash = href === '#' || href.trim() === '';

      // 1e klik -> open
      if (!li.classList.contains('open')) {
        e.preventDefault();
        closeAllSubmenus(li);
        li.classList.add('open');
        anchor.setAttribute('aria-expanded', 'true');
        return;
      }

      // 2e klik -> als href '#' is, dan sluiten (niet navigeren)
      if (isHash) {
        e.preventDefault();
        li.classList.remove('open');
        anchor.setAttribute('aria-expanded', 'false');
        return;
      }
      // Anders: normale navigatie
    });
  });

  // Klik buiten nav -> alles dicht
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav')) {
      closeAllSubmenus();
    }
  });

  // Escape -> alles dicht
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllSubmenus();
      nav.classList.remove('openNav');
    }
  });

  // Bij resize resetten (voorkomt vreemde states)
  let resizeTO;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTO);
    resizeTO = setTimeout(() => {
      nav.classList.remove('openNav');
      closeAllSubmenus();
    }, 150);
  });
});
