const CACHE='snu-field-v1-20261026-a';
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(['./index.html'])).then(()=>self.skipWaiting()));});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('snu-field-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',event=>{
  const u=new URL(event.request.url),scope=new URL(self.registration.scope);
  if(event.request.method!=='GET'||u.origin!==scope.origin||event.request.mode!=='navigate')return;
  const relative=u.pathname.slice(scope.pathname.length);
  if(!['','index.html','offline.html'].includes(relative))return;
  event.respondWith((async()=>{
    const key=new URL('index.html',scope).href;
    try{
      const response=await fetch(event.request);
      if(!response.ok)throw new Error('Map unavailable');
      const cache=await caches.open(CACHE);await cache.put(key,response.clone());
      return response;
    }catch(error){return await caches.match(key)||Response.error();}
  })());
});
