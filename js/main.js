(function () {
  "use strict";

  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Mobile menu ---------- */
  var navToggle = document.getElementById("navToggle");
  var mobileMenu = document.getElementById("mobileMenu");
  if (navToggle && mobileMenu) {
    navToggle.addEventListener("click", function () {
      var open = mobileMenu.classList.toggle("open");
      navToggle.classList.toggle("open", open);
      navToggle.setAttribute("aria-expanded", String(open));
    });
    mobileMenu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        mobileMenu.classList.remove("open");
        navToggle.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Scroll progress bar ---------- */
  var progressBar = document.getElementById("scrollProgress");
  if (progressBar) {
    var updateProgress = function () {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      var pct = max > 0 ? (h.scrollTop / max) * 100 : 0;
      progressBar.style.width = pct + "%";
    };
    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();
  }

  /* ---------- Header shadow on scroll ---------- */
  var header = document.querySelector(".bar");
  if (header) {
    var updateHeader = function () {
      header.classList.toggle("scrolled", window.scrollY > 8);
    };
    window.addEventListener("scroll", updateHeader, { passive: true });
    updateHeader();
  }

  /* ---------- Active nav link on scroll (+ sliding indicator) ---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav-links a"));
  var navIndicator = document.getElementById("navIndicator");
  var moveIndicator = function (link) {
    if (!navIndicator || !link) return;
    var navRect = link.closest(".nav-links").getBoundingClientRect();
    var linkRect = link.getBoundingClientRect();
    navIndicator.style.width = linkRect.width + "px";
    navIndicator.style.transform = "translateX(" + (linkRect.left - navRect.left) + "px)";
    navIndicator.style.opacity = "1";
  };
  if (navLinks.length && "IntersectionObserver" in window) {
    var navSections = navLinks
      .map(function (a) { return document.querySelector(a.getAttribute("href")); })
      .filter(Boolean);
    var currentActive = null;
    var navObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var href = "#" + entry.target.id;
          navLinks.forEach(function (a) {
            var isActive = a.getAttribute("href") === href;
            a.classList.toggle("active", isActive);
            if (isActive) currentActive = a;
          });
          moveIndicator(currentActive);
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );
    navSections.forEach(function (s) { navObserver.observe(s); });
    window.addEventListener("resize", function () { moveIndicator(currentActive); }, { passive: true });
  }

  /* ---------- Staggered tag / chip entrance ---------- */
  document.querySelectorAll(".skills-cloud").forEach(function (cloud) {
    Array.prototype.forEach.call(cloud.querySelectorAll(".tag"), function (tag, i) {
      tag.style.setProperty("--i", i);
    });
  });
  document.querySelectorAll(".chip-row").forEach(function (row) {
    Array.prototype.forEach.call(row.querySelectorAll(".chip"), function (chip, i) {
      chip.style.setProperty("--i", i);
    });
  });

  /* ---------- Hero spotlight (cursor-follow glow) ---------- */
  var hero = document.querySelector(".hero");
  var spotlight = document.getElementById("heroSpotlight");
  if (hero && spotlight && window.matchMedia("(hover: hover)").matches) {
    hero.addEventListener("mousemove", function (e) {
      var rect = hero.getBoundingClientRect();
      var x = ((e.clientX - rect.left) / rect.width * 100).toFixed(1) + "%";
      var y = ((e.clientY - rect.top) / rect.height * 100).toFixed(1) + "%";
      spotlight.style.setProperty("--mx", x);
      spotlight.style.setProperty("--my", y);
    });
  }

  /* ---------- Work card tilt ---------- */
  if (window.matchMedia("(hover: hover)").matches) {
    document.querySelectorAll(".work-card").forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        var rect = card.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.setProperty("--tiltX", (y * -6).toFixed(2) + "deg");
        card.style.setProperty("--tiltY", (x * 6).toFixed(2) + "deg");
      });
      card.addEventListener("mouseleave", function () {
        card.style.setProperty("--tiltX", "0deg");
        card.style.setProperty("--tiltY", "0deg");
      });
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  if (revealEls.length) {
    if ("IntersectionObserver" in window) {
      var observer = new IntersectionObserver(
        function (entries, obs) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("in-view");
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
      );
      revealEls.forEach(function (el, i) {
        el.style.transitionDelay = Math.min(i % 4, 3) * 60 + "ms";
        observer.observe(el);
      });
    } else {
      revealEls.forEach(function (el) { el.classList.add("in-view"); });
    }
  }
})();
