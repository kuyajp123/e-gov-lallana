import { usePage } from '@inertiajs/react';
import { Turnstile } from '@marsidev/react-turnstile';

interface TurnstileWidgetProps {
    onSuccess: (token: string) => void;
    onError?: () => void;
    onExpire?: () => void;
    className?: string;
}

export function TurnstileWidget({
    onSuccess,
    onError,
    onExpire,
    className,
}: TurnstileWidgetProps) {
    const { props } = usePage<{ turnstileSiteKey?: string }>();
    const siteKey = props.turnstileSiteKey || '1x00000000000000000000AA'; // Fallback to Cloudflare testing dummy key

    return (
        <div className={`my-2 flex justify-center ${className || ''}`}>
            <Turnstile
                siteKey={siteKey}
                onSuccess={onSuccess}
                onError={onError}
                onExpire={onExpire}
                options={{
                    theme: 'auto',
                    size: 'normal',
                }}
            />
        </div>
    );
}
