/* The Griff — Cart Tracker service worker.
   Enables OS-level notifications while the app is running, and lays the
   groundwork for real web push if a backend is added later. */

self.addEventListener("install", function () { self.skipWaiting(); });
self.addEventListener("activate", function (e) { e.waitUntil(self.clients.claim()); });

// Focus (or open) the app when a notification is tapped.
self.addEventListener("notificationclick", function (e) {
  e.notification.close();
  e.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (list) {
      for (var i = 0; i < list.length; i++) { if ("focus" in list[i]) return list[i].focus(); }
      if (self.clients.openWindow) return self.clients.openWindow("./");
    })
  );
});

// Real web push (only fires if a server ever sends one — needs a backend).
self.addEventListener("push", function (e) {
  var data = {};
  try { data = e.data ? e.data.json() : {}; } catch (err) {}
  var title = data.title || "The Griff";
  var body = data.body || "New alert";
  e.waitUntil(self.registration.showNotification(title, { body: body, tag: data.tag || "griff" }));
});
