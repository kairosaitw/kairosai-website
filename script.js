(function () {
  "use strict";

  const nav = document.getElementById("siteNav");
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");
  const sections = document.querySelectorAll("main section[id]");
  const revealElements = document.querySelectorAll(".reveal");

  function setScrolledState() {
    if (!nav) return;
    nav.classList.toggle("scrolled", window.scrollY > 24);
  }

  function closeMenu() {
    if (!navToggle || !navLinks || !nav) return;
    navToggle.classList.remove("active");
    navToggle.setAttribute("aria-expanded", "false");
    navLinks.classList.remove("open");
    nav.classList.remove("menu-open");
    document.body.classList.remove("nav-open");
  }

  function toggleMenu() {
    if (!navToggle || !navLinks || !nav) return;
    const isOpen = navLinks.classList.toggle("open");
    navToggle.classList.toggle("active", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
    nav.classList.toggle("menu-open", isOpen);
    document.body.classList.toggle("nav-open", isOpen);
  }

  function smoothScroll(event) {
    const href = event.currentTarget.getAttribute("href");
    if (!href || !href.startsWith("#")) return;

    const target = document.querySelector(href);
    if (!target) return;

    event.preventDefault();
    closeMenu();

    const offset = 78;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
  }

  function setActiveLink() {
    if (!sections.length || !navLinks) return;

    const scrollPosition = window.scrollY + 120;
    let activeId = "";

    sections.forEach((section) => {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      if (scrollPosition >= top && scrollPosition < bottom) {
        activeId = section.id;
      }
    });

    navLinks.querySelectorAll("a[href^='#']").forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${activeId}`);
    });
  }

  if (navToggle) {
    navToggle.addEventListener("click", toggleMenu);
  }

  document.querySelectorAll("a[href^='#']").forEach((anchor) => {
    anchor.addEventListener("click", smoothScroll);
  });

  window.addEventListener("scroll", () => {
    setScrolledState();
    setActiveLink();
  }, { passive: true });

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.16,
        rootMargin: "0px 0px -32px 0px",
      }
    );

    revealElements.forEach((element, index) => {
      element.style.transitionDelay = `${(index % 4) * 70}ms`;
      observer.observe(element);
    });
  } else {
    revealElements.forEach((element) => {
      element.classList.add("visible");
    });
  }

  setScrolledState();
  setActiveLink();
})();
