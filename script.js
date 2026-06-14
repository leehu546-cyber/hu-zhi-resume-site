const cards = {
  communication: {
    kicker: "ABILITY BLOCK 01",
    title: "沟通访谈：能把人说清、把信息记准",
    body:
      "在乡村振兴评估、土地利用调查、课程顾问和房产销售中，我持续面对不同背景的人群。经验沉淀为耐心倾听、结构化提问、保密记录和需求判断。"
  },
  process: {
    kicker: "ABILITY BLOCK 02",
    title: "流程执行：适合招聘筛选、邀约和入职跟进",
    body:
      "我做过问卷发放、回收、核验、样本抽取和标准化信息整理，能按照既定规则把琐碎任务推进完整，减少遗漏和返工。"
  },
  data: {
    kicker: "ABILITY BLOCK 03",
    title: "数据整理：能把零散信息做成台账",
    body:
      "掌握 Python、Pandas、SQL、PostgreSQL、MongoDB、Excel 和 PPT，能支持简历筛选表、出勤表、培训反馈表等基础数据维护。"
  },
  fit: {
    kicker: "PIPE TO ROLE FIT",
    title: "岗位匹配：招聘支持 / 员工关系 / 培训助理",
    body:
      "调研访谈经验对应候选人初筛沟通；问卷核验经验对应简历信息归档；课程顾问经验对应员工和候选人需求识别；军旅经历对应纪律性与抗压执行。"
  },
  contact: {
    kicker: "PIPE TO CONTACT",
    title: "面试沟通入口",
    body:
      "邮箱：huzhi2024@163.com。电话可通过页面底部按钮复制。也可以直接下载 Word 简历，查看完整教育背景、实践经历和技能说明。"
  }
};

const avatar = document.querySelector("#avatar");
const screen = document.querySelector("#card-screen");
const coinCount = document.querySelector("#coin-count");
const targets = [...document.querySelectorAll("[data-card]")];
let avatarPosition = 12;
let activeIndex = 0;
let coins = 0;

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function renderCard(key) {
  const card = cards[key];
  screen.innerHTML = `
    <p class="pixel-kicker">${card.kicker}</p>
    <h2>${card.title}</h2>
    <p>${card.body}</p>
  `;
  coins = clamp(coins + 1, 0, 99);
  coinCount.textContent = String(coins).padStart(2, "0");
  avatar.classList.remove("jump");
  window.requestAnimationFrame(() => avatar.classList.add("jump"));
}

function setActiveTarget(index) {
  activeIndex = (index + targets.length) % targets.length;
  targets.forEach((target) => target.classList.remove("active"));
  const target = targets[activeIndex];
  target.classList.add("active");
  const rect = target.getBoundingClientRect();
  const stageRect = document.querySelector(".stage").getBoundingClientRect();
  const percent = ((rect.left + rect.width / 2 - stageRect.left) / stageRect.width) * 100;
  avatarPosition = clamp(percent, 8, 92);
  avatar.style.setProperty("--avatar-x", `${avatarPosition}%`);
}

targets.forEach((target, index) => {
  target.addEventListener("click", () => {
    setActiveTarget(index);
    renderCard(target.dataset.card);
  });
});

document.querySelectorAll("[data-move]").forEach((button) => {
  button.addEventListener("click", () => {
    setActiveTarget(activeIndex + Number(button.dataset.move));
  });
});

document.querySelector("[data-jump]").addEventListener("click", () => {
  avatar.classList.remove("jump");
  window.requestAnimationFrame(() => avatar.classList.add("jump"));
});

document.querySelector("[data-open-active]").addEventListener("click", () => {
  renderCard(targets[activeIndex].dataset.card);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") {
    setActiveTarget(activeIndex - 1);
  }
  if (event.key === "ArrowRight") {
    setActiveTarget(activeIndex + 1);
  }
  if (event.key === "ArrowUp" || event.key === "Enter" || event.key === " ") {
    renderCard(targets[activeIndex].dataset.card);
  }
});

document.querySelectorAll("[data-copy]").forEach((button) => {
  button.addEventListener("click", async () => {
    const value = button.dataset.copy;
    const status = document.querySelector("#copy-status");
    try {
      await navigator.clipboard.writeText(value);
      status.textContent = "COPY OK";
    } catch {
      status.textContent = value;
    }
  });
});

setActiveTarget(0);
