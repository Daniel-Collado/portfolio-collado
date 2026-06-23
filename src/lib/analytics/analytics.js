let analyticsInstance = null;
let logEventFn = null;

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
        analyticsModule,
        { initializeApp, getApps, getApp },
    ] = await Promise.all([
        import("firebase/analytics"),
        import("firebase/app"),
    ]);

    const {
        getAnalytics,
        isSupported,
        logEvent,
    } = analyticsModule;

    logEventFn = logEvent;

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

    logEventFn(
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

    logEventFn(
        analytics,
        eventName,
        params
    );
}

let lastSection = "";

const visibleProjects =
    new Set();

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

export async function trackProjectOpen(
    project
) {
    await trackEvent(
        "project_open",
        {
            project_name:
                project,
        }
    );
}

export async function trackGithubOpen(
    project
) {
    await trackEvent(
        "project_github_open",
        {
            project_name:
                project,
        }
    );
}

export async function trackProjectVisible(
    project
) {
    if (
        !project ||
        visibleProjects.has(
            project
        )
    ) {
        return;
    }

    visibleProjects.add(
        project
    );

    await trackEvent(
        "project_visible",
        {
            project_name:
                project,
        }
    );
}

export async function trackContactSubmit() {
    await trackEvent(
        "contact_submit"
    );
}

export async function trackContactSubmitError(
    reason
) {
    await trackEvent(
        "contact_submit_error",
        {
            reason,
        }
    );
}

export async function trackThemeChange(theme) {
    await trackEvent("theme_changed", { theme });
}

export async function trackLanguageChange(language) {
    await trackEvent("language_changed", { language });
}