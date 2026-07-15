// 0xPrivacy Tools service worker — offline-first, cache shell + visited tools
const CACHE = '0xp-v1';
const SHELL = [
  './', './index.html', './manifest.webmanifest',
  './assets/css/shell.css', './assets/js/shell.js',
  './assets/js/lib/qrcode.js', './assets/js/lib/bech32.js',
  './assets/js/lib/hashes.js', './assets/js/lib/noble/utils.js',
  './assets/js/lib/noble/sha256.js', './assets/js/lib/noble/md5.js',
  './assets/js/lib/noble/blake3.js', './assets/js/lib/noble/_assert.js',
  './assets/js/lib/noble/_md.js', './assets/js/lib/noble/_blake.js',
  './assets/js/lib/noble/_u64.js', './assets/js/lib/noble/blake2s.js',
  './assets/js/lib/noble/crypto.js'
];
self.addEventListener('install', e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate', e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch', e=>{
  const req = e.request;
  if(req.method !== 'GET') return;
  e.respondWith(
    caches.match(req).then(hit=>{
      const net = fetch(req).then(res=>{
        if(res && res.status===200 && (res.type==='basic' || res.type==='cors')){
          const copy = res.clone();
          caches.open(CACHE).then(c=>c.put(req, copy));
        }
        return res;
      }).catch(()=>hit);
      return hit || net;
    })
  );
});
