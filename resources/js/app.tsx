import { createInertiaApp } from '@inertiajs/react';
import AppLayout from '@/app/layouts/app-layout';
import AuthLayout from '@/app/layouts/auth-layout';
import SettingsLayout from '@/app/layouts/settings/layout';
import { Toaster } from '@/shared/components/ui/sonner';
import { TooltipProvider } from '@/shared/components/ui/tooltip';
import { initializeTheme } from '@/shared/hooks/use-appearance';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

const featurePages = import.meta.glob<{ default: React.ComponentType }>(
    './features/*/pages/**/*.tsx',
);
const standalonePages = import.meta.glob<{ default: React.ComponentType }>(
    './pages/**/*.tsx',
);

async function resolvePageComponent(name: string) {
    const parts = name.split('/');

    if (parts.length > 1) {
        const [feature, ...rest] = parts;
        const key = `./features/${feature}/pages/${rest.join('/')}.tsx`;

        if (featurePages[key]) {
            const page = await featurePages[key]();

            return page.default;
        }
    }

    const key = `./pages/${name}.tsx`;

    if (standalonePages[key]) {
        const page = await standalonePages[key]();

        return page.default;
    }

    throw new Error(`Page not found: ${name}`);
}

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: resolvePageComponent,
    layout: (name) => {
        switch (true) {
            case name === 'welcome':
                return null;
            case name.startsWith('auth/'):
                return AuthLayout;
            case name.startsWith('settings/'):
                return [AppLayout, SettingsLayout];
            default:
                return AppLayout;
        }
    },
    strictMode: true,
    withApp(app) {
        return (
            <TooltipProvider delayDuration={0}>
                {app}
                <Toaster />
            </TooltipProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
