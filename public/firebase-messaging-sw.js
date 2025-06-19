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

// eslint-disable-next-line no-undef
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js')
// eslint-disable-next-line no-undef
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js')

// Replace the following config with your actual Firebase project config
// You must include apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId
// See: https://firebase.google.com/docs/web/setup#config-object
// eslint-disable-next-line no-undef
firebase.initializeApp({
  apiKey: 'AIzaSyCfAv1bmJ5SBB3wRZttEYrecYJ3bW5py2o',
  authDomain: 'sample-2beba.firebaseapp.com',
  projectId: 'sample-2beba',
  storageBucket: 'sample-2beba.firebasestorage.app',
  messagingSenderId: '846858288563',
  appId: '1:846858288563:web:6aa6f1707385f6f886dfc6'
})

// eslint-disable-next-line no-undef
const messaging = firebase.messaging()

// Handle background messages (for firebase v7+ use onBackgroundMessage)
messaging.onBackgroundMessage(function (payload) {
  console.log('[firebase-messaging-sw.js] Received background message', payload)
  // If payload.notification exists, browser will show notification automatically, so skip manual showNotification
  // if (payload.notification && payload.data.click_action) {
  //   return
  // }
  // Only show notification if it's data-only
  const notificationTitle = (payload.data && payload.data.title) || 'Notification'
  const notificationOptions = {
    body: (payload.data && payload.data.body) || '',
    icon: '/firebase-logo.png',
    data: {
      click_action: (payload.data && payload.data.click_action) || '/'
    }
  }
  return self.registration.showNotification(notificationTitle, notificationOptions)
})

messaging.onMessage(messaging, (payload) => {
  // Always show notification even when app is open
  if (payload?.notification) {
    const { title, body, icon } = payload.notification
    self.registration.showNotification(title, {
      body,
      icon: icon || '/firebase-logo.png',
      data: payload.data
    })
  }
})

// Listen for notification click
self.addEventListener('notificationclick', function (event) {
  event.notification.close()
  const clickAction = event.notification.data && event.notification.data.click_action
    ? event.notification.data.click_action
    : (event.notification.click_action || '/')

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
      // Cek jika sudah ada window/tab app yang terbuka
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i]
        // Cek url root app, bisa disesuaikan jika perlu
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus()
        }
      }
      // Jika belum ada, buka window baru (akan membuka PWA, bukan browser baru jika sudah diinstall)
      if (clients.openWindow) {
        return clients.openWindow(clickAction)
      }
    })
  )
})
