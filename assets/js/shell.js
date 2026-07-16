// 0xPrivacy Tools — shared shell logic (no network calls)
(function(){
  const root = document.documentElement;
  function setTheme(t){ root.setAttribute('data-theme', t); try{localStorage.setItem('0xp-theme', t);}catch(e){} }
  const saved = (()=>{try{return localStorage.getItem('0xp-theme');}catch(e){return null;}})();
  setTheme(saved || (matchMedia('(prefers-color-scheme: light)').matches ? 'light':'dark'));

  document.addEventListener('click', e=>{
    const t = e.target.closest('[data-theme-toggle]');
    if(t){ setTheme(root.getAttribute('data-theme')==='dark'?'light':'dark'); }
  });

  // offline indicator
  function syncNet(){ document.body.classList.toggle('offline', !navigator.onLine); }
  window.addEventListener('online', syncNet);
  window.addEventListener('offline', syncNet);
  syncNet();

  // register service worker for offline PWA
  if('serviceWorker' in navigator){
    navigator.serviceWorker.register('../sw.js').catch(()=>{});
  }
})();

// ---------------------------------------------------------------------------
// 0xP Private Local Analytics (opt-in, zero network, zero tracking)
// Counts tool opens in localStorage only. Nothing is sent automatically.
// Export is manual and user-initiated (downloads JSON they can DM to 0xDevBot).
// ---------------------------------------------------------------------------
(function(){
  const KEY = '0xp-usage';
  function load(){
    try { return JSON.parse(localStorage.getItem(KEY)) || {}; }
    catch(e){ return {}; }
  }
  function save(o){
    try { localStorage.setItem(KEY, JSON.stringify(o)); } catch(e){}
  }
  // slug from page title, e.g. "Hash Calculator — 0xPrivacy" -> "hash"
  function slug(){
    const t = (document.title || location.pathname).toLowerCase();
    if(t.includes('password')||t.includes('passphrase')) return 'password';
    if(t.includes('hash')) return 'hash';
    if(t.includes('converter')||t.includes('convert')) return 'converters';
    if(t.includes('dev')) return 'devutils';
    if(t.includes('qr')) return 'qrcode';
    if(t.includes('meta')||t.includes('metadata')) return 'metadata';
    // fallback: last path segment
    const seg = location.pathname.split('/').filter(Boolean).pop() || 'unknown';
    return seg.replace(/\.html$/, '') || 'unknown';
  }
  // increment on load
  const s = slug();
  const data = load();
  data[s] = (data[s] || 0) + 1;
  data._last = Math.floor(Date.now()/1000);
  save(data);

  // public API
  window['0xP'] = window['0xP'] || {};
  window['0xP'].usage = function(){ return load(); };
  window['0xP'].exportUsage = function(){
    const d = load();
    const payload = {
      app: '0xPrivacy-tools',
      exported_at: Math.floor(Date.now()/1000),
      note: "Opt-in local usage. DM to 0xDevBot to help prioritize tools. No PII.",
      usage: Object.fromEntries(Object.entries(d).filter(([k])=>k!=='_last'))
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {type:'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = '0xprivacy-usage.json';
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
    return payload;
  };

  // show an "Export usage" button only when ?analytics is in the URL (opt-in UI)
  if(location.search.includes('analytics')){
    document.addEventListener('DOMContentLoaded', ()=>{
      const btn = document.createElement('button');
      btn.className = 'btn';
      btn.textContent = 'Export local usage';
      btn.style.position = 'fixed'; btn.style.bottom = '12px'; btn.style.right = '12px';
      btn.style.opacity = '0.85'; btn.style.zIndex = '99';
      btn.onclick = ()=> window['0xP'].exportUsage();
      document.body.appendChild(btn);
    });
  }
})();
