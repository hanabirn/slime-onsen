// 史萊姆溫泉度假村 — Service Worker（讓遊戲可以安裝、離線遊玩）
// ⚠️ 每次更新遊戲內容後，請把 CACHE 的版本號改掉，玩家才會拿到新版。
const CACHE = 'slime-onsen-v2.2.0';

const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './bgm.mp3',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-192.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png',
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)));
  self.skipWaiting();
});

// 啟用新版時，刪掉舊版快取
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;

  // 音樂播放會用 Range 分段請求，離線時要從快取切出對應的片段
  if (req.headers.has('range')) {
    event.respondWith(rangeResponse(req));
    return;
  }

  // 網頁本身：先抓網路上的新版，沒網路才用快取
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then(res => { putCache(req, res.clone()); return res; })
        .catch(() => caches.match(req).then(r => r || caches.match('./index.html')))
    );
    return;
  }

  // 其他檔案（圖示、音樂）：先用快取，沒有才抓網路
  event.respondWith(
    caches.match(req).then(cached => cached || fetch(req).then(res => {
      if (res.ok) putCache(req, res.clone());
      return res;
    }))
  );
});

function putCache(req, res) {
  if (res.ok) caches.open(CACHE).then(cache => cache.put(req, res));
}

async function rangeResponse(req) {
  const cached = await caches.match(req.url, { ignoreSearch: true });
  if (!cached) return fetch(req);
  const buf = await cached.arrayBuffer();
  const size = buf.byteLength;
  const m = /bytes=(\d*)-(\d*)/.exec(req.headers.get('range') || '');
  let start = 0, end = size - 1;
  if (m) {
    if (m[1] === '' && m[2] !== '') {          // bytes=-500：最後 500 bytes
      start = Math.max(0, size - Number(m[2]));
    } else {
      start = Number(m[1] || 0);
      if (m[2] !== '') end = Math.min(Number(m[2]), size - 1);
    }
  }
  return new Response(buf.slice(start, end + 1), {
    status: 206,
    headers: {
      'Content-Type': cached.headers.get('Content-Type') || 'audio/mpeg',
      'Content-Range': `bytes ${start}-${end}/${size}`,
      'Content-Length': String(end - start + 1),
      'Accept-Ranges': 'bytes',
    },
  });
}
