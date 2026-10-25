import { usePage } from '@inertiajs/react';

export function useTranslation() {
    const { translations = {}, locale = 'en' } = usePage<{
        translations: Record<string, any>;
        locale: string;
    }>().props;

    const t = (
        key: string,
        replacementsOrFallback?: Record<string, string | number> | string,
        fallbackOrReplacements?: Record<string, string | number> | string,
    ): string => {
        let replacements: Record<string, string | number> | undefined;
        let defaultText: string | undefined;

        if (typeof replacementsOrFallback === 'string') {
            defaultText = replacementsOrFallback;

            if (
                typeof fallbackOrReplacements === 'object' &&
                fallbackOrReplacements !== null
            ) {
                replacements = fallbackOrReplacements;
            }
        } else if (
            typeof replacementsOrFallback === 'object' &&
            replacementsOrFallback !== null
        ) {
            replacements = replacementsOrFallback;

            if (typeof fallbackOrReplacements === 'string') {
                defaultText = fallbackOrReplacements;
            }
        } else if (typeof fallbackOrReplacements === 'string') {
            defaultText = fallbackOrReplacements;
        }

        const parts = key.split('.');
        let current: any = translations;

        for (const part of parts) {
            if (current && typeof current === 'object' && part in current) {
                current = current[part];
            } else {
                current = undefined;
                break;
            }
        }

        let result =
            typeof current === 'string' ? current : (defaultText ?? key);

        if (replacements && result) {
            for (const [k, val] of Object.entries(replacements)) {
                result = result
                    .replace(new RegExp(`:${k}`, 'g'), String(val))
                    .replace(new RegExp(`\\{${k}\\}`, 'g'), String(val));
            }
        }

        return result;
    };

    return { t, locale, translations };
}
