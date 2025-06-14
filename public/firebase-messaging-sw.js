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

// Listen for notification click
self.addEventListener('notificationclick', function (event) {
  console.log('[firebase-messaging-sw.js] Notification click event:', event)
  event.notification.close()
  // Get click_action from notification data
  const clickAction = event.notification.data && event.notification.data.click_action
    ? event.notification.data.click_action
    : (event.notification.click_action || '/')
  console.log('[firebase-messaging-sw.js] clickAction:', clickAction)
  event.waitUntil(
    clients.matchAll({ includeUncontrolled: true, type: 'window' }).then(function (clientList) {
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i]
        // Use startsWith to match base url (handle params/hash)
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
