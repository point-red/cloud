// Import and configure the Firebase SDK

/**
 * @fileoverview Firebase Messaging Service Worker
 * @global importScripts
 * @global firebase
 * @global clients
 */

/**
 * Initialize Firebase Messaging in the Service Worker.
 **/

importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js')

// firebase.initializeApp({
//   apiKey: 'AIzaSyCfAv1bmJ5SBB3wRZttEYrecYJ3bW5py2o',
//   authDomain: 'sample-2beba.firebaseapp.com',
//   projectId: 'sample-2beba',
//   storageBucket: 'sample-2beba.firebasestorage.app',
//   messagingSenderId: '846858288563',
//   appId: '1:846858288563:web:6aa6f1707385f6f886dfc6'
// })

// const messaging = firebase.messaging()

// Handle background messages (for firebase v7+ use onBackgroundMessage)
// messaging.onBackgroundMessage(function (payload) {
//   console.log('[firebase-messaging-sw.js] Received background message', payload)
//   const notificationTitle = (payload.data && payload.data.title) || 'Notification'
//   const notificationOptions = {
//     body: (payload.data && payload.data.body) || '',
//     icon: '/firebase-logo.png',
//     data: {
//       click_action: (payload.data && payload.data.click_action) || '/'
//     }
//   }
//   return self.registration.showNotification(notificationTitle, notificationOptions)
// })

// Always show notification even when app is open (foreground or background)
self.addEventListener('push', function (event) {
  let payload = {}
  try {
    payload = event.data.json()
  } catch (e) {
    payload = {}
  }
  // Support both notification and data-only payloads
  const notification = payload.notification || {}
  const data = payload.data || {}
  const title = notification.title || data.title || 'Notification'
  const options = {
    body: notification.body || data.body || '',
    icon: notification.icon || '/firebase-logo.png',
    data: {
      ...data,
      click_action: data.click_action || notification.click_action || '/'
    }
  }
  event.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener('notificationclick', function (event) {
  event.notification.close()
  let clickAction =
    (event.notification.data && event.notification.data.click_action) ||
    (event.notification.click_action) ||
    '/'

  // Normalisasi URL agar selalu absolut
  if (!/^https?:\/\//.test(clickAction)) {
    clickAction = self.location.origin + (clickAction.startsWith('/') ? clickAction : '/' + clickAction)
  }

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
      // Fokuskan tab jika sudah ada, jika tidak buka baru
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i]
        // Gunakan startsWith agar path dengan query/fragment tetap cocok
        if (client.url.startsWith(clickAction) && 'focus' in client) {
          return client.focus()
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(clickAction)
      }
    })
  )
})
