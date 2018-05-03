/*
 * Service worker for web application
 * 
 * This file has to be in root directory -
 * Do not shift into 'js' folder
 */

'use strict';

var _cache = 'pwa-cache';
var pagesToCache = [
  'offline.html',
  'ac.html',
  'contact.html',
  'exco.html',
  'index.html',
  'info.html',
  'links.html',
  'officers.html',
  'roh.html'
];

// Install stage sets up the cache-array to configure pre-cache content
self.addEventListener('install', function (evt) {
  evt.waitUntil(precache().then(function () {
    return self.skipWaiting();
  }));
});

// Allow service worker to control the current page
self.addEventListener('activate', function (evt) {
  return self.clients.claim();
});

self.addEventListener('fetch', function (evt) {
  evt.respondWith(
    fromCache(evt.request)
      .catch(fromServer(evt.request))
  );
  evt.waitUntil(update(evt.request));
});


function precache() {
  return caches.open(_cache).then(function (cache) {
    return cache.addAll(pagesToCache);
  });
}

function fromCache(request) {
  // We pull files from the cache first so we can show them fast
  return caches.open(_cache).then(function (cache) {
    return cache.match(request)
      .then(function (matching) {
        return matching || Promise.reject('no-match');
      });
  });
}

function update(request) {
  // This is where we call the server to get the newest version of the 
  // file to use the next time we show view
  return caches.open(_cache).then(function (cache) {
    return fetch(request).then(function (response) {
      return cache.put(request, response);
    });
  });
}

function fromServer(request) {
  // This is the fallback if it is not in the cahche to go to the server and get it
  return fetch(request).then(function (response) {
    return response;
  });
}