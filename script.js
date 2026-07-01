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

const mobileNav = document.querySelector(".mobile-nav");
const mobileNavLinks = document.querySelectorAll(".mobile-nav a[data-nav]");
const navSections = [
  { id: "top", el: document.querySelector("#top") },
  { id: "identity", el: document.querySelector("#identity") },
  { id: "system", el: document.querySelector("#system") },
  { id: "works", el: document.querySelector("#works") },
  { id: "project", el: document.querySelector("#project") },
  { id: "creation", el: document.querySelector("#creation") },
].filter((item) => item.el);

const siteHeader = document.querySelector(".site-header");
const heroDark = document.querySelector(".hero-dark");

if (siteHeader && heroDark) {
  siteHeader.classList.add("on-hero");
  const heroObserver = new IntersectionObserver(
    ([entry]) => {
      siteHeader.classList.toggle("on-hero", entry.isIntersecting);
    },
    { threshold: 0.12, rootMargin: "-72px 0px 0px 0px" }
  );
  heroObserver.observe(heroDark);
}

const setActiveMobileNav = (id) => {
  mobileNavLinks.forEach((link) => {
    link.classList.toggle("is-active", link.dataset.nav === id);
  });

  const activeLink = mobileNav?.querySelector(`a[data-nav="${id}"]`);
  if (activeLink && mobileNav) {
    const linkLeft = activeLink.offsetLeft;
    const linkRight = linkLeft + activeLink.offsetWidth;
    const viewLeft = mobileNav.scrollLeft;
    const viewRight = viewLeft + mobileNav.clientWidth;

    if (linkLeft < viewLeft + 12 || linkRight > viewRight - 12) {
      mobileNav.scrollTo({
        left: linkLeft - mobileNav.clientWidth / 2 + activeLink.offsetWidth / 2,
        behavior: "smooth",
      });
    }
  }
};

if (mobileNavLinks.length && navSections.length) {
  const navObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

      if (!visible.length) return;
      setActiveMobileNav(visible[0].target.id || "top");
    },
    {
      rootMargin: "-34% 0px -44% 0px",
      threshold: [0.12, 0.3, 0.5],
    }
  );

  navSections.forEach(({ el }) => navObserver.observe(el));

  mobileNavLinks.forEach((link) => {
    link.addEventListener("click", () => {
      window.setTimeout(() => setActiveMobileNav(link.dataset.nav || "top"), 120);
    });
  });

  setActiveMobileNav("top");
}
