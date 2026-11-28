// ROLE ANIMATION
document.addEventListener("DOMContentLoaded", function () {
  const target = document.getElementById("heroRoleTypewriter");
  if (!target) return;

  const roles = [
    "Web Developer",
    "Backend Developer",
    "Fullstack Developer",
    "Staf IT",
    "Mobile Developer",
  ];

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  if (prefersReducedMotion) {
    target.textContent = roles[0];
    return;
  }

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  const typeSpeed = 85;
  const deleteSpeed = 45;
  const holdAfterType = 1600;
  const holdAfterDelete = 320;

  function tick() {
    const currentRole = roles[roleIndex];

    if (!isDeleting) {
      charIndex++;
      target.textContent = currentRole.slice(0, charIndex);

      if (charIndex === currentRole.length) {
        isDeleting = true;
        setTimeout(tick, holdAfterType);
        return;
      }
      setTimeout(tick, typeSpeed);
    } else {
      charIndex--;
      target.textContent = currentRole.slice(0, charIndex);

      if (charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        setTimeout(tick, holdAfterDelete);
        return;
      }
      setTimeout(tick, deleteSpeed);
    }
  }

  tick();
});

// THEME
const htmlEl = document.documentElement;
const themeToggleBtn = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");
const themeLabel = document.getElementById("themeLabel");

function applyTheme(theme) {
  htmlEl.setAttribute("data-theme", theme);
  localStorage.setItem("portfolio-theme", theme);

  if (theme === "dark") {
    if (themeIcon) themeIcon.className = "bi bi-sun-fill text-warning";
    if (themeLabel) themeLabel.textContent = "Light";
  } else {
    if (themeIcon) themeIcon.className = "bi bi-moon-stars-fill";
    if (themeLabel) themeLabel.textContent = "Dark";
  }
}

const savedTheme = localStorage.getItem("portfolio-theme") || "light";
applyTheme(savedTheme);

if (themeToggleBtn) {
  themeToggleBtn.addEventListener("click", () => {
    const currentTheme = htmlEl.getAttribute("data-theme");
    const nextTheme = currentTheme === "light" ? "dark" : "light";
    applyTheme(nextTheme);
  });
}

// MODALS
let certResetZoomFn = null;
let reopenOrgGalleryOnZoomClose = false;

function openZoomModal(imgSrc, title) {
  const certImg = document.getElementById("certZoomModalImg");
  const certTitle = document.getElementById("certZoomModalTitle");
  const certModalEl = document.getElementById("certZoomModal");

  const legacyImg = document.getElementById("zoomModalImage");
  const legacyTitle = document.getElementById("zoomModalTitle");
  const legacyModalEl = document.getElementById("zoomModal");

  if (certImg && certModalEl) {
    certImg.src = imgSrc;
    certImg.alt = title || "Preview Sertifikat";
    if (certTitle) certTitle.textContent = title || "Preview Sertifikat";
    if (typeof certResetZoomFn === "function") certResetZoomFn();
    if (window.bootstrap && bootstrap.Modal) {
      bootstrap.Modal.getOrCreateInstance(certModalEl).show();
    }
    return;
  }

  if (legacyImg && legacyModalEl) {
    legacyImg.src = imgSrc;
    legacyImg.alt = title || "Preview";
    if (legacyTitle) legacyTitle.textContent = title || "Preview";
    if (window.bootstrap && bootstrap.Modal) {
      bootstrap.Modal.getOrCreateInstance(legacyModalEl).show();
    }
  }
}

function openInfoModal(title, description, meta) {
  const titleEl = document.getElementById("infoModalTitle");
  const descEl = document.getElementById("infoModalDesc");
  const metaEl = document.getElementById("infoModalMeta");
  const modalEl = document.getElementById("infoModal");

  if (titleEl) titleEl.textContent = title;
  if (descEl) descEl.textContent = description;
  if (metaEl) metaEl.textContent = meta;

  if (modalEl && window.bootstrap && bootstrap.Modal) {
    bootstrap.Modal.getOrCreateInstance(modalEl).show();
  }
}

// NAVBAR
const navLinks = document.querySelectorAll('.navbar .nav-link[href^="#"]');
const sections = Array.from(navLinks)
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

function setActiveNavLink() {
  const scrollPosition = window.scrollY + 140;
  let currentSectionId = "";

  for (const section of sections) {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    if (scrollPosition >= top && scrollPosition < top + height) {
      currentSectionId = section.getAttribute("id");
      break;
    }
  }

  if (
    window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 20 &&
    sections.length > 0
  ) {
    currentSectionId = sections[sections.length - 1].getAttribute("id");
  }

  navLinks.forEach((link) => {
    const targetId = link.getAttribute("href").slice(1);
    link.classList.toggle("active", targetId === currentSectionId);
  });
}

window.addEventListener("scroll", setActiveNavLink, { passive: true });
window.addEventListener("load", setActiveNavLink);
setActiveNavLink();

(() => {
  const scrollTopBtn = document.querySelector(".scroll-top-btn");
  const identitySection = document.querySelector("#hero");

  if (!scrollTopBtn) return;

  const toggleScrollBtn = () => {
    const threshold = identitySection
      ? identitySection.offsetTop + identitySection.offsetHeight - 80
      : 300;

    if (window.scrollY > threshold) {
      scrollTopBtn.classList.add("is-visible");
    } else {
      scrollTopBtn.classList.remove("is-visible");
    }
  };

  window.addEventListener("scroll", toggleScrollBtn, { passive: true });
  window.addEventListener("resize", toggleScrollBtn, { passive: true });
  toggleScrollBtn();
})();

// ABOUT
(() => {
  const aboutSection = document.getElementById("about");
  if (!aboutSection) return;

  aboutSection.querySelectorAll("[data-target-section]").forEach((el) => {
    el.addEventListener("click", () => {
      const selector = el.getAttribute("data-target-section");
      const target = selector ? document.querySelector(selector) : null;
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
})();

// PROJECTS
(function initProjectsCoverflow() {
  const track = document.getElementById("projectCoverflowTrack");
  const dotsWrap = document.getElementById("coverflowDots");
  const prevBtn = document.getElementById("coverflowPrevBtn");
  const nextBtn = document.getElementById("coverflowNextBtn");

  if (!track) return;

  const cards = Array.from(track.querySelectorAll(".coverflow-card"));
  const total = cards.length;
  let activeIndex = 0;

  if (dotsWrap) {
    dotsWrap.innerHTML = "";
    cards.forEach((_, idx) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "coverflow-dot-btn";
      btn.setAttribute("aria-label", "Proyek " + (idx + 1));
      btn.addEventListener("click", () => {
        activeIndex = idx;
        renderCoverflow();
      });
      dotsWrap.appendChild(btn);
    });
  }

  function getCircularOffset(idx, current, count) {
    let diff = idx - current;
    const half = count / 2;
    if (diff > half) diff -= count;
    if (diff < -half) diff += count;
    return diff;
  }

  function renderCoverflow() {
    const isMobile = window.innerWidth < 768;
    const stepX = isMobile ? 165 : 255;

    cards.forEach((card, idx) => {
      const offset = getCircularOffset(idx, activeIndex, total);
      const absOffset = Math.abs(offset);

      card.classList.toggle("is-active", offset === 0);

      let translateX = offset * stepX;
      let scale = 1;
      let opacity = 1;
      let zIndex = 10 - absOffset;

      if (offset === 0) {
        scale = 1;
        opacity = 1;
        zIndex = 15;
      } else if (absOffset === 1) {
        scale = 0.85;
        opacity = 0.72;
        zIndex = 10;
      } else {
        scale = 0.72;
        opacity = isMobile ? 0 : 0.42;
        zIndex = 5;
      }

      card.style.transform = `translateX(${translateX}px) scale(${scale})`;
      card.style.opacity = opacity;
      card.style.zIndex = zIndex;
    });

    if (dotsWrap) {
      Array.from(dotsWrap.children).forEach((dot, idx) => {
        dot.classList.toggle("active", idx === activeIndex);
      });
    }
  }

  cards.forEach((card, idx) => {
    card.addEventListener("click", () => {
      if (idx !== activeIndex) {
        activeIndex = idx;
        renderCoverflow();
      }
    });
  });

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      activeIndex = (activeIndex - 1 + total) % total;
      renderCoverflow();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      activeIndex = (activeIndex + 1) % total;
      renderCoverflow();
    });
  }

  window.addEventListener("resize", renderCoverflow);
  renderCoverflow();
})();

function zoomActiveProjectSlide(carouselId, fallbackTitle) {
  const carouselEl = document.getElementById(carouselId);
  if (!carouselEl) return;
  const activeImg = carouselEl.querySelector(".carousel-item.active img");
  if (activeImg) {
    openZoomModal(activeImg.src, activeImg.alt || fallbackTitle);
  }
}

// ORGANIZATION
(function initOrgBigFolder() {
  const orgPhotos = Array.from({ length: 20 }, (_, i) => {
    const num = i + 1;
    return {
      src: `assets/img/org-${num}.jpeg`,
      caption: `Dokumentasi Kegiatan Organisasi #${num}`,
    };
  });

  const modalEl = document.getElementById("orgGalleryModal");
  const stageEl = modalEl ? modalEl.querySelector(".org-viewer-stage") : null;
  const imgEl = document.getElementById("orgGalleryImg");
  const titleEl = document.getElementById("orgGalleryTitle");
  const counterEl = document.getElementById("orgGalleryCounter");
  const captionEl = document.getElementById("orgGalleryCaption");

  const zoomSteps = [1, 1.5, 2, 2.5, 3];
  let currentIdx = 0;
  let stepIndex = 0;
  let currentScale = 1;
  let posX = 0;
  let posY = 0;

  let isDragging = false;
  let didDrag = false;
  let pointerDownX = 0;
  let pointerDownY = 0;
  let dragStartX = 0;
  let dragStartY = 0;

  function clampPosition(nextX, nextY, scale) {
    if (scale <= 1 || !stageEl || !imgEl) return { x: 0, y: 0 };

    const stageRect = stageEl.getBoundingClientRect();
    const baseWidth = imgEl.clientWidth || stageRect.width;
    const baseHeight = imgEl.clientHeight || stageRect.height;

    const maxOffsetX = Math.max(0, (baseWidth * scale - stageRect.width) / 2);
    const maxOffsetY = Math.max(0, (baseHeight * scale - stageRect.height) / 2);

    return {
      x: Math.min(maxOffsetX, Math.max(-maxOffsetX, nextX)),
      y: Math.min(maxOffsetY, Math.max(-maxOffsetY, nextY)),
    };
  }

  function applyOrgTransform(scale) {
    currentScale = scale;
    if (!imgEl) return;

    if (scale <= 1) {
      currentScale = 1;
      posX = 0;
      posY = 0;
      if (stageEl) stageEl.classList.remove("is-zoomed", "is-dragging");
    } else {
      const clamped = clampPosition(posX, posY, scale);
      posX = clamped.x;
      posY = clamped.y;
      if (stageEl) stageEl.classList.add("is-zoomed");
    }

    imgEl.style.transform = `translate(${posX}px, ${posY}px) scale(${currentScale})`;
    imgEl.dataset.zoomed = currentScale > 1 ? "true" : "false";
  }

  function resetOrgZoom() {
    stepIndex = 0;
    currentScale = 1;
    posX = 0;
    posY = 0;
    isDragging = false;
    didDrag = false;
    if (stageEl) stageEl.classList.remove("is-zoomed", "is-dragging");
    if (imgEl) {
      imgEl.style.transform = "translate(0px, 0px) scale(1)";
      imgEl.dataset.zoomed = "false";
    }
  }

  function renderPhoto() {
    const item = orgPhotos[currentIdx];
    if (!item) return;

    resetOrgZoom();

    if (titleEl) titleEl.textContent = "Dokumentasi Organisasi";
    if (counterEl) {
      counterEl.textContent = `Foto ${currentIdx + 1} dari ${orgPhotos.length}`;
    }
    if (imgEl) {
      imgEl.src = item.src;
      imgEl.alt = item.caption;
    }
    if (captionEl) captionEl.textContent = item.caption;
  }

  window.openOrgFolder = function () {
    currentIdx = 0;
    renderPhoto();

    if (modalEl && window.bootstrap) {
      bootstrap.Modal.getOrCreateInstance(modalEl).show();
    }
  };

  window.stepOrgPhoto = function (delta) {
    const len = orgPhotos.length;
    currentIdx = (currentIdx + delta + len) % len;
    renderPhoto();
  };

  window.zoomCurrentOrgPhoto = function () {
    if (didDrag) {
      didDrag = false;
      return;
    }
    stepIndex = (stepIndex + 1) % zoomSteps.length;
    const nextScale = zoomSteps[stepIndex];
    if (nextScale === 1) {
      posX = 0;
      posY = 0;
    }
    applyOrgTransform(nextScale);
  };

  if (stageEl) {
    stageEl.addEventListener("pointerdown", function (e) {
      if (e.button !== 0 && e.pointerType === "mouse") return;
      didDrag = false;
      pointerDownX = e.clientX;
      pointerDownY = e.clientY;

      if (currentScale > 1) {
        isDragging = true;
        dragStartX = e.clientX - posX;
        dragStartY = e.clientY - posY;
        stageEl.classList.add("is-dragging");
        stageEl.setPointerCapture(e.pointerId);
      }
    });

    stageEl.addEventListener("pointermove", function (e) {
      if (Math.hypot(e.clientX - pointerDownX, e.clientY - pointerDownY) > 5) {
        didDrag = true;
      }
      if (!isDragging || currentScale <= 1) return;

      const clamped = clampPosition(
        e.clientX - dragStartX,
        e.clientY - dragStartY,
        currentScale,
      );
      posX = clamped.x;
      posY = clamped.y;
      applyOrgTransform(currentScale);
    });

    function stopOrgDrag(e) {
      if (!isDragging) return;
      isDragging = false;
      stageEl.classList.remove("is-dragging");
      if (
        e &&
        stageEl.hasPointerCapture &&
        stageEl.hasPointerCapture(e.pointerId)
      ) {
        stageEl.releasePointerCapture(e.pointerId);
      }
    }

    stageEl.addEventListener("pointerup", stopOrgDrag);
    stageEl.addEventListener("pointercancel", stopOrgDrag);
  }

  if (modalEl) {
    modalEl.addEventListener("hidden.bs.modal", resetOrgZoom);
  }
})();

// CERTIFICATES
(function initCertCarouselIndicators() {
  const carouselEl = document.getElementById("certCarousel");
  const indicatorsEl = document.getElementById("certCarouselIndicators");
  if (!carouselEl || !indicatorsEl) return;

  const allItems = Array.from(carouselEl.querySelectorAll(".carousel-item"));
  const prevBtn = carouselEl.querySelector(".carousel-control-prev");
  const nextBtn = carouselEl.querySelector(".carousel-control-next");

  function isDesktopViewport() {
    return window.matchMedia("(min-width: 992px)").matches;
  }

  function getGroupItems() {
    const group = isDesktopViewport() ? "desktop" : "mobile";
    const matched = allItems.filter((el) => el.dataset.certGroup === group);
    return matched.length ? matched : allItems;
  }

  function getCarouselInstance() {
    if (!window.bootstrap || !bootstrap.Carousel) return null;
    return bootstrap.Carousel.getOrCreateInstance(carouselEl, {
      ride: false,
      interval: false,
    });
  }

  function updateActiveIndicator(activeLocalIdx) {
    const buttons = indicatorsEl.querySelectorAll("button");
    buttons.forEach((btn, idx) => {
      const isCurrent = idx === activeLocalIdx;
      btn.classList.toggle("active", isCurrent);
      if (isCurrent) {
        btn.setAttribute("aria-current", "true");
      } else {
        btn.removeAttribute("aria-current");
      }
    });
  }

  function setSlideImmediate(targetItem) {
    const instance = getCarouselInstance();
    if (instance && typeof instance.pause === "function") {
      instance.pause();
    }

    allItems.forEach((el) => {
      el.classList.remove(
        "active",
        "carousel-item-next",
        "carousel-item-prev",
        "carousel-item-start",
        "carousel-item-end",
      );
    });

    if (targetItem) {
      targetItem.classList.add("active");
    }
  }

  function goToGroupIndex(targetLocalIdx, immediate = false) {
    const groupItems = getGroupItems();
    if (!groupItems.length) return;

    const total = groupItems.length;
    const wrappedIdx = ((targetLocalIdx % total) + total) % total;
    const targetItem = groupItems[wrappedIdx];
    const globalIdx = allItems.indexOf(targetItem);
    if (globalIdx < 0) return;

    if (immediate) {
      setSlideImmediate(targetItem);
      updateActiveIndicator(wrappedIdx);
      return;
    }

    const instance = getCarouselInstance();
    if (instance) {
      instance.to(globalIdx);
    } else {
      setSlideImmediate(targetItem);
      updateActiveIndicator(wrappedIdx);
    }
  }

  function rebuildIndicators(forceFirst = false) {
    const groupItems = getGroupItems();
    let activeEl = carouselEl.querySelector(".carousel-item.active");

    if (forceFirst || !activeEl || !groupItems.includes(activeEl)) {
      goToGroupIndex(0, true);
      activeEl = groupItems[0];
    }

    const activeLocalIdx = Math.max(0, groupItems.indexOf(activeEl));
    indicatorsEl.innerHTML = "";

    groupItems.forEach((_, localIdx) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.setAttribute("aria-label", `Halaman sertifikat ${localIdx + 1}`);

      if (localIdx === activeLocalIdx) {
        btn.classList.add("active");
        btn.setAttribute("aria-current", "true");
      }

      btn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        goToGroupIndex(localIdx, false);
      });

      indicatorsEl.appendChild(btn);
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      const groupItems = getGroupItems();
      const activeEl = carouselEl.querySelector(".carousel-item.active");
      const currentIdx = Math.max(0, groupItems.indexOf(activeEl));
      goToGroupIndex(currentIdx - 1, false);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      const groupItems = getGroupItems();
      const activeEl = carouselEl.querySelector(".carousel-item.active");
      const currentIdx = Math.max(0, groupItems.indexOf(activeEl));
      goToGroupIndex(currentIdx + 1, false);
    });
  }

  carouselEl.addEventListener("slid.bs.carousel", function () {
    const groupItems = getGroupItems();
    const activeEl = carouselEl.querySelector(".carousel-item.active");
    const activeLocalIdx = groupItems.indexOf(activeEl);

    if (activeLocalIdx === -1) {
      goToGroupIndex(0, true);
      return;
    }

    updateActiveIndicator(activeLocalIdx);
  });

  let lastIsDesktop = isDesktopViewport();
  rebuildIndicators(true);

  let resizeTimer = null;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      const nowDesktop = isDesktopViewport();
      if (nowDesktop !== lastIsDesktop) {
        lastIsDesktop = nowDesktop;
        rebuildIndicators(true);
      }
    }, 150);
  });
})();

(function initCertContinuousZoom() {
  const modalEl = document.getElementById("certZoomModal");
  const stageEl = document.getElementById("certZoomStage");
  const imgEl = document.getElementById("certZoomModalImg");
  const badgeEl = document.getElementById("certZoomScaleBadge");

  if (!modalEl || !stageEl || !imgEl) return;

  const zoomSteps = [1, 1.5, 2, 2.5, 3];
  let stepIndex = 0;
  let currentScale = 1;
  let posX = 0;
  let posY = 0;

  let isDragging = false;
  let didDrag = false;
  let pointerDownX = 0;
  let pointerDownY = 0;
  let dragStartX = 0;
  let dragStartY = 0;

  function getBaseImageSize() {
    const prevTransform = imgEl.style.transform;
    const prevTransition = imgEl.style.transition;

    imgEl.style.transition = "none";
    imgEl.style.transform = "translate(0px, 0px) scale(1)";
    const rect = imgEl.getBoundingClientRect();

    imgEl.style.transform = prevTransform;
    imgEl.style.transition = prevTransition;

    return {
      width: rect.width || imgEl.clientWidth || 1,
      height: rect.height || imgEl.clientHeight || 1,
    };
  }

  function clampPosition(nextX, nextY, scale) {
    if (scale <= 1) return { x: 0, y: 0 };

    const stageRect = stageEl.getBoundingClientRect();
    const baseSize = getBaseImageSize();

    const scaledWidth = baseSize.width * scale;
    const scaledHeight = baseSize.height * scale;

    const maxOffsetX = Math.max(0, (scaledWidth - stageRect.width) / 2);
    const maxOffsetY = Math.max(0, (scaledHeight - stageRect.height) / 2);

    return {
      x: Math.min(maxOffsetX, Math.max(-maxOffsetX, nextX)),
      y: Math.min(maxOffsetY, Math.max(-maxOffsetY, nextY)),
    };
  }

  function updateBadge(scale) {
    if (!badgeEl) return;
    if (scale <= 1) {
      badgeEl.textContent = "100% — Klik untuk zoom bertahap (150% → 300%)";
    } else {
      badgeEl.textContent = `${Math.round(scale * 100)}% — Klik lagi untuk zoom lanjut, geser untuk melihat detail`;
    }
  }

  function applyTransform(scale) {
    currentScale = scale;

    if (scale <= 1) {
      currentScale = 1;
      posX = 0;
      posY = 0;
      stageEl.classList.remove("is-zoomed", "is-dragging");
    } else {
      const clamped = clampPosition(posX, posY, scale);
      posX = clamped.x;
      posY = clamped.y;
      stageEl.classList.add("is-zoomed");
    }

    imgEl.style.transform = `translate(${posX}px, ${posY}px) scale(${currentScale})`;
    updateBadge(currentScale);
  }

  function stepZoomNext() {
    stepIndex = (stepIndex + 1) % zoomSteps.length;
    const nextScale = zoomSteps[stepIndex];
    if (nextScale === 1) {
      posX = 0;
      posY = 0;
    }
    applyTransform(nextScale);
  }

  function resetZoom() {
    stepIndex = 0;
    currentScale = 1;
    posX = 0;
    posY = 0;
    isDragging = false;
    didDrag = false;
    applyTransform(1);
  }

  if (typeof certResetZoomFn !== "undefined") {
    certResetZoomFn = resetZoom;
  }

  stageEl.addEventListener("pointerdown", function (e) {
    if (e.button !== 0 && e.pointerType === "mouse") return;

    didDrag = false;
    pointerDownX = e.clientX;
    pointerDownY = e.clientY;

    if (currentScale > 1) {
      isDragging = true;
      dragStartX = e.clientX - posX;
      dragStartY = e.clientY - posY;
      stageEl.classList.add("is-dragging");
      stageEl.setPointerCapture(e.pointerId);
    }
  });

  stageEl.addEventListener("pointermove", function (e) {
    if (Math.hypot(e.clientX - pointerDownX, e.clientY - pointerDownY) > 5) {
      didDrag = true;
    }

    if (!isDragging || currentScale <= 1) return;

    const rawX = e.clientX - dragStartX;
    const rawY = e.clientY - dragStartY;
    const clamped = clampPosition(rawX, rawY, currentScale);

    posX = clamped.x;
    posY = clamped.y;
    applyTransform(currentScale);
  });

  function finishPointer(e) {
    if (isDragging) {
      isDragging = false;
      stageEl.classList.remove("is-dragging");
      if (
        e &&
        stageEl.hasPointerCapture &&
        stageEl.hasPointerCapture(e.pointerId)
      ) {
        stageEl.releasePointerCapture(e.pointerId);
      }
    }
  }

  stageEl.addEventListener("pointerup", finishPointer);
  stageEl.addEventListener("pointercancel", finishPointer);

  stageEl.addEventListener("click", function (e) {
    e.stopPropagation();
    if (didDrag) {
      didDrag = false;
      return;
    }
    stepZoomNext();
  });

  stageEl.addEventListener(
    "wheel",
    function (e) {
      e.preventDefault();
      e.stopPropagation();

      const delta = e.deltaY < 0 ? 0.25 : -0.25;
      const targetScale = Math.min(
        3,
        Math.max(1, Number((currentScale + delta).toFixed(2))),
      );

      let closestIdx = 0;
      let minDiff = Infinity;
      zoomSteps.forEach((s, idx) => {
        const diff = Math.abs(s - targetScale);
        if (diff < minDiff) {
          minDiff = diff;
          closestIdx = idx;
        }
      });
      stepIndex = closestIdx;

      applyTransform(targetScale);
    },
    { passive: false },
  );

  modalEl.addEventListener("hidden.bs.modal", function () {
    resetZoom();

    if (reopenOrgGalleryOnZoomClose) {
      reopenOrgGalleryOnZoomClose = false;
      const orgModalEl = document.getElementById("orgGalleryModal");
      if (orgModalEl && window.bootstrap && bootstrap.Modal) {
        bootstrap.Modal.getOrCreateInstance(orgModalEl).show();
      }
    }
  });
})();
