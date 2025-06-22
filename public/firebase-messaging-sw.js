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
  const action = event.action
  const clickAction =
    (event.notification.data && event.notification.data.click_action) ||
    (event.notification.click_action) ||
    '/'

  // Ambil notificationId jika ada
  const notificationId =
    (event.notification.data && event.notification.data.notificationId) ||
    (event.notification.notificationId)

  // Jika tombol "Mark as Read" diklik
  if (action === 'mark-as-read') {
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
        if (clientList.length > 0) {
          clientList[0].postMessage({ type: 'mark-as-read', id: notificationId })
        }
      })
    )
    return
  }

  // Jika notifikasi dibuka (klik utama), juga mark as read
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
      if (clientList.length > 0) {
        const client = clientList[0]
        client.focus()
        // Kirim pesan ke window: mark as read + navigasi
        client.postMessage({ type: 'mark-as-read', id: notificationId })
        client.postMessage({ type: 'notification-click', path: clickAction })
        return
      }
      // Jika belum ada, buka window/tab baru ke clickAction (fallback)
      if (clients.openWindow) {
        return clients.openWindow(clickAction)
      }
    })
  )
})
