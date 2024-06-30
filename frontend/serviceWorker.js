
/**
 * 
 * @param {string[]} imagesToCache 
 */
export default async function registerNavigator(imagesToCache){
    if(!("serviceWorker" in navigator)) return;

    //register service worker
    try{
        const reg = await navigator.serviceWorker.register('/frontend/sw.js');
        console.log('Service Worker Registered', reg);
    }catch(err){
        console.error("faild to register service worker");
        throw err;
    }
    
    self.addEventListener('install', (event) => {
        event.waitUntil(
            caches.open('image-cache').then((cache) => {
                cache.addAll(imagesToCache);
            })
        );
    });

    self.addEventListener('fetch', (event) => {
        console.log(event.request.url)
        event.respondWith(
            caches.match(event.request).then((response) => {
                return response || fetch(event.request);
            })
        );
    });
};