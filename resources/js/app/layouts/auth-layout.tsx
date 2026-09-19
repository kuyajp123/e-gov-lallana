import AuthLayoutTemplate from '@/app/layouts/auth/auth-simple-layout';

export default function AuthLayout({
    title = '',
    description = '',
    className,
    children,
}: {
    title?: string;
    description?: string;
    className?: string;
    children: React.ReactNode;
}) {
    return (
        <AuthLayoutTemplate
            title={title}
            description={description}
            className={className}
        >
            {children}
        </AuthLayoutTemplate>
    );
}
