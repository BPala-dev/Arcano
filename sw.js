// Subí el número de VERSION cada vez que actualices index.html para que el celu tome la versión nueva.
const VERSION='arcano21-v3';
const ARCHIVOS=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png','./apple-touch-icon.png'];
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(VERSION).then(c=>c.addAll(ARCHIVOS)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
// Primero red (así siempre ves la última versión con internet); si no hay conexión, usa lo guardado.
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(
    fetch(e.request).then(r=>{
      if(r&&(r.status===200||r.type==='opaque')){const copia=r.clone();caches.open(VERSION).then(c=>c.put(e.request,copia))}
      return r;
    }).catch(()=>caches.match(e.request).then(r=>r||caches.match('./index.html')))
  );
});
