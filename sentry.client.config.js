import * as Sentry from "@sentry/nextjs";

if (process.env.NEXT_PUBLIC_SENTRY_DSN && process.env.NODE_ENV === 'production') {
    Sentry.init({
        dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
        integrations: [
            new Sentry.BrowserTracing(),
            new Sentry.Replay(),
        ],
        tracesSampleRate: 0.5,
        replaysSessionSampleRate: 0.1,
        replaysOnErrorSampleRate: 1.0,
        ignoreErrors: [
            'ResizeObserver loop limit exceeded',
            'ResizeObserver loop completed with undelivered notifications',
            'jigsaw is not defined',
            /undefined is not an object \(evaluating '\e.startTime\'/i,
        ],
         denyUrls: [
            // Chrome extensions
            /extensions\//i,
            /chrome-extension/i,
            /^chrome:\/\//i,
            /safari-extension/,
            // Google Adsense
            /pagead\/js/i,
            // Other plugins
            /127\.0\.0\.1:4001\/isrunning/i, // Cacaoweb
            /webappstoolbarba\.texthelp\.com\//i,
            /metrics\.itunes\.apple\.com\.edgesuite\.net\//i,
        ]
    });
}
