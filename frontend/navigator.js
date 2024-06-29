
/**
 * 
 * @param {string[]} imagesToCache 
 */
export default async function registerNavigator(imagesToCache){
    if(!("serviceWorker" in navigator)) return;

    //register service worker
    try{
        await navigator.serviceWorker.register('/sw.js')
        console.log('Service Worker Registered');
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
        event.respondWith(
            caches.match(event.request).then((response) => {
                return response || fetch(event.request);
            })
        );
    });
};