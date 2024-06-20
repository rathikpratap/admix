importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');
firebase.initializeApp({
    apiKey: "AIzaSyBI2Tr1-YBb7y2Iev1GSqAdJDgr2kEMIfg",
    authDomain: "admix-demo.firebaseapp.com",
    projectId: "admix-demo",
    storageBucket: "admix-demo.appspot.com",
    messagingSenderId: "307998352143",
    appId: "1:307998352143:web:87588e83badc06c8b9147a",
    measurementId: "G-STKETZDSF0"
});
const messaging = firebase.messaging();