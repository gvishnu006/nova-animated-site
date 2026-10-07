(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Preloader ---------- */
  const loader = document.getElementById("loader");
  const loaderCount = document.getElementById("loaderCount");
  document.body.classList.add("is-loading");

  function finishLoading() {
    loader.classList.add("is-done");
    document.body.classList.remove("is-loading");
    document.querySelectorAll("[data-split]").forEach((el) => {
      if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add("is-inview");
    });
  }

  if (reduceMotion) {
    if (loaderCount) loaderCount.textContent = "100";
    finishLoading();
  } else {
    let n = 0;
    const timer = setInterval(() => {
      n += Math.floor(Math.random() * 12) + 4;
      if (n >= 100) {
        n = 100;
        clearInterval(timer);
        setTimeout(finishLoading, 350);
      }
      if (loaderCount) loaderCount.textContent = n;
    }, 70);
  }

  /* ---------- Custom cursor ---------- */
  const cursor = document.getElementById("cursor");
  const dot = document.getElementById("cursorDot");

  if (cursor && dot && window.matchMedia("(hover: hover)").matches) {
    let cx = 0,
      cy = 0,
      tx = 0,
      ty = 0;

    window.addEventListener("mousemove", (e) => {
      tx = e.clientX;
      ty = e.clientY;
      dot.style.transform = `translate(${tx}px, ${ty}px) translate(-50%, -50%)`;
    });

    (function loop() {
      cx += (tx - cx) * 0.16;
      cy += (ty - cy) * 0.16;
      cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
      requestAnimationFrame(loop);
    })();

    document.querySelectorAll("a, button, .card, [data-magnetic]").forEach((el) => {
      el.addEventListener("mouseenter", () => cursor.classList.add("is-hover"));
      el.addEventListener("mouseleave", () => cursor.classList.remove("is-hover"));
    });
  }

  /* ---------- Magnetic elements ---------- */
  if (!reduceMotion) {
    document.querySelectorAll("[data-magnetic]").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = `translate(${x * 0.32}px, ${y * 0.32}px)`;
      });
      el.addEventListener("mouseleave", () => {
        el.style.transform = "translate(0, 0)";
      });
    });
  }

  /* ---------- Split text into chars ---------- */
  document.querySelectorAll("[data-split]").forEach((el) => {
    const words = el.textContent.trim().split(/\s+/);
    el.textContent = "";
    let i = 0;
    words.forEach((word, wi) => {
      const span = document.createElement("span");
      span.className = "word";
      [...word].forEach((ch) => {
        const c = document.createElement("span");
        c.className = "char";
        c.textContent = ch;
        c.style.transitionDelay = `${i * 0.032}s`;
        span.appendChild(c);
        i++;
      });
      el.appendChild(span);
      if (wi < words.length - 1) el.appendChild(document.createTextNode(" "));
    });
  });

  /* ---------- Scroll reveal + split headings ---------- */
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(
            entry.target.hasAttribute("data-split") ? "is-inview" : "is-visible"
          );
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18, rootMargin: "0px 0px -60px" }
  );

  document.querySelectorAll(".reveal, [data-split]").forEach((el) => observer.observe(el));

  /* ---------- Animated counters ---------- */
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        counterObserver.unobserve(el);

        if (reduceMotion) {
          el.textContent = target;
          return;
        }

        const start = performance.now();
        const dur = 1600;
        (function tick(now) {
          const p = Math.min((now - start) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * eased);
          if (p < 1) requestAnimationFrame(tick);
        })(start);
      });
    },
    { threshold: 0.5 }
  );

  document.querySelectorAll("[data-count]").forEach((el) => counterObserver.observe(el));

  /* ---------- Nav scroll state ---------- */
  const nav = document.getElementById("nav");
  const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 40);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- 3D tilt on cards ---------- */
  if (!reduceMotion && window.matchMedia("(hover: hover)").matches) {
    document.querySelectorAll("[data-tilt]").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(900px) rotateY(${px * 12}deg) rotateX(${
          -py * 12
        }deg) translateY(-6px)`;
      });
      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
      });
    });
  }

  /* ---------- Hero parallax on scroll ---------- */
  if (!reduceMotion) {
    const hero = document.querySelector(".hero");
    window.addEventListener(
      "scroll",
      () => {
        const y = window.scrollY;
        if (y < window.innerHeight && hero) {
          hero.style.transform = `translateY(${y * 0.14}px)`;
          hero.style.opacity = String(Math.max(0, 1 - y / (window.innerHeight * 0.85)));
        }
      },
      { passive: true }
    );
  }

  /* ---------- Smooth anchor scrolling ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const target = document.querySelector(a.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
    });
  });
})();

  /* ---------- Scroll progress bar ---------- */
  const progress = document.getElementById("progress");
  if (progress) {
    window.addEventListener(
      "scroll",
      () => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        progress.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + "%";
      },
      { passive: true }
    );
  }
