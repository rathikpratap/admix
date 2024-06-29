importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');
firebase.initializeApp({
    // apiKey: "AIzaSyBI2Tr1-YBb7y2Iev1GSqAdJDgr2kEMIfg",
    // authDomain: "admix-demo.firebaseapp.com",
    // projectId: "admix-demo",
    // storageBucket: "admix-demo.appspot.com",
    // messagingSenderId: "307998352143",
    // appId: "1:307998352143:web:87588e83badc06c8b9147a",
    // measurementId: "G-STKETZDSF0"
    apiKey: "AIzaSyArUyhOGe66UgZ7u_VMmP8JiufsMmZ5fY0",
    authDomain: "admixmedia-notification.firebaseapp.com",
    projectId: "admixmedia-notification",
    storageBucket: "admixmedia-notification.appspot.com",
    messagingSenderId: "637739116752",
    appId: "1:637739116752:web:c357c5d66c9d65ea46d6d5",
    measurementId: "G-N3ZYPDKH9W"
});
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    console.log('[firebase-messaging-sw.js] Received background message BOdy ', payload.notification.notificationOptions);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
      body: payload.notification.body,
      icon: '/firebase-logo.png'
    };
  
    self.registration.showNotification(notificationTitle, notificationOptions);
  });