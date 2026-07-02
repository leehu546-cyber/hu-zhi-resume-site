const revealItems = document.querySelectorAll("[data-reveal]");
const capabilityButtons = document.querySelectorAll(".capability");
const tabs = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".tab-panel");
const counters = document.querySelectorAll("[data-count]");
const trendCanvas = document.querySelector("#trendChart");

if (window.lucide) {
  window.lucide.createIcons({
    attrs: {
      strokeWidth: 1.8,
    },
  });
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  { threshold: 0.18 }
);

revealItems.forEach((item) => revealObserver.observe(item));

window.setTimeout(() => {
  revealItems.forEach((item) => {
    const rect = item.getBoundingClientRect();
    const nearViewport = rect.top < window.innerHeight * 1.15 && rect.bottom > -80;
    if (nearViewport) item.classList.add("is-visible");
  });
}, 250);

let activeCapability = 0;
const rotateCapability = () => {
  if (!capabilityButtons.length) return;
  capabilityButtons.forEach((button) => button.classList.remove("is-active"));
  capabilityButtons[activeCapability].classList.add("is-active");
  activeCapability = (activeCapability + 1) % capabilityButtons.length;
};

let capabilityTimer = capabilityButtons.length ? window.setInterval(rotateCapability, 2400) : null;

capabilityButtons.forEach((button, index) => {
  button.addEventListener("click", () => {
    if (capabilityTimer) window.clearInterval(capabilityTimer);
    activeCapability = index;
    rotateCapability();
    capabilityTimer = window.setInterval(rotateCapability, 2400);
  });
});

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const target = tab.dataset.tab;
    tabs.forEach((item) => item.classList.toggle("is-active", item === tab));
    panels.forEach((panel) => {
      panel.classList.toggle("is-active", panel.dataset.panel === target);
    });
  });
});

const formatNumber = (value) => {
  return new Intl.NumberFormat("zh-CN").format(value);
};

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting || entry.target.dataset.done) return;

      const target = Number(entry.target.dataset.count);
      const duration = 1200;
      const start = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        entry.target.textContent = formatNumber(Math.round(target * eased));

        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          entry.target.dataset.done = "true";
        }
      };

      requestAnimationFrame(tick);
    });
  },
  { threshold: 0.4 }
);

counters.forEach((counter) => counterObserver.observe(counter));

const drawTrendChart = () => {
  if (!trendCanvas) return;

  const parent = trendCanvas.parentElement;
  const rect = parent.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  const width = Math.max(Math.round(rect.width), 320);
  const height = Math.max(Math.round(rect.height), 220);

  trendCanvas.width = width * dpr;
  trendCanvas.height = height * dpr;
  trendCanvas.style.width = `${width}px`;
  trendCanvas.style.height = `${height}px`;

  const ctx = trendCanvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);

  const padding = { top: 54, right: 34, bottom: 42, left: 44 };
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;
  const gridColor = "rgba(18, 20, 23, 0.08)";
  const labelColor = "rgba(102, 108, 116, 0.82)";

  ctx.lineWidth = 1;
  ctx.strokeStyle = gridColor;
  ctx.font = "12px Inter, sans-serif";
  ctx.fillStyle = labelColor;

  for (let i = 0; i <= 4; i += 1) {
    const y = padding.top + (plotHeight / 4) * i;
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(width - padding.right, y);
    ctx.stroke();
  }

  const labels = ["05/10", "05/11", "05/12", "05/13", "05/14", "05/15", "05/16"];
  labels.forEach((label, index) => {
    const x = padding.left + (plotWidth / (labels.length - 1)) * index;
    ctx.fillText(label, x - 17, height - 17);
  });

  const series = [
    { color: "#1b66f2", values: [126, 108, 145, 151, 170, 143, 158] },
    { color: "#2f9d55", values: [82, 91, 105, 118, 93, 121, 88] },
  ];

  const allValues = series.flatMap((item) => item.values);
  const min = Math.min(...allValues) - 14;
  const max = Math.max(...allValues) + 16;

  const pointFor = (value, index, count) => {
    const x = padding.left + (plotWidth / (count - 1)) * index;
    const y = padding.top + plotHeight - ((value - min) / (max - min)) * plotHeight;
    return { x, y };
  };

  series.forEach((item) => {
    ctx.strokeStyle = item.color;
    ctx.lineWidth = 3;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.beginPath();

    item.values.forEach((value, index) => {
      const point = pointFor(value, index, item.values.length);
      if (index === 0) ctx.moveTo(point.x, point.y);
      else ctx.lineTo(point.x, point.y);
    });

    ctx.stroke();

    item.values.forEach((value, index) => {
      const point = pointFor(value, index, item.values.length);
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(point.x, point.y, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = item.color;
      ctx.lineWidth = 2;
      ctx.stroke();
    });
  });
};

drawTrendChart();
window.addEventListener("resize", drawTrendChart);

const TYPEWRITER_KEY = "huZhiHeroTyped_v2";
const WORKS_TYPEWRITER_KEY = "huZhiWorksTyped_v3";
const PAUSE_CHARS = new Set(["，", "。", "、", "；", "：", " ", "·", "—", "–", "-"]);

const sleep = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));

const charDelay = (char, baseSpeed) => {
  if (char === "—" || char === "–") return baseSpeed + 90;
  if (PAUSE_CHARS.has(char)) return baseSpeed + 50;
  return baseSpeed;
};

const lerp = (current, target, amount) => current + (target - current) * amount;

const easeOutCubic = (value) => 1 - (1 - value) ** 3;

const easeOutQuart = (value) => 1 - (1 - value) ** 4;

const splitGraphemes = (text) => {
  if (typeof Intl !== "undefined" && Intl.Segmenter) {
    return [...new Intl.Segmenter("zh", { granularity: "grapheme" }).segment(text)].map(
      (part) => part.segment
    );
  }
  return [...text];
};

const typewriterLines = () => [...document.querySelectorAll("[data-typewriter]")];

const revealHeroExtras = () => {
  document.querySelector(".hero-after-type")?.classList.add("is-visible");
  document.querySelector("#top .page-scroll-cta")?.classList.add("is-visible");
};

const showAllTypewriterText = () => {
  typewriterLines().forEach((el) => {
    el.textContent = el.dataset.typeText || "";
    el.classList.remove("is-typing");
  });
  revealHeroExtras();
};

const typeLinePage = async (el, speed) => {
  const text = el.dataset.typeText || "";
  el.textContent = "";
  el.classList.add("is-typing-page");

  const cursor = document.createElement("span");
  cursor.className = "typewriter-page-cursor";
  cursor.setAttribute("aria-hidden", "true");
  cursor.textContent = "▋";
  el.appendChild(cursor);

  for (const char of splitGraphemes(text)) {
    el.insertBefore(document.createTextNode(char), cursor);
    await sleep(charDelay(char, speed));
  }

  await sleep(180);
  cursor.remove();
  el.classList.remove("is-typing-page");
  await sleep(100);
};

const showWorksPageText = () => {
  const worksInner = document.querySelector("#works .page-inner--works");
  worksInner?.querySelectorAll("[data-page-typewriter]").forEach((el) => {
    el.textContent = el.dataset.typeText || "";
    el.classList.remove("is-typing-page");
  });
  worksInner?.classList.add("is-page-ready");
};

const runWorksPageTypewriter = async () => {
  const worksInner = document.querySelector("#works .page-inner--works");
  const lines = worksInner ? [...worksInner.querySelectorAll("[data-page-typewriter]")] : [];
  if (!lines.length) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const alreadyTyped = sessionStorage.getItem(WORKS_TYPEWRITER_KEY) === "1";

  if (reducedMotion || alreadyTyped) {
    showWorksPageText();
    return;
  }

  lines.forEach((el) => {
    el.textContent = "";
  });

  for (const el of lines) {
    const speed = Number(el.dataset.speed) || 40;
    await typeLinePage(el, speed);
  }

  worksInner?.classList.add("is-page-ready");
  sessionStorage.setItem(WORKS_TYPEWRITER_KEY, "1");
};

const initWorksPageTypewriter = () => {
  const worksPanel = document.getElementById("works");
  if (!worksPanel) return null;

  let started = false;

  const maybeStart = () => {
    if (started) return;
    const enter = Number.parseFloat(worksPanel.style.getPropertyValue("--panel-enter") || "0");
    if (enter < 0.78) return;
    started = true;
    runWorksPageTypewriter();
  };

  if (sessionStorage.getItem(WORKS_TYPEWRITER_KEY) === "1") {
    showWorksPageText();
    return maybeStart;
  }

  window.addEventListener("scroll", maybeStart, { passive: true });
  window.setTimeout(maybeStart, 500);
  return maybeStart;
};

let worksTypewriterCheck = null;

const typeLine = async (el, speed) => {
  const text = el.dataset.typeText || "";
  el.textContent = "";
  el.classList.add("is-typing");

  const cursor = document.createElement("span");
  cursor.className = "typewriter-cursor";
  cursor.setAttribute("aria-hidden", "true");
  cursor.textContent = "|";
  el.appendChild(cursor);

  for (const char of splitGraphemes(text)) {
    el.insertBefore(document.createTextNode(char), cursor);
    await sleep(charDelay(char, speed));
  }

  await sleep(280);
  cursor.remove();
  el.classList.remove("is-typing");
  await sleep(160);
};

const runHeroTypewriter = async () => {
  const lines = typewriterLines();
  if (!lines.length) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const alreadyTyped = sessionStorage.getItem(TYPEWRITER_KEY) === "1";

  if (reducedMotion || alreadyTyped) {
    showAllTypewriterText();
    return;
  }

  lines.forEach((el) => {
    el.textContent = "";
  });

  for (const el of lines) {
    const speed = Number(el.dataset.speed) || 100;
    await typeLine(el, speed);
  }

  revealHeroExtras();
  sessionStorage.setItem(TYPEWRITER_KEY, "1");
};

const initMagneticElements = () => {
  document.querySelectorAll("[data-magnetic]").forEach((el) => {
    const strength = Number(el.dataset.magnetic) || 0.32;

    el.addEventListener("mousemove", (event) => {
      const rect = el.getBoundingClientRect();
      const offsetX = (event.clientX - rect.left - rect.width / 2) * strength;
      const offsetY = (event.clientY - rect.top - rect.height / 2) * strength;
      el.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0)`;
    });

    el.addEventListener("mouseleave", () => {
      el.style.transform = "";
      el.classList.remove("is-active");
    });

    el.addEventListener("mouseenter", () => {
      el.classList.add("is-active");
    });
  });
};

const getStageProgress = (stageEl) => {
  const rect = stageEl.getBoundingClientRect();
  const viewport = window.innerHeight || 1;
  const range = Math.max(stageEl.offsetHeight - viewport, 1);
  const scrolled = Math.min(Math.max(-rect.top, 0), range);
  return scrolled / range;
};

const initAllPageParallax = () => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const states = [...document.querySelectorAll(".page-panel")].map((panel) => ({
    panel,
    targetX: 0,
    targetY: 0,
    currentX: 0,
    currentY: 0,
  }));

  states.forEach((entry) => {
    entry.panel.addEventListener("mousemove", (event) => {
      const rect = entry.panel.getBoundingClientRect();
      entry.targetX = (event.clientX - rect.left) / rect.width - 0.5;
      entry.targetY = (event.clientY - rect.top) / rect.height - 0.5;
    });

    entry.panel.addEventListener("mouseleave", () => {
      entry.targetX = 0;
      entry.targetY = 0;
    });
  });

  const tick = () => {
    states.forEach((state) => {
      state.currentX = lerp(state.currentX, state.targetX, 0.08);
      state.currentY = lerp(state.currentY, state.targetY, 0.08);
      state.panel.style.setProperty("--mouse-x", state.currentX.toFixed(4));
      state.panel.style.setProperty("--mouse-y", state.currentY.toFixed(4));
    });
    window.requestAnimationFrame(tick);
  };

  window.requestAnimationFrame(tick);
};

const initPageScrollSystem = () => {
  const stages = [...document.querySelectorAll("[data-page-stage]")];
  if (!stages.length) return null;

  const panels = stages
    .map((stage) => stage.querySelector(".page-panel"))
    .filter((panel) => panel instanceof HTMLElement);

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const panelState = new Map();
  let lenis = null;

  panels.forEach((panel, index) => {
    panelState.set(panel, {
      currentHero: 0,
      currentEnter: index === 0 ? 1 : 0,
      targetHero: 0,
      targetEnter: index === 0 ? 1 : 0,
    });
    if (index === 0) {
      panel.style.setProperty("--panel-enter", "1");
    }
  });

  const updateTargets = () => {
    stages.forEach((stage, index) => {
      const panel = panels[index];
      const nextPanel = panels[index + 1];
      if (!panel) return;

      const progress = easeOutCubic(getStageProgress(stage));
      const state = panelState.get(panel);
      if (!state) return;

      state.targetHero = progress;

      if (nextPanel) {
        const enter = easeOutQuart(Math.min(Math.max((progress - 0.28) / 0.72, 0), 1));
        const nextState = panelState.get(nextPanel);
        if (nextState) {
          nextState.targetEnter = enter;
        }
        nextPanel.classList.toggle("is-entered", enter > 0.9);
      }

      panel.querySelector(".hero-after-type")?.classList.toggle("is-scrolling", progress > 0.02);
      panel.querySelector(".page-scroll-cta")?.classList.toggle("is-scrolling", progress > 0.02);
    });
  };

  const applySmoothValues = () => {
    panels.forEach((panel) => {
      const state = panelState.get(panel);
      if (!state) return;

      state.currentHero = reducedMotion ? state.targetHero : lerp(state.currentHero, state.targetHero, 0.11);
      state.currentEnter = reducedMotion
        ? state.targetEnter
        : lerp(state.currentEnter, state.targetEnter, 0.13);
      panel.style.setProperty("--hero-scroll", state.currentHero.toFixed(4));
      panel.style.setProperty("--panel-enter", state.currentEnter.toFixed(4));
    });
    worksTypewriterCheck?.();
    window.requestAnimationFrame(applySmoothValues);
  };

  const scrollToHash = (event) => {
    if (!(event.target instanceof Element)) return;
    const link = event.target.closest('a[href^="#"]');
    if (!link || link.getAttribute("href") === "#") return;

    const hash = link.getAttribute("href");
    const target = hash ? document.querySelector(hash) : null;
    if (!target) return;

    event.preventDefault();
    if (lenis) {
      lenis.scrollTo(target, { offset: 0, duration: 1.8 });
      return;
    }

    target.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  document.addEventListener("click", scrollToHash);
  updateTargets();
  window.requestAnimationFrame(applySmoothValues);

  if (reducedMotion) {
    window.addEventListener("scroll", updateTargets, { passive: true });
    window.addEventListener("resize", updateTargets);
    return null;
  }

  if (window.Lenis) {
    lenis = new window.Lenis({
      duration: 1.15,
      smoothWheel: true,
      touchMultiplier: 1.65,
      wheelMultiplier: 0.95,
    });

    lenis.on("scroll", updateTargets);
    const lenisFrame = (time) => {
      lenis.raf(time);
      window.requestAnimationFrame(lenisFrame);
    };
    window.requestAnimationFrame(lenisFrame);
    document.documentElement.classList.add("lenis");
  } else {
    window.addEventListener("scroll", updateTargets, { passive: true });
  }

  window.addEventListener("resize", updateTargets);

  return lenis;
};

initPageScrollSystem();
initAllPageParallax();
initMagneticElements();
worksTypewriterCheck = initWorksPageTypewriter();
runHeroTypewriter();
