/* eslint-disable no-undef */
// Firebase Hosting injects project config via /__/firebase/init.js
importScripts('/__/firebase/11.10.0/firebase-app-compat.js')
importScripts('/__/firebase/11.10.0/firebase-messaging-compat.js')
importScripts('/__/firebase/init.js')

const messaging = firebase.messaging()

messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title ?? 'AceIGCSE'
  const body = payload.notification?.body ?? 'Keep your streak going!'
  self.registration.showNotification(title, { body, icon: '/favicon.png', data: payload.data })
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(clients.openWindow('/dashboard'))
})
