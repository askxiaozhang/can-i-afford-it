# 发布步骤

代码已经准备好，发布需要用你自己的 GitHub 和 itch.io 账号完成。

## 0. 填打赏链接（可选）

编辑 `src/config.json`：

```json
{
  "repo": "https://github.com/你的用户名/can-i-afford-it",
  "itchPage": "https://你的用户名.itch.io/can-i-afford-it",
  "support": {
    "afdian": "https://afdian.com/a/你的主页",
    "githubSponsors": "https://github.com/sponsors/你的用户名",
    "wechatQr": "wechat-qr.png"
  }
}
```

微信赞赏码图片放到 `src/support/wechat-qr.png`。只填 `https://` 开头的链接；留空的渠道不会显示。

## 1. 发布到 GitHub

```bash
cd can-i-afford-it
npm install
npm test
git init
git add .
git commit -m "v0.1.0：买房关卡"
git branch -M main
git remote add origin https://github.com/你的用户名/can-i-afford-it.git
git push -u origin main
```

然后在仓库页面：

1. **Settings → Pages → Build and deployment → Source** 选 **GitHub Actions**。
2. 回到 **Actions** 页，等 "Deploy to GitHub Pages" 跑完，网页版地址是 `https://你的用户名.github.io/can-i-afford-it/`。
3. 把这个地址填进 README 的"网页版"一栏。

### 发一个可下载的版本

```bash
npm run build:itch
```

在仓库 **Releases → Draft a new release**，标签填 `v0.1.0`，把 `release/` 里的两个文件拖进去：

- `can-i-afford-it-v0.1.0.html`：直接下载版，双击就能玩
- `can-i-afford-it-v0.1.0-itch.zip`：给 itch.io 用的压缩包

## 2. 发布到 itch.io

1. 登录 itch.io → **Upload new project**。
2. **Kind of project** 选 **HTML**。
3. **Uploads** 上传 `release/can-i-afford-it-v0.1.0-itch.zip`，勾选 **This file will be played in the browser**。
4. **Embed options**：视口尺寸建议 420 × 820，勾选 **Mobile friendly** 和 **Fullscreen button**。
5. **Pricing** 选 **No payments** 或 **Donate**（想付多少付多少，玩家可以不付）。
6. 可以再把 `can-i-afford-it-v0.1.0.html` 作为可下载文件上传一份。
7. 发布后把 itch.io 页面地址填回 `src/config.json` 的 `itchPage`，重新构建。

## 3. 以后更新

1. 改代码或数据，跑 `npm test`。
2. 把 `package.json` 里的 `version` 加一位（如 0.1.1）。
3. 推送到 main，网页版会自动更新；已安装到手机主屏幕的玩家，下次打开时会自动拿到新版本。
4. 重新 `npm run build:itch`，把新压缩包传到 itch.io。

## 注意

- 国内安卓应用商店上架游戏一般需要版号，个人很难拿到，暂不建议上架应用商店。
- 不要接入借贷、网贷、博彩类广告；任何广告 SDK 都会收集设备信息，需要另写隐私政策。
