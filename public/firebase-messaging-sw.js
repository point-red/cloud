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
  const actions = notification.actions || data.actions || [
    {
      action: 'mark-as-read',
      title: 'Mark as Read'
    }
  ]
  const options = {
    body: notification.body || data.body || '',
    icon: notification.icon || '/firebase-logo.png',
    data: {
      ...data,
      click_action: data.click_action || notification.click_action || '/'
    },
    actions
  }
  event.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener('notificationclick', function (event) {
  event.notification.close()

  const action = event.action
  const data = event.notification.data || {}
  const domainProject = (data.domain_project || '').replace(/\/$/, '') // Ensure no trailing slash
  const clickAction = data.click_action || '/' // Default to root path if undefined

  // Validate domainProject and clickAction
  const isValidDomain = /^https?:\/\//.test(domainProject)
  const targetUrl = isValidDomain ? `${domainProject}${clickAction}` : clickAction

  // Handle "Mark as Read" action
  if (action === 'mark-as-read') {
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
        if (clientList.length > 0) {
          clientList[0].postMessage({ type: 'mark-as-read', id: data.notificationId })
        }
      })
    )
    return
  }

  // Handle notification click
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
      if (clientList.length > 0) {
        const client = clientList[0]
        client.focus()
        client.postMessage({ type: 'notification-click', path: clickAction, domainProject })
        return
      }
      // Open a new window if no client is available
      if (clients.openWindow) {
        return clients.openWindow(targetUrl)
      }
    })
  )
})
