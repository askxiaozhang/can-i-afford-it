/* 关于、隐私说明和打赏入口。打赏渠道在 src/config.json 里配置，没填的不显示。 */
import config from '../config.json';
import { DATA_AS_OF } from '../data/index.js';
import { esc } from '../core/util.js';
import { openAsk } from './shell.js';

export const VERSION = typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : 'dev';

/* 微信赞赏码：图片放在 src/support/，构建时打包进游戏 */
const supportImages = import.meta.glob('../support/*.{png,jpg,jpeg,webp}', { eager: true, import: 'default' });
function wechatQrUrl(){
  const name = config.support?.wechatQr; if(!name) return '';
  const hit = Object.entries(supportImages).find(([p]) => p.endsWith('/' + name));
  return hit ? hit[1] : '';
}
const isUrl = s => typeof s === 'string' && /^https:\/\//.test(s);
export function supportChannels(){
  const s = config.support || {}; const list = [];
  if(isUrl(s.afdian)) list.push({ name:'爱发电', url:s.afdian, d:'可以一次性打赏，也可以按月赞助' });
  if(isUrl(s.githubSponsors)) list.push({ name:'GitHub Sponsors', url:s.githubSponsors, d:'适合有 GitHub 账号的朋友' });
  if(isUrl(config.itchPage)) list.push({ name:'itch.io', url:config.itchPage, d:'下载页上"想付多少付多少"' });
  return list;
}
export function hasSupport(){ return supportChannels().length > 0 || !!wechatQrUrl(); }

export function showSupport(){
  const list = supportChannels(); const qr = wechatQrUrl();
  const body = `<div class="stack">
    <p class="txt">游戏永久免费、开源，不卖数据，也不会塞借贷广告。觉得有用的话，可以请作者喝杯咖啡。</p>
    ${list.map(c => `<a class="opt" href="${esc(c.url)}" target="_blank" rel="noopener"><b>${esc(c.name)}</b><span>${esc(c.d)}</span></a>`).join('')}
    ${qr ? `<div class="qr"><img src="${qr}" alt="微信赞赏码" width="220" height="220"><span class="small muted">微信扫一扫打赏</span></div>` : ''}
  </div>`;
  return openAsk({ title:'支持作者', body, options:[{ id:'ok', label:'关闭' }] });
}

export async function showAbout(){
  const repo = isUrl(config.repo) ? config.repo : '';
  const body = `<div class="txt stack-s">
    <p>买得起吗 v${esc(VERSION)} · 第一关：买房</p>
    <p>代码以 GPL-3.0 协议开源，数据和文案以 CC BY-SA 4.0 协议共享。${repo ? `源码在 <a href="${esc(repo)}" target="_blank" rel="noopener">GitHub</a>。` : ''}</p>
    <p><b>隐私</b>：你填的工资、存款和游戏存档，只保存在这台设备的浏览器里，不上传、不统计。</p>
    <p><b>数据</b>：房价、利率和政策截至 ${esc(DATA_AS_OF)}，来源见项目里的 DATA_SOURCES.md。随机事件和投资收益都是模拟，不构成任何理财建议。</p>
  </div>`;
  const opts = [{ id:'ok', label:'知道了', cls:'primary' }];
  if(hasSupport()) opts.unshift({ id:'support', label:'支持作者', sub:'打赏或赞助，游戏本身永久免费' });
  const c = await openAsk({ title:'关于买得起吗', body, options:opts });
  if(c === 'support') showSupport();
}
export function aboutLinksHTML(){
  return `<div class="row about-links"><button type="button" class="btn sm ghost" data-act="about">关于 · 隐私</button>${hasSupport() ? '<button type="button" class="btn sm ghost" data-act="support">支持作者</button>' : ''}</div>`;
}
