import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Phone, Send, Trash2, ShieldAlert, CheckCircle2, Clock, XCircle, AlertTriangle } from 'lucide-react';

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

export default function DevSmsInbox({ messages, currentMode, configuredProvider }: DevSmsInboxProps) {
    const [recipient, setRecipient] = useState('09171234567');
    const [message, setMessage] = useState('Your Barangay Lallana OTP is 483921.');
    const [isSending, setIsSending] = useState(false);

    const handleModeChange = (mode: string) => {
        router.post('/dev/sms/mode', { mode }, { preserveScroll: true });
    };

    const handleSendTest = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSending(true);
        router.post('/dev/sms/send', { recipient, message }, {
            preserveScroll: true,
            onFinish: () => setIsSending(false),
        });
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
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                        <CheckCircle2 className="w-3.5 h-3.5" /> SENT
                    </span>
                );
            case 'TIMEOUT':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                        <Clock className="w-3.5 h-3.5" /> TIMEOUT
                    </span>
                );
            case 'RATE_LIMITED':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
                        <AlertTriangle className="w-3.5 h-3.5" /> RATE LIMITED
                    </span>
                );
            case 'FAILED':
            default:
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
                        <XCircle className="w-3.5 h-3.5" /> FAILED
                    </span>
                );
        }
    };

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 p-6 md:p-10 font-sans">
            <Head title="Developer SMS Inbox — Barangay Lallana" />

            <div className="max-w-5xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-6">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded text-xs font-mono font-semibold bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-300">
                                LOCAL DEV ONLY
                            </span>
                            <span className="text-xs text-neutral-500">Provider: <code className="text-neutral-700 dark:text-neutral-300 font-mono font-semibold">{configuredProvider}</code></span>
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight mt-1 flex items-center gap-2.5">
                            <Phone className="w-7 h-7 text-violet-600" />
                            Developer SMS Simulator & Inbox
                        </h1>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                            Simulates and visualizes all outbound SMS, OTP codes, and document notifications with zero telco charges.
                        </p>
                    </div>

                    {messages.length > 0 && (
                        <Button variant="outline" size="sm" onClick={handleClear} className="text-rose-600 hover:text-rose-700 self-start md:self-auto">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Clear Inbox
                        </Button>
                    )}
                </div>

                {/* Simulator Controls & Dispatch */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Mode Selector */}
                    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 shadow-xs space-y-4">
                        <div className="flex items-center gap-2 text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                            <ShieldAlert className="w-4 h-4 text-violet-600" />
                            Simulation Response Mode
                        </div>
                        <p className="text-xs text-neutral-500">
                            Force the fake provider to simulate different network/carrier outcomes:
                        </p>

                        <div className="grid grid-cols-2 gap-2">
                            {['SUCCESS', 'FAILURE', 'TIMEOUT', 'RATE_LIMITED'].map((mode) => (
                                <button
                                    key={mode}
                                    type="button"
                                    onClick={() => handleModeChange(mode)}
                                    className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-all text-center ${
                                        currentMode === mode
                                            ? 'bg-violet-600 text-white border-violet-600 shadow-xs'
                                            : 'bg-neutral-50 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:border-violet-300'
                                    }`}
                                >
                                    {mode.replace('_', ' ')}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Test Send Form */}
                    <div className="md:col-span-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 shadow-xs">
                        <form onSubmit={handleSendTest} className="space-y-4">
                            <div className="font-semibold text-sm text-neutral-800 dark:text-neutral-200 flex items-center gap-2">
                                <Send className="w-4 h-4 text-violet-600" />
                                Send Test Simulated SMS
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <Label htmlFor="recipient" className="text-xs">Recipient Number</Label>
                                    <Input
                                        id="recipient"
                                        value={recipient}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRecipient(e.target.value)}
                                        placeholder="09171234567"
                                        required
                                        className="mt-1 text-sm font-mono"
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <Label htmlFor="message" className="text-xs">Message Content</Label>
                                    <Input
                                        id="message"
                                        value={message}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMessage(e.target.value)}
                                        placeholder="Enter SMS text..."
                                        required
                                        className="mt-1 text-sm"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <Button type="submit" size="sm" disabled={isSending} className="bg-violet-600 hover:bg-violet-700 text-white">
                                    <Send className="w-3.5 h-3.5 mr-2" />
                                    {isSending ? 'Simulating...' : 'Dispatch Simulated SMS'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Messages List */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold">Simulated Messages ({messages.length})</h2>
                        <span className="text-xs text-neutral-500">Auto-persisted in local cache (7 days)</span>
                    </div>

                    {messages.length === 0 ? (
                        <div className="bg-white dark:bg-neutral-900 border border-dashed border-neutral-300 dark:border-neutral-800 rounded-xl p-12 text-center">
                            <Phone className="w-10 h-10 text-neutral-300 dark:text-neutral-700 mx-auto mb-3" />
                            <h3 className="font-semibold text-neutral-700 dark:text-neutral-300">No simulated SMS sent yet</h3>
                            <p className="text-sm text-neutral-500 mt-1">
                                Trigger an OTP, document update, or use the test form above to see messages appear here.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-xs space-y-3"
                                >
                                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-100 dark:border-neutral-800/60 pb-3">
                                        <div className="flex items-center gap-3">
                                            <span className="font-mono text-sm font-semibold text-violet-600 dark:text-violet-400">
                                                {msg.recipient}
                                            </span>
                                            {getStatusBadge(msg.status)}
                                        </div>
                                        <span className="text-xs text-neutral-400 font-mono">
                                            {msg.sent_at}
                                        </span>
                                    </div>

                                    <div className="p-3 bg-neutral-50 dark:bg-neutral-950/60 rounded-lg border border-neutral-100 dark:border-neutral-800 text-sm font-mono leading-relaxed break-words">
                                        {msg.message}
                                    </div>

                                    {msg.error && (
                                        <div className="text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                                            <XCircle className="w-3.5 h-3.5 shrink-0" />
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
