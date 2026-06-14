const questSteps = [
  {
    title: "沟通访谈：能把人说清、把信息记准",
    body: "调研、评估、课程顾问和销售经历，都训练了我面对不同人群的倾听、解释和记录能力。",
    hr: "HR 结论：可支持候选人初筛、面试邀约和员工沟通记录。"
  },
  {
    title: "流程执行：能把细碎任务做完整",
    body: "问卷发放、回收、核验和样本抽取，让我习惯按流程推进，减少遗漏。",
    hr: "HR 结论：可支持入职资料核验、招聘台账和培训签到反馈。"
  },
  {
    title: "数据整理：能把信息做成台账",
    body: "Python、Pandas、SQL、Excel、PostgreSQL、MongoDB 都能支持基础清洗和整理。",
    hr: "HR 结论：可维护简历筛选表、出勤表、培训反馈表。"
  },
  {
    title: "岗位匹配：招聘支持 / 员工关系 / 培训助理",
    body: "沟通、流程、数据和纪律性组合在一起，适合从 HR 助理岗位稳定切入。",
    hr: "30 秒结论：能沟通、能执行、会整理、守流程。"
  }
];

const runner = document.querySelector("#runner");
const output = document.querySelector("#quest-output");
const coinCount = document.querySelector("#coin-count");
const stepCount = document.querySelector("#step-count");
const startButton = document.querySelector("#start-run");
const nextButton = document.querySelector("#next-step");
const pipeFinish = document.querySelector("#pipe-finish");
let currentStep = -1;
let running = false;

function setRunner(stepIndex) {
  const positions = [14, 34, 54, 74];
  runner.style.setProperty("--runner-left", `${positions[stepIndex] || 8}%`);
}

function renderStep(stepIndex) {
  const step = questSteps[stepIndex];
  output.innerHTML = `
    <p>WORLD 1-${stepIndex + 1}</p>
    <h2>${step.title}</h2>
    <span>${step.body}</span>
    <strong>${step.hr}</strong>
  `;
  coinCount.textContent = String(stepIndex + 1);
  stepCount.textContent = String(stepIndex + 1);
}

function markStep(stepIndex) {
  document.querySelectorAll(`[data-step="${stepIndex}"]`).forEach((node) => {
    node.classList.add("is-collected");
  });
  document.querySelectorAll(".glass-card").forEach((card, index) => {
    card.classList.toggle("is-current", index === stepIndex);
  });
  if (stepIndex === questSteps.length - 1) {
    pipeFinish.classList.add("is-open");
  }
}

function playStep(stepIndex) {
  if (running || stepIndex < 0 || stepIndex >= questSteps.length) {
    return;
  }
  running = true;
  currentStep = stepIndex;
  startButton.textContent = "继续";
  setRunner(stepIndex);
  runner.classList.remove("jump", "bump");
  window.setTimeout(() => runner.classList.add("jump"), 220);
  window.setTimeout(() => {
    markStep(stepIndex);
    renderStep(stepIndex);
    runner.classList.add("bump");
    running = false;
  }, 620);
}

function nextStep() {
  const next = Math.min(currentStep + 1, questSteps.length - 1);
  playStep(next);
}

function resetGame() {
  currentStep = -1;
  running = false;
  runner.style.setProperty("--runner-left", "8%");
  coinCount.textContent = "0";
  stepCount.textContent = "0";
  pipeFinish.classList.remove("is-open");
  document.querySelectorAll("[data-step], .glass-card").forEach((node) => {
    node.classList.remove("is-collected", "is-current");
  });
}

startButton.addEventListener("click", nextStep);
nextButton.addEventListener("click", nextStep);

document.querySelectorAll("[data-step]").forEach((node) => {
  node.addEventListener("click", () => playStep(Number(node.dataset.step)));
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

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  { threshold: 0.16 }
);

document.querySelectorAll(".reveal").forEach((node) => observer.observe(node));

document.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " " || event.key === "ArrowRight") {
    nextStep();
  }
  if (event.key === "r" || event.key === "R") {
    resetGame();
  }
});

resetGame();
