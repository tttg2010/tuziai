# API 文档索引

总入口：

- https://dvqyn6o2vd.apifox.cn/llms.txt

后续开发优先从 `llms.txt` 查找最新接口文档，再打开具体 `.md` 接口页确认字段。

## 已确认的关键接口

- 通用任务进度查询：`/v1/videos/{video_id}`，Veo / Sora2 / Grok 等视频任务共用。
- OpenAI 聊天接口：`/v1/chat/completions`，JSON body 使用 `model` 和 `messages`。
- 文件上传样例：multipart/form-data，字段含 `prompt`、`input_reference`。
- 令牌额度：系统接口。
- 令牌余额：`/v1/dashboard/billing/subscription`。
- 模型实时价格：`/api/pricing`，最终价格需要 `model_price * group_ratio[group]`。
- Veo 自建分组创建视频：`/v1/videos`，JSON body 支持 `prompt`、`model`、`size`、`input_reference`、`remix_id`。

## llms.txt 中的主要分类

- 共用接口：任务查询、聊天、文件 form-data。
- 系统接口：额度、余额、价格。
- Sora-2：创建视频、编辑视频、角色创建/查询/删除、视频文件内容。
- Veo：自建分组创建视频、veo_3_1-fast 创建与查询。
- Grok：异步视频、同步视频、图片生成、任务查询。
- 香蕉：nano / gemini / nano-banana-2 / banana pro 图片生成。
- ChatGPT：文本对话、image2 图片生成。
- Gemini：聊天接口。
- yijiasd：视频任务创建。

## 当前实现注意点

- 视频 UI 已接入 Veo 自建分组 `/v1/videos` 和通用轮询。
- 聊天 UI 已接入 `/v1/chat/completions`。
- 图片 UI 已预留；后续应从 `llms.txt` 选择具体图片接口，例如 Grok 图片、香蕉生图或 ChatGPT image2，再按目标模型接入。

## Nano Banana / 香蕉接口补充

- nano 开头香蕉模型：`POST /v1/images/generations`
  - JSON 字段：`prompt`、`model`、`size`、`image`
  - `image` 是公开图片 URL 数组。
  - 返回：`data[0].b64_json`，示例中实际是图片 URL。
- gemini 开头香蕉模型：`POST /v1beta/models/{model}:generateContent`
  - JSON 字段：`systemInstruction`、`contents[].parts[]`、`generationConfig.responseModalities=["IMAGE"]`、`generationConfig.imageConfig.aspectRatio`
  - 参考图用 `fileData.mimeType` + `fileData.fileUri`。
  - 返回文本中可能包含 Markdown 图片链接。
- `nano-banana-2`：`POST /v1/images/generations`
  - 文档标记 deprecated，但仍列为可用说明。
  - JSON 字段：`prompt`、`model`、`aspect_ratio`、`response_format=url`、`image`、`image_size`
  - 返回：`data[0].url`。
- `nanobanana-yijia` / `nanobanana-pro-yijia`：`POST /v1/videos`
  - 文档标记 deprecated。
  - 异步图片任务，字段：`model`、`prompt`、`image`、`type=image`、`user`。
