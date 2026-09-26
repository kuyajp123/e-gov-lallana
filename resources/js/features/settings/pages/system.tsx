import { Head, useForm } from '@inertiajs/react';
import {
    Activity,
    CheckCircle2,
    Clock,
    Database,
    Globe,
    Power,
    RefreshCw,
    Server,
    ShieldAlert,
    Zap,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import Heading from '@/shared/components/heading';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';

interface KeepAliveStatus {
    is_pgsql: boolean;
    enabled: boolean;
    interval: number;
    target_url: string;
    cron_available: boolean;
    net_available: boolean;
    job: {
        jobid?: number;
        schedule?: string;
        command?: string;
        active?: boolean;
    } | null;
    last_ping: {
        id?: number;
        status_code?: number;
        error_msg?: string | null;
        created?: string;
    } | null;
}

interface SystemSettingsProps {
    keepAlive: KeepAliveStatus;
}

export default function SystemSettings({ keepAlive }: SystemSettingsProps) {
    const { data, setData, post, processing, errors } = useForm({
        enabled: Boolean(keepAlive.enabled),
        interval: keepAlive.interval || 11,
        target_url: keepAlive.target_url || '',
    });

    const [testingPing, setTestingPing] = useState(false);
    const [testResult, setTestResult] = useState<{
        status: number;
        durationMs: number;
        text: string;
    } | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/settings/system/keep-alive', {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(
                    'System keep-alive settings updated successfully.',
                );
            },
            onError: (err) => {
                toast.error(
                    (Object.values(err)[0] as string) ||
                        'Failed to update system settings.',
                );
            },
        });
    };

    const handleTestPing = async () => {
        setTestingPing(true);
        setTestResult(null);
        const startTime = performance.now();

        try {
            const urlToTest = data.target_url || '/healthz';
            const response = await fetch(urlToTest, {
                method: 'GET',
                cache: 'no-store',
            });
            const durationMs = Math.round(performance.now() - startTime);
            const text = await response.text();

            setTestResult({
                status: response.status,
                durationMs,
                text: text.slice(0, 50),
            });

            if (response.ok) {
                toast.success(
                    `Endpoint responded with HTTP ${response.status} in ${durationMs}ms`,
                );
            } else {
                toast.error(
                    `Endpoint returned HTTP ${response.status} (${response.statusText})`,
                );
            }
        } catch (error) {
            const durationMs = Math.round(performance.now() - startTime);
            setTestResult({
                status: 0,
                durationMs,
                text: error instanceof Error ? error.message : 'Network error',
            });
            toast.error('Failed to connect to healthcheck endpoint.');
        } finally {
            setTestingPing(false);
        }
    };

    return (
        <>
            <Head title="System & Server Settings" />

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title="System & Server Settings"
                    description="Configure infrastructure background workers, server keep-alive, and cloud integration."
                />

                {/* Render Keep-Alive Main Card */}
                <Card className="border-border/80 shadow-xs">
                    <CardHeader className="pb-4">
                        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <Zap className="size-5 text-amber-500" />
                                    <CardTitle className="text-base font-semibold">
                                        Render Free-Tier Keep-Alive Service
                                    </CardTitle>
                                </div>
                                <CardDescription className="text-xs">
                                    Automates non-blocking HTTP pings from
                                    Supabase (via PostgreSQL pg_cron + pg_net)
                                    to prevent Render instances from sleeping.
                                </CardDescription>
                            </div>

                            <Badge
                                variant={data.enabled ? 'default' : 'secondary'}
                                className={`h-6 gap-1 px-2.5 text-xs font-medium ${
                                    data.enabled
                                        ? 'bg-emerald-600 hover:bg-emerald-600 dark:bg-emerald-500'
                                        : ''
                                }`}
                            >
                                <span
                                    className={`size-1.5 rounded-full ${
                                        data.enabled
                                            ? 'animate-pulse bg-white'
                                            : 'bg-muted-foreground'
                                    }`}
                                />
                                {data.enabled
                                    ? `Active (Every ${data.interval}m)`
                                    : 'Disabled'}
                            </Badge>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Toggle Switch Bar */}
                            <div className="flex items-center justify-between rounded-xl border border-border/80 bg-muted/30 p-4">
                                <div className="space-y-0.5">
                                    <div className="text-sm font-medium text-foreground">
                                        Keep-Alive Automation
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        Toggle whether Supabase should schedule
                                        recurring background pings to Render.
                                    </div>
                                </div>

                                <Button
                                    type="button"
                                    variant={
                                        data.enabled ? 'default' : 'outline'
                                    }
                                    size="sm"
                                    onClick={() =>
                                        setData('enabled', !data.enabled)
                                    }
                                    className={`h-9 gap-2 text-xs font-semibold ${
                                        data.enabled
                                            ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                                            : 'text-muted-foreground'
                                    }`}
                                >
                                    <Power className="size-3.5" />
                                    {data.enabled ? 'Enabled' : 'Disabled'}
                                </Button>
                            </div>

                            {/* Target Endpoint Field */}
                            <div className="space-y-2">
                                <Label
                                    htmlFor="target_url"
                                    className="text-xs font-semibold"
                                >
                                    Target Healthcheck Endpoint
                                </Label>
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <Globe className="absolute top-2.5 left-3 size-4 text-muted-foreground" />
                                        <Input
                                            id="target_url"
                                            type="url"
                                            value={data.target_url}
                                            onChange={(e) =>
                                                setData(
                                                    'target_url',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="https://e-gov-lallana.onrender.com/healthz"
                                            className="pl-9 font-mono text-xs"
                                        />
                                    </div>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={handleTestPing}
                                        disabled={testingPing}
                                        className="h-9 shrink-0 gap-1.5 text-xs"
                                    >
                                        <Activity
                                            className={`size-3.5 ${
                                                testingPing
                                                    ? 'animate-spin'
                                                    : ''
                                            }`}
                                        />
                                        {testingPing
                                            ? 'Testing...'
                                            : 'Test Ping'}
                                    </Button>
                                </div>
                                <p className="text-[11px] text-muted-foreground">
                                    Calls the zero-overhead{' '}
                                    <code className="rounded bg-muted px-1 py-0.5 font-mono text-[10px] text-foreground">
                                        /healthz
                                    </code>{' '}
                                    route. Returns HTTP 200 without executing
                                    any database queries or loading session
                                    state.
                                </p>
                                {errors.target_url && (
                                    <p className="text-xs text-destructive">
                                        {errors.target_url}
                                    </p>
                                )}

                                {/* Test Result Display */}
                                {testResult && (
                                    <div
                                        className={`mt-2 flex items-center justify-between rounded-lg border p-2.5 text-xs ${
                                            testResult.status === 200
                                                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-900 dark:text-emerald-200'
                                                : 'border-destructive/30 bg-destructive/10 text-destructive'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            {testResult.status === 200 ? (
                                                <CheckCircle2 className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                                            ) : (
                                                <ShieldAlert className="size-4 shrink-0" />
                                            )}
                                            <span>
                                                HTTP {testResult.status} (
                                                {testResult.text})
                                            </span>
                                        </div>
                                        <span className="font-mono text-[11px] opacity-80">
                                            {testResult.durationMs}ms latency
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Interval Field */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label
                                        htmlFor="interval"
                                        className="text-xs font-semibold"
                                    >
                                        Ping Frequency (Minutes)
                                    </Label>
                                    <span className="text-[11px] text-muted-foreground">
                                        Render sleeps after 15m idle
                                    </span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="relative w-36">
                                        <Clock className="absolute top-2.5 left-3 size-4 text-muted-foreground" />
                                        <Input
                                            id="interval"
                                            type="number"
                                            min={2}
                                            max={59}
                                            value={data.interval}
                                            onChange={(e) =>
                                                setData(
                                                    'interval',
                                                    parseInt(e.target.value) ||
                                                        11,
                                                )
                                            }
                                            className="pl-9 font-mono text-xs"
                                        />
                                    </div>

                                    {/* Presets */}
                                    <div className="flex items-center gap-1.5">
                                        {[10, 11, 12].map((mins) => (
                                            <Button
                                                key={mins}
                                                type="button"
                                                size="sm"
                                                variant={
                                                    data.interval === mins
                                                        ? 'secondary'
                                                        : 'ghost'
                                                }
                                                onClick={() =>
                                                    setData('interval', mins)
                                                }
                                                className="h-8 px-2.5 font-mono text-xs"
                                            >
                                                {mins}m
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                                <p className="text-[11px] text-muted-foreground">
                                    Recommended:{' '}
                                    <strong>11 or 12 minutes</strong> to provide
                                    a safe safety buffer before Render's
                                    15-minute inactivity countdown.
                                </p>
                                {errors.interval && (
                                    <p className="text-xs text-destructive">
                                        {errors.interval}
                                    </p>
                                )}
                            </div>

                            {/* Save Submit Button */}
                            <div className="flex items-center justify-end pt-2">
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    size="sm"
                                    className="h-9 gap-1.5 px-4 text-xs font-semibold"
                                >
                                    <RefreshCw
                                        className={`size-3.5 ${
                                            processing ? 'animate-spin' : ''
                                        }`}
                                    />
                                    {processing
                                        ? 'Saving Changes...'
                                        : 'Save System Settings'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Infrastructure Diagnostics Card */}
                <Card className="border-border/80 shadow-xs">
                    <CardHeader className="pb-3">
                        <div className="flex items-center gap-2">
                            <Server className="size-4 text-muted-foreground" />
                            <CardTitle className="text-sm font-semibold">
                                Supabase & Infrastructure Diagnostics
                            </CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                            {/* Database Driver */}
                            <div className="rounded-lg border border-border/80 bg-muted/20 p-3">
                                <div className="text-[11px] text-muted-foreground">
                                    Database Driver
                                </div>
                                <div className="mt-1 flex items-center gap-1.5 text-xs font-medium">
                                    <Database className="size-3.5 text-primary" />
                                    {keepAlive.is_pgsql
                                        ? 'PostgreSQL (Supabase)'
                                        : 'SQLite (Local / Testing)'}
                                </div>
                            </div>

                            {/* pg_cron Extension */}
                            <div className="rounded-lg border border-border/80 bg-muted/20 p-3">
                                <div className="text-[11px] text-muted-foreground">
                                    pg_cron Extension
                                </div>
                                <div className="mt-1 flex items-center gap-1.5 text-xs font-medium">
                                    {keepAlive.cron_available ? (
                                        <>
                                            <span className="size-2 rounded-full bg-emerald-500" />
                                            <span className="text-emerald-700 dark:text-emerald-400">
                                                Installed & Available
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="size-2 rounded-full bg-amber-500" />
                                            <span className="text-amber-700 dark:text-amber-400">
                                                {keepAlive.is_pgsql
                                                    ? 'Not Detected in DB'
                                                    : 'Not applicable (Local)'}
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* pg_net Extension */}
                            <div className="rounded-lg border border-border/80 bg-muted/20 p-3">
                                <div className="text-[11px] text-muted-foreground">
                                    pg_net Extension
                                </div>
                                <div className="mt-1 flex items-center gap-1.5 text-xs font-medium">
                                    {keepAlive.net_available ? (
                                        <>
                                            <span className="size-2 rounded-full bg-emerald-500" />
                                            <span className="text-emerald-700 dark:text-emerald-400">
                                                Installed & Available
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="size-2 rounded-full bg-amber-500" />
                                            <span className="text-amber-700 dark:text-amber-400">
                                                {keepAlive.is_pgsql
                                                    ? 'Not Detected in DB'
                                                    : 'Not applicable (Local)'}
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Recent Ping Log Details if available */}
                        {keepAlive.last_ping && (
                            <div className="rounded-lg border border-border/80 bg-muted/30 p-3 text-xs">
                                <div className="flex items-center justify-between">
                                    <span className="font-semibold text-foreground">
                                        Latest Automated pg_net Ping Response:
                                    </span>
                                    <Badge
                                        variant={
                                            keepAlive.last_ping.status_code ===
                                            200
                                                ? 'default'
                                                : 'destructive'
                                        }
                                        className="h-5 px-2 text-[10px]"
                                    >
                                        HTTP {keepAlive.last_ping.status_code}
                                    </Badge>
                                </div>
                                <div className="mt-1 flex items-center gap-4 text-[11px] text-muted-foreground">
                                    <span>
                                        Timestamp:{' '}
                                        {keepAlive.last_ping.created ||
                                            'Recently'}
                                    </span>
                                    {keepAlive.last_ping.error_msg && (
                                        <span className="text-destructive">
                                            Error:{' '}
                                            {keepAlive.last_ping.error_msg}
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Setup Notice for Supabase Dashboard */}
                        {keepAlive.is_pgsql &&
                            (!keepAlive.cron_available ||
                                !keepAlive.net_available) && (
                                <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-900 dark:text-amber-200">
                                    <p className="font-semibold">
                                        Need to enable pg_cron or pg_net in
                                        Supabase?
                                    </p>
                                    <p className="mt-1 text-[11px] opacity-90">
                                        Go to your{' '}
                                        <strong>Supabase Dashboard</strong>{' '}
                                        &rarr; <strong>Database</strong> &rarr;{' '}
                                        <strong>Extensions</strong>, and toggle
                                        on <code>pg_cron</code> and{' '}
                                        <code>pg_net</code>. Or run in the SQL
                                        Editor:
                                    </p>
                                    <pre className="mt-2 rounded bg-black/80 p-2 font-mono text-[10px] text-white">
                                        {`CREATE EXTENSION IF NOT EXISTS pg_cron;\nCREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;`}
                                    </pre>
                                </div>
                            )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

SystemSettings.layout = {
    breadcrumbs: [
        {
            title: 'System settings',
            href: '/settings/system',
        },
    ],
};
