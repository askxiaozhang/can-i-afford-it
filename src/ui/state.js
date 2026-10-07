import { defaultCfg } from '../core/setup.js';
/* ============================================================
   全局状态：store.G 是正在进行的这局人生（没开局时为 null），
   UI 是界面状态（当前页、开局设置、选中的房源、贷款滑块等）。
   都只保存在本机浏览器里，不上传任何地方。
   ============================================================ */
export const store = { G: null };
export const UI = { tab:'life', stage:'start', cfg:defaultCfg('cd'), seed:0, listings:null, pick:null, ctl:null, busy:false, asset:'csi', vol:false, cmp:null, calc:null, touched:{} };

export const SAVE_KEY = 'can-i-afford-it:save:v1';
const LEGACY_KEYS = ['house-sim-save-v2'];      // 早期在线版的存档，读得到就迁移过来
const GAME_VERSION = 2;                          // 存档里 G.v 的版本号，结构不兼容时递增

function uiSnapshot(){
  return {tab:UI.tab, stage:UI.stage, cfg:UI.cfg, seed:UI.seed, listings:UI.listings, pick:UI.pick, ctl:UI.ctl, asset:UI.asset, vol:UI.vol, cmp:UI.cmp, calc:UI.calc, touched:UI.touched, listingsCity:UI.listingsCity};
}
export function snapshot(){ return {G:store.G, UI:uiSnapshot()}; }
export function save(){ try{ localStorage.setItem(SAVE_KEY, JSON.stringify(snapshot())); }catch(e){} }
function readStored(){
  for(const k of [SAVE_KEY, ...LEGACY_KEYS]){
    try{ const raw = localStorage.getItem(k); if(raw) return JSON.parse(raw); }catch(e){}
  }
  return null;
}
export function loadSaved(data){
  try{
    const d = data && data.UI ? data : readStored();
    if(!d) return;
    Object.assign(UI, d.UI||{}); UI.busy = false;
    store.G = d.G || null;
    if(store.G && store.G.v!==GAME_VERSION) store.G = null;
  }catch(e){}
}
