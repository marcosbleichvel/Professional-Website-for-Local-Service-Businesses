// script.js — versão integrada e robusta
document.addEventListener("DOMContentLoaded", () => {
  const $ = (sel, scope = document) => scope.querySelector(sel);
  const $$ = (sel, scope = document) => Array.from(scope.querySelectorAll(sel));

  // --- Header scroll ---
  const header = $(".site-header");
  const onScroll = () => {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 8);
  };
  window.addEventListener("scroll", onScroll);
  onScroll();

  // --- Mobile menu ---
  const menuBtn = $(".menu-toggle");
  const nav = $("#site-nav");
  if (menuBtn && nav) {
    menuBtn.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", String(open));
    });
    $$("a", nav).forEach(a => a.addEventListener("click", () => {
      nav.classList.remove("open");
      menuBtn.setAttribute("aria-expanded", "false");
    }));
  }

  // --- Lightbox (portfolio) ---
  const lightbox = $("#lightbox");
  const lightboxFigure = $(".lightbox-figure");
  const lightboxCaption = $(".lightbox-caption");
  const lightboxClose = $(".lightbox-close");

  $$(".work-item").forEach(item => {
    item.addEventListener("click", () => {
      if (!lightbox || !lightboxFigure || !lightboxCaption) return;

      // Prioriza background-image, senão procura <img> dentro do figure
      const bg = getComputedStyle(item).backgroundImage;
      if (bg && bg !== "none") {
        lightboxFigure.style.backgroundImage = bg;
      } else {
        const img = item.querySelector("img");
        if (img && img.src) lightboxFigure.style.backgroundImage = `url("${img.src}")`;
      }

      lightboxCaption.textContent = item.dataset.title || "";
      lightbox.classList.add("open");
      lightbox.setAttribute("aria-hidden", "false");
    });
  });

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    if (lightboxFigure) lightboxFigure.style.backgroundImage = "";
  }

  if (lightbox && lightboxClose) {
    lightboxClose.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });
  }

  // --- Slider de depoimentos ---
  const slidesContainer = $(".slides");
  const slides = slidesContainer ? Array.from(slidesContainer.querySelectorAll(".slide")) : [];
  let currentIndex = 0;
  const prevBtn = $(".slider-btn.prev");
  const nextBtn = $(".slider-btn.next");

  function showSlide(index) {
    if (!slidesContainer || slides.length === 0) return;
    const total = slides.length;
    currentIndex = (index + total) % total;
    const slideWidth = slidesContainer.clientWidth || slidesContainer.offsetWidth || 0;
    slidesContainer.scrollTo({ left: slideWidth * currentIndex, behavior: "smooth" });
  }

  if (prevBtn) prevBtn.addEventListener("click", () => showSlide(currentIndex - 1));
  if (nextBtn) nextBtn.addEventListener("click", () => showSlide(currentIndex + 1));

  // auto-slide apenas se houver >1 slide
  if (slides.length > 1 && slidesContainer) {
    let sliderInterval = setInterval(() => showSlide(currentIndex + 1), 5000);
    // pausa ao passar o mouse
    slidesContainer.addEventListener("mouseenter", () => clearInterval(sliderInterval));
    slidesContainer.addEventListener("mouseleave", () => { sliderInterval = setInterval(() => showSlide(currentIndex + 1), 5000); });
    // reajusta ao redimensionar
    window.addEventListener("resize", () => showSlide(currentIndex));
  }

  // --- Toast e formulário ---
  const toast = $("#toast");
  function showToast(msg) {
    if (!msg) return;
    if (!toast) { alert(msg); return; }
    toast.textContent = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 3000);
  }

  function setError(el, msg) {
    const label = el && el.closest ? el.closest("label") : null;
    const err = label ? label.querySelector(".error") : null;
    if (err) err.textContent = msg || "";
  }

  const form = $("#contact-form");
  function isEmail(v) { return /.+@.+\..+/.test(v); }

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const name = String(fd.get("name") || "").trim();
      const email = String(fd.get("email") || "").trim();
      const message = String(fd.get("message") || "").trim();
      let invalid = false;

      if (!name) { setError($("input[name='name']", form), "Please enter your name"); invalid = true; } else setError($("input[name='name']", form), "");
      if (!email || !isEmail(email)) { setError($("input[name='email']", form), "Please enter a valid email"); invalid = true; } else setError($("input[name='email']", form), "");
      if (!message) { setError($("textarea[name='message']", form), "Tell us about your project"); invalid = true; } else setError($("textarea[name='message']", form), "");

      if (invalid) return;
      showToast("Thank you! We will contact you soon.");
      form.reset();
    });
  }

  // --- FAQ interativo (só 1 aberto por vez) ---
  const faqButtons = $$(".faq-q");
  if (faqButtons.length) {
    faqButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        const answer = btn.nextElementSibling;
        if (!answer) return;
        const wasHidden = answer.hasAttribute("hidden");

        // fecha todas
        $$(".faq-a").forEach(a => a.setAttribute("hidden", ""));
        $$(".faq-q").forEach(b => b.setAttribute("aria-expanded", "false"));

        if (wasHidden) {
          answer.removeAttribute("hidden");
          btn.setAttribute("aria-expanded", "true");
          showToast(answer.textContent.trim());
        }
      });
    });
  }

  // --- Ano no rodapé ---
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  console.log("site: js iniciado");
});
