(function () {
  "use strict";

  var toggle = document.getElementById("navToggle");
  var nav = document.getElementById("site-nav");
  var scrim = document.getElementById("navScrim");

  function closeNav() {
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    scrim.hidden = true;
  }

  function openNav() {
    nav.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
    scrim.hidden = false;
  }

  toggle.addEventListener("click", function () {
    var isOpen = toggle.getAttribute("aria-expanded") === "true";
    if (isOpen) {
      closeNav();
    } else {
      openNav();
    }
  });

  scrim.addEventListener("click", closeNav);

  nav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", closeNav);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeNav();
    }
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth >= 900) {
      closeNav();
    }
  });

  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  var header = document.querySelector(".site-header");
  var heroEl = document.querySelector(".hero");
  function updateHeaderState() {
    var threshold = heroEl ? Math.max(heroEl.offsetHeight - 140, 80) : 80;
    header.classList.toggle("is-scrolled", window.scrollY > threshold);
  }
  window.addEventListener("scroll", updateHeaderState, { passive: true });
  window.addEventListener("resize", updateHeaderState);
  updateHeaderState();

  var backToTop = document.querySelector(".back-to-top");
  if (backToTop) {
    function updateBackToTop() {
      backToTop.classList.toggle("is-hidden", window.scrollY < 500);
    }
    window.addEventListener("scroll", updateBackToTop, { passive: true });
    updateBackToTop();
  }

  function animateCount(el) {
    var raw = el.textContent;
    var match = raw.match(/[0-9]+/);
    if (!match) return;
    var target = parseInt(match[0], 10);
    var prefix = raw.slice(0, match.index);
    var suffix = raw.slice(match.index + match[0].length);
    var start = null;
    var duration = 900;

    function step(timestamp) {
      if (start === null) start = timestamp;
      var progress = Math.min((timestamp - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var value = Math.round(eased * target);
      el.textContent = prefix + value + suffix;
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        el.textContent = raw;
      }
    }
    window.requestAnimationFrame(step);
  }

  var revealEls = document.querySelectorAll("[data-reveal]");

  if (revealEls.length && document.documentElement.classList.contains("has-js")) {
    revealEls.forEach(function (el) {
      var delay = el.getAttribute("data-delay");
      if (delay) {
        el.style.setProperty("--delay", delay + "ms");
      }
    });

    var observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            if (entry.target.hasAttribute("data-count")) {
              animateCount(entry.target);
            }
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -8% 0px" }
    );

    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  }

  var parallaxEls = Array.prototype.slice.call(document.querySelectorAll("[data-parallax]"));
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (parallaxEls.length && !reduceMotion) {
    var parallaxTicking = false;

    function updateParallax() {
      var vh = window.innerHeight;
      parallaxEls.forEach(function (el) {
        var rect = el.getBoundingClientRect();
        var center = rect.top + rect.height / 2;
        var progress = (vh / 2 - center) / vh;
        var speed = parseFloat(el.getAttribute("data-parallax")) || 0;
        var rotate = parseFloat(el.getAttribute("data-parallax-rotate")) || 0;
        el.style.transform = "translateY(" + (progress * speed).toFixed(1) + "px) rotate(" + (progress * rotate).toFixed(1) + "deg)";
      });
      parallaxTicking = false;
    }

    window.addEventListener(
      "scroll",
      function () {
        if (!parallaxTicking) {
          window.requestAnimationFrame(updateParallax);
          parallaxTicking = true;
        }
      },
      { passive: true }
    );
    window.addEventListener("resize", updateParallax);
    updateParallax();
  }
})();
