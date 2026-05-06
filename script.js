const API_CONFIG_KEY = "lingyu-api-config";
const REMOVED_MODULES_KEY = "tuzi-removed-modules";
const SAVED_TASKS_KEY = "tuzi-saved-results";
const PRIMARY_API_BASE_URL = "https://api.yijiarj.cn";

const fallbackModels = [
  {
    name: "veo_3_1-fast",
    description: "文生视频 / 图生视频 / 参考图 / 多图输入",
    category: "video",
    tags: "视频",
    price: 0.19,
    ratio: 1,
    group: "default",
    brand: "veo",
    logoLabel: "Veo",
    capabilities: ["文生视频", "图生视频", "多图参考"],
    supportsWatermark: true
  },
  {
    name: "veo_3_1-4K",
    description: "4K 视频生成 / 高质量输出 / 任务轮询",
    category: "video",
    tags: "视频",
    price: 1,
    ratio: 1,
    group: "default",
    brand: "veo",
    logoLabel: "Veo",
    capabilities: ["4K", "多图参考", "任务轮询"],
    supportsWatermark: true
  },
  {
    name: "nano_banana_pro",
    description: "文生图 / 图生图 / 多图参考 / URL 输出",
    category: "image",
    tags: "图片",
    price: 0.21,
    ratio: 1,
    group: "default",
    brand: "banana",
    logoLabel: "NB",
    capabilities: ["文生图", "图生图", "多图参考"]
  },
  {
    name: "nano-banana-2",
    description: "多图参考 / 1K-4K 输出 / 新版 Banana",
    category: "image",
    tags: "图片",
    price: 0.21,
    ratio: 1,
    group: "default",
    brand: "banana",
    logoLabel: "NB2",
    capabilities: ["多图参考", "2K/4K", "尺寸选择"]
  },
  {
    name: "gemini-3.1-flash-image-preview-1k",
    description: "Gemini 图片生成 / 多模态参考 / 快速预览",
    category: "image",
    tags: "图片",
    price: 0.21,
    ratio: 1,
    group: "default",
    brand: "gemini",
    logoLabel: "Gem",
    capabilities: ["Gemini", "图像生成", "参考图"]
  },
  {
    name: "gpt-5.2-codex",
    description: "真实 GPT 对话体验 / 代码工程 / 多轮上下文",
    category: "chat",
    tags: "聊天",
    price: 0,
    ratio: 0.875,
    group: "cx",
    brand: "gpt",
    logoLabel: "GPT",
    capabilities: ["代码工程", "多轮对话", "系统角色"]
  },
  {
    name: "openai-chat",
    description: "通用助手 / 创意写作 / 问答分析",
    category: "chat",
    tags: "聊天",
    price: 0,
    ratio: 1,
    group: "default",
    brand: "openai",
    logoLabel: "AI",
    capabilities: ["通用问答", "写作", "分析"]
  }
];

const featureCopy = {
  video: {
    titlePrefix: "当前视频模型",
    note: "veo 有效期约6小时，请生成后尽快下载。",
    promptLabel: "视频提示词",
    placeholder: "描述镜头、主体、动作、风格、光线和转场...",
    submit: "开始生成",
    result: "创作资产"
  },
  chat: {
    titlePrefix: "当前聊天模型",
    note: "调用 /v1/chat/completions，按 OpenAI messages 格式提交。",
    promptLabel: "对话内容",
    placeholder: "输入你想让模型回答、改写、分析或执行的内容...",
    submit: "发送消息",
    result: "会话资产"
  },
  image: {
    titlePrefix: "当前图片模型",
    note: "nano banana 已接入 /v1/images/generations；参考图需使用公开 URL。",
    promptLabel: "图片提示词",
    placeholder: "描述画面主体、构图、风格、材质、光线和色彩...",
    submit: "生成图片",
    result: "创作资产"
  }
};

const systemRolePresets = [
  {
    id: "general",
    name: "通用助手",
    shortName: "通",
    prompt: `你是一个高质量通用 AI 助手，遵循工程化思维和结构化表达。面对任何问题时先理解用户目标，再拆解问题，给出清晰、可执行的回答。

原则：
优先理解用户真实需求，而不是只回答表面问题
复杂问题先拆解再回答
输出清晰、简洁、有逻辑
尽量提供可执行步骤
如果信息不足，提出合理假设并说明

回答结构：
需求理解
核心结论
具体方案或步骤
可能的注意事项

避免：
空泛描述
无用客套
重复用户问题

目标：让用户快速得到可执行的答案。`
  },
  {
    id: "coder",
    name: "代码工程师",
    shortName: "码",
    prompt: `你是一名资深软件工程师，擅长系统设计、代码实现和问题排查。你的思维方式偏工程化和结构化，优先提供可靠、可维护的技术方案。

工作原则：
先理解需求，再设计方案
优先给出简单、稳定、可扩展的实现
避免过度设计
提供完整示例代码
解释关键设计思路

回答流程：
需求分析
技术方案选择
实现步骤
示例代码
可能的优化点

编码要求：
代码清晰可读
使用常见最佳实践
必要时解释关键逻辑

目标：让用户可以直接运行或快速落地实现。`
  },
  {
    id: "copywriter",
    name: "文案策划",
    shortName: "文",
    prompt: `你是一名资深文案策划，擅长品牌表达、营销文案、产品介绍和传播策略。你的任务是把复杂内容转化为清晰、有吸引力、易传播的表达。

思考方式：
先明确目标用户
再确定传播目标
最后设计表达方式

输出结构：
目标用户
核心卖点
文案策略
多版本文案示例

写作原则：
简洁有力
重点突出
避免空洞形容词
强调用户价值

目标：让文案既好读又有转化力。`
  },
  {
    id: "analyst",
    name: "分析顾问",
    shortName: "析",
    prompt: `你是一名理性分析顾问，擅长商业分析、决策评估、数据思考和逻辑推理。你的目标是帮助用户看清问题结构并给出合理判断。

分析原则：
区分事实、假设和结论
避免情绪化判断
使用逻辑推理
提供多角度分析

回答结构：
问题定义
关键因素
可能方案
优缺点分析
建议结论

目标：帮助用户做出更理性的决策。`
  },
  {
    id: "translator",
    name: "翻译润色",
    shortName: "译",
    prompt: `你是一名专业翻译和语言编辑，目标是提供准确、自然、符合语境的表达，而不是逐字翻译。

原则：
保留原意
优化表达
保持语气一致
符合目标语言习惯

输出格式：
直译版本（可选）
优化翻译
如果需要，提供润色版

重点：
让文本读起来像母语写的
避免机器翻译感

目标：准确 + 自然 + 易读。`
  },
  {
    id: "teacher",
    name: "耐心导师",
    shortName: "师",
    prompt: `你是一名耐心的导师，擅长把复杂概念讲清楚。你的目标不是炫耀知识，而是让学习者真正理解。

教学方法：
从基础概念开始
使用类比和例子
分步骤解释
避免跳步

教学结构：
概念解释
简单例子
深入说明
常见误区
小总结

原则：
清晰
有耐心
逐步深入

目标：让用户真正理解，而不是只是看懂答案。`
  },
  {
    id: "product",
    name: "产品经理",
    shortName: "产",
    prompt: `你是一名经验丰富的产品经理，擅长需求分析、产品设计、用户体验和商业思考。

思考方式：
从用户需求出发
平衡技术、商业和体验
优先解决核心问题

回答结构：
用户需求
产品目标
解决方案
功能设计
关键指标

原则：
避免复杂功能堆叠
优先核心价值
设计可落地方案

目标：帮助用户设计真正有价值的产品方案。`
  }
];

const squareTags = [
  "全部", "图片", "视频", "系统生成", "来自网络", "YouMind", "Seedance2.0", "Nano Banana Pro", "GPT Image 2",
  "波普艺术", "怪诞卡通", "节日氛围", "游戏周边", "极简美学", "机甲",
  "虚假风美学", "屏幕模拟", "趋势分析", "健康", "品牌视觉", "二次元", "校园",
  "冬泳", "疯批感", "AI工作流", "空间改造", "公式美学", "创意质感", "自然奇观",
  "复古美学", "中式克苏鲁", "数字人", "创意海报", "赛博朋克", "太空探索", "证件照",
  "多重风格", "塔罗占卜", "水彩风格", "美漫风格", "中式玄幻", "科幻艺术", "超写实",
  "四视图", "修罗", "美式复古", "唯美光影", "浪漫主义", "潮流涂鸦", "新闻纪实"
];

let state = {
  config: loadConfig(),
  models: fallbackModels,
  selectedModel: fallbackModels[0],
  activeCategory: "all",
  activeMode: "models",
  galleryFilter: "all",
  galleryTag: "全部",
  galleryDetailId: null,
  galleryPreviewId: null,
  externalPrompts: Array.isArray(window.YOUMIND_PROMPTS) ? window.YOUMIND_PROMPTS : [],
  size: "720x1280",
  count: 1,
  tasks: loadSavedTasks(),
  chatMessages: loadSavedChatMessages(),
  previewItem: null,
  preview: { scale: 1, x: 0, y: 0 },
  historyVideoMuted: true,
  lastHealthResults: [],
  removedModules: loadRemovedModules(),
  workspaceFilter: "all",
  workspaceView: "grid"
};

const el = (id) => document.getElementById(id);

function loadConfig() {
  const saved = localStorage.getItem(API_CONFIG_KEY);
  const parsed = saved ? JSON.parse(saved) : { apiKey: "" };
  return { ...parsed, baseUrl: PRIMARY_API_BASE_URL };
}

function saveConfig() {
  state.config = { baseUrl: PRIMARY_API_BASE_URL, apiKey: el("apiKey").value.trim() };
  localStorage.setItem(API_CONFIG_KEY, JSON.stringify(state.config));
}

function loadRemovedModules() {
  const saved = localStorage.getItem(REMOVED_MODULES_KEY);
  return saved ? JSON.parse(saved) : [];
}

function saveRemovedModules() {
  localStorage.setItem(REMOVED_MODULES_KEY, JSON.stringify(state.removedModules));
}

function loadSavedTasks() {
  const saved = localStorage.getItem(SAVED_TASKS_KEY);
  return saved ? JSON.parse(saved) : [];
}

function saveTasks() {
  try {
    const keep = state.tasks.slice(0, 120);
    localStorage.setItem(SAVED_TASKS_KEY, JSON.stringify(keep));
  } catch (error) {
    console.warn("保存本地结果失败", error);
  }
}

function loadSavedChatMessages() {
  const saved = localStorage.getItem("tuzi-chat-messages");
  return saved ? JSON.parse(saved) : [];
}

function saveChatMessages() {
  try {
    localStorage.setItem("tuzi-chat-messages", JSON.stringify(state.chatMessages.slice(-80)));
  } catch (error) {
    console.warn("保存聊天记录失败", error);
  }
}

async function apiFetch(path, options = {}) {
  if (!state.config.apiKey) throw new Error("请先在设置里填写 API Key");
  const headers = new Headers(options.headers || {});
  headers.set("Authorization", `Bearer ${state.config.apiKey.replace(/^Bearer\s+/i, "")}`);
  return fetch(`${state.config.baseUrl}${path}`, { ...options, headers });
}

async function buildApiErrorMessage(response, action) {
  const detail = await readErrorDetail(response);
  const suffix = detail ? `；接口返回：${detail}` : "";
  const messages = {
    400: `${action}失败：请求参数不符合接口要求，请检查提示词、尺寸、时长和参考图设置${suffix}`,
    401: `${action}失败：API Key 无效、已过期或没有正确带上 Bearer Token，请在设置里重新填写令牌${suffix}`,
    403: `${action}失败：当前令牌或分组没有访问该模型的权限，请检查账号分组是否支持 ${state.selectedModel.name}${suffix}`,
    404: `${action}失败：接口路径或模型名称未找到，请检查当前模型配置${suffix}`,
    429: `${action}失败：请求过于频繁、额度不足或并发受限，请稍后重试${suffix}`,
    500: `${action}失败：服务端异常，请稍后重试${suffix}`,
    502: `${action}失败：上游模型服务暂时不可用${suffix}`,
    503: `${action}失败：模型服务暂时不可用，可能是线路拥堵、模型维护或当前分组不可用${suffix}`
  };
  return messages[response.status] || `${action}失败：HTTP ${response.status}${suffix}`;
}

async function readErrorDetail(response) {
  try {
    const text = await response.text();
    if (!text) return "";
    try {
      const data = JSON.parse(text);
      return String(data.error?.message || data.message || data.error || text).slice(0, 180);
    } catch {
      return text.slice(0, 180);
    }
  } catch {
    return "";
  }
}

function finalPrice(model) {
  return Number((Number(model.price || model.model_price || 0) * Number(model.ratio || 1)).toFixed(4));
}

function normalizePricing(payload) {
  const ratios = payload.group_ratio || {};
  const categoryOrder = { video: 0, image: 1, chat: 2 };
  const remoteModels = (payload.data || [])
    .map((item) => {
      const group = item.enable_groups?.[0] || "default";
      const category = getModelCategory(item);
      const fallback = fallbackModels.find((model) => model.name === item.model_name);
      return {
        name: item.model_name,
        description: fallback?.description || item.description || `${item.tags || "模型"} · ${group}`,
        category,
        tags: item.tags || fallback?.tags || (category === "video" ? "视频" : category === "image" ? "图片" : "聊天"),
        price: item.model_price || fallback?.price || 0,
        ratio: ratios[group] || fallback?.ratio || 1,
        group,
        brand: fallback?.brand || getModelBrand({ name: item.model_name }),
        logoLabel: fallback?.logoLabel || formatModelTitle(item.model_name).slice(0, 3),
        capabilities: fallback?.capabilities || [],
        supportsWatermark: fallback?.supportsWatermark || false
      };
    })
    .filter((item) => ["video", "image", "chat"].includes(item.category))
    .filter((item) => !isSoraModel(item))
    .sort((a, b) => categoryOrder[a.category] - categoryOrder[b.category]);
  const videoModels = remoteModels.filter((item) => item.category === "video");
  return videoModels.length >= 1 ? remoteModels : fallbackModels;
}

function isSoraModel(model) {
  const name = String(model.name || model.model_name || "").toLowerCase();
  const group = String(model.group || model.enable_groups?.join(" ") || "").toLowerCase();
  return name.includes("sora") || group.includes("sora");
}

function getModelCategory(item) {
  const tags = String(item.tags || "");
  const name = String(item.model_name || item.name || "").toLowerCase();
  if (tags.includes("视频") || name.includes("veo") || name.includes("video") || name.includes("seedance")) return "video";
  if (tags.includes("绘图") || tags.includes("图片") || name.includes("banana") || name.includes("image") || name.includes("vision")) return "image";
  return "chat";
}

function renderModels() {
  renderHealthToolCard();
  const query = el("modelSearch").value.trim().toLowerCase();
  const list = state.models
    .filter((model) => !isSoraModel(model))
    .filter((model) => !state.removedModules.includes(model.name))
    .filter((model) => state.activeCategory === "all" || model.category === state.activeCategory)
    .filter((model) => `${model.name} ${model.description}`.toLowerCase().includes(query));
  el("modelList").innerHTML = list.map((model) => `
    <button class="model-card ${model.name === state.selectedModel.name ? "active" : ""} ${getModelHealthClass(model)}" data-model="${model.name}">
      ${renderBrandLogo(model)}
      <span>
        <h3 title="${escapeHtml(model.name)}">${formatModelTitle(model.name)}</h3>
        <p>${getModelCardDescription(model)}</p>
      </span>
      <span class="badge">${finalPrice(model)}</span>
      ${renderModelHealthProgress(model)}
    </button>
  `).join("");
  if (!list.length) {
    el("modelList").innerHTML = `<div class="empty-list">当前分类暂无可用模块</div>`;
  }
}

function renderHealthToolCard() {
  const button = el("healthToolButton");
  if (!button) return;
  const status = state.inlineHealth.category === state.activeCategory ? state.inlineHealth.status : "idle";
  const results = state.inlineHealth.category === state.activeCategory ? state.inlineHealth.results || [] : [];
  const okCount = results.filter((item) => item.ok).length;
  const unknownCount = results.filter((item) => item.indeterminate).length;
  const failCount = results.filter((item) => !item.ok && !item.indeterminate).length;
  const total = results.length;
  const label = getHealthCategoryLabel(state.activeCategory);
  const small = `点击检查${label}模块`;
  let dotClass = "idle";
  let dotLabel = "待检测";
  if (status === "running") {
    dotClass = "checking";
    dotLabel = "检测中";
  } else if (status === "done") {
    dotClass = failCount ? "fail" : unknownCount ? "unknown" : "ok";
    dotLabel = failCount ? "异常" : unknownCount ? "未确认" : "正常";
  } else if (status === "error") {
    dotClass = "fail";
    dotLabel = "错误";
  }
  button.className = `tool-card health-inline ${status === "running" ? "checking" : ""} ${status === "done" ? (failCount ? "has-fail" : unknownCount ? "has-unknown" : "is-ok") : ""} ${status === "error" ? "has-fail" : ""}`;
  button.innerHTML = `
    <span class="logo brand-system"><span>API</span></span>
    <span>
      <strong>功能模块检测</strong>
      <small>${escapeHtml(small)}</small>
    </span>
    <i class="health-dot ${dotClass}" aria-label="${escapeHtml(dotLabel)}"></i>
  `;
}

function getModelHealthItem(model) {
  if (state.inlineHealth.category !== state.activeCategory) return null;
  return (state.inlineHealth.results || []).find((item) => item.modelName === model.name) || null;
}

function getModelHealthClass(model) {
  const item = getModelHealthItem(model);
  if (state.inlineHealth.status === "running" && state.inlineHealth.currentModel === model.name) return "health-running";
  if (!item) return "";
  if (item.ok) return "health-ok";
  if (item.indeterminate) return "health-unknown";
  return "health-fail";
}

function renderModelHealthProgress(model) {
  if (state.inlineHealth.category !== state.activeCategory || state.inlineHealth.status === "idle") return "";
  const item = getModelHealthItem(model);
  const isCurrent = state.inlineHealth.status === "running" && state.inlineHealth.currentModel === model.name;
  const isDone = Boolean(item);
  const className = isCurrent
    ? "running"
    : item?.ok
      ? "ok"
      : item?.indeterminate
        ? "unknown"
        : isDone
          ? "fail"
          : "pending";
  return `<span class="model-health-progress ${className}" aria-hidden="true">${".".repeat(18)}</span>`;
}

function getHealthCategoryLabel(category) {
  if (category === "video") return "视频";
  if (category === "image") return "图片";
  if (category === "chat") return "聊天";
  return "全部";
}

function formatModelTitle(name) {
  const aliases = {
    "gpt-5.2-codex": "GPT-5.2 Codex",
    "gpt-5.1-codex-max": "GPT-5.1 Codex Max",
    "gpt-5-codex": "GPT-5 Codex",
    "openai-chat": "OpenAI Chat",
    "nano_banana_pro": "Nano Banana Pro",
    "nano-banana-2": "Nano Banana 2",
    "gemini-3.1-flash-image-preview-1k": "Gemini Image 1K"
  };
  if (aliases[name]) return aliases[name];
  return name
    .replace(/^deepseek-ai\//i, "DeepSeek ")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .slice(0, 34);
}

function getModelCardDescription(model) {
  const group = model.group ? ` · ${model.group}` : "";
  const capabilityText = Array.isArray(model.capabilities) && model.capabilities.length
    ? model.capabilities.slice(0, 3).join(" / ")
    : "";
  if (capabilityText) return `${capabilityText}${group}`;
  if (model.category === "video") return `视频生成 / 历史回放 / 批量下载${group}`;
  if (model.category === "image") return `图片生成 / 多图参考 / 历史管理${group}`;
  if (model.category === "chat") return `真实对话 / 系统角色 / 清晰报错${group}`;
  return `模型 · ${model.group || "default"}`;
}

function renderBrandLogo(model) {
  const brand = getModelBrand(model);
  const label = model.logoLabel || formatModelTitle(model.name).slice(0, 3);
  return `<span class="logo brand-${brand}" aria-label="${escapeHtml(label)} logo">
    <span>${escapeHtml(label)}</span>
  </span>`;
}

function getModelBrand(model) {
  if (model.brand) return model.brand;
  const name = String(model.name || "").toLowerCase();
  if (name.includes("veo")) return "veo";
  if (name.includes("banana") || name.includes("nano_banana")) return "banana";
  if (name.includes("gemini")) return "gemini";
  if (name.includes("openai")) return "openai";
  if (name.includes("gpt")) return "gpt";
  if (name.includes("vision")) return "vision";
  return "default";
}

function renderSelection() {
  const copy = getCurrentCopy();
  document.querySelector(".api-card span").textContent = copy.titlePrefix;
  el("selectedModelTitle").textContent = state.selectedModel.name;
  el("selectedModelNote").textContent = `${copy.note} ${state.selectedModel.group} 分组，预估单次 ${finalPrice(state.selectedModel)} 积分`;
  el("priceHint").textContent = `(${Number(finalPrice(state.selectedModel) * state.count).toFixed(2)} 积分)`;
  renderFeaturePanel();
}

function getCurrentCopy() {
  return featureCopy[state.selectedModel.category] || featureCopy.video;
}

function getWorkspaceHeadline(category) {
  return "任务与结果";
}

function getWorkspaceDescription(category) {
  return "0 进行中 · 0 已完成";
}

function getWorkspaceModelMeta(category) {
  if (category === "video") return "视频创作流";
  if (category === "image") return "图片创作流";
  if (category === "chat") return `角色：${getActiveRoleName()}`;
  return "工作台上下文";
}

function renderFeaturePanel() {
  const category = state.selectedModel.category;
  const copy = getCurrentCopy();
  document.querySelector(".app-shell").classList.toggle("chat-layout", category === "chat" && state.activeMode === "models");
  el("promptLabel").innerHTML = `${copy.promptLabel} <b>*</b>`;
  el("prompt").placeholder = copy.placeholder;
  el("submitLabel").textContent = copy.submit;
  el("resultTitle").textContent = copy.result;
  el("workspaceHeadline").textContent = getWorkspaceHeadline(category);
  el("workspaceDescription").textContent = getWorkspaceDescription(category);
  el("workspaceModelName").textContent = formatModelTitle(state.selectedModel.name);
  el("workspaceModelMeta").textContent = getWorkspaceModelMeta(category);
  el("referenceSection").classList.toggle("hidden", category === "chat");
  el("extendSection").classList.toggle("hidden", category !== "video");
  el("videoControls").classList.toggle("hidden", category !== "video");
  el("watermarkSection").classList.toggle("hidden", category !== "video");
  el("chatOptions").classList.toggle("hidden", category !== "chat");
  el("chatSurface").classList.toggle("hidden", category !== "chat");
  el("imageOptions").classList.toggle("hidden", category !== "image");
  if (category === "chat") renderRoleAvatars();
  if (category === "image") renderImageControls();
  if (category === "chat") renderChatSurface();
  renderWorkspaceForFeature();
}

function setAppMode(mode) {
  state.activeMode = mode;
  if (mode === "square" && location.hash !== "#square") {
    history.replaceState(null, "", "#square");
  }
  if (mode === "models" && location.hash === "#square") {
    history.replaceState(null, "", location.pathname + location.search);
  }
  document.querySelectorAll(".mode").forEach((button) => {
    button.classList.toggle("active", button.dataset.mode === mode);
  });
  document.querySelector(".app-shell").classList.toggle("gallery-layout", mode === "square");
  document.querySelector(".app-shell").classList.toggle("chat-layout", mode === "models" && state.selectedModel.category === "chat");
  el("squareFilters").classList.toggle("hidden", mode !== "square");
  el("galleryPanel").classList.toggle("hidden", mode !== "square");
  renderSquareFilters();
  renderGallery();
}

function applyInitialRoute() {
  if (location.hash === "#square") {
    setAppMode("square");
  }
}

function renderSquareFilters() {
  const tags = getGalleryTagCloud();
  if (!tags.some((item) => item.tag === state.galleryTag)) state.galleryTag = "全部";
  el("squareTagList").innerHTML = tags.map((item) => `
    <button type="button" class="square-tag tag-cloud-${item.level} ${state.galleryTag === item.tag ? "active" : ""}" data-square-tag="${escapeHtml(item.tag)}">
      <span>${escapeHtml(item.tag)}</span>
      <small>${item.count}</small>
    </button>
  `).join("");
}

function renderGallery() {
  if (state.galleryDetailId) {
    renderGalleryDetail();
    return;
  }
  const items = getGalleryItems();
  el("galleryMasonry").classList.remove("hidden");
  el("galleryDetail").classList.add("hidden");
  if (!items.length) {
    el("galleryMasonry").innerHTML = `<div class="gallery-empty">暂无生成图片或视频<br>生成后会自动出现在提示词广场</div>`;
    return;
  }
  el("galleryMasonry").innerHTML = items.map((item) => `
    <article class="gallery-card ${item.sourceType === "抓取" ? "scraped" : "system"}" data-gallery-id="${escapeHtml(item.id)}" tabindex="0" role="button" aria-label="预览 ${escapeHtml(item.title)}">
      <div class="gallery-card-media">
        ${item.type === "video" ? `<video src="${item.url}" muted loop playsinline preload="metadata" poster="${escapeHtml(item.poster || "")}"></video><span class="gallery-video-badge">悬停预览</span>` : `<img src="${item.url}" alt="${escapeHtml(item.title)}" loading="lazy" />`}
        <span class="gallery-open-cue">点击预览</span>
      </div>
      <div class="gallery-card-body">
        <div class="gallery-card-meta">
          <span>${escapeHtml(item.modelLabel || item.model || (item.type === "video" ? "视频" : "图片"))}</span>
          <span>${escapeHtml(item.displaySourceType || item.sourceType || "系统生成")}</span>
          <span>${escapeHtml(item.type === "video" ? "视频" : "图片")}</span>
        </div>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.author ? `作者：${item.author}` : "作者：当前用户")}</p>
        <div class="gallery-card-tags">${item.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div>
        <div class="gallery-card-actions">
          <button type="button" class="gallery-use" data-gallery-prompt="${escapeHtml(item.prompt || item.title)}" data-gallery-type="${escapeHtml(item.type)}">使用提示词</button>
          ${item.detailUrl ? `<a href="${escapeHtml(item.detailUrl)}" target="_blank" rel="noopener noreferrer">来源</a>` : ""}
        </div>
      </div>
    </article>
  `).join("");
}

function renderGalleryDetail() {
  const item = getRawGalleryItems().find((entry) => entry.id === state.galleryDetailId);
  if (!item) {
    state.galleryDetailId = null;
    renderGallery();
    return;
  }
  const prompt = item.prompt || item.title;
  el("galleryMasonry").classList.add("hidden");
  el("galleryDetail").classList.remove("hidden");
  el("galleryDetail").innerHTML = `
    <article class="detail-page">
      <nav class="detail-breadcrumb">
        <button type="button" id="detailBack">提示词广场</button>
        <span>›</span>
        <span>${escapeHtml(item.modelLabel || item.model || "图片")}</span>
        <span>›</span>
        <strong>${escapeHtml(item.title)}</strong>
      </nav>
      <div class="detail-layout">
        <section class="detail-main">
          <div class="detail-kind">${escapeHtml(item.type === "video" ? "视频提示词" : "图像提示词")}</div>
          <h1>${escapeHtml(item.title)}</h1>
          <figure class="detail-hero">
            ${item.type === "video" ? `<video src="${item.url}" controls playsinline poster="${escapeHtml(item.poster || "")}"></video>` : `<img src="${item.url}" alt="${escapeHtml(item.title)}" />`}
          </figure>
          <section class="detail-prompt-block">
            <header>
              <h2>提示词</h2>
              <button type="button" class="gallery-use" data-gallery-prompt="${escapeHtml(prompt)}" data-gallery-type="${escapeHtml(item.type)}">使用提示词</button>
            </header>
            <pre>${escapeHtml(prompt)}</pre>
          </section>
        </section>
        <aside class="detail-aside">
          <div class="detail-author">
            <small>作者</small>
            <span>${escapeHtml(item.author || "当前用户")}</span>
            <strong>${escapeHtml(item.sourceName || item.displaySourceType || item.sourceType || "系统生成")}</strong>
          </div>
          <dl>
            <div><dt>模型</dt><dd>${escapeHtml(item.modelLabel || item.model || "未标记")}</dd></div>
            <div><dt>类型</dt><dd>${escapeHtml(item.displaySourceType || item.sourceType || "系统生成")}</dd></div>
            <div><dt>素材形态</dt><dd>${escapeHtml(item.type === "video" ? "视频" : "图片")}</dd></div>
            <div><dt>发布时间</dt><dd>${escapeHtml(item.publishedAt || "本地生成")}</dd></div>
            <div><dt>原始语言</dt><dd>${escapeHtml(item.language || "ZH")}</dd></div>
          </dl>
          <div class="detail-tags">${item.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div>
          <div class="detail-actions">
            <button type="button" class="gallery-use" data-gallery-prompt="${escapeHtml(prompt)}" data-gallery-type="${escapeHtml(item.type)}">使用提示词</button>
            ${item.detailUrl ? `<a href="${escapeHtml(item.detailUrl)}" target="_blank" rel="noopener noreferrer">查看原始来源</a>` : ""}
          </div>
        </aside>
      </div>
    </article>
  `;
}

function openGalleryPreview(itemId) {
  const item = getRawGalleryItems().find((entry) => entry.id === itemId);
  if (!item) return;
  state.galleryPreviewId = itemId;
  const overlay = el("galleryPreviewOverlay");
  overlay.innerHTML = `
    <div class="gallery-preview-backdrop" data-preview-close="true"></div>
    <div class="gallery-preview-window" role="dialog" aria-label="${escapeHtml(item.title)} 预览">
      <button type="button" class="gallery-preview-close" data-preview-close="true" aria-label="关闭预览">×</button>
      <div class="gallery-preview-media" data-preview-detail="${escapeHtml(item.id)}" title="点击进入详情页">
        ${item.type === "video" ? `<video src="${item.url}" controls autoplay muted playsinline poster="${escapeHtml(item.poster || "")}"></video>` : `<img src="${item.url}" alt="${escapeHtml(item.title)}" />`}
      </div>
      <div class="gallery-preview-caption">
        <strong>${escapeHtml(item.title)}</strong>
        <span>${escapeHtml(item.modelLabel || item.model || (item.type === "video" ? "视频" : "图片"))}</span>
        <span>${escapeHtml(item.displaySourceType || item.sourceType || "系统生成")}</span>
        <span>再次点击素材进入详情页</span>
      </div>
    </div>
  `;
  overlay.classList.remove("hidden");
  overlay.setAttribute("aria-hidden", "false");
}

function closeGalleryPreview() {
  state.galleryPreviewId = null;
  const overlay = el("galleryPreviewOverlay");
  overlay.classList.add("hidden");
  overlay.setAttribute("aria-hidden", "true");
  overlay.innerHTML = "";
}

function openGalleryDetail(itemId) {
  closeGalleryPreview();
  state.galleryDetailId = itemId;
  renderGallery();
  el("galleryPanel").scrollTop = 0;
}

function getGalleryItems() {
  const query = el("squareTagSearch")?.value.trim() || "";
  return getRawGalleryItems()
    .filter(itemMatchesGalleryFilter)
    .filter((item) => state.galleryTag === "全部" || item.tags.includes(state.galleryTag))
    .filter((item) => !query || item.tags.some((tag) => tag.includes(query)) || item.title.includes(query) || item.modelLabel?.includes(query) || item.author?.includes(query))
    .sort((a, b) => b.createdAt - a.createdAt);
}

function getRawGalleryItems() {
  const systemItems = state.tasks
    .filter((task) => getTaskVideoUrl(task) || getTaskImageUrl(task))
    .map((task) => {
      const type = getTaskVideoUrl(task) ? "video" : "image";
      const tags = getGalleryTags(task, type);
      return {
        id: task.id || `system-${task.created_at || getTaskVideoUrl(task) || getTaskImageUrl(task)}`,
        type,
        url: getTaskVideoUrl(task) || getTaskImageUrl(task),
        poster: task.poster || task.coverUrl || task.thumbnail || "",
        title: task.prompt || (type === "video" ? "未命名视频作品" : "未命名图片作品"),
        prompt: task.prompt || "",
        sourceType: "系统生成",
        displaySourceType: "系统生成",
        sourceName: "兔子AI 工作台",
        author: "当前用户",
        model: task.model || state.selectedModel?.name || "",
        modelLabel: formatModelTitle(task.model || state.selectedModel?.name || ""),
        tags: Array.from(new Set([...tags, "系统生成"])),
        publishedAt: formatTimestamp(task.created_at),
        language: "ZH",
        createdAt: normalizeTimestamp(task.created_at)
      };
    });
  const scrapedItems = state.externalPrompts.map((item) => ({
    ...item,
    poster: item.poster || item.coverUrl || item.thumbnail || "",
    tags: Array.from(new Set([...(Array.isArray(item.tags) ? item.tags.map((tag) => tag === "抓取素材" ? "来自网络" : tag) : getGalleryTags(item, item.type || "image")), item.sourceType === "抓取" ? "来自网络" : "系统生成"])),
    sourceType: item.sourceType || "抓取",
    displaySourceType: item.sourceType || (item.sourceName ? item.sourceName : "来自网络"),
    publishedAt: item.publishedAt || formatTimestamp(item.createdAt),
    language: item.language || "ZH",
    createdAt: normalizeTimestamp(item.createdAt)
  }));
  return [...systemItems, ...scrapedItems];
}

function itemMatchesGalleryFilter(item) {
  if (state.galleryFilter === "all") return true;
  if (state.galleryFilter === "system") return item.sourceType === "系统生成";
  if (state.galleryFilter === "scraped") return item.sourceType === "抓取";
  return item.type === state.galleryFilter;
}

function getGalleryTagCloud() {
  const counts = new Map([["全部", 0]]);
  getRawGalleryItems().filter(itemMatchesGalleryFilter).forEach((item) => {
    counts.set("全部", counts.get("全部") + 1);
    item.tags.forEach((tag) => counts.set(tag, (counts.get(tag) || 0) + 1));
  });
  squareTags.forEach((tag) => {
    if (counts.has(tag)) return;
    const count = getRawGalleryItems().filter(itemMatchesGalleryFilter).filter((item) => item.tags.includes(tag)).length;
    if (count) counts.set(tag, count);
  });
  const entries = [...counts.entries()]
    .map(([tag, count]) => ({ tag, count, level: getTagCloudLevel(tag, count, counts) }))
    .filter((item) => item.tag === "全部" || item.count > 0);
  return entries.sort((a, b) => {
    if (a.tag === "全部") return -1;
    if (b.tag === "全部") return 1;
    return b.count - a.count || a.tag.localeCompare(b.tag, "zh-Hans-CN");
  });
}

function getTagCloudLevel(tag, count, counts) {
  if (tag === "全部") return 4;
  const max = Math.max(1, ...[...counts.entries()].filter(([name]) => name !== "全部").map(([, value]) => value));
  const ratio = count / max;
  if (ratio > 0.72) return 4;
  if (ratio > 0.42) return 3;
  if (ratio > 0.18) return 2;
  return 1;
}

function getGalleryTags(task, type) {
  const base = type === "video" ? ["视频", "AI工作流"] : ["图片", "创意质感"];
  const model = String(task.model || "").toLowerCase();
  if (model.includes("banana")) base.push("超写实");
  if (model.includes("gemini")) base.push("唯美光影");
  if (model.includes("veo")) base.push("创意海报");
  if (model.includes("gpt") || model.includes("openai")) base.push("代码工程");
  return Array.from(new Set(base));
}

function normalizeTimestamp(value) {
  if (!value) return 0;
  const numeric = Number(value);
  if (!Number.isNaN(numeric) && numeric > 0) {
    return numeric > 1e12 ? numeric : numeric * 1000;
  }
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function formatTimestamp(value) {
  const timestamp = normalizeTimestamp(value);
  if (!timestamp) return "本地生成";
  return new Date(timestamp).toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function formatRelativeTime(value) {
  const timestamp = normalizeTimestamp(value);
  if (!timestamp) return "刚刚";
  const diffMinutes = Math.max(0, Math.round((Date.now() - timestamp) / 60000));
  if (diffMinutes < 1) return "刚刚";
  if (diffMinutes < 60) return `${diffMinutes} 分钟前`;
  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} 小时前`;
  const diffDays = Math.round(diffHours / 24);
  if (diffDays < 7) return `${diffDays} 天前`;
  return formatTimestamp(timestamp);
}

function renderRoleAvatars() {
  const currentPrompt = el("systemPrompt").value.trim();
  el("roleAvatarGrid").innerHTML = systemRolePresets.map((role) => `
    <button type="button" class="role-avatar ${currentPrompt === role.prompt ? "active" : ""}" data-role-id="${role.id}" title="${role.name}">
      <span>${role.shortName}</span>
      <small>${role.name}</small>
    </button>
  `).join("");
}

function getActiveRolePreset() {
  const currentPrompt = el("systemPrompt")?.value.trim() || "";
  return systemRolePresets.find((role) => role.prompt === currentPrompt) || systemRolePresets[0];
}

function getActiveRoleName() {
  return getActiveRolePreset()?.name || "通用助手";
}

function getChatMessageType(message) {
  if (String(message.role).includes("user")) return "user";
  if (String(message.role).includes("error")) return "assistant error";
  return "assistant";
}

function getChatMessageAvatar(message) {
  if (String(message.role).includes("user")) return "你";
  if (String(message.role).includes("error")) return "!";
  return getActiveRolePreset()?.shortName || "助";
}

function renderWorkspaceForFeature() {
  const category = state.selectedModel.category;
  const workspace = el("canvasWorkspace");
  workspace.classList.toggle("history-card-workspace", ["video", "image", "chat"].includes(category));
  const resultNode = document.querySelector(".result-node");
  resultNode.classList.toggle("video-workspace", category === "video");
  resultNode.classList.toggle("image-workspace", category === "image");
  resultNode.classList.toggle("chat-workspace", category === "chat");
  syncWorkspaceFilter(category);
  document.querySelector("#videoResultGrid").closest("section").classList.toggle("hidden", !shouldShowWorkspaceSection(category, "video"));
  document.querySelector("#imageResultGrid").closest("section").classList.toggle("hidden", !shouldShowWorkspaceSection(category, "image"));
  document.querySelector("#chatResultGrid").closest("section").classList.toggle("hidden", !shouldShowWorkspaceSection(category, "chat"));
  el("downloadVideos").classList.toggle("hidden", category !== "video");
  el("downloadImages").classList.toggle("hidden", category !== "image");
  renderWorkspaceTabs(category);
  renderTasks();
}

function syncWorkspaceFilter(category) {
  const allowed = getAllowedWorkspaceFilters(category);
  if (category === "video") {
    state.workspaceFilter = "video";
    return;
  }
  if (category === "image") {
    state.workspaceFilter = "image";
    return;
  }
  if (!allowed.includes(state.workspaceFilter)) {
    state.workspaceFilter = allowed[0] || "all";
  }
}

function getAllowedWorkspaceFilters(category) {
  if (category === "video") return ["video"];
  if (category === "image") return ["image"];
  return ["all", "chat"];
}

function shouldShowWorkspaceSection(category, kind) {
  const allowed = getAllowedWorkspaceFilters(category);
  if (!allowed.includes(kind) && kind !== "all") return false;
  if (state.workspaceFilter === "all") return allowed.includes(kind);
  return state.workspaceFilter === kind;
}

function renderWorkspaceTabs(category) {
  const counts = getWorkspaceAssetCounts(category);
  el("workspaceAssetCountAll").textContent = String(counts.all);
  el("workspaceAssetCountVideo").textContent = String(counts.video);
  el("workspaceAssetCountImage").textContent = String(counts.image);
  el("workspaceAssetCountChat").textContent = String(counts.chat);
  document.querySelectorAll(".workspace-asset-tab").forEach((button) => {
    const filter = button.dataset.workspaceFilter;
    const enabled = getAllowedWorkspaceFilters(category).includes(filter);
    button.classList.toggle("active", state.workspaceFilter === filter);
    button.classList.toggle("hidden", !enabled);
    button.disabled = !enabled;
  });
}

function getWorkspaceAssetCounts(category) {
  const counts = {
    video: state.tasks.filter((task) => (task.kind || inferTaskKind(task)) === "video").length,
    image: state.tasks.filter((task) => (task.kind || inferTaskKind(task)) === "image").length,
    chat: state.tasks.filter((task) => task.answer).length
  };
  if (category === "video") return { ...counts, all: counts.video + counts.image + counts.chat };
  if (category === "image") return { ...counts, all: counts.image + counts.video };
  return { ...counts, all: counts.chat };
}

function applyTaskPrompt(task) {
  const prompt = (task.prompt || "").trim();
  if (!prompt) return;
  setAppMode("models");
  const preferredCategory = task.kind || inferTaskKind(task);
  if (preferredCategory !== "chat") {
    const preferredModel = state.models.find((model) => model.category === preferredCategory);
    if (preferredModel) {
      state.selectedModel = preferredModel;
      setActiveCategory(preferredCategory);
      renderSelection();
    }
    el("prompt").value = prompt;
    el("prompt").focus();
    return;
  }
  const chatModel = state.models.find((model) => model.category === "chat");
  if (chatModel) {
    state.selectedModel = chatModel;
    setActiveCategory("chat");
    renderSelection();
  }
  el("prompt").value = prompt;
  el("prompt").focus();
}

function getResultSectionHeading(kind) {
  if (kind === "video") return { title: "最新视频资产", hint: "可预览 / 下载 / 再次使用" };
  if (kind === "image") return { title: "最新图片资产", hint: "参考图与成图结果集中管理" };
  return { title: "最近聊天会话", hint: "保留关键回答与会话摘要" };
}

function renderChatSurface() {
  const roleName = getActiveRoleName();
  const messages = state.chatMessages.length
    ? state.chatMessages
    : [{ role: "assistant", content: `你好，我是 ${formatModelTitle(state.selectedModel.name)}。当前按“${roleName}”方式与你对话。` }];
  el("chatMessages").innerHTML = messages.map((message) => `
    <article class="chat-row ${getChatMessageType(message)}">
      <span class="chat-avatar">${escapeHtml(getChatMessageAvatar(message))}</span>
      <div class="chat-bubble ${message.role.replace(/\s+/g, " ")}">${escapeHtml(message.content)}</div>
    </article>
  `).join("");
  el("chatMessages").scrollTop = el("chatMessages").scrollHeight;
}

function renderImageControls() {
  const modelName = state.selectedModel.name;
  const isGeminiBanana = modelName.startsWith("gemini-");
  const isBanana2 = modelName.includes("banana-2");
  el("imageSize").disabled = isGeminiBanana || !isBanana2;
  el("imageAspectRatio").disabled = false;
  el("imageMode").value = el("imageUrls").value.trim() ? "reference" : "generate";
}

function setActiveCategory(category) {
  state.activeCategory = category;
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.category === category);
  });
  const visibleModels = state.models
    .filter((model) => !state.removedModules.includes(model.name))
    .filter((model) => category === "all" || model.category === category)
    .sort((a, b) => getCategoryRank(a.category) - getCategoryRank(b.category));
  if (visibleModels.length && !visibleModels.some((model) => model.name === state.selectedModel.name)) {
    state.selectedModel = visibleModels[0];
    renderSelection();
  }
  renderModels();
}

function getCategoryRank(category) {
  return { video: 0, image: 1, chat: 2 }[category] ?? 99;
}

function renderTasks() {
  saveTasks();
  if (state.activeMode === "square") renderGallery();
  const category = state.selectedModel.category;
  const visibleTasks = getWorkspaceTasks();
  const latestStatus = visibleTasks[0] || null;

  const runningCount = visibleTasks.filter((task) => {
    const className = getTaskStatus(task).className;
    return className === "processing" || className === "queued";
  }).length;
  const completedCount = visibleTasks.filter((task) => getTaskStatus(task).className === "completed").length;
  const failedCount = visibleTasks.filter((task) => {
    const className = getTaskStatus(task).className;
    return className === "error" || className === "violation";
  }).length;

  el("workspaceHeadline").textContent = "任务与结果";
  el("workspaceDescription").textContent = `${runningCount} 进行中 · ${completedCount} 已完成${failedCount ? ` · ${failedCount} 失败` : ""}`;
  el("workspaceLatestStatus").textContent = latestStatus ? getTaskStatus(latestStatus).label : "待开始";
  el("workspaceLatestHint").textContent = latestStatus
    ? `${getWorkspaceLatestHint(latestStatus)}${runningCount ? ` · ${runningCount} 个处理中` : completedCount ? ` · ${completedCount} 个已完成` : ""}`
    : "提交任务后自动刷新";
  renderWorkspaceTabs(category);
  renderWorkspaceStats(category);
  renderWorkspaceView();

  const videos = state.tasks
    .filter((task) => (task.kind || inferTaskKind(task)) === "video")
    .sort((a, b) => normalizeTimestamp(b.created_at || b.createdAt) - normalizeTimestamp(a.created_at || a.createdAt));
  const images = state.tasks
    .filter((task) => (task.kind || inferTaskKind(task)) === "image")
    .sort((a, b) => normalizeTimestamp(b.created_at || b.createdAt) - normalizeTimestamp(a.created_at || a.createdAt));
  const chats = state.tasks
    .filter((task) => task.answer)
    .sort((a, b) => normalizeTimestamp(b.created_at || b.createdAt) - normalizeTimestamp(a.created_at || a.createdAt));

  document.querySelectorAll(".result-columns section[data-kind]").forEach((section) => {
    const kind = section.dataset.kind;
    const heading = getResultSectionHeading(kind);
    const title = section.querySelector("h3");
    const hint = section.querySelector(".result-section-copy span");
    if (title) title.textContent = heading.title;
    if (hint) hint.textContent = heading.hint;
    section.classList.toggle("hidden", !shouldShowWorkspaceSection(category, kind));
  });

  el("videoResultGrid").innerHTML = renderMediaResults(videos, "video");
  el("imageResultGrid").innerHTML = renderMediaResults(images, "image");
  el("chatResultGrid").innerHTML = renderChatResults(chats);
  prepareHistoryVideoPreviews();
}

function renderWorkspaceStats(category) {
  const allowed = getAllowedWorkspaceFilters(category);
  const tasks = state.tasks.filter((task) => {
    const kind = task.kind || inferTaskKind(task);
    return allowed.includes(kind);
  });
  const stats = tasks.reduce((acc, task) => {
    const className = getTaskStatus(task).className;
    if (className === "queued" || className === "processing") acc.running += 1;
    if (className === "completed") acc.completed += 1;
    if (className === "error" || className === "violation") acc.failed += 1;
    return acc;
  }, { running: 0, completed: 0, failed: 0 });
  el("workspaceStatRunning").textContent = String(stats.running);
  el("workspaceStatCompleted").textContent = String(stats.completed);
  el("workspaceStatFailed").textContent = String(stats.failed);
}

function renderWorkspaceView() {
  document.querySelectorAll(".result-grid").forEach((grid) => {
    grid.classList.toggle("list-view", state.workspaceView === "list");
  });
  document.querySelectorAll("[data-workspace-view]").forEach((button) => {
    button.classList.toggle("active", button.dataset.workspaceView === state.workspaceView);
  });
}

function getWorkspaceLatestHint(task) {
  const status = getTaskStatus(task);
  const prompt = (task.prompt || "").trim();
  return prompt
    ? `${formatRelativeTime(task.created_at || task.createdAt)} · ${prompt.slice(0, 22)}`
    : `${formatRelativeTime(task.created_at || task.createdAt)} · ${toDisplayText(status.detail)}`;
}

function renderChatSessionCards(items) {
  if (!items.length) {
    return `<article class="task-panel empty chat-panel-empty"><div class="task-panel-empty"><strong>这里会记录每一次 GPT 对话</strong><span>发送消息后，最近会话和关键回答会同步沉淀到右侧资产栏。</span></div></article>`;
  }
  return `
    <article class="task-panel chat-sessions-panel">
      <header>
        <div>
          <strong>最近会话</strong>
          <span>保留关键上下文与最近回答</span>
        </div>
        <b>${Math.min(items.length, 8)}</b>
      </header>
      <div class="task-panel-list chat-session-list">
        ${items.slice(0, 8).map((task) => `
          <button type="button" class="chat-session-card" data-task-id="${task.id}">
            <div class="chat-session-topline">
              <strong>${escapeHtml(task.prompt || "用户消息")}</strong>
              <span>${escapeHtml(formatRelativeTime(task.created_at || task.createdAt))}</span>
            </div>
            <span>${escapeHtml(task.answer || "等待回复")}</span>
          </button>
        `).join("")}
      </div>
    </article>
  `;
}

function getWorkspaceTasks() {
  const category = state.selectedModel.category;
  return state.tasks
    .filter((task) => (task.kind || inferTaskKind(task)) === category)
    .sort((a, b) => normalizeTimestamp(b.created_at || b.createdAt) - normalizeTimestamp(a.created_at || a.createdAt));
}

function inferTaskKind(task) {
  if (getTaskVideoUrl(task)) return "video";
  if (getTaskImageUrl(task)) return "image";
  if (task.answer) return "chat";
  if (String(task.model || "").includes("banana") || String(task.model || "").includes("image")) return "image";
  return "video";
}

function getTaskVideoUrl(task) {
  return task.url || task.video_url || task.videoUrl || task.output?.url || task.output?.video_url || task.data?.url || task.data?.video_url || "";
}

function getTaskImageUrl(task) {
  return task.imageUrl || task.image_url || task.image || task.data?.[0]?.url || task.data?.url || "";
}

function renderMediaResults(items, kind) {
  if (!items.length) {
    const label = kind === "video" ? "视频" : "图片";
    const hints = kind === "video"
      ? ["等待提交任务", "生成中会显示进度", "完成后展示预览", "失败任务可重试"]
      : ["等待生成图片", "完成后展示成图", "支持点击预览", "可批量下载"];
    return hints.map((hint, index) => `
      <div class="result-empty-card task-empty-card">
        <span class="empty-status ${index === 0 ? "queued" : ""}">${index === 0 ? "待开始" : "空"}</span>
        <div class="empty-preview-mark"></div>
        <strong>${label}任务位 ${index + 1}</strong>
        <p>${hint}</p>
        <i></i>
      </div>
    `).join("");
  }
  return items.slice(0, 8).map((task) => {
    const status = getTaskStatus(task);
    const canReuse = Boolean((task.prompt || "").trim());
    const actionLabel = kind === "video" ? "再次使用" : "复用提示词";
    const hasMedia = Boolean(getTaskVideoUrl(task) || getTaskImageUrl(task));
    const promptText = (task.prompt || "未填写提示词").trim() || (kind === "video" ? "未命名视频资产" : "未命名图片资产");
    const summaryText = kind === "video"
      ? getVideoCardSummary(task, status)
      : toDisplayText(status.detail);
    const canPreview = Boolean(getTaskVideoUrl(task) || getTaskImageUrl(task) || task.answer);
    const actionButtons = [
      canReuse ? `<button type="button" data-reuse-id="${task.id}">${actionLabel}</button>` : "",
      hasMedia ? `<button type="button" data-download-id="${task.id}">下载</button>` : ""
    ].filter(Boolean).join("");
    return `
      <div class="result-tile ${getTaskVideoUrl(task) ? "video-preview-tile" : ""} ${status.className}" role="button" tabindex="0" data-task-id="${task.id}" ${canPreview ? `data-preview-id="${task.id}"` : ""}>
        ${renderResultPreview(task)}
        ${renderResultStatus(task)}
        ${getTaskVideoUrl(task) ? renderVideoMuteButton() : ""}
        <div class="result-tile-meta ${kind === "video" ? "video-card-meta" : ""}">
          <div class="result-meta-topline">
            <span class="result-model-badge">${escapeHtml(formatModelTitle(task.model || state.selectedModel.name))}</span>
            <small>${escapeHtml(formatRelativeTime(task.created_at || task.createdAt))}</small>
          </div>
          <strong>${escapeHtml(promptText.slice(0, 56))}</strong>
          <span>${escapeHtml(summaryText)}</span>
          ${kind === "video" ? `<div class="result-inline-state"><span class="result-inline-status ${status.className}">${escapeHtml(status.label)}</span><span class="result-inline-progress">${status.progress}%</span></div>` : ""}
        </div>
        ${actionButtons ? `<span class="media-actions ${kind === "video" ? "video-card-actions" : ""}">${actionButtons}</span>` : ""}
      </div>
    `;
  }).join("");
}

function getVideoCardSummary(task, status) {
  if (status.className === "completed") return "可预览、下载，也可以把这条提示词继续复用。";
  const detail = toDisplayText(status.detail);
  if (status.className === "error" || status.className === "violation") return detail.slice(0, 68);
  return `${detail} · 卡片会自动刷新当前进度`;
}

function renderChatResults(items) {
  if (!items.length) {
    return `<div class="result-empty-card">最近还没有沉淀聊天结果<br>发送消息后会把关键回答同步展示在这里</div>`;
  }
  return items.slice(0, 8).map((task) => `
    <div class="result-tile chat-result-card" role="button" tabindex="0" data-task-id="${task.id}" data-preview-id="${task.id}">
      <div class="chat-result-meta">
        <strong>${escapeHtml((task.prompt || "用户消息").slice(0, 38))}</strong>
        <span>${escapeHtml(formatRelativeTime(task.created_at || task.createdAt))}</span>
      </div>
      <span class="text-result">${escapeHtml(task.answer)}</span>
    </div>
  `).join("");
}


function renderResultPreview(task) {
  const videoUrl = getTaskVideoUrl(task);
  const imageUrl = getTaskImageUrl(task);
  if (videoUrl) return `<video class="history-video-preview" src="${videoUrl}" preload="metadata" playsinline poster="${escapeHtml(task.poster || task.coverUrl || task.thumbnail || "")}" ${state.historyVideoMuted ? "muted" : ""}></video>`;
  if (imageUrl) return `<img src="${imageUrl}" alt="生成图片" />`;
  if (task.answer) return `<span class="text-result">${escapeHtml(task.answer)}</span>`;
  const status = getTaskStatus(task);
  return `<span class="empty-result">${escapeHtml(status.label)}<br>${escapeHtml(status.detail)}</span>`;
}

function renderVideoMuteButton() {
  return `<button class="video-mute-toggle" type="button" data-toggle-video-muted aria-label="${state.historyVideoMuted ? "取消静音" : "静音"}">${state.historyVideoMuted ? "静音" : "有声"}</button>`;
}

function prepareHistoryVideoPreviews() {
  document.querySelectorAll("video.history-video-preview").forEach((video) => {
    video.preload = "metadata";
    video.muted = state.historyVideoMuted;
    if (video.getAttribute("poster")) return;
    const showFirstFrame = () => {
      try {
        if (Number.isFinite(video.duration) && video.duration > 0 && video.currentTime < 0.05) {
          video.currentTime = Math.min(0.08, video.duration / 10);
        }
      } catch {
        // Remote videos may disallow seeking until metadata is fully ready.
      }
      video.pause();
    };
    if (video.readyState >= 1) {
      showFirstFrame();
    } else {
      video.addEventListener("loadedmetadata", showFirstFrame, { once: true });
    }
  });
}

function renderResultStatus(task) {
  const status = getTaskStatus(task);
  if ((task.kind || inferTaskKind(task)) === "video") {
    return `
      <span class="result-status result-floating-status ${status.className}">${escapeHtml(status.label)}</span>
      <span class="result-progress inline-video-progress"><span style="width:${status.progress}%"></span></span>
    `;
  }
  return `
    <span class="result-status ${status.className}">${escapeHtml(status.label)}</span>
    <span class="result-progress"><span style="width:${status.progress}%"></span></span>
  `;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function toDisplayText(value) {
  if (value == null) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  try {
    return value.message || value.error || JSON.stringify(value);
  } catch {
    return String(value);
  }
}

function getTaskStatus(task) {
  const rawStatus = String(task.status || "queued").toLowerCase();
  const progress = Math.max(0, Math.min(100, Number(task.progress || 0)));
  const quality = String(task.quality || "");
  const kind = task.kind || inferTaskKind(task);
  const hasResultUrl = kind === "video" ? Boolean(getTaskVideoUrl(task)) : kind === "image" ? Boolean(getTaskImageUrl(task)) : Boolean(task.answer);
  const pendingDetail = toDisplayText(task.error_detail || task.detail || "");
  if (rawStatus === "error" || task.error) {
    return { className: "error", label: kind === "chat" ? "回复失败" : "制作失败", detail: task.error || pendingDetail || "请重试", progress: progress || 100 };
  }
  if (quality && quality !== "standard") {
    return { className: "violation", label: "内容异常", detail: quality.slice(0, 12), progress: 100 };
  }
  if (rawStatus === "completed" || rawStatus === "succeeded" || hasResultUrl) {
    if (!hasResultUrl) {
      return { className: "processing", label: "等待地址", detail: "结果地址同步中", progress: 99 };
    }
    return { className: "completed", label: kind === "chat" ? "回复完成" : "制作完成", detail: kind === "chat" ? "已写入历史记录" : "可预览查看", progress: 100 };
  }
  if (["processing", "running", "in_progress"].includes(rawStatus) || progress > 0) {
    const detailMap = {
      video: "正在生成视频",
      image: "正在生成图片",
      chat: "模型正在思考"
    };
    return { className: "processing", label: kind === "chat" ? "思考中" : "制作中", detail: pendingDetail || detailMap[kind] || "处理中", progress: progress || 1 };
  }
  if (["queued", "pending", "submitted"].includes(rawStatus)) {
    return { className: "queued", label: "排队中", detail: pendingDetail || "等待开始处理", progress };
  }
  return { className: "processing", label: "同步中", detail: pendingDetail || rawStatus, progress };
}

function renderCanvasTransform() {
  return;
}

function renderNodePositions() {
  return;
}

function bindCanvasGestures() {
  return;
}

function tryReleasePointer(target, pointerId) {
  try {
    target.releasePointerCapture(pointerId);
  } catch (_) {
    // The pointer may already be released by the browser.
  }
}

function markTaskError(taskId, message) {
  state.tasks = state.tasks.map((task) => task.id === taskId ? { ...task, status: "error", error: message } : task);
  saveTasks();
  renderTasks();
}

function createLocalPendingTask() {
  return {
    id: `local_${Date.now()}_${Math.random().toString(16).slice(2)}`,
    model: state.selectedModel.name,
    kind: state.selectedModel.category,
    status: "queued",
    progress: 0,
    prompt: el("prompt").value.trim(),
    created_at: Date.now()
  };
}

function replaceTaskId(localId, remoteTask) {
  state.tasks = state.tasks.map((task) => task.id === localId ? { ...task, ...remoteTask, id: remoteTask.id || localId } : task);
  saveTasks();
  renderTasks();
  return remoteTask.id || localId;
}

async function refreshPricing() {
  const response = await apiFetch("/api/pricing");
  const payload = await response.json();
  if (!payload.success) throw new Error("价格接口返回失败");
  const models = normalizePricing(payload);
  state.models = (models.length ? models : fallbackModels).filter((model) => !state.removedModules.includes(model.name));
  state.selectedModel = state.models.find((model) => model.name === state.selectedModel.name) || state.models[0] || fallbackModels[0];
  renderModels();
  renderSelection();
}

async function refreshBilling() {
  const response = await apiFetch("/v1/dashboard/billing/subscription");
  const payload = await response.json();
  el("connectionState").textContent = payload.has_payment_method ? "已连接" : "已连接";
}

async function createVideoTask() {
  const files = el("referenceFiles").files;
  const remixId = el("remixId").value.trim();
  const prompt = el("prompt").value.trim();

  if (files.length) {
    const form = new FormData();
    form.set("model", state.selectedModel.name);
    form.set("prompt", prompt);
    form.set("seconds", el("seconds").value);
    form.set("size", state.size);
    form.set("watermark", String(el("watermark").checked));
    if (remixId) form.set("remix_id", remixId);
    Array.from(files).forEach((file) => form.append("input_reference", file));
    const response = await apiFetch("/v1/videos", { method: "POST", body: form });
    if (!response.ok) throw new Error(await buildApiErrorMessage(response, "视频创建"));
    return response.json();
  }

  const body = {
    model: state.selectedModel.name,
    prompt,
    size: state.size
  };
  if (remixId) body.remix_id = remixId;
  const response = await apiFetch("/v1/videos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  if (!response.ok) throw new Error(await buildApiErrorMessage(response, "视频创建"));
  return response.json();
}

async function createChatCompletion() {
  const messages = [];
  const systemPrompt = el("systemPrompt").value.trim();
  if (systemPrompt) messages.push({ role: "system", content: systemPrompt });
  if (el("chatContext").value === "multi") {
    state.chatMessages.slice(-12).forEach((message) => {
      if (["user", "assistant"].includes(message.role)) messages.push({ role: message.role, content: message.content });
    });
  }
  messages.push({ role: "user", content: el("prompt").value.trim() });
  const response = await apiFetch("/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: state.selectedModel.name, messages })
  });
  if (!response.ok) throw new Error(await buildApiErrorMessage(response, "聊天调用"));
  return response.json();
}

function getChatErrorMessage(status) {
  const messages = {
    401: "聊天调用失败：API Key 无效或未授权。",
    403: "聊天调用失败：当前令牌没有访问该模型的权限。",
    429: "聊天调用失败：请求过于频繁或额度不足。",
    500: "聊天调用失败：服务端异常，请稍后重试。",
    502: "聊天调用失败：上游模型服务暂时不可用。",
    503: "聊天调用失败：模型服务暂时不可用，可能是线路拥堵、模型维护或当前分组不可用。请稍后重试，或切换线路/模型。"
  };
  return messages[status] || `聊天调用失败：HTTP ${status}`;
}

async function createFeatureTask() {
  if (state.selectedModel.category === "video") return createVideoTask();
  if (state.selectedModel.category === "chat") {
    const userContent = el("prompt").value.trim();
    state.chatMessages.push({ role: "user", content: userContent });
    state.chatMessages.push({ role: "assistant pending", content: "正在思考..." });
    renderChatSurface();
    saveChatMessages();
    try {
      const payload = await createChatCompletion();
      const answer = payload.choices?.[0]?.message?.content || JSON.stringify(payload);
      state.chatMessages = state.chatMessages.filter((message) => message.role !== "assistant pending");
      state.chatMessages.push({ role: "assistant", content: answer });
      saveChatMessages();
      renderChatSurface();
      return {
        id: payload.id || `chat_${Date.now()}`,
        object: "chat.completion",
        model: state.selectedModel.name,
        status: "completed",
        progress: 100,
        kind: "chat",
        prompt: userContent,
        answer,
        created_at: Date.now()
      };
    } catch (error) {
      state.chatMessages = state.chatMessages.filter((message) => message.role !== "assistant pending");
      state.chatMessages.push({ role: "assistant error", content: error.message });
      saveChatMessages();
      renderChatSurface();
      return {
        id: `chat_error_${Date.now()}`,
        object: "chat.completion",
        model: state.selectedModel.name,
        status: "error",
        progress: 100,
        kind: "chat",
        prompt: userContent,
        answer: error.message,
        error: error.message,
        created_at: Date.now()
      };
    }
  }
  if (state.selectedModel.category === "image") return createNanoBananaImage();
  throw new Error("当前功能暂未接入提交接口。");
}

async function runHealthChecks() {
  const selected = Array.from(document.querySelectorAll('input[name="modalHealthCheck"]:checked')).map((input) => input.value);
  if (!selected.length) throw new Error("请至少选择一个检测项目");
  const bases = [PRIMARY_API_BASE_URL];
  const checks = [];
  bases.forEach((baseUrl) => {
    getModelsForHealthCheck(selected).forEach((model) => checks.push(runModuleHealthCheck(model, baseUrl)));
  });
  const results = await Promise.all(checks);
  return results;
}

async function runInlineHealthCheck() {
  const models = getModelsForInlineHealthCheck();
  if (!models.length) throw new Error("当前分类没有可检测模块");
  const results = [];
  state.inlineHealth = {
    status: "running",
    category: state.activeCategory,
    results,
    currentModel: models[0].name,
    total: models.length,
    completed: 0
  };
  renderModels();
  for (const model of models) {
    state.inlineHealth.currentModel = model.name;
    renderModels();
    const result = await runModuleHealthCheck(model, PRIMARY_API_BASE_URL);
    results.push(result);
    state.inlineHealth.completed = results.length;
    renderModels();
  }
  state.lastHealthResults = results;
  return results;
}

function getModelsForInlineHealthCheck() {
  return state.models
    .filter((model) => !isSoraModel(model))
    .filter((model) => !state.removedModules.includes(model.name))
    .filter((model) => state.activeCategory === "all" || model.category === state.activeCategory)
    .sort((a, b) => getCategoryRank(a.category) - getCategoryRank(b.category));
}

function getModelsForHealthCheck(selected) {
  const picked = new Map();
  if (selected.includes("current")) picked.set(state.selectedModel.name, state.selectedModel);
  ["video", "image", "chat"].forEach((category) => {
    if (!selected.includes(category)) return;
    state.models
      .filter((model) => !isSoraModel(model))
      .filter((model) => !state.removedModules.includes(model.name))
      .filter((model) => model.category === category)
      .forEach((model) => picked.set(model.name, model));
  });
  return Array.from(picked.values());
}

async function runModuleHealthCheck(model, baseUrl) {
  const spec = getModuleEndpointSpec(model);
  const endpoint = `${getBaseLabel(baseUrl)} · ${spec.method} ${spec.endpoint}`;
  if (!spec.ready) {
    return {
      ok: false,
      removable: true,
      indeterminate: false,
      type: model.category,
      label: model.name,
      modelName: model.name,
      endpoint,
      detail: spec.detail
    };
  }
  try {
    const response = await probeModuleEndpoint(baseUrl, spec);
    const reachable = isReachableProbeStatus(response.status);
    return {
      ok: reachable,
      removable: !reachable,
      indeterminate: false,
      type: model.category,
      label: model.name,
      modelName: model.name,
      endpoint,
      detail: reachable
        ? `${spec.detail}；接口探测 HTTP ${response.status}，未携带令牌，不会创建任务`
        : `${spec.detail}；接口探测 HTTP ${response.status}`
    };
  } catch (error) {
    return {
      ok: false,
      removable: false,
      indeterminate: true,
      type: model.category,
      label: model.name,
      modelName: model.name,
      endpoint,
      detail: error.message === "Failed to fetch"
        ? "浏览器无法访问该线路，可能是网络、跨域或线路不可达；未确认模块失败"
        : `${error.message}；未确认模块失败`
    };
  }
}

function probeModuleEndpoint(baseUrl, spec) {
  return fetch(`${baseUrl}${spec.endpoint}`, {
    method: spec.method,
    headers: { "Content-Type": "application/json" },
    body: spec.method === "POST" ? "{}" : undefined
  });
}

function isReachableProbeStatus(status) {
  return [200, 400, 401, 403, 422, 429].includes(status);
}

function getBaseLabel(baseUrl) {
  const labels = {
    [PRIMARY_API_BASE_URL]: "国内大带宽"
  };
  return labels[baseUrl] || "当前线路";
}

function getModuleEndpointSpec(model) {
  const name = model.name.toLowerCase();
  if (model.category === "video") {
    return {
      method: "POST",
      endpoint: "/v1/videos",
      ready: true,
      detail: "创建接口 /v1/videos，进度查询 /v1/videos/{id}，安全检测未创建任务"
    };
  }
  if (model.category === "chat") {
    return {
      method: "POST",
      endpoint: "/v1/chat/completions",
      ready: true,
      detail: "聊天接口 messages + model 已配置，安全检测未发送对话"
    };
  }
  if (name.startsWith("gemini-")) {
    return {
      method: "POST",
      endpoint: `/v1beta/models/${model.name}:generateContent`,
      ready: true,
      detail: "Gemini banana generateContent 字段已配置，安全检测未生成图片"
    };
  }
  if (name.includes("banana")) {
    return {
      method: "POST",
      endpoint: "/v1/images/generations",
      ready: true,
      detail: "nano banana 图片字段已配置，安全检测未生成图片"
    };
  }
  return {
    method: "POST",
    endpoint: "未配置",
    ready: false,
    detail: "该模块缺少明确创建接口文档或尚未接入"
  };
}

async function createNanoBananaImage() {
  const model = state.selectedModel.name;
  const prompt = el("prompt").value.trim();
  const imageUrls = parseImageUrls();

  if (model.startsWith("gemini-")) {
    return createGeminiBananaImage(model, prompt, imageUrls);
  }

  if (model.includes("banana-2")) {
    const payload = {
      prompt,
      model,
      aspect_ratio: el("imageAspectRatio").value,
      response_format: "url",
      image: imageUrls,
      image_size: el("imageSize").value
    };
    const response = await apiFetch("/v1/images/generations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!response.ok) throw new Error(await buildApiErrorMessage(response, "图片生成"));
    return normalizeImageResponse(await response.json(), model);
  }

  const payload = {
    prompt,
    model,
    size: aspectRatioToSize(el("imageAspectRatio").value),
    image: imageUrls
  };
  const response = await apiFetch("/v1/images/generations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!response.ok) throw new Error(await buildApiErrorMessage(response, "图片生成"));
  return normalizeImageResponse(await response.json(), model);
}

async function createGeminiBananaImage(model, prompt, imageUrls) {
  const parts = [{ text: prompt }];
  imageUrls.forEach((url) => parts.push({ fileData: { mimeType: guessMimeType(url), fileUri: url } }));
  const payload = {
    systemInstruction: { parts: [{ text: "Return an image only." }] },
    contents: [{ role: "user", parts }],
    generationConfig: {
      responseModalities: ["IMAGE"],
      imageConfig: { aspectRatio: el("imageAspectRatio").value }
    }
  };
  const response = await apiFetch(`/v1beta/models/${model}:generateContent`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!response.ok) throw new Error(await buildApiErrorMessage(response, "Gemini 图片生成"));
  return normalizeImageResponse(await response.json(), model);
}

function parseImageUrls() {
  return el("imageUrls").value
    .split(/\n|,/)
    .map((url) => url.trim())
    .filter(Boolean);
}

function aspectRatioToSize(ratio) {
  const sizes = {
    "16:9": "1920x1080",
    "9:16": "1080x1920",
    "1:1": "1080x1080",
    "4:3": "1440x1080",
    "3:4": "1080x1440",
    "21:9": "2100x900"
  };
  return sizes[ratio] || "1080x1080";
}

function guessMimeType(url) {
  const lower = url.toLowerCase();
  if (lower.includes(".jpg") || lower.includes(".jpeg")) return "image/jpeg";
  if (lower.includes(".webp")) return "image/webp";
  return "image/png";
}

function normalizeImageResponse(payload, model) {
  const markdownImage = payload.candidates?.[0]?.content?.parts?.find((part) => part.text)?.text || "";
  const markdownUrl = markdownImage.match(/!\[[^\]]*]\(([^)]+)\)/)?.[1];
  const imageUrl = payload.data?.[0]?.url || payload.data?.[0]?.b64_json || markdownUrl || "";
  return {
    id: payload.id || `image_${Date.now()}`,
    object: "image",
    model,
    status: "completed",
    progress: 100,
    kind: "image",
    imageUrl,
    answer: imageUrl ? "" : JSON.stringify(payload),
    created_at: Date.now()
  };
}

async function pollTask(taskId) {
  const tick = async () => {
    try {
      const response = await apiFetch(`/v1/videos/${taskId}`, { headers: { "Content-Type": "application/json" } });
      if (!response.ok) throw new Error(await buildApiErrorMessage(response, "视频查询"));
      const payload = await response.json();
      const normalized = normalizeVideoTaskPayload(payload);
      state.tasks = state.tasks.map((task) => task.id === taskId ? { ...task, ...normalized } : task);
      renderTasks();
      if (!["completed", "succeeded", "error", "failed"].includes(String(normalized.status || "").toLowerCase())) setTimeout(tick, 4500);
    } catch (error) {
      markTaskError(taskId, error.message);
    }
  };
  setTimeout(tick, 1800);
}

function normalizeVideoTaskPayload(payload) {
  const url = payload.url || payload.video_url || payload.videoUrl || payload.output?.url || payload.output?.video_url || payload.data?.url || payload.data?.video_url || "";
  const poster = payload.poster || payload.cover_url || payload.coverUrl || payload.thumbnail || payload.output?.cover_url || payload.output?.thumbnail || "";
  const rawStatus = String(payload.status || payload.state || "").toLowerCase();
  const status = ["completed", "succeeded"].includes(rawStatus) || url
    ? "completed"
    : ["failed", "error"].includes(rawStatus)
      ? "error"
      : ["queued", "pending", "submitted"].includes(rawStatus)
        ? "queued"
        : "processing";
  const progress = Number(payload.progress ?? payload.metadata?.progress ?? (status === "completed" ? 100 : status === "queued" ? 0 : 55)) || 0;
  return {
    ...payload,
    kind: "video",
    status,
    progress,
    url,
    poster,
    error: payload.error || payload.error_message || payload.message || "",
    error_detail: payload.detail || payload.status_text || "",
    created_at: payload.created_at || payload.createdAt || Date.now()
  };
}

function bindEvents() {
  document.querySelectorAll(".mode[data-mode]").forEach((button) => {
    button.addEventListener("click", () => setAppMode(button.dataset.mode));
  });
  el("publicSquareLink").addEventListener("click", (event) => {
    event.preventDefault();
    setAppMode("square");
  });
  window.addEventListener("hashchange", applyInitialRoute);
  el("squareTagList").addEventListener("click", (event) => {
    const tagButton = event.target.closest("[data-square-tag]");
    if (!tagButton) return;
    state.galleryTag = tagButton.dataset.squareTag;
    state.galleryDetailId = null;
    closeGalleryPreview();
    renderSquareFilters();
    renderGallery();
  });
  document.querySelectorAll(".gallery-tab").forEach((button) => {
    button.addEventListener("click", () => {
      state.galleryFilter = button.dataset.galleryFilter;
      state.galleryTag = "全部";
      state.galleryDetailId = null;
      closeGalleryPreview();
      document.querySelectorAll(".gallery-tab").forEach((item) => item.classList.toggle("active", item === button));
      renderSquareFilters();
      renderGallery();
    });
  });
  el("squareSearchConfirm").addEventListener("click", renderGallery);
  el("squareTagSearch").addEventListener("keydown", (event) => {
    if (event.key === "Enter") renderGallery();
  });
  el("galleryMasonry").addEventListener("click", (event) => {
    const useButton = event.target.closest(".gallery-use");
    if (useButton) {
      useGalleryPrompt(useButton.dataset.galleryPrompt || "", useButton.dataset.galleryType || "image");
      return;
    }
    if (event.target.closest("a")) return;
    const card = event.target.closest("[data-gallery-id]");
    if (!card) return;
    openGalleryPreview(card.dataset.galleryId);
  });
  el("galleryMasonry").addEventListener("pointerover", handleGalleryVideoHover);
  el("galleryMasonry").addEventListener("pointerout", handleGalleryVideoLeave);
  el("galleryMasonry").addEventListener("keydown", (event) => {
    if (!["Enter", " "].includes(event.key)) return;
    const card = event.target.closest("[data-gallery-id]");
    if (!card) return;
    event.preventDefault();
    openGalleryPreview(card.dataset.galleryId);
  });
  el("galleryPreviewOverlay").addEventListener("click", (event) => {
    const detailTarget = event.target.closest("[data-preview-detail]");
    if (detailTarget) {
      openGalleryDetail(detailTarget.dataset.previewDetail);
      return;
    }
    if (event.target.closest("[data-preview-close]")) closeGalleryPreview();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && state.galleryPreviewId) closeGalleryPreview();
  });
  el("galleryDetail").addEventListener("click", (event) => {
    if (event.target.closest("#detailBack")) {
      state.galleryDetailId = null;
      renderGallery();
      return;
    }
    const useButton = event.target.closest(".gallery-use");
    if (!useButton) return;
    useGalleryPrompt(useButton.dataset.galleryPrompt || "", useButton.dataset.galleryType || "image");
  });
  function useGalleryPrompt(prompt, kind = "image") {
    setAppMode("models");
    const preferredCategory = kind === "video" ? "video" : "image";
    const preferredModel = state.models.find((model) => model.category === preferredCategory)
      || state.models.find((model) => model.category === "image");
    if (preferredModel) {
      state.selectedModel = preferredModel;
      setActiveCategory(preferredCategory);
      renderSelection();
    }
    el("prompt").value = prompt;
    el("prompt").focus();
  }
  el("openConfig").addEventListener("click", () => {
    el("apiKey").value = state.config.apiKey;
    el("configDialog").showModal();
  });

  el("saveConfig").addEventListener("click", saveConfig);
  el("testConfig").addEventListener("click", async () => {
    saveConfig();
    try {
      await refreshPricing();
      await refreshBilling();
      alert("连接成功，模型价格已刷新");
    } catch (error) {
      alert(error.message);
    }
  });

  el("refreshBilling").addEventListener("click", async () => {
    try {
      await refreshPricing();
      await refreshBilling();
    } catch (error) {
      alert(error.message);
    }
  });

  el("modelSearch").addEventListener("input", renderModels);
  el("healthToolButton").addEventListener("click", async () => {
    const button = el("healthToolButton");
    button.disabled = true;
    state.inlineHealth = { status: "running", category: state.activeCategory, results: [], currentModel: null, total: 0, completed: 0 };
    renderHealthToolCard();
    try {
      const results = await runInlineHealthCheck();
      state.inlineHealth = { status: "done", category: state.activeCategory, results, currentModel: null, total: results.length, completed: results.length };
    } catch (error) {
      state.inlineHealth = { status: "error", category: state.activeCategory, results: [], currentModel: null, total: 0, completed: 0, message: error.message };
    } finally {
      button.disabled = false;
      renderModels();
    }
  });
  el("runHealthCheckButton").addEventListener("click", async () => {
    const button = el("runHealthCheckButton");
    button.disabled = true;
    el("healthSummary").innerHTML = `<div class="summary-pill"><strong>检测中</strong><span>正在检查接口状态</span></div>`;
    el("healthResults").innerHTML = "";
    try {
      const results = await runHealthChecks();
      state.lastHealthResults = results;
      renderHealthDialog(results);
    } catch (error) {
      el("healthSummary").innerHTML = `<div class="summary-pill"><strong>失败</strong><span>${escapeHtml(error.message)}</span></div>`;
    } finally {
      button.disabled = false;
    }
  });
  el("removeFailedModulesButton").addEventListener("click", removeFailedModules);
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => setActiveCategory(tab.dataset.category));
  });

  el("modelList").addEventListener("click", (event) => {
    const card = event.target.closest(".model-card");
    if (!card) return;
    state.selectedModel = state.models.find((model) => model.name === card.dataset.model);
    renderModels();
    renderSelection();
  });
  el("roleAvatarGrid").addEventListener("click", (event) => {
    const button = event.target.closest(".role-avatar");
    if (!button) return;
    const role = systemRolePresets.find((item) => item.id === button.dataset.roleId);
    if (!role) return;
    el("systemPrompt").value = role.prompt;
    renderRoleAvatars();
  });
  el("systemPrompt").addEventListener("input", () => {
    renderRoleAvatars();
  });
  el("newChatButton").addEventListener("click", () => {
    state.chatMessages = [];
    saveChatMessages();
    renderChatSurface();
  });
  el("clearChatButton").addEventListener("click", () => {
    state.chatMessages = [];
    state.tasks = state.tasks.filter((task) => task.kind !== "chat");
    saveChatMessages();
    saveTasks();
    renderChatSurface();
    renderTasks();
  });
  el("prompt").addEventListener("keydown", (event) => {
    if (state.selectedModel.category !== "chat") return;
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      el("featureForm").requestSubmit();
    }
  });

  document.querySelectorAll(".chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      document.querySelectorAll(".chip").forEach((item) => item.classList.remove("active"));
      chip.classList.add("active");
      state.size = chip.dataset.size;
    });
  });

  el("decreaseCount").addEventListener("click", () => {
    state.count = Math.max(1, state.count - 1);
    el("generationCount").textContent = state.count;
    renderSelection();
  });

  el("increaseCount").addEventListener("click", () => {
    state.count = Math.min(4, state.count + 1);
    el("generationCount").textContent = state.count;
    renderSelection();
  });

  el("clearDone").addEventListener("click", () => {
    state.tasks = state.tasks.filter((task) => getTaskStatus(task).className !== "completed");
    saveTasks();
    renderTasks();
  });

  el("workspaceAssetTabs").addEventListener("click", (event) => {
    const button = event.target.closest("[data-workspace-filter]");
    if (!button || button.disabled) return;
    state.workspaceFilter = button.dataset.workspaceFilter;
    renderTasks();
  });
  document.querySelector(".workspace-view-toggle").addEventListener("click", (event) => {
    const button = event.target.closest("[data-workspace-view]");
    if (!button) return;
    state.workspaceView = button.dataset.workspaceView;
    renderTasks();
  });

  el("downloadVideos").addEventListener("click", () => batchDownload("video"));
  el("downloadImages").addEventListener("click", () => batchDownload("image"));
  el("previewDownload").addEventListener("click", () => {
    if (state.previewItem) downloadMedia(state.previewItem);
  });

  el("videoResultGrid").addEventListener("click", handleResultClick);
  el("imageResultGrid").addEventListener("click", handleResultClick);
  el("chatResultGrid").addEventListener("click", handleResultClick);
  el("videoResultGrid").addEventListener("pointerover", handleHistoryVideoHover);
  el("videoResultGrid").addEventListener("pointerout", handleHistoryVideoLeave);
  el("previewZoomIn").addEventListener("click", () => zoomPreview(1.2));
  el("previewZoomOut").addEventListener("click", () => zoomPreview(1 / 1.2));
  el("previewZoomReset").addEventListener("click", resetPreviewZoom);
  bindPreviewGestures();

  el("featureForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const button = event.submitter;
    button.disabled = true;
    try {
      for (let i = 0; i < state.count; i += 1) {
        const localTask = createLocalPendingTask();
        state.tasks.unshift(localTask);
        saveTasks();
        renderTasks();
        const task = await createFeatureTask();
        const taskId = replaceTaskId(localTask.id, { ...task, status: task.status || "queued", progress: task.progress || 0 });
        if (state.selectedModel.category === "video") pollTask(taskId);
      }
    } catch (error) {
      alert(error.message);
      const firstPending = state.tasks.find((task) => String(task.id).startsWith("local_") && task.status === "queued");
      if (firstPending) markTaskError(firstPending.id, error.message);
    } finally {
      button.disabled = false;
    }
  });
}

function handleGalleryVideoHover(event) {
  const card = event.target.closest(".gallery-card");
  if (!card || !event.currentTarget.contains(card)) return;
  if (event.relatedTarget && card.contains(event.relatedTarget)) return;
  const video = card.querySelector(".gallery-card-media video");
  if (!video) return;
  video.muted = true;
  video.play().catch(() => {});
}

function handleGalleryVideoLeave(event) {
  const card = event.target.closest(".gallery-card");
  if (!card || !event.currentTarget.contains(card)) return;
  if (event.relatedTarget && card.contains(event.relatedTarget)) return;
  const video = card.querySelector(".gallery-card-media video");
  if (!video) return;
  video.pause();
  try {
    video.currentTime = 0;
  } catch {
    // Some remote videos do not allow seeking before metadata is ready.
  }
}

function renderHealthDialog(results) {
  state.lastHealthResults = results;
  const remainingFailed = getRemainingFailedModuleNames(results);
  el("removeFailedModulesButton").disabled = !remainingFailed.size;
  if (!results.length) {
    el("healthSummary").innerHTML = `
      <div class="summary-pill"><strong>-</strong><span>尚未检测</span></div>
      <div class="summary-pill"><strong>-</strong><span>通过</span></div>
      <div class="summary-pill"><strong>-</strong><span>失败</span></div>
    `;
    el("healthResults").innerHTML = `<div class="health-row"><b>等待开始</b><div><strong>选择检测项目后点击开始检测</strong><p>不会创建付费生成任务</p></div><span class="health-status">待检测</span></div>`;
    return;
  }
  const okCount = results.filter((item) => item.ok).length;
  const unknownCount = results.filter((item) => item.indeterminate).length;
  const removedCount = results.filter((item) => state.removedModules.includes(item.modelName || item.label)).length;
  el("healthSummary").innerHTML = `
    <div class="summary-pill"><strong>${results.length}</strong><span>检测项</span></div>
    <div class="summary-pill"><strong>${okCount}</strong><span>通过</span></div>
    <div class="summary-pill"><strong>${unknownCount}</strong><span>未确认</span></div>
    <div class="summary-pill"><strong>${remainingFailed.size}</strong><span>可删除失败模块</span></div>
    ${removedCount ? `<div class="summary-pill"><strong>${removedCount}</strong><span>已隐藏失败记录</span></div>` : ""}
  `;
  el("healthResults").innerHTML = results.map((item) => `
    <div class="health-row ${getHealthResultClass(item)} ${state.removedModules.includes(item.modelName || item.label) ? "removed" : ""}">
      <b>${escapeHtml(item.label)}</b>
      <div>
        <strong>${escapeHtml(item.endpoint)}</strong>
        <p>${escapeHtml(item.detail)}</p>
      </div>
      <span class="health-status">${getHealthResultLabel(item)}</span>
    </div>
  `).join("");
}

function getHealthResultClass(item) {
  if (item.ok) return "ok";
  if (item.indeterminate) return "unknown";
  return "fail";
}

function getHealthResultLabel(item) {
  if (state.removedModules.includes(item.modelName || item.label)) return "已删除";
  if (item.ok) return "通过";
  if (item.indeterminate) return "未确认";
  return "失败";
}

function removeFailedModules() {
  const failedNames = getRemainingFailedModuleNames(state.lastHealthResults);
  if (!failedNames.size) {
    alert("没有失败模块可删除");
    return;
  }
  state.removedModules = Array.from(new Set([...state.removedModules, ...failedNames]));
  saveRemovedModules();
  state.models = state.models.filter((model) => !state.removedModules.includes(model.name));
  if (failedNames.has(state.selectedModel.name)) {
    state.selectedModel = state.models[0] || fallbackModels.find((model) => !state.removedModules.includes(model.name)) || fallbackModels[0];
  }
  renderModels();
  renderSelection();
  renderHealthDialog(state.lastHealthResults);
}

function getRemainingFailedModuleNames(results) {
  return new Set(
    results
      .filter((item) => !item.ok)
      .filter((item) => item.removable !== false && !item.indeterminate)
      .map((item) => item.modelName || item.label)
      .filter((name) => !state.removedModules.includes(name))
  );
}

function handleResultClick(event) {
  const muteButton = event.target.closest("[data-toggle-video-muted]");
  if (muteButton) {
    event.stopPropagation();
    state.historyVideoMuted = !state.historyVideoMuted;
    renderTasks();
    return;
  }
  const reuseButton = event.target.closest("[data-reuse-id]");
  if (reuseButton) {
    event.stopPropagation();
    const task = state.tasks.find((item) => item.id === reuseButton.dataset.reuseId);
    if (task) applyTaskPrompt(task);
    return;
  }
  const downloadButton = event.target.closest("[data-download-id]");
  if (downloadButton) {
    event.stopPropagation();
    const task = state.tasks.find((item) => item.id === downloadButton.dataset.downloadId);
    if (task) downloadMedia(task);
    return;
  }
  const tile = event.target.closest("[data-preview-id]");
  if (!tile) return;
  const task = state.tasks.find((item) => item.id === tile.dataset.previewId);
  if (!task || !canOpenTaskPreview(task)) return;
  openPreview(task);
}

function canOpenTaskPreview(task) {
  return Boolean(getTaskVideoUrl(task) || getTaskImageUrl(task) || task.answer);
}

function handleHistoryVideoHover(event) {
  const tile = event.target.closest(".video-preview-tile");
  if (!tile || !event.currentTarget.contains(tile)) return;
  if (event.relatedTarget && tile.contains(event.relatedTarget)) return;
  const video = tile.querySelector("video");
  if (!video) return;
  video.muted = state.historyVideoMuted;
  video.play().catch(() => {});
}

function handleHistoryVideoLeave(event) {
  const tile = event.target.closest(".video-preview-tile");
  if (!tile || !event.currentTarget.contains(tile)) return;
  if (event.relatedTarget && tile.contains(event.relatedTarget)) return;
  const video = tile.querySelector("video");
  if (!video) return;
  video.pause();
  try {
    video.currentTime = 0;
  } catch {
    // Some remote videos do not allow seeking before metadata is ready.
  }
}

function openPreview(task) {
  if (!canOpenTaskPreview(task)) return;
  const videoUrl = getTaskVideoUrl(task);
  const imageUrl = getTaskImageUrl(task);
  state.previewItem = { ...task, url: videoUrl, imageUrl };
  resetPreviewZoom();
  el("previewTitle").textContent = videoUrl ? "视频预览" : imageUrl ? "图片预览" : "聊天预览";
  el("previewBody").innerHTML = videoUrl
    ? `<video src="${videoUrl}" controls autoplay ${state.historyVideoMuted ? "muted" : ""}></video>`
    : imageUrl
      ? `<img class="zoomable-preview" src="${imageUrl}" alt="生成图片" />`
      : `<article class="preview-text">${escapeHtml(task.answer || "")}</article>`;
  document.querySelectorAll("#previewZoomIn, #previewZoomOut, #previewZoomReset").forEach((button) => {
    button.classList.toggle("hidden", !imageUrl);
  });
  el("previewDownload").classList.toggle("hidden", !videoUrl && !imageUrl);
  el("previewDialog").showModal();
}

function zoomPreview(multiplier) {
  if (!state.previewItem?.imageUrl) return;
  state.preview.scale = Math.max(0.35, Math.min(6, state.preview.scale * multiplier));
  applyPreviewTransform();
}

function resetPreviewZoom() {
  state.preview = { scale: 1, x: 0, y: 0 };
  applyPreviewTransform();
}

function applyPreviewTransform() {
  const body = el("previewBody");
  body.style.setProperty("--preview-scale", state.preview.scale);
  body.style.setProperty("--preview-x", `${state.preview.x}px`);
  body.style.setProperty("--preview-y", `${state.preview.y}px`);
  if (el("previewZoomReset")) el("previewZoomReset").textContent = `${Math.round(state.preview.scale * 100)}%`;
}

function bindPreviewGestures() {
  const body = el("previewBody");
  let dragging = false;
  let last = null;

  body.addEventListener("wheel", (event) => {
    if (!state.previewItem?.imageUrl) return;
    event.preventDefault();
    zoomPreview(Math.exp(-event.deltaY * 0.002));
  }, { passive: false });

  body.addEventListener("pointerdown", (event) => {
    if (!state.previewItem?.imageUrl) return;
    dragging = true;
    last = { x: event.clientX, y: event.clientY };
    body.classList.add("dragging");
    body.setPointerCapture(event.pointerId);
  });

  body.addEventListener("pointermove", (event) => {
    if (!dragging || !last) return;
    state.preview.x += event.clientX - last.x;
    state.preview.y += event.clientY - last.y;
    last = { x: event.clientX, y: event.clientY };
    applyPreviewTransform();
  });

  ["pointerup", "pointercancel", "pointerleave"].forEach((type) => {
    body.addEventListener(type, (event) => {
      dragging = false;
      last = null;
      body.classList.remove("dragging");
      tryReleasePointer(body, event.pointerId);
    });
  });
}

function batchDownload(kind) {
  const items = state.tasks.filter((task) => kind === "video" ? task.url : task.imageUrl);
  if (!items.length) {
    alert(kind === "video" ? "暂无可下载视频" : "暂无可下载图片");
    return;
  }
  items.forEach((task, index) => {
    setTimeout(() => downloadMedia(task), index * 250);
  });
}

function downloadMedia(task) {
  const url = task.url || task.imageUrl;
  if (!url) return;
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = buildDownloadName(task, url);
  anchor.target = "_blank";
  anchor.rel = "noopener";
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
}

function buildDownloadName(task, url) {
  const extension = getUrlExtension(url, task.url ? "mp4" : "png");
  const prefix = task.url ? "video" : "image";
  return `${prefix}_${task.model || "result"}_${task.id}.${extension}`.replace(/[^\w.-]+/g, "_");
}

function getUrlExtension(url, fallback) {
  try {
    const pathname = new URL(url).pathname;
    const extension = pathname.split(".").pop();
    return extension && extension.length <= 5 ? extension : fallback;
  } catch (_) {
    return fallback;
  }
}

bindEvents();
bindCanvasGestures();
renderModels();
renderSelection();
renderTasks();
renderCanvasTransform();
renderNodePositions();
renderSquareFilters();
applyInitialRoute();
