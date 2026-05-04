const API_CONFIG_KEY = "lingyu-api-config";
const REMOVED_MODULES_KEY = "tuzi-removed-modules";
const SAVED_TASKS_KEY = "tuzi-saved-results";
const SAVED_DRAGGED_ITEMS_KEY = "tuzi-dragged-items";

const fallbackModels = [
  { name: "veo_3_1-fast", description: "视频生成 · 任务轮询 · 画布工作流", category: "video", tags: "视频", price: 0.19, ratio: 1, group: "default" },
  { name: "veo_3_1-4K", description: "视频生成 · 4K 输出 · 画布管理", category: "video", tags: "视频", price: 1, ratio: 1, group: "default" },
  { name: "openai-chat", description: "聊天对话 · 多轮上下文 · 流式回复", category: "chat", tags: "聊天", price: 0, ratio: 1, group: "default" },
  { name: "gpt-5.2-codex", description: "代码助手 · 推理工具 · 多模态理解", category: "chat", tags: "聊天", price: 0, ratio: 0.875, group: "cx" },
  { name: "nano_banana_pro", description: "香蕉 nano · 文/图生图 · 返回图片 URL", category: "image", tags: "图片", price: 0.21, ratio: 1, group: "default" },
  { name: "nano-banana-2", description: "香蕉 2 · 多图 URL · 1K/2K/4K 输出", category: "image", tags: "图片", price: 0.21, ratio: 1, group: "default" },
  { name: "gemini-3.1-flash-image-preview-1k", description: "Gemini 香蕉 · generateContent 图片输出", category: "image", tags: "图片", price: 0.21, ratio: 1, group: "default" },
  { name: "vision-model", description: "图片理解 · 视觉分析 · 多模态输入", category: "image", tags: "图片", price: 0, ratio: 0.5, group: "default" }
];

const featureCopy = {
  video: {
    titlePrefix: "当前视频模型",
    note: "veo 有效期约6小时，请生成后尽快下载。",
    promptLabel: "视频提示词",
    placeholder: "描述镜头、主体、动作、风格、光线和转场...",
    submit: "开始生成",
    queue: "视频任务队列",
    result: "视频结果"
  },
  chat: {
    titlePrefix: "当前聊天模型",
    note: "调用 /v1/chat/completions，按 OpenAI messages 格式提交。",
    promptLabel: "对话内容",
    placeholder: "输入你想让模型回答、改写、分析或执行的内容...",
    submit: "发送消息",
    queue: "聊天调用记录",
    result: "聊天结果"
  },
  image: {
    titlePrefix: "当前图片模型",
    note: "nano banana 已接入 /v1/images/generations；参考图需使用公开 URL。",
    promptLabel: "图片提示词",
    placeholder: "描述画面主体、构图、风格、材质、光线和色彩...",
    submit: "生成图片",
    queue: "图片任务队列",
    result: "图片结果"
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
  "全部", "图片", "视频", "系统生成", "抓取素材", "YouMind", "Nano Banana Pro", "GPT Image 2",
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
  selectedCanvasItem: null,
  previewItem: null,
  preview: { scale: 1, x: 0, y: 0 },
  lastHealthResults: [],
  removedModules: loadRemovedModules(),
  draggedItems: loadSavedDraggedItems(),
  nodePositions: {
    source: { x: 88, y: 72 },
    result: { x: 88, y: 302 }
  },
  canvas: { x: 0, y: 0, zoom: 1 }
};

const el = (id) => document.getElementById(id);

function loadConfig() {
  const saved = localStorage.getItem(API_CONFIG_KEY);
  return saved ? JSON.parse(saved) : { baseUrl: "https://api.yijiarj.cn", apiKey: "" };
}

function saveConfig() {
  state.config = { baseUrl: el("apiBaseUrl").value, apiKey: el("apiKey").value.trim() };
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

function loadSavedDraggedItems() {
  const saved = localStorage.getItem(SAVED_DRAGGED_ITEMS_KEY);
  return saved ? JSON.parse(saved) : {};
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

function saveDraggedItems() {
  try {
    localStorage.setItem(SAVED_DRAGGED_ITEMS_KEY, JSON.stringify(state.draggedItems));
  } catch (error) {
    console.warn("保存画布位置失败", error);
  }
}

async function apiFetch(path, options = {}) {
  if (!state.config.apiKey) throw new Error("请先在设置里填写 API Key");
  const headers = new Headers(options.headers || {});
  headers.set("Authorization", `Bearer ${state.config.apiKey.replace(/^Bearer\s+/i, "")}`);
  return fetch(`${state.config.baseUrl}${path}`, { ...options, headers });
}

function finalPrice(model) {
  return Number((Number(model.price || model.model_price || 0) * Number(model.ratio || 1)).toFixed(4));
}

function normalizePricing(payload) {
  const ratios = payload.group_ratio || {};
  const categoryOrder = { video: 0, chat: 1, image: 2 };
  const remoteModels = (payload.data || [])
    .map((item) => {
      const group = item.enable_groups?.[0] || "default";
      const category = getModelCategory(item);
      return {
        name: item.model_name,
        description: item.description || `${item.tags || "模型"} · ${group}`,
        category,
        tags: item.tags || "视频",
        price: item.model_price || 0,
        ratio: ratios[group] || 1,
        group
      };
    })
    .filter((item) => ["video", "chat", "image"].includes(item.category))
    .filter((item) => !isSoraModel(item))
    .sort((a, b) => categoryOrder[a.category] - categoryOrder[b.category]);
  const videoModels = remoteModels.filter((item) => item.category === "video");
  return videoModels.length >= 2 ? remoteModels : fallbackModels;
}

function isSoraModel(model) {
  const name = String(model.name || model.model_name || "").toLowerCase();
  const group = String(model.group || model.enable_groups?.join(" ") || "").toLowerCase();
  return name.includes("sora") || group.includes("sora");
}

function getModelCategory(item) {
  const tags = String(item.tags || "");
  const name = String(item.model_name || "");
  if (tags.includes("视频") || name.includes("veo") || name.includes("sora") || name.includes("video")) return "video";
  if (tags.includes("绘图") || tags.includes("图片") || name.includes("banana") || name.includes("image") || name.includes("vision")) return "image";
  return "chat";
}

function renderModels() {
  const query = el("modelSearch").value.trim().toLowerCase();
  const list = state.models
    .filter((model) => !isSoraModel(model))
    .filter((model) => !state.removedModules.includes(model.name))
    .filter((model) => state.activeCategory === "all" || model.category === state.activeCategory)
    .filter((model) => `${model.name} ${model.description}`.toLowerCase().includes(query));
  el("modelList").innerHTML = list.map((model) => `
    <button class="model-card ${model.name === state.selectedModel.name ? "active" : ""}" data-model="${model.name}">
      ${renderBrandLogo(model)}
      <span>
        <h3 title="${escapeHtml(model.name)}">${formatModelTitle(model.name)}</h3>
        <p>${getModelCardDescription(model)}</p>
      </span>
      <span class="badge">${finalPrice(model)}</span>
    </button>
  `).join("");
  if (!list.length) {
    el("modelList").innerHTML = `<div class="empty-list">当前分类暂无可用模块</div>`;
  }
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
  const name = String(model.name || "").toLowerCase();
  const group = model.group ? ` · ${model.group}` : "";
  if (model.category === "video") {
    if (name.includes("veo")) return `视频生成 · 图生/文生 · 任务轮询${group}`;
    return `视频创作 · 结果预览 · 批量下载${group}`;
  }
  if (model.category === "image") {
    if (name.includes("banana")) return `图片生成 · 多图参考 · URL 输出${group}`;
    if (name.includes("gemini")) return `Gemini 图片 · 参考图创作${group}`;
    return `图片理解/生成 · 多模态输入${group}`;
  }
  if (model.category === "chat") {
    if (name.includes("codex")) return `代码与推理 · 长上下文 · 工程助手${group}`;
    if (name.includes("deepseek")) return `中文推理 · 数学/代码 · 高性价比${group}`;
    if (name.includes("grok")) return `实时问答 · 创意对话 · 快速响应${group}`;
    if (name.includes("mini")) return `轻量对话 · 快速响应 · 低成本${group}`;
    if (name.includes("gpt")) return `通用对话 · 推理写作 · 多场景${group}`;
    return `聊天对话 · 多轮上下文 · 角色预设${group}`;
  }
  return `模型 · ${model.group || "default"}`;
}

function renderBrandLogo(model) {
  const brand = getModelBrand(model);
  const labels = {
    veo: "V3",
    sora: "S",
    banana: "NB",
    gemini: "G",
    openai: "AI",
    gpt: "GPT",
    vision: "VIS",
    system: "API"
  };
  return `<span class="logo brand-${brand}" aria-label="${labels[brand] || "AI"} logo">
    <span>${labels[brand] || model.name.slice(0, 1).toUpperCase()}</span>
  </span>`;
}

function getModelBrand(model) {
  const name = String(model.name || "").toLowerCase();
  if (name.includes("veo")) return "veo";
  if (name.includes("sora")) return "sora";
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

function renderFeaturePanel() {
  const category = state.selectedModel.category;
  const copy = getCurrentCopy();
  document.querySelector(".app-shell").classList.toggle("chat-layout", category === "chat" && state.activeMode === "models");
  el("promptLabel").innerHTML = `${copy.promptLabel} <b>*</b>`;
  el("prompt").placeholder = copy.placeholder;
  el("submitLabel").textContent = copy.submit;
  el("queueTitle").textContent = copy.queue;
  el("resultTitle").textContent = copy.result;
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
        ${item.type === "video" ? `<video src="${item.url}" controls muted></video>` : `<img src="${item.url}" alt="${escapeHtml(item.title)}" />`}
        <span class="gallery-open-cue">点击预览</span>
      </div>
      <div class="gallery-card-body">
        <div class="gallery-card-meta">
          <span>${escapeHtml(item.modelLabel || item.model || (item.type === "video" ? "视频" : "图片"))}</span>
          <span>${escapeHtml(item.sourceType || "系统生成")}</span>
        </div>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.author ? `作者：${item.author}` : "作者：当前用户")}</p>
        <div class="gallery-card-tags">${item.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div>
        <div class="gallery-card-actions">
          <button type="button" class="gallery-use" data-gallery-prompt="${escapeHtml(item.prompt || item.title)}">使用提示词</button>
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
            ${item.type === "video" ? `<video src="${item.url}" controls></video>` : `<img src="${item.url}" alt="${escapeHtml(item.title)}" />`}
          </figure>
          <section class="detail-prompt-block">
            <header>
              <h2>提示词</h2>
              <button type="button" class="gallery-use" data-gallery-prompt="${escapeHtml(prompt)}">使用提示词</button>
            </header>
            <pre>${escapeHtml(prompt)}</pre>
          </section>
        </section>
        <aside class="detail-aside">
          <div class="detail-author">
            <small>作者</small>
            <span>${escapeHtml(item.author || "当前用户")}</span>
            <strong>${escapeHtml(item.sourceName || item.sourceType || "系统生成")}</strong>
          </div>
          <dl>
            <div><dt>模型</dt><dd>${escapeHtml(item.modelLabel || item.model || "未标记")}</dd></div>
            <div><dt>类型</dt><dd>${escapeHtml(item.sourceType || "系统生成")}</dd></div>
            <div><dt>发布时间</dt><dd>${escapeHtml(item.publishedAt || "本地生成")}</dd></div>
            <div><dt>原始语言</dt><dd>ZH</dd></div>
          </dl>
          <div class="detail-tags">${item.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div>
          <div class="detail-actions">
            <button type="button" class="gallery-use" data-gallery-prompt="${escapeHtml(prompt)}">使用提示词</button>
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
        ${item.type === "video" ? `<video src="${item.url}" controls autoplay muted playsinline></video>` : `<img src="${item.url}" alt="${escapeHtml(item.title)}" />`}
      </div>
      <div class="gallery-preview-caption">
        <strong>${escapeHtml(item.title)}</strong>
        <span>再次点击图片进入详情页</span>
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
    .filter((task) => task.url || task.imageUrl)
    .map((task) => {
      const type = task.url ? "video" : "image";
      const tags = getGalleryTags(task, type);
      return {
        id: task.id || `system-${task.created_at || task.url || task.imageUrl}`,
        type,
        url: task.url || task.imageUrl,
        title: task.prompt || (type === "video" ? "未命名视频作品" : "未命名图片作品"),
        prompt: task.prompt || "",
        sourceType: "系统生成",
        author: "当前用户",
        model: task.model || state.selectedModel?.name || "",
        modelLabel: formatModelTitle(task.model || state.selectedModel?.name || ""),
        tags: Array.from(new Set([...tags, "系统生成"])),
        createdAt: task.created_at || 0
      };
    });
  const scrapedItems = state.externalPrompts.map((item) => ({
    ...item,
    tags: Array.from(new Set([...(Array.isArray(item.tags) ? item.tags : getGalleryTags(item, item.type || "image")), "抓取素材"])),
    sourceType: item.sourceType || "抓取",
    createdAt: item.createdAt || 0
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
  return Array.from(new Set(base));
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

function renderWorkspaceForFeature() {
  const category = state.selectedModel.category;
  el("canvasWorkspace").classList.toggle("history-card-workspace", ["video", "image"].includes(category));
  const resultNode = document.querySelector(".result-node");
  resultNode.classList.toggle("video-workspace", category === "video");
  resultNode.classList.toggle("image-workspace", category === "image");
  resultNode.classList.toggle("chat-workspace", category === "chat");
  document.querySelector(".source-node").classList.toggle("chat-workspace", category === "chat");
  document.querySelector("#videoResultGrid").closest("section").classList.toggle("hidden", category !== "video");
  document.querySelector("#imageResultGrid").closest("section").classList.toggle("hidden", category !== "image");
  document.querySelector("#chatResultGrid").closest("section").classList.toggle("hidden", category !== "chat");
  el("downloadVideos").classList.toggle("hidden", category !== "video");
  el("downloadImages").classList.toggle("hidden", category !== "image");
  renderTasks();
}

function renderChatSurface() {
  const messages = state.chatMessages.length
    ? state.chatMessages
    : [{ role: "assistant", content: `你好，我是 ${state.selectedModel.name}。可以直接像 GPT 一样和我对话。` }];
  el("chatMessages").innerHTML = messages.map((message) => `
    <div class="chat-bubble ${message.role.replace(/\s+/g, " ")}">${escapeHtml(message.content)}</div>
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
    .filter((model) => category === "all" || model.category === category);
  if (visibleModels.length && !visibleModels.some((model) => model.name === state.selectedModel.name)) {
    state.selectedModel = visibleModels[0];
    renderSelection();
  }
  renderModels();
}

function renderTasks() {
  saveTasks();
  saveDraggedItems();
  if (state.activeMode === "square") renderGallery();
  const visibleTasks = getWorkspaceTasks();
  el("taskCount").textContent = `${visibleTasks.length} 个${getWorkspaceUnit()}`;
  const placeholders = Array.from({ length: Math.max(16, visibleTasks.length) }, (_, index) => visibleTasks[index]);
  el("taskGrid").innerHTML = state.selectedModel.category === "chat"
    ? renderChatSessionCards(visibleTasks)
    : placeholders.map((task) => {
      if (!task) return `<div class="task-tile">等待任务</div>`;
      const status = getTaskStatus(task);
      const floating = state.draggedItems[task.id];
      return `<button type="button" class="task-tile draggable-data ${status.className} ${floating ? "floating-data" : ""} ${state.selectedCanvasItem === task.id ? "selected" : ""}" data-task-id="${task.id}" style="${floating ? `left:${floating.x}px;top:${floating.y}px;` : ""}">
        <span class="task-model">${task.model || state.selectedModel.name}</span>
        <strong>${status.label}</strong>
        <span>${status.detail}</span>
        <span class="progress-track"><span class="progress-fill" style="width:${status.progress}%"></span></span>
        <span>${status.progress}%</span>
      </button>`;
    }).join("");

  const videos = state.selectedModel.category === "video" ? state.tasks.filter((task) => task.url) : [];
  const images = state.selectedModel.category === "image" ? state.tasks.filter((task) => task.imageUrl) : [];
  const chats = state.selectedModel.category === "chat" ? state.tasks.filter((task) => task.answer) : [];
  el("videoResultGrid").innerHTML = renderMediaResults(videos, "video");
  el("imageResultGrid").innerHTML = renderMediaResults(images, "image");
  el("chatResultGrid").innerHTML = renderChatResults(chats);
  renderNodePositions();
}

function renderChatSessionCards(items) {
  if (!items.length) {
    return `<div class="chat-session-empty">这里会记录每一次 GPT 对话</div>`;
  }
  return items.slice(0, 8).map((task) => `
    <button type="button" class="chat-session-card draggable-data ${state.selectedCanvasItem === task.id ? "selected" : ""}" data-task-id="${task.id}">
      <strong>${escapeHtml(task.prompt || "用户消息")}</strong>
      <span>${escapeHtml(task.answer || "等待回复")}</span>
    </button>
  `).join("");
}

function getWorkspaceTasks() {
  const category = state.selectedModel.category;
  return state.tasks.filter((task) => (task.kind || inferTaskKind(task)) === category);
}

function inferTaskKind(task) {
  if (task.url) return "video";
  if (task.imageUrl) return "image";
  if (task.answer) return "chat";
  if (String(task.model || "").includes("banana") || String(task.model || "").includes("image")) return "image";
  return "video";
}

function getWorkspaceUnit() {
  const units = { video: "视频任务", image: "图片任务", chat: "聊天记录" };
  return units[state.selectedModel.category] || "任务";
}

function renderMediaResults(items, kind) {
  if (!items.length) {
    if (state.selectedModel.category === "video") {
      return `<div class="result-empty-card">暂无${kind === "video" ? "历史视频" : "历史图片"}<br>生成完成后会自动保存在这里</div>`;
    }
    return Array.from({ length: 4 }, () => `<div class="result-tile"><span class="empty-result">空</span></div>`).join("");
  }
  return items.map((task) => `
    <div class="result-tile draggable-data ${state.selectedCanvasItem === task.id ? "selected" : ""}" role="button" tabindex="0" data-task-id="${task.id}" data-preview-id="${task.id}">
      ${renderResultPreview(task)}
      <span class="media-actions">
        <button type="button" data-download-id="${task.id}">下载</button>
      </span>
    </div>
  `).join("");
}

function renderChatResults(items) {
  if (!items.length) {
    return Array.from({ length: 4 }, () => `<div class="result-tile chat-result-card"><span class="empty-result">空</span></div>`).join("");
  }
  return items.map((task) => `
    <div class="result-tile chat-result-card draggable-data ${state.selectedCanvasItem === task.id ? "selected" : ""}" role="button" tabindex="0" data-task-id="${task.id}" data-preview-id="${task.id}">
      <span class="text-result">${escapeHtml(task.answer)}</span>
    </div>
  `).join("");
}


function renderResultPreview(task) {
  if (task.url) return `<video src="${task.url}" controls></video>`;
  if (task.imageUrl) return `<img src="${task.imageUrl}" alt="生成图片" />`;
  if (task.answer) return `<span class="text-result">${escapeHtml(task.answer)}</span>`;
  return `<span class="empty-result">已完成<br>等待地址</span>`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getTaskStatus(task) {
  const rawStatus = String(task.status || "queued").toLowerCase();
  const progress = Math.max(0, Math.min(100, Number(task.progress || 0)));
  const quality = String(task.quality || "");
  if (rawStatus === "error" || task.error) {
    return { className: "error", label: "制作失败", detail: task.error || "请重试", progress };
  }
  if (quality && quality !== "standard") {
    return { className: "violation", label: "内容异常", detail: quality.slice(0, 12), progress: 100 };
  }
  if (rawStatus === "completed") {
    return { className: "completed", label: task.kind === "chat" ? "回复完成" : "制作完成", detail: task.url || task.answer ? "可预览查看" : "等待结果", progress: 100 };
  }
  if (rawStatus === "processing" || progress > 0) {
    return { className: "processing", label: "制作中", detail: "正在生成视频", progress: progress || 1 };
  }
  if (rawStatus === "queued") {
    return { className: "queued", label: "排队中", detail: "等待开始制作", progress };
  }
  return { className: "processing", label: "同步中", detail: rawStatus, progress };
}

function renderCanvasTransform() {
  const canvas = el("gridCanvas");
  canvas.style.setProperty("--pan-x", `${state.canvas.x}px`);
  canvas.style.setProperty("--pan-y", `${state.canvas.y}px`);
  canvas.style.setProperty("--zoom", state.canvas.zoom);
  el("zoomReadout").textContent = `${Math.round(state.canvas.zoom * 100)}%`;
}

function renderNodePositions() {
  const sourceNode = document.querySelector(".source-node");
  const resultNode = document.querySelector(".result-node");
  if (sourceNode) {
    sourceNode.style.left = `${state.nodePositions.source.x}px`;
    sourceNode.style.top = `${state.nodePositions.source.y}px`;
  }
  if (resultNode) {
    resultNode.style.left = `${state.nodePositions.result.x}px`;
    resultNode.style.top = `${state.nodePositions.result.y}px`;
  }
}

function zoomCanvas(nextZoom, originX, originY) {
  const canvas = el("gridCanvas");
  const rect = canvas.getBoundingClientRect();
  const oldZoom = state.canvas.zoom;
  const zoom = Math.max(0.35, Math.min(2.6, nextZoom));
  const localX = originX - rect.left;
  const localY = originY - rect.top;
  const worldX = (localX - state.canvas.x) / oldZoom;
  const worldY = (localY - state.canvas.y) / oldZoom;
  state.canvas.x = localX - worldX * zoom;
  state.canvas.y = localY - worldY * zoom;
  state.canvas.zoom = zoom;
  renderCanvasTransform();
}

function panCanvas(dx, dy) {
  state.canvas.x += dx;
  state.canvas.y += dy;
  renderCanvasTransform();
}

function bindCanvasGestures() {
  const canvas = el("gridCanvas");
  const pointers = new Map();
  let lastPanPoint = null;
  let pinchStart = null;
  let dragTarget = null;

  canvas.addEventListener("wheel", (event) => {
    if (event.button === 1 || event.ctrlKey || event.metaKey) {
      event.preventDefault();
      zoomCanvas(state.canvas.zoom * Math.exp(-event.deltaY * 0.002), event.clientX, event.clientY);
      return;
    }
    if (event.shiftKey) {
      event.preventDefault();
      panCanvas(-event.deltaY, -event.deltaX);
    }
  }, { passive: false });

  canvas.addEventListener("pointerdown", (event) => {
    if (event.target.closest("[data-download-id]")) return;
    const dataItem = event.target.closest("[data-task-id]");
    if (dataItem && event.button === 0) {
      event.preventDefault();
      canvas.setPointerCapture(event.pointerId);
      state.selectedCanvasItem = dataItem.dataset.taskId;
      const start = clientToWorld(event.clientX, event.clientY);
      dragTarget = {
        kind: "data",
        id: dataItem.dataset.taskId,
        start,
        moved: false,
        offset: getDataDragOffset(dataItem, start)
      };
      renderTasks();
      return;
    }

    if (event.target.closest("button, video, input, textarea, select")) {
      return;
    }
    const node = event.target.closest(".node");
    if (node && event.button === 0) {
      event.preventDefault();
      canvas.setPointerCapture(event.pointerId);
      document.querySelectorAll(".node").forEach((item) => item.classList.remove("selected"));
      node.classList.add("selected");
      const nodeKey = node.classList.contains("source-node") ? "source" : "result";
      const start = clientToWorld(event.clientX, event.clientY);
      dragTarget = {
        kind: "node",
        id: nodeKey,
        start,
        moved: false,
        origin: { ...state.nodePositions[nodeKey] }
      };
      return;
    }
    canvas.setPointerCapture(event.pointerId);
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    const shouldPan = event.button === 1 || pointers.size >= 3;
    if (shouldPan) {
      event.preventDefault();
      lastPanPoint = { x: event.clientX, y: event.clientY };
      canvas.classList.add("panning");
    }
    if (pointers.size === 2) pinchStart = getPinchState(pointers);
  });

  canvas.addEventListener("pointermove", (event) => {
    if (dragTarget) {
      event.preventDefault();
      const point = clientToWorld(event.clientX, event.clientY);
      const dx = point.x - dragTarget.start.x;
      const dy = point.y - dragTarget.start.y;
      dragTarget.moved = dragTarget.moved || Math.abs(dx) + Math.abs(dy) > 2;
      if (dragTarget.kind === "node") {
        state.nodePositions[dragTarget.id] = {
          x: dragTarget.origin.x + dx,
          y: dragTarget.origin.y + dy
        };
        renderNodePositions();
      } else {
        state.draggedItems[dragTarget.id] = {
          x: point.x - dragTarget.offset.x,
          y: point.y - dragTarget.offset.y
        };
        saveDraggedItems();
        renderTasks();
      }
      return;
    }

    if (!pointers.has(event.pointerId)) return;
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (pointers.size === 2 && pinchStart) {
      event.preventDefault();
      const current = getPinchState(pointers);
      zoomCanvas(pinchStart.zoom * (current.distance / pinchStart.distance), current.center.x, current.center.y);
      return;
    }

    if ((event.buttons === 4 || pointers.size >= 3) && lastPanPoint) {
      event.preventDefault();
      panCanvas(event.clientX - lastPanPoint.x, event.clientY - lastPanPoint.y);
      lastPanPoint = { x: event.clientX, y: event.clientY };
    }
  });

  ["pointerup", "pointercancel", "pointerleave"].forEach((type) => {
    canvas.addEventListener(type, (event) => {
      if (dragTarget) {
        dragTarget = null;
        tryReleasePointer(canvas, event.pointerId);
        return;
      }
      pointers.delete(event.pointerId);
      if (pointers.size < 3 && event.buttons !== 4) {
        lastPanPoint = null;
        canvas.classList.remove("panning");
      }
      if (pointers.size !== 2) pinchStart = null;
      if (pointers.size === 2) pinchStart = getPinchState(pointers);
    });
  });

  canvas.addEventListener("auxclick", (event) => {
    if (event.button === 1) event.preventDefault();
  });
}

function clientToWorld(clientX, clientY) {
  const rect = el("gridCanvas").getBoundingClientRect();
  return {
    x: (clientX - rect.left - state.canvas.x) / state.canvas.zoom,
    y: (clientY - rect.top - state.canvas.y) / state.canvas.zoom
  };
}

function getDataDragOffset(dataItem, start) {
  const existing = state.draggedItems[dataItem.dataset.taskId];
  if (existing) return { x: start.x - existing.x, y: start.y - existing.y };
  const rect = dataItem.getBoundingClientRect();
  const canvasRect = el("gridCanvas").getBoundingClientRect();
  const x = (rect.left - canvasRect.left - state.canvas.x) / state.canvas.zoom;
  const y = (rect.top - canvasRect.top - state.canvas.y) / state.canvas.zoom;
  return { x: start.x - x, y: start.y - y };
}

function tryReleasePointer(target, pointerId) {
  try {
    target.releasePointerCapture(pointerId);
  } catch (_) {
    // The pointer may already be released by the browser.
  }
}

function getPinchState(pointers) {
  const points = Array.from(pointers.values()).slice(0, 2);
  const distance = Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y) || 1;
  return {
    distance,
    zoom: state.canvas.zoom,
    center: {
      x: (points[0].x + points[1].x) / 2,
      y: (points[0].y + points[1].y) / 2
    }
  };
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
    created_at: Math.floor(Date.now() / 1000)
  };
}

function replaceTaskId(localId, remoteTask) {
  state.tasks = state.tasks.map((task) => task.id === localId ? { ...task, ...remoteTask, id: remoteTask.id || localId } : task);
  if (state.draggedItems[localId] && remoteTask.id) {
    state.draggedItems[remoteTask.id] = state.draggedItems[localId];
    delete state.draggedItems[localId];
  }
  saveTasks();
  saveDraggedItems();
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
    if (!response.ok) throw new Error(`创建失败：${response.status}`);
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
  if (!response.ok) throw new Error(`创建失败：${response.status}`);
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
  if (!response.ok) throw new Error(getChatErrorMessage(response.status));
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
        answer
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
        error: error.message
      };
    }
  }
  if (state.selectedModel.category === "image") return createNanoBananaImage();
  throw new Error("当前功能暂未接入提交接口。");
}

async function runHealthChecks() {
  const selected = Array.from(document.querySelectorAll('input[name="modalHealthCheck"]:checked')).map((input) => input.value);
  if (!selected.length) throw new Error("请至少选择一个检测项目");
  const bases = el("modalHealthBaseMode").value === "all"
    ? ["https://api.yijiarj.cn", "https://apius.yijiarj.cn", "https://ai.yijiarj.cn"]
    : [state.config.baseUrl];
  const checks = [];
  bases.forEach((baseUrl) => {
    getModelsForHealthCheck(selected).forEach((model) => checks.push(runModuleHealthCheck(model, baseUrl)));
  });
  const results = await Promise.all(checks);
  return results;
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
  const previousBase = state.config.baseUrl;
  try {
    state.config.baseUrl = baseUrl;
    const response = await apiFetch("/api/pricing");
    state.config.baseUrl = previousBase;
    const pricingOk = response.ok;
    const confirmedFailure = pricingOk && !spec.ready;
    return {
      ok: pricingOk && spec.ready,
      removable: confirmedFailure,
      indeterminate: !pricingOk,
      type: model.category,
      label: model.name,
      modelName: model.name,
      endpoint,
      detail: pricingOk
        ? `${spec.detail}；鉴权/价格接口 HTTP ${response.status}`
        : `线路鉴权未通过，无法确认模块状态：HTTP ${response.status}`
    };
  } catch (error) {
    state.config.baseUrl = previousBase;
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

function getBaseLabel(baseUrl) {
  const labels = {
    "https://api.yijiarj.cn": "国内大带宽",
    "https://apius.yijiarj.cn": "美国大带宽",
    "https://ai.yijiarj.cn": "国内小带宽"
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
    if (!response.ok) throw new Error(`图片生成失败：${response.status}`);
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
  if (!response.ok) throw new Error(`图片生成失败：${response.status}`);
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
  if (!response.ok) throw new Error(`Gemini 图片生成失败：${response.status}`);
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
    answer: imageUrl ? "" : JSON.stringify(payload)
  };
}

async function pollTask(taskId) {
  const tick = async () => {
    try {
      const response = await apiFetch(`/v1/videos/${taskId}`, { headers: { "Content-Type": "application/json" } });
      if (!response.ok) throw new Error(`查询失败：${response.status}`);
      const payload = await response.json();
      state.tasks = state.tasks.map((task) => task.id === taskId ? { ...task, ...payload } : task);
      renderTasks();
      if (!["completed", "error"].includes(String(payload.status || "").toLowerCase())) setTimeout(tick, 4500);
    } catch (error) {
      markTaskError(taskId, error.message);
    }
  };
  setTimeout(tick, 1800);
}

function bindEvents() {
  document.querySelectorAll(".mode[data-mode]").forEach((button) => {
    button.addEventListener("click", () => setAppMode(button.dataset.mode));
  });
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
      useGalleryPrompt(useButton.dataset.galleryPrompt || "");
      return;
    }
    if (event.target.closest("a")) return;
    const card = event.target.closest("[data-gallery-id]");
    if (!card) return;
    openGalleryPreview(card.dataset.galleryId);
  });
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
    useGalleryPrompt(useButton.dataset.galleryPrompt || "");
  });
  function useGalleryPrompt(prompt) {
    setAppMode("models");
    const imageModel = state.models.find((model) => model.category === "image" && /banana|image|gemini/i.test(model.name)) || state.models.find((model) => model.category === "image");
    if (imageModel) {
      state.selectedModel = imageModel;
      state.activeCategory = "image";
      document.querySelectorAll(".tab").forEach((tab) => tab.classList.toggle("active", tab.dataset.category === "image"));
      renderModels();
      renderSelection();
    }
    el("prompt").value = prompt;
    el("prompt").focus();
  }
  el("openConfig").addEventListener("click", () => {
    el("apiBaseUrl").value = state.config.baseUrl;
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
  el("healthToolButton").addEventListener("click", () => {
    renderHealthDialog([]);
    el("healthDialog").showModal();
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

  el("downloadVideos").addEventListener("click", () => batchDownload("video"));
  el("downloadImages").addEventListener("click", () => batchDownload("image"));
  el("previewDownload").addEventListener("click", () => {
    if (state.previewItem) downloadMedia(state.previewItem);
  });

  el("videoResultGrid").addEventListener("click", handleResultClick);
  el("imageResultGrid").addEventListener("click", handleResultClick);
  el("chatResultGrid").addEventListener("click", handleResultClick);
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
  if (task) openPreview(task);
}

function openPreview(task) {
  state.previewItem = task;
  resetPreviewZoom();
  el("previewTitle").textContent = task.url ? "视频预览" : task.imageUrl ? "图片预览" : "聊天预览";
  el("previewBody").innerHTML = task.url
    ? `<video src="${task.url}" controls autoplay></video>`
    : task.imageUrl
      ? `<img class="zoomable-preview" src="${task.imageUrl}" alt="生成图片" />`
      : `<article class="preview-text">${escapeHtml(task.answer || "")}</article>`;
  document.querySelectorAll("#previewZoomIn, #previewZoomOut, #previewZoomReset").forEach((button) => {
    button.classList.toggle("hidden", !task.imageUrl);
  });
  el("previewDownload").classList.toggle("hidden", !task.url && !task.imageUrl);
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
