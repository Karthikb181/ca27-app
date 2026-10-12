const V='ca-study-v12',CORE=['./','index.html','manifest.webmanifest','icons/icon-192.png','icons/icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V&&x!=='ca-settings').map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET'||new URL(e.request.url).hostname==='api.github.com')return;
  e.respondWith(fetch(e.request).then(r=>{if(r&&(r.ok||r.type==='opaque')){const c=r.clone();caches.open(V).then(x=>x.put(e.request,c))}return r}).catch(()=>caches.match(e.request).then(m=>m||(e.request.mode==='navigate'?caches.match('index.html'):undefined))))});
self.addEventListener('notificationclick',e=>{e.notification.close();e.waitUntil(clients.matchAll({type:'window'}).then(l=>l.length?l[0].focus():clients.openWindow('./index.html')))});
self.addEventListener('periodicsync',e=>{if(e.tag==='ca-remind')e.waitUntil(remindCheck())});
async function remindCheck(){const c=await caches.open('ca-settings');let st={on:true,time:'17:35'};try{const r=await c.match('settings.json');if(r)st=await r.json()}catch(x){}
  if(st.on===false)return;const n=new Date(),m=n.getHours()*60+n.getMinutes(),p=(st.time||'17:35').split(':').map(Number),f=p[0]*60+p[1],day=n.getFullYear()+'-'+(n.getMonth()+1)+'-'+n.getDate();
  let last='';try{const r=await c.match('last.json');if(r)last=(await r.json()).d}catch(x){}
  if(m>=f&&m<f+85&&last!==day){await c.put('last.json',new Response(JSON.stringify({d:day})));await self.registration.showNotification('Test time',{body:'Time for your test.',icon:'icons/icon-192.png'})}}
