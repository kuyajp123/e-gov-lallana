import { Head, router } from '@inertiajs/react';
import {
    Activity,
    AlertTriangle,
    Check,
    CheckCircle2,
    Clock,
    Copy,
    Cpu,
    Database,
    Phone,
    Radio,
    Send,
    ShieldAlert,
    ShieldCheck,
    Sparkles,
    Terminal,
    Trash2,
    XCircle,
} from 'lucide-react';
import React, { useState } from 'react';
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
import { Textarea } from '@/shared/components/ui/textarea';
import type { BreadcrumbItem } from '@/shared/types';

interface SmsMessage {
    id: string;
    recipient: string;
    message: string;
    mode: string;
    status: 'SENT' | 'FAILED' | 'TIMEOUT' | 'RATE_LIMITED';
    error?: string;
    sent_at: string;
}

interface SystemDiagnostics {
    phpVersion: string;
    laravelVersion: string;
    environment: string;
    debugMode: boolean;
    smsProvider: string;
    databaseDriver: string;
    queueDriver: string;
    systemTime: string;
}

interface DevSmsInboxProps {
    messages: SmsMessage[];
    currentMode: string;
    configuredProvider: string;
    appEnv?: string;
    diagnostics?: SystemDiagnostics;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin Console', href: '/admin' },
    { title: 'Developer Diagnostics', href: '/dev/sms' },
];

const PRESETS = [
    {
        id: 'otp',
        label: '🔢 OTP Code',
        generate: () =>
            `Your Barangay Lallana OTP is ${Math.floor(100000 + Math.random() * 900000)}. Valid for 5 minutes.`,
    },
    {
        id: 'ready',
        label: '📄 Document Ready',
        generate: () =>
            'Good day! Your requested Barangay Clearance (REQ-2026-0042) is now ready for pickup at the Barangay Hall.',
    },
    {
        id: 'verified',
        label: '🏠 Household Verified',
        generate: () =>
            'Congratulations! Your household profile (HH-2026-0015) has been officially verified by Barangay Lallana.',
    },
    {
        id: 'clarify',
        label: '⚠️ Action Required',
        generate: () =>
            'Barangay Lallana: Your document request requires clarification. Please sign in to your resident portal.',
    },
];

const MODES = [
    {
        id: 'SUCCESS',
        label: 'SUCCESS',
        description: 'Normal 200 OK delivery',
    },
    {
        id: 'FAILURE',
        label: 'FAILURE',
        description: 'Simulated 500 error',
    },
    {
        id: 'TIMEOUT',
        label: 'TIMEOUT',
        description: 'Gateway network timeout',
    },
    {
        id: 'RATE_LIMITED',
        label: 'RATE LIMITED',
        description: '429 quota exhaustion',
    },
];

export default function DevSmsInbox({
    messages = [],
    currentMode = 'SUCCESS',
    configuredProvider = 'fake',
    appEnv = 'local',
    diagnostics,
}: DevSmsInboxProps) {
    const [recipient, setRecipient] = useState('09171234567');
    const [message, setMessage] = useState(
        'Your Barangay Lallana OTP is 483921.',
    );
    const [isSending, setIsSending] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const handleModeChange = (mode: string) => {
        router.post('/dev/sms/mode', { mode }, { preserveScroll: true });
    };

    const handleSendTest = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSending(true);
        router.post(
            '/dev/sms/send',
            { recipient, message },
            {
                preserveScroll: true,
                onFinish: () => setIsSending(false),
            },
        );
    };

    const handleClear = () => {
        if (
            confirm(
                'Are you sure you want to clear all simulated SMS messages?',
            )
        ) {
            router.delete('/dev/sms/clear', { preserveScroll: true });
        }
    };

    const handleCopy = (id: string, text: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const applyPreset = (generate: () => string) => {
        setMessage(generate());
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'SENT':
                return (
                    <Badge
                        variant="outline"
                        className="gap-1 border-emerald-500/20 bg-emerald-500/10 text-xs font-semibold text-emerald-700 dark:text-emerald-400"
                    >
                        <CheckCircle2 className="h-3 w-3" /> SENT
                    </Badge>
                );
            case 'TIMEOUT':
                return (
                    <Badge
                        variant="outline"
                        className="gap-1 border-amber-500/20 bg-amber-500/10 text-xs font-semibold text-amber-700 dark:text-amber-400"
                    >
                        <Clock className="h-3 w-3" /> TIMEOUT
                    </Badge>
                );
            case 'RATE_LIMITED':
                return (
                    <Badge
                        variant="outline"
                        className="gap-1 border-purple-500/20 bg-purple-500/10 text-xs font-semibold text-purple-700 dark:text-purple-400"
                    >
                        <AlertTriangle className="h-3 w-3" /> RATE LIMITED
                    </Badge>
                );
            case 'FAILED':
            default:
                return (
                    <Badge
                        variant="outline"
                        className="gap-1 border-rose-500/20 bg-rose-500/10 text-xs font-semibold text-rose-700 dark:text-rose-400"
                    >
                        <XCircle className="h-3 w-3" /> FAILED
                    </Badge>
                );
        }
    };

    return (
        <>
            <Head title="Developer Diagnostics & SMS Simulator | Admin Console" />

            <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:p-6">
                {/* Page Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2.5">
                            <div className="rounded-lg bg-violet-500/10 p-2 text-violet-600 dark:text-violet-400">
                                <Terminal className="h-5 w-5" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                                        Developer Diagnostics & SMS Simulator
                                    </h1>
                                    <Badge
                                        variant="secondary"
                                        className="bg-violet-500/10 font-mono text-[11px] text-violet-700 dark:text-violet-400"
                                    >
                                        {appEnv.toUpperCase()} ONLY
                                    </Badge>
                                </div>
                                <p className="mt-0.5 text-xs text-muted-foreground">
                                    System runtime telemetry, mock telecom
                                    dispatch simulator, and local notification
                                    audit log.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <Badge
                            variant="outline"
                            className="gap-1 border-emerald-500/20 bg-emerald-500/10 text-xs text-emerald-700 dark:text-emerald-400"
                        >
                            <ShieldCheck className="h-3.5 w-3.5" />
                            Production 404 Guard Active
                        </Badge>
                        {messages.length > 0 && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleClear}
                                className="h-8 gap-1.5 text-xs text-destructive hover:text-destructive"
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                                Clear Inbox ({messages.length})
                            </Button>
                        )}
                    </div>
                </div>

                {/* System Diagnostics Metrics Grid */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <Card className="gap-2 p-4">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>Runtime Engine</span>
                            <Cpu className="h-4 w-4 text-primary" />
                        </div>
                        <div className="text-base font-bold text-foreground">
                            PHP {diagnostics?.phpVersion ?? '8.4+'}
                        </div>
                        <div className="font-mono text-[11px] text-muted-foreground">
                            Laravel v{diagnostics?.laravelVersion ?? '12'}
                        </div>
                    </Card>

                    <Card className="gap-2 p-4">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>Environment Mode</span>
                            <Activity className="h-4 w-4 text-violet-500" />
                        </div>
                        <div className="flex items-center gap-1.5 text-base font-bold text-foreground">
                            <span className="h-2 w-2 rounded-full bg-emerald-500" />
                            {appEnv.toUpperCase()}
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                            Debug:{' '}
                            {diagnostics?.debugMode ? 'Enabled' : 'Disabled'}
                        </div>
                    </Card>

                    <Card className="gap-2 p-4">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>Data & Queue</span>
                            <Database className="h-4 w-4 text-blue-500" />
                        </div>
                        <div className="text-base font-bold text-foreground capitalize">
                            {diagnostics?.databaseDriver ?? 'sqlite'}
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                            Queue: {diagnostics?.queueDriver ?? 'sync'}
                        </div>
                    </Card>

                    <Card className="gap-2 p-4">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>SMS Gateway</span>
                            <Radio className="h-4 w-4 text-emerald-500" />
                        </div>
                        <div className="font-mono text-base font-bold text-foreground">
                            {configuredProvider}
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                            Sim Mode:{' '}
                            <strong className="text-violet-600 dark:text-violet-400">
                                {currentMode}
                            </strong>
                        </div>
                    </Card>
                </div>

                {/* Simulation Controls & Dispatch Form */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Carrier Simulation Modes */}
                    <Card className="gap-4">
                        <CardHeader className="pb-2">
                            <div className="flex items-center gap-2">
                                <ShieldAlert className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                                <CardTitle className="text-sm font-semibold">
                                    Carrier Simulation Mode
                                </CardTitle>
                            </div>
                            <CardDescription className="text-xs">
                                Force the fake SMS provider to mimic various
                                carrier and network response outcomes:
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="grid grid-cols-2 gap-2">
                                {MODES.map((mode) => {
                                    const isActive = currentMode === mode.id;

                                    return (
                                        <button
                                            key={mode.id}
                                            type="button"
                                            onClick={() =>
                                                handleModeChange(mode.id)
                                            }
                                            className={`flex flex-col items-start rounded-lg border p-3 text-left transition-all ${
                                                isActive
                                                    ? 'border-violet-600 bg-violet-600/10 text-violet-900 shadow-2xs dark:border-violet-500 dark:bg-violet-950/40 dark:text-violet-200'
                                                    : 'border-border bg-card text-foreground hover:border-violet-300 dark:hover:border-violet-700'
                                            }`}
                                        >
                                            <div className="flex w-full items-center justify-between">
                                                <span className="text-xs font-bold">
                                                    {mode.label}
                                                </span>
                                                {isActive && (
                                                    <span className="h-2 w-2 rounded-full bg-violet-600 dark:bg-violet-400" />
                                                )}
                                            </div>
                                            <span className="mt-0.5 text-[10px] text-muted-foreground">
                                                {mode.description}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="rounded-md border border-dashed border-border/80 bg-muted/40 p-2.5 text-[11px] text-muted-foreground">
                                Active mode applies to all outbound SMS in the
                                application (registration OTP, document updates,
                                etc.).
                            </div>
                        </CardContent>
                    </Card>

                    {/* Dispatch Test SMS Form */}
                    <Card className="gap-4 lg:col-span-2">
                        <CardHeader className="pb-2">
                            <div className="flex items-center gap-2">
                                <Send className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                                <CardTitle className="text-sm font-semibold">
                                    Dispatch Simulated SMS
                                </CardTitle>
                            </div>
                            <CardDescription className="text-xs">
                                Test mobile notification triggers and preview
                                SMS formatting with live carrier simulation.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form
                                onSubmit={handleSendTest}
                                className="space-y-4"
                            >
                                {/* Quick Presets */}
                                <div>
                                    <div className="mb-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                                        <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                                        <span>Quick Scenario Presets:</span>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5">
                                        {PRESETS.map((preset) => (
                                            <button
                                                key={preset.id}
                                                type="button"
                                                onClick={() =>
                                                    applyPreset(preset.generate)
                                                }
                                                className="rounded-md border border-border bg-muted/60 px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-muted"
                                            >
                                                {preset.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                    <div>
                                        <Label
                                            htmlFor="recipient"
                                            className="text-xs"
                                        >
                                            Recipient Mobile Number
                                        </Label>
                                        <Input
                                            id="recipient"
                                            value={recipient}
                                            onChange={(
                                                e: React.ChangeEvent<HTMLInputElement>,
                                            ) => setRecipient(e.target.value)}
                                            placeholder="09171234567"
                                            required
                                            className="mt-1 h-9 font-mono text-sm"
                                        />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <div className="flex items-center justify-between">
                                            <Label
                                                htmlFor="message"
                                                className="text-xs"
                                            >
                                                SMS Message Body
                                            </Label>
                                            <span className="text-[11px] text-muted-foreground">
                                                {message.length} chars (
                                                {Math.ceil(
                                                    message.length / 160,
                                                ) || 1}{' '}
                                                SMS segment)
                                            </span>
                                        </div>
                                        <Textarea
                                            id="message"
                                            rows={3}
                                            value={message}
                                            onChange={(
                                                e: React.ChangeEvent<HTMLTextAreaElement>,
                                            ) => setMessage(e.target.value)}
                                            placeholder="Enter SMS message body..."
                                            required
                                            className="mt-1 min-h-[72px] font-sans text-xs"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-1">
                                    <div className="text-xs text-muted-foreground">
                                        Active Carrier Mode:{' '}
                                        <strong className="font-mono text-violet-600 dark:text-violet-400">
                                            {currentMode}
                                        </strong>
                                    </div>
                                    <Button
                                        type="submit"
                                        size="sm"
                                        disabled={isSending}
                                        className="h-8 gap-1.5 bg-violet-600 text-xs text-white shadow-2xs hover:bg-violet-700"
                                    >
                                        <Send className="h-3.5 w-3.5" />
                                        {isSending
                                            ? 'Simulating Dispatch...'
                                            : 'Dispatch Message'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                {/* Simulated Outbox & Audit Stream */}
                <Card className="gap-4">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div>
                            <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                                <CardTitle className="text-sm font-semibold">
                                    Intercepted SMS Outbox ({messages.length})
                                </CardTitle>
                            </div>
                            <CardDescription className="text-xs">
                                Real-time capture of all outbound OTPs, status
                                alerts, and notifications generated by the
                                system.
                            </CardDescription>
                        </div>
                        {diagnostics?.systemTime && (
                            <span className="font-mono text-[11px] text-muted-foreground">
                                System Clock: {diagnostics.systemTime}
                            </span>
                        )}
                    </CardHeader>
                    <CardContent>
                        {messages.length === 0 ? (
                            <div className="rounded-xl border border-dashed border-border/80 p-12 text-center">
                                <Phone className="mx-auto mb-3 h-10 w-10 text-muted-foreground/40" />
                                <h3 className="text-sm font-semibold text-foreground">
                                    No simulated SMS messages intercepted yet
                                </h3>
                                <p className="mx-auto mt-1 max-w-sm text-xs text-muted-foreground">
                                    Trigger a household OTP verification,
                                    document status change, or use the dispatch
                                    tool above to see messages logged here in
                                    real-time.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className="rounded-lg border border-border bg-card p-4 transition-all hover:border-violet-300/60 dark:hover:border-violet-700/60"
                                    >
                                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-2.5">
                                            <div className="flex items-center gap-2.5">
                                                <span className="font-mono text-sm font-bold text-foreground">
                                                    {msg.recipient}
                                                </span>
                                                {getStatusBadge(msg.status)}
                                                <Badge
                                                    variant="secondary"
                                                    className="font-mono text-[10px]"
                                                >
                                                    MODE: {msg.mode}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono text-xs text-muted-foreground">
                                                    {msg.sent_at}
                                                </span>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() =>
                                                        handleCopy(
                                                            msg.id,
                                                            msg.message,
                                                        )
                                                    }
                                                    className="h-7 w-7 text-muted-foreground hover:text-foreground"
                                                    title="Copy Message Text"
                                                >
                                                    {copiedId === msg.id ? (
                                                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                                                    ) : (
                                                        <Copy className="h-3.5 w-3.5" />
                                                    )}
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="mt-2.5 rounded-md border border-border/50 bg-muted/40 p-3 font-mono text-xs leading-relaxed break-words text-foreground">
                                            {msg.message}
                                        </div>

                                        {msg.error && (
                                            <div className="mt-2 flex items-center gap-1.5 rounded-md border border-destructive/20 bg-destructive/10 px-2.5 py-1.5 text-xs text-destructive">
                                                <XCircle className="h-3.5 w-3.5 shrink-0" />
                                                <span>
                                                    Simulation Failure:{' '}
                                                    {msg.error}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

DevSmsInbox.layout = {
    breadcrumbs,
};
