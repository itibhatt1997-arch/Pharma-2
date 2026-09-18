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
  const hideCsr = () => {
    csrCards.forEach((card) => {
      card.classList.add("is-resetting");
      card.classList.remove("is-in");
    });
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        csrCards.forEach((card) => card.classList.remove("is-resetting"));
      });
    });
  };
  if (csrRow && csrCards.length) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      showCsr();
    } else {
      const csrSpy = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) showCsr();
            else hideCsr();
          });
        },
        { threshold: 0 }
      );
      csrSpy.observe(csrRow);
    }
  }

  const stats = document.querySelector(".about-stats");
  if (stats) {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const items = [...stats.children];
    const showLabels = () => items.forEach((li) => li.classList.add("is-labeled"));
    if (reduceMotion) {
      stats.classList.add("is-in");
      showLabels();
    } else {
      stats.classList.add("is-ready");
      stats.querySelectorAll("strong[data-count]").forEach((el) => {
        el.textContent = el.dataset.suffix === "%" ? "0%" : "0";
      });
      const easeOut = (t) => 1 - (1 - t) ** 3;
      const countUp = (el, to, suffix, done) => {
        const dur = 1800;
        const t0 = performance.now();
        const frame = (now) => {
          const t = Math.min(1, (now - t0) / dur);
          const val = Math.round(easeOut(t) * to);
          el.textContent = suffix === "%" ? `${val}%` : String(val);
          if (t < 1) requestAnimationFrame(frame);
          else {
            el.textContent = suffix === "%" ? `${to}%` : `${to}+`;
            done();
          }
        };
        requestAnimationFrame(frame);
      };
      const run = () => {
        stats.classList.add("is-in");
        items.forEach((li, i) => {
          const delay = i * 180;
          const strong = li.querySelector("strong");
          window.setTimeout(() => {
            if (strong.dataset.count) {
              countUp(strong, Number(strong.dataset.count), strong.dataset.suffix, () => {
                li.classList.add("is-labeled");
              });
            } else {
              window.setTimeout(() => li.classList.add("is-labeled"), 700);
            }
          }, delay);
        });
      };
      const statsSpy = new IntersectionObserver(
        (entries, observer) => {
          if (!entries.some((entry) => entry.isIntersecting)) return;
          run();
          observer.disconnect();
        },
        { threshold: 0.35 }
      );
      statsSpy.observe(stats);
    }
  }

  const mvGrid = document.querySelector(".mv-grid");
  if (mvGrid) {
    const mvCards = [...mvGrid.querySelectorAll(".mv-card")];
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      mvCards.forEach((card) => card.classList.add("is-in"));
    } else {
      const mvSpy = new IntersectionObserver(
        (entries, observer) => {
          if (!entries.some((entry) => entry.isIntersecting)) return;
          mvCards[0]?.classList.add("is-in");
          window.setTimeout(() => mvCards[1]?.classList.add("is-in"), 120);
          observer.disconnect();
        },
        { threshold: 0.28 }
      );
      mvSpy.observe(mvGrid);
    }
  }

  const typeHeads = [...document.querySelectorAll(".typewriter")];
  if (typeHeads.length && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    typeHeads.forEach((el) => {
      const text = el.textContent.trim();
      el.textContent = "";
      const ghost = document.createElement("span");
      ghost.className = "tw-ghost";
      ghost.setAttribute("aria-hidden", "true");
      ghost.textContent = text;
      const live = document.createElement("span");
      live.className = "tw-live";
      const typed = document.createElement("span");
      typed.className = "tw-text";
      const cursor = document.createElement("span");
      cursor.className = "tw-cursor";
      cursor.setAttribute("aria-hidden", "true");
      live.append(typed, cursor);
      el.append(ghost, live);

      const typeIn = () => {
        if (el.classList.contains("is-typing") || el.classList.contains("is-done")) return;
        el.classList.add("is-typing");
        let i = 0;
        const tick = () => {
          i += 1;
          typed.textContent = text.slice(0, i);
          if (i < text.length) {
            setTimeout(tick, 42);
          } else {
            el.classList.remove("is-typing");
            el.classList.add("is-done");
          }
        };
        tick();
      };

      const io = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            typeIn();
            observer.unobserve(entry.target);
          });
        },
        { threshold: 0.4, rootMargin: "0px 0px -8% 0px" }
      );
      io.observe(el);
    });
  }
})();
