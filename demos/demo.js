const lerp = (start, end, amount) => start + (end - start) * amount;

const initDemoPage = () => {
  if (window.lucide) {
    window.lucide.createIcons({ attrs: { strokeWidth: 1.8 } });
  }

  document.querySelectorAll("[data-reveal]").forEach((el) => {
    el.classList.add("is-visible");
  });

  const wrap = document.querySelector(".demo-page-wrap");
  if (!wrap || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;

  wrap.addEventListener("mousemove", (event) => {
    const rect = wrap.getBoundingClientRect();
    targetX = (event.clientX - rect.left) / rect.width - 0.5;
    targetY = (event.clientY - rect.top) / rect.height - 0.5;
  });

  wrap.addEventListener("mouseleave", () => {
    targetX = 0;
    targetY = 0;
  });

  const tick = () => {
    currentX = lerp(currentX, targetX, 0.08);
    currentY = lerp(currentY, targetY, 0.08);
    wrap.style.setProperty("--mouse-x", currentX.toFixed(4));
    wrap.style.setProperty("--mouse-y", currentY.toFixed(4));
    window.requestAnimationFrame(tick);
  };

  window.requestAnimationFrame(tick);
};

document.addEventListener("DOMContentLoaded", initDemoPage);
