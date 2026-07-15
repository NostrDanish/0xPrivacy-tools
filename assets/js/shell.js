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
