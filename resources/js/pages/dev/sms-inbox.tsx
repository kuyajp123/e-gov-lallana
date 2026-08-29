import { Head, router } from '@inertiajs/react';
import {
    Phone,
    Send,
    Trash2,
    ShieldAlert,
    CheckCircle2,
    Clock,
    XCircle,
    AlertTriangle,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';

interface SmsMessage {
    id: string;
    recipient: string;
    message: string;
    mode: string;
    status: 'SENT' | 'FAILED' | 'TIMEOUT' | 'RATE_LIMITED';
    error?: string;
    sent_at: string;
}

interface DevSmsInboxProps {
    messages: SmsMessage[];
    currentMode: string;
    configuredProvider: string;
}

export default function DevSmsInbox({
    messages,
    currentMode,
    configuredProvider,
}: DevSmsInboxProps) {
    const [recipient, setRecipient] = useState('09171234567');
    const [message, setMessage] = useState(
        'Your Barangay Lallana OTP is 483921.',
    );
    const [isSending, setIsSending] = useState(false);

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
        if (confirm('Clear all simulated messages?')) {
            router.delete('/dev/sms/clear', { preserveScroll: true });
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'SENT':
                return (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400">
                        <CheckCircle2 className="h-3.5 w-3.5" /> SENT
                    </span>
                );
            case 'TIMEOUT':
                return (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-400">
                        <Clock className="h-3.5 w-3.5" /> TIMEOUT
                    </span>
                );
            case 'RATE_LIMITED':
                return (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-200 bg-purple-50 px-2.5 py-1 text-xs font-semibold text-purple-700 dark:border-purple-800 dark:bg-purple-950/50 dark:text-purple-400">
                        <AlertTriangle className="h-3.5 w-3.5" /> RATE LIMITED
                    </span>
                );
            case 'FAILED':
            default:
                return (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 dark:border-rose-800 dark:bg-rose-950/50 dark:text-rose-400">
                        <XCircle className="h-3.5 w-3.5" /> FAILED
                    </span>
                );
        }
    };

    return (
        <div className="min-h-screen bg-neutral-50 p-6 font-sans text-neutral-900 md:p-10 dark:bg-neutral-950 dark:text-neutral-100">
            <Head title="Developer SMS Inbox — Barangay Lallana" />

            <div className="mx-auto max-w-5xl space-y-8">
                {/* Header */}
                <div className="flex flex-col justify-between gap-4 border-b border-neutral-200 pb-6 md:flex-row md:items-center dark:border-neutral-800">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="rounded bg-violet-100 px-2.5 py-0.5 font-mono text-xs font-semibold text-violet-800 dark:bg-violet-950 dark:text-violet-300">
                                LOCAL DEV ONLY
                            </span>
                            <span className="text-xs text-neutral-500">
                                Provider:{' '}
                                <code className="font-mono font-semibold text-neutral-700 dark:text-neutral-300">
                                    {configuredProvider}
                                </code>
                            </span>
                        </div>
                        <h1 className="mt-1 flex items-center gap-2.5 text-2xl font-bold tracking-tight md:text-3xl">
                            <Phone className="h-7 w-7 text-violet-600" />
                            Developer SMS Simulator & Inbox
                        </h1>
                        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                            Simulates and visualizes all outbound SMS, OTP
                            codes, and document notifications with zero telco
                            charges.
                        </p>
                    </div>

                    {messages.length > 0 && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleClear}
                            className="self-start text-rose-600 hover:text-rose-700 md:self-auto"
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Clear Inbox
                        </Button>
                    )}
                </div>

                {/* Simulator Controls & Dispatch */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {/* Mode Selector */}
                    <div className="space-y-4 rounded-xl border border-neutral-200 bg-white p-6 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="flex items-center gap-2 text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                            <ShieldAlert className="h-4 w-4 text-violet-600" />
                            Simulation Response Mode
                        </div>
                        <p className="text-xs text-neutral-500">
                            Force the fake provider to simulate different
                            network/carrier outcomes:
                        </p>

                        <div className="grid grid-cols-2 gap-2">
                            {[
                                'SUCCESS',
                                'FAILURE',
                                'TIMEOUT',
                                'RATE_LIMITED',
                            ].map((mode) => (
                                <button
                                    key={mode}
                                    type="button"
                                    onClick={() => handleModeChange(mode)}
                                    className={`rounded-lg border px-3 py-2 text-center text-xs font-semibold transition-all ${
                                        currentMode === mode
                                            ? 'border-violet-600 bg-violet-600 text-white shadow-xs'
                                            : 'border-neutral-200 bg-neutral-50 text-neutral-700 hover:border-violet-300 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'
                                    }`}
                                >
                                    {mode.replace('_', ' ')}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Test Send Form */}
                    <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-xs md:col-span-2 dark:border-neutral-800 dark:bg-neutral-900">
                        <form onSubmit={handleSendTest} className="space-y-4">
                            <div className="flex items-center gap-2 text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                                <Send className="h-4 w-4 text-violet-600" />
                                Send Test Simulated SMS
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                <div>
                                    <Label
                                        htmlFor="recipient"
                                        className="text-xs"
                                    >
                                        Recipient Number
                                    </Label>
                                    <Input
                                        id="recipient"
                                        value={recipient}
                                        onChange={(
                                            e: React.ChangeEvent<HTMLInputElement>,
                                        ) => setRecipient(e.target.value)}
                                        placeholder="09171234567"
                                        required
                                        className="mt-1 font-mono text-sm"
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <Label
                                        htmlFor="message"
                                        className="text-xs"
                                    >
                                        Message Content
                                    </Label>
                                    <Input
                                        id="message"
                                        value={message}
                                        onChange={(
                                            e: React.ChangeEvent<HTMLInputElement>,
                                        ) => setMessage(e.target.value)}
                                        placeholder="Enter SMS text..."
                                        required
                                        className="mt-1 text-sm"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <Button
                                    type="submit"
                                    size="sm"
                                    disabled={isSending}
                                    className="bg-violet-600 text-white hover:bg-violet-700"
                                >
                                    <Send className="mr-2 h-3.5 w-3.5" />
                                    {isSending
                                        ? 'Simulating...'
                                        : 'Dispatch Simulated SMS'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Messages List */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold">
                            Simulated Messages ({messages.length})
                        </h2>
                        <span className="text-xs text-neutral-500">
                            Auto-persisted in local cache (7 days)
                        </span>
                    </div>

                    {messages.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-neutral-300 bg-white p-12 text-center dark:border-neutral-800 dark:bg-neutral-900">
                            <Phone className="mx-auto mb-3 h-10 w-10 text-neutral-300 dark:text-neutral-700" />
                            <h3 className="font-semibold text-neutral-700 dark:text-neutral-300">
                                No simulated SMS sent yet
                            </h3>
                            <p className="mt-1 text-sm text-neutral-500">
                                Trigger an OTP, document update, or use the test
                                form above to see messages appear here.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className="space-y-3 rounded-xl border border-neutral-200 bg-white p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900"
                                >
                                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-100 pb-3 dark:border-neutral-800/60">
                                        <div className="flex items-center gap-3">
                                            <span className="font-mono text-sm font-semibold text-violet-600 dark:text-violet-400">
                                                {msg.recipient}
                                            </span>
                                            {getStatusBadge(msg.status)}
                                        </div>
                                        <span className="font-mono text-xs text-neutral-400">
                                            {msg.sent_at}
                                        </span>
                                    </div>

                                    <div className="rounded-lg border border-neutral-100 bg-neutral-50 p-3 font-mono text-sm leading-relaxed break-words dark:border-neutral-800 dark:bg-neutral-950/60">
                                        {msg.message}
                                    </div>

                                    {msg.error && (
                                        <div className="flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400">
                                            <XCircle className="h-3.5 w-3.5 shrink-0" />
                                            {msg.error}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
