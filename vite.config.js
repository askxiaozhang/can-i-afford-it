import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import { viteSingleFile } from 'vite-plugin-singlefile';
import { readFileSync } from 'node:fs';

const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'));

/* 单文件版没有 public 目录，把网页图标直接内联进去 */
const inlineIcon = {
  name: 'inline-icon',
  transformIndexHtml(html){
    const svg = readFileSync(new URL('./public/icon.svg', import.meta.url), 'utf8');
    const uri = 'data:image/svg+xml,' + encodeURIComponent(svg);
    return html.replace('href="./icon.svg"', `href="${uri}"`).replace(/\s*<link rel="apple-touch-icon"[^>]*>/, '');
  },
};

/* 两种构建：
   npm run build         → dist/：多文件网页 + PWA（可安装、离线），用于 GitHub Pages
   npm run build:single  → dist-single/index.html：一个 HTML 文件包含全部内容，双击就能玩，用于 itch.io 和直接下载 */
export default defineConfig(({ mode }) => {
  const single = mode === 'single';
  return {
    base: './',
    define: { __APP_VERSION__: JSON.stringify(pkg.version) },
    build: single
      ? { outDir: 'dist-single', emptyOutDir: true, assetsInlineLimit: 100_000_000, cssCodeSplit: false, copyPublicDir: false }
      : { outDir: 'dist', emptyOutDir: true },
    plugins: single ? [viteSingleFile(), inlineIcon] : [
      VitePWA({
        registerType: 'autoUpdate',
        injectRegister: 'script',
        includeAssets: ['icon.svg', 'apple-touch-icon.png'],
        manifest: {
          name: '买得起吗',
          short_name: '买得起吗',
          description: '开源的买房与消费模拟游戏',
          lang: 'zh-CN',
          start_url: './',
          scope: './',
          display: 'standalone',
          background_color: '#E4E8E7',
          theme_color: '#BC3226',
          icons: [
            { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
            { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
            { src: 'icons/icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
          ],
        },
        workbox: { globPatterns: ['**/*.{js,css,html,svg,png,woff2}'], globIgnores: ['download/**'], navigateFallbackDenylist: [/\/download\//] },
      }),
    ],
    test: { environment: 'node', include: ['tests/**/*.test.js'] },
  };
});
