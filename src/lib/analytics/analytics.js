let analyticsInstance = null;

export async function getAnalyticsInstance() {
    if (analyticsInstance) {
        return analyticsInstance;
    }

    const measurementId =
        import.meta.env.VITE_FIREBASE_MEASUREMENT_ID;

    if (!measurementId) {
        return null;
    }

    const [
        { getAnalytics, isSupported },
        { initializeApp, getApps, getApp },
    ] = await Promise.all([
        import("firebase/analytics"),
        import("firebase/app"),
    ]);

    const supported =
        await isSupported();

    if (!supported) {
        return null;
    }

    const firebaseConfig = {
        apiKey:
            import.meta.env.VITE_FIREBASE_API_KEY,

        authDomain:
            import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,

        projectId:
            import.meta.env.VITE_FIREBASE_PROJECT_ID,

        storageBucket:
            import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,

        messagingSenderId:
            import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,

        appId:
            import.meta.env.VITE_FIREBASE_APP_ID,

        measurementId,
    };

    const app =
        getApps().length
            ? getApp()
            : initializeApp(firebaseConfig);

    analyticsInstance =
        getAnalytics(app);


    return analyticsInstance;
}

let lastTracked = "";

export async function trackPageView(path) {
    if (
        path.startsWith("/admin") ||
        path === "/adminlogin"
    ) {
        return;
    }

    if (lastTracked === path) {
        return;
    }

    lastTracked = path;

    const analytics =
        await getAnalyticsInstance();

    if (!analytics) {
        return;
    }

    const { logEvent } =
        await import(
            "firebase/analytics"
        );

    logEvent(
        analytics,
        "page_view",
        {
            page_path: path,
        }
    );
}

export async function trackEvent(
    eventName,
    params = {}
) {
    const analytics =
        await getAnalyticsInstance();

    if (!analytics) {
        return;
    }

    const { logEvent } =
        await import(
            "firebase/analytics"
        );

    logEvent(
        analytics,
        eventName,
        params
    );
}

let lastSection = "";

export async function trackSectionView(
    section
) {
    if (
        !section ||
        section === lastSection
    ) {
        return;
    }

    lastSection =
        section;

    await trackEvent(
        "section_view",
        {
            section_name:
                section,
        }
    );
}