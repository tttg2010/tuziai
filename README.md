# tuziai
ai大模型聚合

## CloudBase

已绑定腾讯 CloudBase 环境：

- 环境名称：`ai-rh202602`
- 环境 ID：`ai-rh202602-4g44noj4b1870204`
- 静态网站域名：`https://ai-rh202602-4g44noj4b1870204-1259354505.tcloudbaseapp.com`

部署静态网站：

```bash
tcb hosting deploy index.html /index.html -e ai-rh202602-4g44noj4b1870204
tcb hosting deploy styles.css /styles.css -e ai-rh202602-4g44noj4b1870204
tcb hosting deploy script.js /script.js -e ai-rh202602-4g44noj4b1870204
tcb hosting deploy tuzi-ai-logo.png /tuzi-ai-logo.png -e ai-rh202602-4g44noj4b1870204
```
