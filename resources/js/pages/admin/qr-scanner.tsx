import { Head, Link } from '@inertiajs/react';
import { BrowserQRCodeReader } from '@zxing/browser';
import type { IScannerControls } from '@zxing/browser';
import {
    AlertCircle,
    ArrowLeft,
    Camera,
    Clock,
    ExternalLink,
    History,
    Loader2,
    RefreshCw,
    ScanLine,
    ShieldCheck,
    SwitchCamera,
    Volume2,
    VolumeX,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from '@/shared/components/ui/avatar';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/shared/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/shared/components/ui/dialog';
import { Input } from '@/shared/components/ui/input';

interface RecentScan {
    token: string;
    reference_code: string;
    document_type: string;
    resident_name: string;
    status: string;
    last_scanned_formatted: string;
}

interface VerificationPayload {
    token: string;
    reference_code: string;
    document_type: string;
    request_id: number | null;
    current_status: string;
    payment_status: string;
    purpose: string;
    issued_at: string;
    expires_at: string | null;
    is_expired: boolean;
    scanned_count: number;
    resident: {
        id: number | null;
        name: string | null;
        email: string | null;
        contact_number: string | null;
        purok: string | null;
        civil_status: string | null;
        age: number | null;
        is_voter: boolean;
        is_pwd: boolean;
        is_senior: boolean;
        avatar_url: string | null;
    };
    household: {
        id: number;
        household_number: string;
        purok: string;
        status: string;
    } | null;
    admin_view_url: string | null;
}

interface AdminQrScannerProps {
    recentScans: RecentScan[];
}

export default function AdminQrScanner({ recentScans }: AdminQrScannerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const codeReaderRef = useRef<BrowserQRCodeReader | null>(null);
    const controlsRef = useRef<IScannerControls | null>(null);

    const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
    const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
    const [isScanning, setIsScanning] = useState<boolean>(false);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const [manualToken, setManualToken] = useState<string>('');
    const [isVerifying, setIsVerifying] = useState<boolean>(false);
    const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
    const [retryCount, setRetryCount] = useState<number>(0);

    const [verifiedData, setVerifiedData] =
        useState<VerificationPayload | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [modalOpen, setModalOpen] = useState<boolean>(false);

    // Synthesize audio feedback via Web Audio API
    const playSuccessChime = useCallback(() => {
        if (!soundEnabled) {
            return;
        }

        try {
            const ctx = new (
                window.AudioContext ||
                (
                    window as unknown as {
                        webkitAudioContext: typeof AudioContext;
                    }
                ).webkitAudioContext
            )();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
            osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1); // A5
            gain.gain.setValueAtTime(0.15, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(
                0.001,
                ctx.currentTime + 0.35,
            );
            osc.start();
            osc.stop(ctx.currentTime + 0.35);
        } catch {
            // AudioContext not permitted without user gesture
        }
    }, [soundEnabled]);

    const stopScanner = useCallback(() => {
        if (controlsRef.current) {
            controlsRef.current.stop();
            controlsRef.current = null;
        }

        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach((track) => track.stop());
            videoRef.current.srcObject = null;
        }

        setIsScanning(false);
    }, []);

    const verifyToken = useCallback(async (tokenToVerify: string) => {
        if (!tokenToVerify.trim()) {
            return;
        }

        setIsVerifying(true);
        setErrorMessage(null);

        try {
            const csrfToken =
                (
                    document.querySelector(
                        'meta[name="csrf-token"]',
                    ) as HTMLMetaElement
                )?.content || '';

            const res = await fetch('/admin/qr/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: JSON.stringify({ token: tokenToVerify }),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                setVerifiedData(data.payload);
                setModalOpen(true);
            } else {
                setErrorMessage(
                    data.message ||
                        'QR code verification failed. Document not recognized.',
                );
                setModalOpen(true);
                setVerifiedData(null);
            }
        } catch {
            setErrorMessage(
                'Network or server error verifying document QR token.',
            );
            setModalOpen(true);
            setVerifiedData(null);
        } finally {
            setIsVerifying(false);
        }
    }, []);

    const handleTokenScanned = useCallback(
        async (token: string) => {
            stopScanner();
            playSuccessChime();
            await verifyToken(token);
        },
        [stopScanner, playSuccessChime, verifyToken],
    );

    // Initialize camera devices
    useEffect(() => {
        codeReaderRef.current = new BrowserQRCodeReader();

        BrowserQRCodeReader.listVideoInputDevices()
            .then((videoInputDevices) => {
                setDevices(videoInputDevices);

                if (videoInputDevices.length > 0) {
                    // Prefer back camera on mobile
                    const backCam = videoInputDevices.find(
                        (d) =>
                            d.label.toLowerCase().includes('back') ||
                            d.label.toLowerCase().includes('rear') ||
                            d.label.toLowerCase().includes('environment'),
                    );
                    setSelectedDeviceId(
                        backCam
                            ? backCam.deviceId
                            : videoInputDevices[0].deviceId,
                    );
                }
            })
            .catch(() => {
                setCameraError(
                    'Unable to enumerate camera devices. Please check permissions.',
                );
            });

        return () => {
            stopScanner();
        };
    }, [stopScanner]);

    // Synchronize camera scanner with device selection and modal visibility
    useEffect(() => {
        const videoElement = videoRef.current;

        if (!selectedDeviceId || modalOpen) {
            return;
        }

        let isCancelled = false;

        const start = async () => {
            if (!codeReaderRef.current || !videoElement) {
                return;
            }

            if (controlsRef.current) {
                controlsRef.current.stop();
                controlsRef.current = null;
            }

            if (videoElement.srcObject) {
                const stream = videoElement.srcObject as MediaStream;
                stream.getTracks().forEach((track) => track.stop());
                videoElement.srcObject = null;
            }

            try {
                const controls =
                    await codeReaderRef.current.decodeFromVideoDevice(
                        selectedDeviceId,
                        videoElement,
                        (result) => {
                            if (result && !isCancelled) {
                                const rawText = result.getText();
                                void handleTokenScanned(rawText);
                            }
                        },
                    );

                if (isCancelled) {
                    controls.stop();
                } else {
                    controlsRef.current = controls;
                    setIsScanning(true);
                    setCameraError(null);
                }
            } catch {
                if (!isCancelled) {
                    setCameraError(
                        'Failed to access camera stream. Grant camera permissions in browser.',
                    );
                    setIsScanning(false);
                }
            }
        };

        void start();

        return () => {
            isCancelled = true;

            if (controlsRef.current) {
                controlsRef.current.stop();
                controlsRef.current = null;
            }

            if (videoElement && videoElement.srcObject) {
                const stream = videoElement.srcObject as MediaStream;
                stream.getTracks().forEach((track) => track.stop());
                videoElement.srcObject = null;
            }

            setIsScanning(false);
        };
    }, [selectedDeviceId, modalOpen, retryCount, handleTokenScanned]);

    const handleSwitchCamera = () => {
        if (devices.length <= 1) {
            return;
        }

        const currentIndex = devices.findIndex(
            (d) => d.deviceId === selectedDeviceId,
        );
        const nextIndex = (currentIndex + 1) % devices.length;
        setSelectedDeviceId(devices[nextIndex].deviceId);
    };

    const handleModalClose = () => {
        setModalOpen(false);
        setVerifiedData(null);
        setErrorMessage(null);
        setManualToken('');
    };

    return (
        <div className="min-h-screen bg-muted/20 pb-12">
            <Head title="Staff QR Scanner - Barangay Lallana" />

            {/* Top Navigation */}
            <div className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur-sm">
                <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/admin"
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
                        >
                            <ArrowLeft className="size-4" />
                            Admin Dashboard
                        </Link>
                        <span className="text-muted-foreground/40">|</span>
                        <div className="flex items-center gap-2">
                            <ScanLine className="size-4 text-violet-600" />
                            <span className="text-sm font-bold tracking-tight text-foreground">
                                QR Document Authenticator
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSoundEnabled(!soundEnabled)}
                            title={
                                soundEnabled
                                    ? 'Mute audio chime'
                                    : 'Enable audio chime'
                            }
                            className="size-8 text-muted-foreground"
                        >
                            {soundEnabled ? (
                                <Volume2 className="size-4 text-emerald-600" />
                            ) : (
                                <VolumeX className="size-4 text-muted-foreground" />
                            )}
                        </Button>

                        {devices.length > 1 && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleSwitchCamera}
                                className="h-8 gap-1.5 text-xs"
                            >
                                <SwitchCamera className="size-3.5" />
                                <span className="hidden sm:inline">
                                    Flip Camera
                                </span>
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-5xl px-4 pt-6 sm:px-6">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                    {/* Left: Viewfinder Camera Card */}
                    <div className="space-y-4 lg:col-span-7">
                        <Card className="overflow-hidden border-2 shadow-sm">
                            <CardHeader className="bg-muted/40 p-4 pb-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Camera className="size-4 text-violet-600" />
                                        <CardTitle className="text-sm font-bold">
                                            Optical Camera Viewfinder
                                        </CardTitle>
                                    </div>
                                    <Badge
                                        variant={
                                            isScanning ? 'default' : 'secondary'
                                        }
                                        className="font-mono text-[10px] tracking-wider uppercase"
                                    >
                                        {isScanning
                                            ? 'Live Scanner'
                                            : 'Inactive'}
                                    </Badge>
                                </div>
                            </CardHeader>

                            <CardContent className="p-4">
                                {/* Camera Viewport Box */}
                                <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl bg-slate-950 shadow-inner sm:aspect-4/3">
                                    <video
                                        ref={videoRef}
                                        className="h-full w-full object-cover"
                                        playsInline
                                        muted
                                    />

                                    {/* Scanner Overlay Crosshair & Reticle */}
                                    {isScanning && (
                                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                                            <div className="relative size-56 rounded-2xl border-2 border-emerald-400/80 shadow-[0_0_15px_rgba(52,211,153,0.3)] sm:size-64">
                                                <div className="absolute -top-1 -left-1 size-5 rounded-tl-md border-t-4 border-l-4 border-emerald-500"></div>
                                                <div className="absolute -top-1 -right-1 size-5 rounded-tr-md border-t-4 border-r-4 border-emerald-500"></div>
                                                <div className="absolute -bottom-1 -left-1 size-5 rounded-bl-md border-b-4 border-l-4 border-emerald-500"></div>
                                                <div className="absolute -right-1 -bottom-1 size-5 rounded-br-md border-r-4 border-b-4 border-emerald-500"></div>

                                                {/* Animated Laser Scanning Line */}
                                                <div className="absolute right-2 left-2 h-0.5 animate-bounce bg-gradient-to-r from-transparent via-emerald-400 to-transparent"></div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Camera Error or Off State */}
                                    {cameraError && (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/90 p-6 text-center text-white">
                                            <AlertCircle className="mb-2 size-10 text-rose-500" />
                                            <p className="text-sm font-semibold">
                                                {cameraError}
                                            </p>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="mt-4 gap-2 border-slate-700 text-xs text-white hover:bg-slate-800"
                                                onClick={() =>
                                                    setRetryCount((c) => c + 1)
                                                }
                                            >
                                                <RefreshCw className="size-3.5" />
                                                Retry Camera
                                            </Button>
                                        </div>
                                    )}

                                    {isVerifying && (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/75 text-white backdrop-blur-xs">
                                            <Loader2 className="mb-2 size-8 animate-spin text-emerald-400" />
                                            <span className="text-xs font-semibold tracking-wider uppercase">
                                                Authenticating Security Token...
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Manual Token Input Fallback */}
                                <div className="mt-4 border-t border-border/60 pt-3">
                                    <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                                        Manual Token Entry (If QR is damaged or
                                        unreadable):
                                    </label>
                                    <form
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            verifyToken(manualToken);
                                        }}
                                        className="flex gap-2"
                                    >
                                        <Input
                                            value={manualToken}
                                            onChange={(e) =>
                                                setManualToken(e.target.value)
                                            }
                                            placeholder="Paste 32-character token or verification URL..."
                                            className="font-mono text-xs"
                                            disabled={isVerifying}
                                        />
                                        <Button
                                            type="submit"
                                            size="sm"
                                            disabled={
                                                !manualToken.trim() ||
                                                isVerifying
                                            }
                                            className="shrink-0 gap-1.5 text-xs font-semibold"
                                        >
                                            Verify
                                        </Button>
                                    </form>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right: Recent Verification Logs */}
                    <div className="space-y-4 lg:col-span-5">
                        <Card className="border shadow-xs">
                            <CardHeader className="p-4 pb-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <History className="size-4 text-violet-600" />
                                        <CardTitle className="text-sm font-bold">
                                            Recent Scans in Barangay
                                        </CardTitle>
                                    </div>
                                    <span className="text-[11px] font-medium text-muted-foreground">
                                        Audit Trail
                                    </span>
                                </div>
                                <CardDescription className="text-xs">
                                    Recent clearance verifications performed by
                                    authorized staff
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="p-4 pt-2">
                                <div className="divide-y divide-border/60">
                                    {recentScans.length > 0 ? (
                                        recentScans.map((scan) => (
                                            <div
                                                key={scan.token}
                                                className="flex items-center justify-between gap-3 py-2.5 text-xs"
                                            >
                                                <div className="space-y-0.5">
                                                    <div className="font-semibold text-foreground">
                                                        {scan.resident_name}
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                                                        <span className="font-mono text-violet-600">
                                                            {
                                                                scan.reference_code
                                                            }
                                                        </span>
                                                        <span>&bull;</span>
                                                        <span>
                                                            {scan.document_type}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="shrink-0 text-right">
                                                    <Badge
                                                        variant="outline"
                                                        className="border-emerald-300 text-[10px] text-emerald-600"
                                                    >
                                                        Valid
                                                    </Badge>
                                                    <div className="mt-0.5 flex items-center gap-1 text-[10px] text-muted-foreground">
                                                        <Clock className="size-3" />
                                                        {
                                                            scan.last_scanned_formatted
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="py-8 text-center text-xs text-muted-foreground">
                                            No recent document scan events
                                            recorded today.
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Verification Result Modal */}
            <Dialog
                open={modalOpen}
                onOpenChange={(open) => !open && handleModalClose()}
            >
                <DialogContent className="max-w-md p-6">
                    {verifiedData ? (
                        <div className="space-y-4">
                            <DialogHeader>
                                <div className="flex items-center gap-2">
                                    <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                                        <ShieldCheck className="size-5" />
                                    </div>
                                    <div>
                                        <DialogTitle className="text-base font-bold text-foreground">
                                            Document Verified Authentic
                                        </DialogTitle>
                                        <DialogDescription className="text-xs">
                                            Cryptographic signature matches
                                            official registry
                                        </DialogDescription>
                                    </div>
                                </div>
                            </DialogHeader>

                            {/* Resident Profile Snapshot */}
                            <div className="space-y-3 rounded-xl border border-border/80 bg-muted/30 p-3.5">
                                <div className="flex items-center gap-3">
                                    <Avatar className="size-12 border">
                                        <AvatarImage
                                            src={
                                                verifiedData.resident
                                                    .avatar_url ?? undefined
                                            }
                                            alt={
                                                verifiedData.resident.name ??
                                                'Resident'
                                            }
                                        />
                                        <AvatarFallback className="bg-violet-100 text-xs font-bold text-violet-700">
                                            {verifiedData.resident.name
                                                ? verifiedData.resident.name
                                                      .split(' ')
                                                      .map((n) => n[0])
                                                      .join('')
                                                      .slice(0, 2)
                                                : 'RES'}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h4 className="text-sm font-bold text-foreground">
                                            {verifiedData.resident.name}
                                        </h4>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <span>
                                                {verifiedData.resident.purok ??
                                                    'Barangay Lallana'}
                                            </span>
                                            {verifiedData.resident.age && (
                                                <>
                                                    <span>&bull;</span>
                                                    <span>
                                                        {
                                                            verifiedData
                                                                .resident.age
                                                        }{' '}
                                                        y/o
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2 border-t border-border/60 pt-2.5 text-xs">
                                    <div>
                                        <span className="block text-[10px] font-semibold text-muted-foreground uppercase">
                                            Document Type
                                        </span>
                                        <span className="font-semibold text-foreground">
                                            {verifiedData.document_type}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="block text-[10px] font-semibold text-muted-foreground uppercase">
                                            Reference Code
                                        </span>
                                        <span className="font-mono font-bold text-violet-700 dark:text-violet-400">
                                            {verifiedData.reference_code}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="block text-[10px] font-semibold text-muted-foreground uppercase">
                                            Issue Date
                                        </span>
                                        <span className="text-foreground">
                                            {verifiedData.issued_at}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="block text-[10px] font-semibold text-muted-foreground uppercase">
                                            Validity
                                        </span>
                                        <span className="font-semibold text-emerald-600">
                                            {verifiedData.expires_at
                                                ? `Until ${verifiedData.expires_at}`
                                                : 'Permanent'}
                                        </span>
                                    </div>
                                </div>

                                {verifiedData.household && (
                                    <div className="flex items-center justify-between rounded-lg border bg-background p-2.5 text-xs">
                                        <span className="text-muted-foreground">
                                            Household Reference:
                                        </span>
                                        <span className="font-mono font-bold text-foreground">
                                            {
                                                verifiedData.household
                                                    .household_number
                                            }
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2 pt-1">
                                {verifiedData.admin_view_url && (
                                    <a
                                        href={verifiedData.admin_view_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1"
                                    >
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="w-full gap-1.5 text-xs font-semibold"
                                        >
                                            <ExternalLink className="size-3.5" />
                                            View in Admin Record
                                        </Button>
                                    </a>
                                )}
                                <Button
                                    size="sm"
                                    className="flex-1 text-xs font-semibold"
                                    onClick={handleModalClose}
                                >
                                    Scan Next Document
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4 py-2 text-center">
                            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-rose-500/10 text-rose-600">
                                <AlertCircle className="size-7" />
                            </div>
                            <DialogHeader>
                                <DialogTitle className="text-center text-base font-bold text-foreground">
                                    Verification Failed
                                </DialogTitle>
                                <DialogDescription className="text-center text-xs">
                                    {errorMessage ||
                                        'The scanned document could not be authenticated.'}
                                </DialogDescription>
                            </DialogHeader>

                            <Button
                                size="sm"
                                variant="outline"
                                className="w-full text-xs font-semibold"
                                onClick={handleModalClose}
                            >
                                Dismiss & Scan Again
                            </Button>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
