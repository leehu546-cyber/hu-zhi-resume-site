const steps = [
  {
    kicker: "WORLD 1-1 · 沟通金币",
    title: "沟通访谈：能把人说清、把信息记准",
    body:
      "乡村振兴评估、土地调查、课程顾问和房产销售都要求高频沟通。我能耐心倾听、结构化提问，并按保密要求记录关键信息。",
    hr: "对应 HR：候选人初筛、面试邀约、员工沟通记录。"
  },
  {
    kicker: "WORLD 1-2 · 流程箱子",
    title: "流程执行：能把琐碎事项推进完整",
    body:
      "做过问卷发放、回收、核验、样本抽取和标准化数据表整理，习惯按规则执行，减少遗漏和返工。",
    hr: "对应 HR：简历归档、入职资料核验、培训签到与反馈回收。"
  },
  {
    kicker: "WORLD 1-3 · 数据金币",
    title: "数据整理：能把零散信息变成台账",
    body:
      "掌握 Python、Pandas、SQL、PostgreSQL、MongoDB、Excel 和 PPT，能支持基础清洗、分类、统计和展示。",
    hr: "对应 HR：招聘筛选表、出勤表、绩效台账、培训反馈表。"
  },
  {
    kicker: "WORLD 1-4 · 通关旗帜",
    title: "岗位匹配：招聘支持 / 员工关系 / 培训助理",
    body:
      "我的优势不是单点技能，而是沟通、流程、数据和纪律性的组合。适合从 HR 助理岗位做起，提供稳定的信息整理与沟通协助。",
    hr: "30 秒结论：能沟通、能执行、会整理、守流程。"
  }
];

const avatar = document.querySelector("#avatar");
const screen = document.querySelector("#card-screen");
const coinCount = document.querySelector("#coin-count");
const stepCount = document.querySelector("#step-count");
const startButton = document.querySelector("#start-run");
const nextButton = document.querySelector("#next-step");
const resetButton = document.querySelector("#reset-run");
const scanHint = document.querySelector("#scan-hint");
const finishFlag = document.querySelector("#finish-flag");
let currentStep = -1;
let isAnimating = false;

function isMobileView() {
  return window.matchMedia("(max-width: 760px)").matches;
}

function showScanHint() {
  if (!scanHint || !isMobileView()) {
    return;
  }
  if (localStorage.getItem("resume-scan-hint-dismissed") === "1") {
    return;
  }
  scanHint.hidden = false;
}

function hideScanHint() {
  if (!scanHint) {
    return;
  }
  scanHint.hidden = true;
  localStorage.setItem("resume-scan-hint-dismissed", "1");
}

function scrollToSection(selector) {
  const node = document.querySelector(selector);
  if (node) {
    node.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function setRunnerPosition(stepIndex) {
  const target = document.querySelector(`[data-step-target="${stepIndex}"]`);
  if (!target) {
    avatar.style.setProperty("--runner-x", "9%");
    return;
  }
  const stageRect = document.querySelector(".stage").getBoundingClientRect();
  const rect = target.getBoundingClientRect();
  const x = ((rect.left + rect.width / 2 - stageRect.left) / stageRect.width) * 100;
  avatar.style.setProperty("--runner-x", `${Math.max(7, Math.min(92, x))}%`);
}

function renderStep(stepIndex) {
  const step = steps[stepIndex];
  screen.innerHTML = `
    <p class="pixel-kicker">${step.kicker}</p>
    <h2>${step.title}</h2>
    <p>${step.body}</p>
    <strong>${step.hr}</strong>
  `;
  coinCount.textContent = String(stepIndex + 1);
  stepCount.textContent = String(stepIndex + 1);
  document.querySelectorAll(".quick-cards [data-step]").forEach((button) => {
    button.classList.toggle("is-active", Number(button.dataset.step) === stepIndex);
  });
}

function markCollected(stepIndex) {
  const point = document.querySelector(`[data-step-target="${stepIndex}"]`);
  point?.classList.add("is-collected");
  point?.querySelector(".mystery-block")?.classList.add("is-hit");
  point?.querySelector(".coin")?.classList.add("is-collected");
  if (stepIndex === steps.length - 1) {
    finishFlag.classList.add("is-raised");
  }
}

function playStep(stepIndex, options = {}) {
  if (isAnimating || stepIndex < 0 || stepIndex >= steps.length) {
    return;
  }
  isAnimating = true;
  currentStep = stepIndex;
  startButton.textContent = "继续通关";
  setRunnerPosition(stepIndex);
  avatar.classList.remove("jump", "bump");
  window.setTimeout(() => {
    avatar.classList.add("jump");
    markCollected(stepIndex);
    renderStep(stepIndex);
    if (options.scroll !== false) {
      scrollToSection("#play");
    }
  }, 260);
  window.setTimeout(() => {
    avatar.classList.add("bump");
    isAnimating = false;
  }, 560);
}

function playNext() {
  const next = currentStep + 1;
  if (next >= steps.length) {
    playStep(steps.length - 1);
    return;
  }
  playStep(next);
}

function resetRun() {
  currentStep = -1;
  isAnimating = false;
  avatar.style.setProperty("--runner-x", "9%");
  avatar.classList.remove("jump", "bump");
  finishFlag.classList.remove("is-raised");
  coinCount.textContent = "0";
  stepCount.textContent = "0";
  document.querySelectorAll(".quest-point, .coin, .mystery-block").forEach((node) => {
    node.classList.remove("is-collected", "is-hit");
  });
  document.querySelectorAll(".quick-cards [data-step]").forEach((button) => {
    button.classList.remove("is-active");
  });
  startButton.textContent = "开始通关";
  screen.innerHTML = `
    <p class="pixel-kicker">MISSION START</p>
    <h2>给 HR 的最短路径</h2>
    <p>点一次“开始通关”，角色会按顺序走完 4 个箱子：沟通、流程、数据、岗位匹配。</p>
  `;
}

startButton.addEventListener("click", playNext);
nextButton.addEventListener("click", playNext);
resetButton.addEventListener("click", resetRun);

document.querySelectorAll("[data-step]").forEach((button) => {
  button.addEventListener("click", () => {
    playStep(Number(button.dataset.step));
  });
});

document.querySelectorAll("[data-scroll]").forEach((button) => {
  button.addEventListener("click", () => scrollToSection(button.dataset.scroll));
});

document.querySelectorAll("[data-copy]").forEach((button) => {
  button.addEventListener("click", async () => {
    const value = button.dataset.copy;
    const status = document.querySelector("#copy-status");
    try {
      await navigator.clipboard.writeText(value);
      status.textContent = "已复制";
    } catch {
      status.textContent = value;
    }
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight" || event.key === "Enter" || event.key === " ") {
    playNext();
  }
  if (event.key === "r" || event.key === "R") {
    resetRun();
  }
});

document.querySelector("#dismiss-scan-hint")?.addEventListener("click", hideScanHint);
showScanHint();
resetRun();
