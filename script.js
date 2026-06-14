const roleContent = {
  recruiting: {
    kicker: "招聘支持",
    title: "能把候选人沟通和信息跟进做细",
    body:
      "高频访谈、客户接待和课程顾问经历，让我习惯先听清需求，再按流程记录、分类和反馈。这可以迁移到简历初筛、面试邀约、候选人信息归档和招聘台账维护。"
  },
  relations: {
    kicker: "员工关系",
    title: "能在多元人群中保持耐心、边界和保密意识",
    body:
      "在基层调研和第三方评估中，我需要面对不同年龄、职业和表达习惯的人群，按中立、保密、准确记录的原则沟通。这类经验适合员工沟通、信息收集和问题反馈。"
  },
  training: {
    kicker: "培训助理",
    title: "能把材料、反馈和执行流程整理清楚",
    body:
      "课程顾问经历让我熟悉学习服务场景，也训练了我把用户反馈归纳为共性问题的能力。放到培训支持中，可以协助培训通知、签到、反馈收集和材料归档。"
  },
  data: {
    kicker: "数据整理",
    title: "能用工具把零散信息变成可查看的台账",
    body:
      "我掌握 Python、SQL、Excel、PostgreSQL 和 MongoDB，能进行基础清洗、分类和汇总。适合维护招聘简历筛选表、出勤表、绩效台账和培训反馈数据。"
  }
};

const tabs = document.querySelectorAll(".role-tab");
const roleCard = document.querySelector("#role-card");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((item) => item.classList.remove("active"));
    tab.classList.add("active");
    const content = roleContent[tab.dataset.role];
    roleCard.innerHTML = `
      <p class="role-kicker">${content.kicker}</p>
      <h3>${content.title}</h3>
      <p>${content.body}</p>
    `;
  });
});

document.querySelectorAll("[data-copy]").forEach((button) => {
  button.addEventListener("click", async () => {
    const value = button.dataset.copy;
    const status = document.querySelector("#copy-status");
    try {
      await navigator.clipboard.writeText(value);
      status.textContent = "已复制，可以直接粘贴给面试官。";
    } catch {
      status.textContent = value;
    }
  });
});
