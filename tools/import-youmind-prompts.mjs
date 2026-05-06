import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { extname, join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const outDir = join(root, "scraped", "youmind");
const mediaDir = join(outDir, "media");
const rawDir = join(outDir, "raw");

const sources = [
  {
    id: "nano-banana-pro",
    model: "nano banana pro",
    modelTag: "Nano Banana Pro",
    url: "https://youmind.com/zh-CN/nano-banana-pro-prompts",
    html: join(rawDir, "nano-banana-pro.html")
  },
  {
    id: "gpt-image-2",
    model: "gpt-image-2",
    modelTag: "GPT Image 2",
    url: "https://youmind.com/zh-CN/gpt-image-2-prompts",
    html: join(rawDir, "gpt-image-2.html")
  },
  {
    id: "grok-imagine",
    model: "grok imagine",
    modelTag: "Grok Imagine",
    url: "https://youmind.com/zh-CN/grok-imagine-prompts",
    html: join(rawDir, "grok-imagine.html")
  }
];

const cloudBaseRoot = "https://ai-rh202602-4g44noj4b1870204-1259354505.tcloudbaseapp.com";
const appendPerSource = Number.parseInt(process.env.APPEND_PER_SOURCE || "20", 10);
const appendTotal = Number.parseInt(process.env.APPEND_TOTAL || "100", 10);
const onlySourceIds = new Set((process.env.SOURCE_IDS || "").split(",").map((id) => id.trim()).filter(Boolean));
const existingFile = join(outDir, "youmind-prompts.json");

mkdirSync(mediaDir, { recursive: true });

function decodeHtml(value = "") {
  return value
    .replace(/\\u003c/g, "<")
    .replace(/\\u003e/g, ">")
    .replace(/\\"/g, "\"")
    .replace(/&quot;/g, "\"")
    .replace(/&#x27;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/<!-- -->/g, "")
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeImageUrl(url) {
  if (!url) return "";
  url = url.replace(/\\+$/g, "");
  if (url.startsWith("/cdn-cgi/image/")) {
    const encoded = url.match(/\/(https%3A%2F%2F.+)$/)?.[1];
    if (encoded) return decodeURIComponent(encoded);
  }
  if (url.startsWith("https://")) return url;
  if (url.startsWith("//")) return `https:${url}`;
  if (url.startsWith("/")) return `https://youmind.com${url}`;
  return url;
}

function canonicalMediaUrl(url = "") {
  return normalizeImageUrl(url)
    .replace(/@small$/g, "")
    .replace(/-300x\d+(?=\.[a-z0-9]+(?:$|[?#]))/i, "")
    .split("?")[0];
}

function filenameFor(url, index) {
  const cleanUrl = url.split("?")[0].replace(/@small$/, "");
  const extension = extname(cleanUrl).split("@")[0] || ".jpg";
  const hash = createHash("sha1").update(url).digest("hex").slice(0, 12);
  return `${String(index + 1).padStart(3, "0")}-${hash}${extension}`;
}

function titleFromMediaUrl(url, source, index) {
  const filename = decodeURIComponent(url.split("/").pop()?.split("?")[0] || "");
  const stem = filename
    .replace(/-\d+x\d+(?=\.)/i, "")
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/^\d+_[a-z0-9]+_/i, "")
    .replace(/[_-]+/g, " ")
    .trim();
  return stem ? stem.slice(0, 42) : `${source.modelTag} 参考素材 ${index + 1}`;
}

function inferTags(text, source) {
  const tags = [source.id === "grok-imagine" ? "视频" : "图片", "YouMind", source.modelTag];
  const rules = [
    ["人像", ["人像", "自拍", "肖像", "人物", "女性", "男子", "模特", "头像", "面部"]],
    ["商业摄影", ["摄影", "照片", "写实", "镜头", "光影", "微距", "产品图"]],
    ["海报设计", ["海报", "广告", "传单", "封面", "书籍", "火车广告"]],
    ["信息图", ["信息图", "图表", "地图", "教育", "摘要", "知识", "白板"]],
    ["品牌视觉", ["品牌", "产品", "Bento", "商业", "营销", "电商"]],
    ["3D渲染", ["3D", "三维", "渲染", "雕塑", "模型", "玻璃"]],
    ["复古美学", ["复古", "怀旧", "专利", "浮世绘", "古老", "旧"]],
    ["赛博朋克", ["赛博", "未来", "霓虹", "科幻", "城市夜景", "未来感"]],
    ["动漫插画", ["动漫", "漫画", "插画", "Q 版", "手绘", "线稿"]],
    ["节日氛围", ["节日", "圣诞", "元旦", "新年", "祝福"]],
    ["室内空间", ["室内", "房间", "卧室", "办公室", "家居", "空间"]],
    ["城市街景", ["城市", "街道", "街头", "建筑", "天际线", "哥谭"]],
    ["自然风景", ["自然", "风景", "海滩", "日落", "水下", "山", "雨"]],
    ["时尚穿搭", ["时尚", "服装", "穿搭", "连衣裙", "夹克", "制服"]],
    ["角色设定", ["角色", "战士", "吉祥物", "虚拟人", "人物设定"]],
    ["社交媒体", ["社交", "公众号", "缩略图", "帖子", "推文"]],
    ["文字排版", ["文字", "排版", "字体", "引言", "中英文", "标题"]]
  ];
  rules.forEach(([tag, words]) => {
    if (words.some((word) => text.includes(word))) tags.push(tag);
  });
  return Array.from(new Set(tags)).slice(0, 8);
}

function parseCards(source) {
  const html = readFileSync(source.html, "utf8");
  const chunks = html.split(/<div class="group relative flex flex-col mt-4" data-id="/).slice(1);
  const items = [];

  chunks.forEach((chunk, cardIndex) => {
    const cardId = chunk.match(/^(\d+)/)?.[1] || `${source.id}-${cardIndex}`;
    const author = decodeHtml(chunk.match(/title="([^"]+)">(@?[^<]+)/)?.[1] || chunk.match(/>@<!-- -->\s*([^<]+)/)?.[1] || "");
    const date = decodeHtml(chunk.match(/font-mono text-gray-500 whitespace-nowrap">([^<]+)</)?.[1] || "");
    const prompt = decodeHtml(chunk.match(/line-clamp-4">([\s\S]*?)<\/div><\/a>/)?.[1] || "");
    const detailPath = chunk.match(/href="([^"]*\/prompts\/[^"]+)"/)?.[1] || "";
    const detailUrl = detailPath ? `https://youmind.com${detailPath}` : source.url;
    const images = [...chunk.matchAll(/<img[^>]+alt="([^"]*)"[^>]+src="([^"]+)"/g)]
      .map((match) => ({ alt: decodeHtml(match[1]), originalUrl: normalizeImageUrl(match[2]) }))
      .filter((image) => image.originalUrl.includes("cms-assets.youmind.com") || image.originalUrl.includes("cdn.gooo.ai"));

    images.forEach((image, imageIndex) => {
      const title = image.alt || prompt.slice(0, 34) || `${source.modelTag} 提示词`;
      items.push({
        id: `youmind-${source.id}-${cardId}-${imageIndex + 1}`,
        type: "image",
        sourceType: "抓取",
        sourceName: "YouMind",
        sourceUrl: source.url,
        detailUrl,
        author: author || "未标记作者",
        publishedAt: date,
        model: source.model,
        modelLabel: source.modelTag,
        title,
        prompt: prompt || title,
        tags: inferTags(`${title} ${prompt}`, source),
        originalUrl: image.originalUrl
      });
    });
  });

  return items;
}

function parseSupplementalMedia(source) {
  if (source.id === "grok-imagine") return [];
  const html = readFileSync(source.html, "utf8");
  const mediaMatches = [...html.matchAll(/https:\/\/(?:cms-assets\.youmind\.com\/media|cdn\.gooo\.ai\/(?:gen-images|web-images))[^"'\s<]+/g)];
  const mediaByCanonical = new Map();

  mediaMatches.forEach((match) => {
    const originalUrl = normalizeImageUrl(match[0]).replace(/@small$/g, "");
    if (originalUrl.includes("cms-assets.youmind.com") && !/\.[a-z0-9]+(?:$|[?#])/i.test(originalUrl)) return;
    const canonical = canonicalMediaUrl(originalUrl);
    if (!canonical || mediaByCanonical.has(canonical)) return;
    mediaByCanonical.set(canonical, originalUrl);
  });

  return [...mediaByCanonical.values()].map((originalUrl, index) => {
    const title = titleFromMediaUrl(originalUrl, source, index);
    return {
      id: `youmind-${source.id}-media-${createHash("sha1").update(canonicalMediaUrl(originalUrl)).digest("hex").slice(0, 12)}`,
      type: "image",
      sourceType: "抓取",
      sourceName: "YouMind",
      sourceUrl: source.url,
      detailUrl: source.url,
      author: "未标记作者",
      publishedAt: "",
      model: source.model,
      modelLabel: source.modelTag,
      title,
      prompt: `${source.modelTag} 参考素材：${title}`,
      tags: inferTags(title, source),
      originalUrl
    };
  });
}

function parseVideoPromptPage(source) {
  if (source.id !== "grok-imagine") return [];
  const html = readFileSync(source.html, "utf8");
  const itemPattern = /\\"id\\":(\d+),\\"title\\":\\"([\s\S]*?)\\",\\"description\\":\\"([\s\S]*?)\\",\\"slug\\":\\"([^\\]+?)\\"[\s\S]*?\\"content\\":\\"([\s\S]*?)\\",\\"language\\":\\"([^\\]+?)\\",\\"translatedContent\\":\\"([\s\S]*?)\\",\\"sourceLink\\":\\"([^\\]*?)\\",\\"sourcePublishedAt\\":\\"([^\\]*?)\\",\\"author\\":\{\\"name\\":\\"([\s\S]*?)\\"[\s\S]*?\\"streamId\\":\\"([a-f0-9]{32})\\"/g;
  const items = [];
  let match;
  while ((match = itemPattern.exec(html))) {
    const [, id, rawTitle, rawDescription, slug, rawContent, language, rawTranslatedContent, sourceLink, sourcePublishedAt, rawAuthor, streamId] = match;
    const title = decodeHtml(rawTitle);
    const description = decodeHtml(rawDescription);
    const prompt = decodeHtml(rawTranslatedContent) || decodeHtml(rawContent) || description || title;
    const originalUrl = `https://customer-qs6wnyfuv0gcybzj.cloudflarestream.com/${streamId}/downloads/default.mp4`;
    items.push({
      id: `youmind-${source.id}-${id}`,
      type: "video",
      sourceType: "抓取",
      sourceName: "YouMind",
      sourceUrl: source.url,
      detailUrl: `https://youmind.com/zh-CN/video-prompts/${slug}-${id}`,
      author: decodeHtml(rawAuthor) || "未标记作者",
      publishedAt: sourcePublishedAt,
      model: source.model,
      modelLabel: source.modelTag,
      title,
      prompt,
      tags: inferTags(`${title} ${description} ${prompt}`, source),
      originalUrl,
      poster: `https://customer-qs6wnyfuv0gcybzj.cloudflarestream.com/${streamId}/thumbnails/thumbnail.jpg`,
      sourceLink,
      streamId,
      language
    });
  }
  return items;
}

async function download(items) {
  const finalItems = [];
  for (let index = 0; index < items.length; index += 1) {
    const item = items[index];
    const filename = filenameFor(item.originalUrl, item.sequenceIndex ?? index);
    const filePath = join(mediaDir, filename);
    if (!existsSync(filePath)) {
      const response = await fetch(item.originalUrl, {
        headers: { "User-Agent": "Mozilla/5.0 TuziAI prompt gallery importer" }
      });
      if (!response.ok) {
        console.warn(`\n跳过不可下载素材 ${response.status}: ${item.originalUrl}`);
        continue;
      }
      const bytes = Buffer.from(await response.arrayBuffer());
      writeFileSync(filePath, bytes);
    }
    finalItems.push({
      ...Object.fromEntries(Object.entries(item).filter(([key]) => key !== "sequenceIndex")),
      url: `${cloudBaseRoot}/youmind-media/${filename}`,
      imageUrl: item.type === "image" ? `${cloudBaseRoot}/youmind-media/${filename}` : undefined,
      videoUrl: item.type === "video" ? `${cloudBaseRoot}/youmind-media/${filename}` : undefined,
      cloudbasePath: `/youmind-media/${filename}`,
      createdAt: Date.now() - index * 1000
    });
    process.stdout.write(`\r${index + 1}/${items.length}`);
  }
  process.stdout.write("\n");
  return finalItems;
}

const existing = existsSync(existingFile) ? JSON.parse(readFileSync(existingFile, "utf8")) : [];
const existingKeys = new Set(existing.flatMap((item) => [
  item.id,
  item.originalUrl,
  canonicalMediaUrl(item.originalUrl || item.url || item.imageUrl),
  item.detailUrl ? `${item.sourceUrl}|${item.detailUrl}|${item.title}` : ""
]).filter(Boolean));

const parsedBySource = sources.map((source) => ({
  source,
  items: [...parseCards(source), ...parseSupplementalMedia(source), ...parseVideoPromptPage(source)]
})).filter(({ source }) => !onlySourceIds.size || onlySourceIds.has(source.id));

const additions = parsedBySource.flatMap(({ source, items }) => {
  const freshKeys = new Set();
  const fresh = items.filter((item) => {
    const contentKey = item.detailUrl ? `${item.sourceUrl}|${item.detailUrl}|${item.title}` : "";
    const canonicalKey = canonicalMediaUrl(item.originalUrl);
    const isFresh = !existingKeys.has(item.id) && !existingKeys.has(item.originalUrl) && !existingKeys.has(canonicalKey) && !existingKeys.has(contentKey);
    const localKey = canonicalKey || item.originalUrl || item.id || contentKey;
    if (!isFresh || freshKeys.has(localKey)) return false;
    freshKeys.add(localKey);
    return true;
  });
  console.log(`${source.modelTag}: found ${fresh.length} new media items.`);
  return fresh;
}).slice(0, appendTotal).map((item, index) => ({
  ...item,
  sequenceIndex: existing.length + index
}));

const importedAdditions = await download(additions);
const imported = [];
const importedKeys = new Set();
[...existing, ...importedAdditions].forEach((item) => {
  const key = item.originalUrl || item.id || item.url;
  if (importedKeys.has(key)) return;
  importedKeys.add(key);
  imported.push(item);
});

writeFileSync(
  join(outDir, "youmind-prompts.json"),
  JSON.stringify(imported, null, 2)
);
writeFileSync(
  join(root, "youmind-prompts.js"),
  `window.YOUMIND_PROMPTS = ${JSON.stringify(imported, null, 2)};\n`
);

console.log(`Imported ${imported.length} prompt media items.`);
