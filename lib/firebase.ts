// lib/firebase.ts
import { initializeApp } from "firebase/app"
import { getMessaging, getToken, onMessage } from "firebase/messaging"

const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "YOUR_FIREBASE_AUTH_DOMAIN",
  projectId: "YOUR_FIREBASE_PROJECT_ID",
  messagingSenderId: "YOUR_FIREBASE_MESSAGING_SENDER_ID",
  appId: "YOUR_FIREBASE_APP_ID",
}


let app: ReturnType<typeof initializeApp> | undefined = undefined;
let messaging: ReturnType<typeof getMessaging> | undefined = undefined;

function getFirebaseApp() {
  if (!app && typeof window !== "undefined") {
    app = initializeApp(firebaseConfig);
  }
  return app;
}

function getFirebaseMessaging() {
  if (!messaging && typeof window !== "undefined" && typeof navigator !== "undefined") {
    const firebaseApp = getFirebaseApp();
    if (firebaseApp) {
      messaging = getMessaging(firebaseApp);
    }
  }
  return messaging;
}

export { getFirebaseMessaging as messaging };


export async function requestNotificationPermission() {
  if (typeof window === "undefined" || !('Notification' in window)) return false;
  if (!('Notification' in window)) return false;
  const permission = await Notification.requestPermission();
  return permission === "granted";
}


export async function getFcmToken() {
  const messagingInstance = getFirebaseMessaging();
  if (!messagingInstance) return null;
  try {
    const token = await getToken(messagingInstance, { vapidKey: "YOUR_PUBLIC_VAPID_KEY" });
    return token;
  } catch (e) {
    return null;
  }
}


export function onForegroundMessage(callback: (payload: any) => void) {
  const messagingInstance = getFirebaseMessaging();
  if (!messagingInstance) return;
  onMessage(messagingInstance, callback);
}
