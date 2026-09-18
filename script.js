(() => {
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.querySelector("#nav-menu");
  const menuLinks = menu.querySelectorAll("a");

  const setMenu = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    menu.classList.toggle("is-open", open);
    document.body.classList.toggle("nav-open", open);
  };

  toggle.addEventListener("click", () => {
    setMenu(toggle.getAttribute("aria-expanded") !== "true");
  });

  menuLinks.forEach((link) => link.addEventListener("click", () => setMenu(false)));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenu(false);
  });

  const onScroll = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const reveal = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll(".reveal").forEach((el) => reveal.observe(el));
  } else {
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible"));
  }

  const navLinks = [...document.querySelectorAll(".nav-menu a[href^='#']")];
  const hashes = new Set(navLinks.map((link) => link.getAttribute("href")));
  const sections = [...document.querySelectorAll("main section[id], footer[id]")].filter((section) =>
    hashes.has(`#${section.id}`)
  );

  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const hash = `#${entry.target.id}`;
        navLinks.forEach((link) => {
          link.classList.toggle("is-active", link.getAttribute("href") === hash);
        });
      });
    },
    { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
  );

  sections.forEach((section) => spy.observe(section));

  const csrRow = document.querySelector(".csr-row");
  const csrCards = document.querySelectorAll(".csr-card");
  const showCsr = () => csrCards.forEach((card) => card.classList.add("is-in"));
  if (csrRow && csrCards.length) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      showCsr();
    } else {
      const csrSpy = new IntersectionObserver(
        (entries, observer) => {
          if (!entries.some((entry) => entry.isIntersecting)) return;
          showCsr();
          observer.disconnect();
        },
        { threshold: 0.25, rootMargin: "0px 0px -40px 0px" }
      );
      csrSpy.observe(csrRow);
    }
  }
})();
