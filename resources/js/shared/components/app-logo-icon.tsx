import type { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon({
    className,
    alt = 'Barangay Lallana Logo',
    ...props
}: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img
            src="/lallana-icon.png"
            alt={alt}
            className={`object-contain ${className ?? ''}`}
            {...props}
        />
    );
}
