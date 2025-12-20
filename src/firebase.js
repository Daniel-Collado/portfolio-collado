// src/firebase.js
// Lazy Firebase loader: no inicializa Firebase hasta que alguien lo pida.
// Esto evita que Firebase se cargue en la HOME.

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

let _appPromise = null;
let _authPromise = null;
let _dbPromise = null;

async function getApp() {
    if (!_appPromise) {
        _appPromise = (async () => {
        const { initializeApp, getApps, getApp } = await import("firebase/app");
        // Evita reinicializar si ya existe
        const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
        return app;
        })();
    }
    return _appPromise;
}

export async function getAuth() {
    if (!_authPromise) {
        _authPromise = (async () => {
        const app = await getApp();
        const { getAuth } = await import("firebase/auth");
        return getAuth(app);
        })();
    }
    return _authPromise;
}

export async function getDb() {
    if (!_dbPromise) {
        _dbPromise = (async () => {
        const app = await getApp();
        const { getFirestore } = await import("firebase/firestore");
        return getFirestore(app);
        })();
    }
    return _dbPromise;
}
