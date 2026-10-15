/* =========================================================
   Dr Madri Art — Interactions
   ========================================================= */
(() => {
  "use strict";
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Preloader ---------- */
  window.addEventListener("load", () => {
    setTimeout(() => $(".preloader")?.classList.add("done"), 350);
    $(".page-fade")?.classList.remove("active");
  });

  /* ---------- Header, progress bar, back-to-top ---------- */
  const header = $(".header");
  const progress = $(".progress");
  const toTop = $(".to-top");
  const onScroll = () => {
    const y = window.scrollY;
    header?.classList.toggle("scrolled", y > 40);
    toTop?.classList.toggle("show", y > 700);
    if (progress) {
      const h = document.documentElement.scrollHeight - innerHeight;
      progress.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
    }
    $$("[data-parallax]").forEach((el) => {
      if (reduceMotion) return;
      const speed = parseFloat(el.dataset.parallax) || 0.1;
      el.style.transform = `translateY(${y * speed}px)`;
    });
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  toTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  /* ---------- Mobile menu ---------- */
  const toggle = $(".menu-toggle");
  const links = $(".nav-links");
  const closeMenu = () => { toggle?.classList.remove("open"); links?.classList.remove("open"); document.body.style.overflow = ""; };
  toggle?.addEventListener("click", () => {
    const open = toggle.classList.toggle("open");
    links.classList.toggle("open", open);
    document.body.style.overflow = open ? "hidden" : "";
    toggle.setAttribute("aria-expanded", open);
  });
  $$(".nav-links a").forEach((a) => a.addEventListener("click", closeMenu));

  /* ---------- Page transitions ---------- */
  const fade = $(".page-fade");
  $$("a[href]").forEach((a) => {
    const href = a.getAttribute("href");
    const internal = href && !href.startsWith("#") && !href.startsWith("http") && !href.startsWith("mailto:") && !href.startsWith("tel:") && !a.target;
    if (!internal || !fade) return;
    a.addEventListener("click", (e) => {
      if (e.metaKey || e.ctrlKey) return;
      e.preventDefault();
      fade.classList.add("active");
      setTimeout(() => (window.location.href = href), 420);
    });
  });
  window.addEventListener("pageshow", (e) => { if (e.persisted) fade?.classList.remove("active"); });

  /* ---------- Scroll reveal ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
  }, { threshold: 0.12, rootMargin: "0px 0px -50px 0px" });
  $$(".reveal").forEach((el) => io.observe(el));

  /* ---------- Counters ---------- */
  const counterIO = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const el = en.target; const end = +el.dataset.count; const suffix = el.dataset.suffix || "";
      const dur = 1800; const t0 = performance.now();
      const tick = (t) => {
        const p = Math.min((t - t0) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 4);
        el.textContent = Math.floor(end * eased).toLocaleString() + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      counterIO.unobserve(el);
    });
  }, { threshold: 0.6 });
  $$("[data-count]").forEach((el) => counterIO.observe(el));

  /* ---------- Custom cursor ---------- */
  if (matchMedia("(hover: hover) and (pointer: fine)").matches && !reduceMotion) {
    const dot = $(".cursor-dot"), ring = $(".cursor-ring");
    if (dot && ring) {
      document.body.classList.add("has-cursor");
      let mx = 0, my = 0, rx = 0, ry = 0;
      window.addEventListener("mousemove", (e) => { mx = e.clientX; my = e.clientY; dot.style.transform = `translate(${mx}px,${my}px)`; });
      (function loop() { rx += (mx - rx) * 0.16; ry += (my - ry) * 0.16; ring.style.transform = `translate(${rx}px,${ry}px)`; requestAnimationFrame(loop); })();
      $$("a, button, .card, input, select, textarea, .faq-q").forEach((el) => {
        el.addEventListener("mouseenter", () => ring.classList.add("hover"));
        el.addEventListener("mouseleave", () => ring.classList.remove("hover"));
      });
    }

    /* Magnetic buttons */
    $$(".btn").forEach((b) => {
      b.addEventListener("mousemove", (e) => {
        const r = b.getBoundingClientRect();
        b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.22}px, ${(e.clientY - r.top - r.height / 2) * 0.32}px)`;
      });
      b.addEventListener("mouseleave", () => (b.style.transform = ""));
    });

    /* 3D tilt on cards */
    $$(".card, .arch").forEach((c) => {
      c.addEventListener("mousemove", (e) => {
        const r = c.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        c.style.transform = `perspective(900px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-8px)`;
      });
      c.addEventListener("mouseleave", () => (c.style.transform = ""));
    });

    /* Hero orbs follow mouse subtly */
    const hero = $(".hero");
    hero?.addEventListener("mousemove", (e) => {
      const x = (e.clientX / innerWidth - 0.5) * 2, y = (e.clientY / innerHeight - 0.5) * 2;
      $$(".hero .orb, .hero .stroke").forEach((o, i) => (o.style.translate = `${x * (14 + i * 8)}px ${y * (14 + i * 8)}px`));
    });
  }

  /* ---------- FAQ accordion ---------- */
  $$(".faq-item").forEach((item) => {
    const q = $(".faq-q", item), a = $(".faq-a", item);
    q.addEventListener("click", () => {
      const open = item.classList.contains("open");
      $$(".faq-item.open").forEach((o) => { o.classList.remove("open"); $(".faq-a", o).style.maxHeight = null; });
      if (!open) { item.classList.add("open"); a.style.maxHeight = a.scrollHeight + "px"; }
    });
  });

  /* ---------- Testimonial slider ---------- */
  const slides = $$(".testi-slide");
  if (slides.length) {
    const dotsWrap = $(".dots");
    let idx = 0, timer;
    slides.forEach((_, i) => {
      const b = document.createElement("button"); b.setAttribute("aria-label", "Show testimonial " + (i + 1));
      b.addEventListener("click", () => { go(i); restart(); }); dotsWrap.appendChild(b);
    });
    const go = (i) => {
      idx = (i + slides.length) % slides.length;
      slides.forEach((s, n) => s.classList.toggle("active", n === idx));
      $$(".dots button").forEach((d, n) => d.classList.toggle("active", n === idx));
    };
    const restart = () => { clearInterval(timer); timer = setInterval(() => go(idx + 1), 6500); };
    go(0); restart();
  }

  /* ---------- Booking form ---------- */
  const form = $("#booking-form");
  if (form) {
    // Pre-select service from URL, e.g. contact.html?service=Online%20Sessions
    const svc = new URLSearchParams(location.search).get("service");
    if (svc) { const sel = $("#service"); [...sel.options].forEach((o) => { if (o.value === svc) sel.value = svc; }); }

    // Minimum date = tomorrow
    const dateInput = $("#date");
    if (dateInput) { const t = new Date(); t.setDate(t.getDate() + 1); dateInput.min = t.toISOString().split("T")[0]; }

    const status = $(".form-status");
    const validators = {
      name: (v) => v.trim().length >= 2,
      email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
      phone: (v) => v === "" || /^[+\d\s()-]{7,}$/.test(v),
      service: (v) => v !== "",
      message: (v) => v.trim().length >= 10,
      consent: (_, el) => el.checked,
    };
    const check = (el) => {
      const rule = validators[el.name]; if (!rule) return true;
      const ok = rule(el.type === "checkbox" ? el.checked : el.value, el);
      el.closest(".field, .consent")?.classList.toggle("invalid", !ok);
      return ok;
    };
    $$("input, select, textarea", form).forEach((el) => {
      el.addEventListener("blur", () => check(el));
      el.addEventListener("input", () => el.closest(".invalid") && check(el));
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if ($(".hp input", form)?.value) return; // honeypot
      const valid = $$("input, select, textarea", form).map(check).every(Boolean);
      if (!valid) { status.className = "form-status fail"; status.textContent = "Please complete the highlighted fields."; $(".invalid", form)?.scrollIntoView({ behavior: "smooth", block: "center" }); return; }

      const btn = $("button[type=submit]", form); const label = btn.innerHTML;
      btn.disabled = true; btn.innerHTML = "Sending…";
      const endpoint = form.dataset.endpoint;
      try {
        if (!endpoint || endpoint.includes("YOUR_")) throw new Error("not-configured");
        const res = await fetch(endpoint, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } });
        if (!res.ok) throw new Error("failed");
        status.className = "form-status ok";
        status.textContent = "Thank you — your request has been received. You'll hear back within 1–2 working days.";
        form.reset(); $$(".invalid", form).forEach((i) => i.classList.remove("invalid"));
      } catch (err) {
        status.className = "form-status fail";
        status.textContent = err.message === "not-configured"
          ? "Form endpoint not set up yet (see README). Please email directly in the meantime."
          : "Something went wrong sending your request. Please try again or email directly.";
      } finally { btn.disabled = false; btn.innerHTML = label; }
    });
  }

  /* ---------- Year ---------- */
  $$(".year").forEach((y) => (y.textContent = new Date().getFullYear()));
})();
