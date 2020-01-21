// pretender needs to happen inside the service worker itself
// also, how do I import packages?

self.addEventListener('fetch', (event) => {
  console.log(event.request.url);
  if (event.request.url.includes('blob')) {
    console.log(event.request);
  }
});
