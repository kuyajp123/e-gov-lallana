import { Lock } from 'lucide-react';
import React from 'react';
import { Card, CardContent } from '@/shared/components/ui/card';

interface LockedModuleCardProps {
    title: string;
    description: string;
    reason?: string;
    icon?: React.ReactNode;
}

export function LockedModuleCard({
    title,
    description,
    reason = 'This feature requires an approved and verified Barangay Lallana Household record.',
    icon,
}: LockedModuleCardProps) {
    return (
        <Card className="relative overflow-hidden rounded-none border border-dashed border-border/80 bg-muted/20 opacity-80 shadow-none transition-all hover:opacity-90">
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <div className="relative mb-3 flex size-12 items-center justify-center rounded-none bg-muted text-muted-foreground">
                    {icon}
                    <div className="absolute -right-1 -bottom-1 flex size-5 items-center justify-center rounded-none bg-amber-500 text-white shadow-none">
                        <Lock className="size-3" />
                    </div>
                </div>

                <h4 className="text-base font-semibold text-foreground">
                    {title}
                </h4>
                <p className="mt-1 max-w-sm text-xs text-muted-foreground">
                    {description}
                </p>

                <div className="mt-4 rounded-none bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-800 dark:text-amber-300">
                    🔒 {reason}
                </div>
            </CardContent>
        </Card>
    );
}
