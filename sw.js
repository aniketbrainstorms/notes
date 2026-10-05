const V='notebook-v9';
const CORE=['./','./index.html','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png','./icons/apple-touch-icon.png','./icons/favicon.svg','./fonts/Bristol.woff2'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>Promise.all(CORE.map(u=>c.add(new Request(u,{cache:'reload'})).catch(()=>{})))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  const u=new URL(r.url);
  if(u.origin!==location.origin&&u.hostname!=='use.typekit.net')return;
  if(r.mode==='navigate'){
    e.respondWith(caches.match('./index.html').then(hit=>{
      const net=fetch(r).then(res=>{if(res.ok){const c=res.clone();e.waitUntil(caches.open(V).then(x=>x.put('./index.html',c)))}return res}).catch(()=>hit||Response.error());
      return hit||net}));return}
  e.respondWith(caches.match(r).then(hit=>{
    const net=fetch(r).then(res=>{if(res.ok||res.type==='opaque'){const c=res.clone();e.waitUntil(caches.open(V).then(x=>x.put(r,c)))}return res}).catch(()=>hit||Response.error());
    return hit||net}))});
