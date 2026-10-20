import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { 
  initializeFirestore, 
  persistentLocalCache, 
  persistentMultipleTabManager 
} from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDz9pEOx7DwwlBNgl-S1k66o6MmXXfIZ7M",
  authDomain: "vk-creation-studio-dffcd.firebaseapp.com",
  projectId: "vk-creation-studio-dffcd",
  storageBucket: "vk-creation-studio-dffcd.firebasestorage.app",
  messagingSenderId: "1008132813499",
  appId: "1:1008132813499:web:119c600846e37a1aefef9e"
};

// 1. Initialize Firebase App Safely
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);

// 2. Initialize Firestore with Offline Persistent Cache & Multi-Tab Support (Next.js 16 Fix)
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager(),
  }),
});