# Setup Firebase Push Notification di Project Point

Berikut langkah-langkah setup push notifikasi Firebase yang sudah diimplementasikan di project ini:

## 1. Buat Project di Firebase Console
- Buka https://console.firebase.google.com/
- Buat project baru atau gunakan project yang sudah ada.
- Aktifkan layanan Cloud Messaging (FCM).

## 2. Ambil Konfigurasi Firebase
- Masuk ke project Firebase > Project settings > General.
- Di bagian "Your apps", pilih Web app (</>), lalu ambil konfigurasi firebaseConfig (apiKey, authDomain, projectId, dsb).
- Simpan konfigurasi ini di file `.env` atau file konfigurasi JS sesuai implementasi project.

## 3. Tambahkan File Konfigurasi di Project
- Buat file `firebase-config.js` di folder yang sesuai, misal `app/libs/` atau `src/libs/`.
- Contoh isi file:

```js
// firebase-config.js
export const firebaseConfig = {
  apiKey: 'xxx',
  authDomain: 'xxx',
  projectId: 'xxx',
  storageBucket: 'xxx',
  messagingSenderId: 'xxx',
  appId: 'xxx',
};
```

## 4. Inisialisasi Firebase di Project
- Pastikan sudah install package:
  ```bash
  npm install firebase
  ```
- Import dan inisialisasi Firebase di file utama atau file service worker:

```js
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { firebaseConfig } from './firebase-config';

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);
```

## 5. Setup Service Worker (public/firebase-messaging-sw.js)
- Buat file `public/firebase-messaging-sw.js` dengan isi:

```js
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'xxx',
  authDomain: 'xxx',
  projectId: 'xxx',
  storageBucket: 'xxx',
  messagingSenderId: 'xxx',
  appId: 'xxx',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: '/firebase-logo.png',
  });
});
```

## 6. Request Izin Notifikasi & Ambil Token
- Di aplikasi, request izin notifikasi dan ambil FCM token:

```js
Notification.requestPermission().then((permission) => {
  if (permission === 'granted') {
    getToken(messaging, { vapidKey: 'YOUR_VAPID_KEY' })
      .then((currentToken) => {
        if (currentToken) {
          // Kirim token ke backend
        }
      });
  }
});
```

## 7. Kirim Token ke Backend
- Kirim token FCM ke backend untuk disimpan dan digunakan mengirim push notifikasi.

## 8. Pengiriman Notifikasi
- Gunakan Firebase Cloud Messaging API atau library server-side untuk mengirim notifikasi ke token yang sudah disimpan.

---

**Catatan:**
- Ganti semua `xxx` dengan konfigurasi dari Firebase project Anda.
- Pastikan domain aplikasi sudah didaftarkan di Firebase Console.
- Untuk pengujian di local, gunakan domain yang sesuai dengan konfigurasi Firebase.

Jika sudah mengikuti langkah di atas, push notifikasi Firebase akan aktif di project Point.
