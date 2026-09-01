import { useForm, usePage } from '@inertiajs/react';
import axios from 'axios';
import {
    CheckCircle2,
    Home,
    KeyRound,
    MapPin,
    Send,
    ShieldCheck,
    User,
} from 'lucide-react';
import React, { useState } from 'react';
import type { ResidentProfileData } from '@/features/resident/components/profile-form';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/shared/components/ui/select';
import { Spinner } from '@/shared/components/ui/spinner';
import { Textarea } from '@/shared/components/ui/textarea';

interface HouseholdWizardProps {
    profile: ResidentProfileData | null;
    purokOptions: string[];
}

export function HouseholdWizard({
    profile,
    purokOptions,
}: HouseholdWizardProps) {
    const { auth } = usePage().props;
    const user = auth.user;

    const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
    const [channel, setChannel] = useState<'sms' | 'email'>(
        user.phone_number ? 'sms' : 'email',
    );
    const [otpSent, setOtpSent] = useState(false);
    const [sendingOtp, setSendingOtp] = useState(false);
    const [otpCooldown, setOtpCooldown] = useState(0);
    const [otpMessage, setOtpMessage] = useState<string | null>(null);

    const { data, setData, post, processing, errors } = useForm({
        purok_sitio: purokOptions[0] || 'Purok 1',
        address: '',
        notes: '',
        verification_channel: channel,
        otp_code: '',
    });

    const handleSendOtp = async () => {
        setSendingOtp(true);
        setOtpMessage(null);

        try {
            const res = await axios.post('/household/register/otp/send', {
                channel,
                phone_number: user.phone_number,
            });

            if (res.data.success) {
                setOtpSent(true);
                setOtpMessage(
                    `Verification code sent to your ${channel.toUpperCase()}!`,
                );
                setData('verification_channel', channel);
                // Start cooldown countdown
                setOtpCooldown(60);
                const timer = setInterval(() => {
                    setOtpCooldown((prev) => {
                        if (prev <= 1) {
                            clearInterval(timer);

                            return 0;
                        }

                        return prev - 1;
                    });
                }, 1000);
            }
        } catch (err: any) {
            setOtpMessage(
                err.response?.data?.message ||
                    'Failed to send OTP code. Please try again.',
            );
        } finally {
            setSendingOtp(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/household/register', {
            preserveScroll: true,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Step Indicators */}
            <div className="grid grid-cols-4 gap-2">
                {[
                    { num: 1, label: 'Address', icon: MapPin },
                    { num: 2, label: 'Family Head', icon: User },
                    { num: 3, label: 'Verification', icon: ShieldCheck },
                    { num: 4, label: 'Review', icon: CheckCircle2 },
                ].map(({ num, label, icon: Icon }) => (
                    <div
                        key={num}
                        onClick={() => num < step && setStep(num as any)}
                        className={`flex flex-col items-center justify-center rounded-xl p-3 text-center transition-all ${
                            step === num
                                ? 'border-2 border-primary bg-primary/10 font-semibold text-primary'
                                : step > num
                                  ? 'cursor-pointer border border-border bg-card text-foreground'
                                  : 'border border-border/40 bg-muted/20 text-muted-foreground opacity-60'
                        }`}
                    >
                        <div className="flex items-center gap-1.5">
                            <Icon className="size-4" />
                            <span className="text-xs font-bold">{num}</span>
                        </div>
                        <span className="mt-1 hidden text-xs sm:inline">
                            {label}
                        </span>
                    </div>
                ))}
            </div>

            {/* Step 1: Address & Location */}
            {step === 1 && (
                <div className="space-y-6">
                    <div className="space-y-4 rounded-xl border border-border bg-card p-6">
                        <div className="flex items-center gap-2 font-semibold text-primary">
                            <Home className="size-5" />
                            <h3>Household Location in Barangay Lallana</h3>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="purok_sitio">
                                    Purok / Sitio{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Select
                                    value={data.purok_sitio}
                                    onValueChange={(val) =>
                                        setData('purok_sitio', val)
                                    }
                                >
                                    <SelectTrigger id="purok_sitio">
                                        <SelectValue placeholder="Select Purok / Sitio" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {purokOptions.map((purok) => (
                                            <SelectItem
                                                key={purok}
                                                value={purok}
                                            >
                                                {purok}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.purok_sitio && (
                                    <p className="text-xs text-destructive">
                                        {errors.purok_sitio}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2 sm:col-span-2">
                                <Label htmlFor="address">
                                    Exact Street Address / House No.{' '}
                                    <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="address"
                                    value={data.address}
                                    onChange={(e) =>
                                        setData('address', e.target.value)
                                    }
                                    placeholder="e.g. Block 4 Lot 12, Sampaguita St., Barangay Lallana"
                                    required
                                />
                                {errors.address && (
                                    <p className="text-xs text-destructive">
                                        {errors.address}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2 sm:col-span-2">
                                <Label htmlFor="notes">
                                    Landmark / Household Notes (Optional)
                                </Label>
                                <Textarea
                                    id="notes"
                                    value={data.notes}
                                    onChange={(e) =>
                                        setData('notes', e.target.value)
                                    }
                                    placeholder="Near chapel, green gate, etc."
                                    rows={3}
                                />
                                {errors.notes && (
                                    <p className="text-xs text-destructive">
                                        {errors.notes}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <Button
                            type="button"
                            onClick={() =>
                                data.address.trim()
                                    ? setStep(2)
                                    : setData('address', ' ')
                            }
                            disabled={!data.address.trim()}
                        >
                            Next: Family Head Info →
                        </Button>
                    </div>
                </div>
            )}

            {/* Step 2: Family Head Summary */}
            {step === 2 && (
                <div className="space-y-6">
                    <Card className="rounded-xl border-border">
                        <CardContent className="space-y-4 p-6">
                            <div className="flex items-center gap-2 font-semibold text-primary">
                                <User className="size-5" />
                                <h3>Designated Family Head</h3>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                As the creator of this household registration,
                                you will be designated as the{' '}
                                <strong>Family Head</strong> with authority to
                                manage members and transfer authority.
                            </p>

                            <div className="grid gap-3 rounded-lg bg-muted/40 p-4 text-sm sm:grid-cols-2">
                                <div>
                                    <span className="block text-xs text-muted-foreground">
                                        Full Name
                                    </span>
                                    <span className="font-semibold">
                                        {profile
                                            ? `${profile.first_name} ${profile.middle_name || ''} ${profile.last_name}`.trim()
                                            : user.name}
                                    </span>
                                </div>
                                <div>
                                    <span className="block text-xs text-muted-foreground">
                                        Contact Number
                                    </span>
                                    <span className="font-semibold">
                                        {user.phone_number || 'Not provided'}
                                    </span>
                                </div>
                                <div>
                                    <span className="block text-xs text-muted-foreground">
                                        Email Address
                                    </span>
                                    <span className="font-semibold">
                                        {user.email}
                                    </span>
                                </div>
                                <div>
                                    <span className="block text-xs text-muted-foreground">
                                        Government ID
                                    </span>
                                    <span className="font-semibold text-emerald-600">
                                        {profile?.government_id_url
                                            ? 'Attached on Profile'
                                            : 'Not attached'}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-between">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setStep(1)}
                        >
                            ← Back
                        </Button>
                        <Button type="button" onClick={() => setStep(3)}>
                            Next: Contact Verification →
                        </Button>
                    </div>
                </div>
            )}

            {/* Step 3: Contact Verification (OTP) */}
            {step === 3 && (
                <div className="space-y-6">
                    <Card className="rounded-xl border-border">
                        <CardContent className="space-y-6 p-6">
                            <div className="flex items-center gap-2 font-semibold text-primary">
                                <KeyRound className="size-5" />
                                <h3>Contact Ownership Verification</h3>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                To prevent duplicate or fraudulent household
                                submissions, please verify your identity using a
                                one-time passcode (OTP).
                            </p>

                            {/* Channel Selector */}
                            <div className="grid gap-3 sm:grid-cols-2">
                                <div
                                    onClick={() =>
                                        !otpSent && setChannel('sms')
                                    }
                                    className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-all ${
                                        channel === 'sms'
                                            ? 'border-primary bg-primary/5 text-primary'
                                            : 'border-border bg-card text-foreground hover:border-border/80'
                                    } ${!user.phone_number ? 'pointer-events-none opacity-50' : ''}`}
                                >
                                    <div>
                                        <p className="text-sm font-semibold">
                                            SMS Text Message
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {user.phone_number ||
                                                'No phone registered'}
                                        </p>
                                    </div>
                                    <div
                                        className={`size-4 rounded-full border ${channel === 'sms' ? 'border-primary bg-primary' : 'border-muted-foreground'}`}
                                    />
                                </div>

                                <div
                                    onClick={() =>
                                        !otpSent && setChannel('email')
                                    }
                                    className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-all ${
                                        channel === 'email'
                                            ? 'border-primary bg-primary/5 text-primary'
                                            : 'border-border bg-card text-foreground hover:border-border/80'
                                    }`}
                                >
                                    <div>
                                        <p className="text-sm font-semibold">
                                            Email Notification
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {user.email}
                                        </p>
                                    </div>
                                    <div
                                        className={`size-4 rounded-full border ${channel === 'email' ? 'border-primary bg-primary' : 'border-muted-foreground'}`}
                                    />
                                </div>
                            </div>

                            {/* Send OTP Button */}
                            <div className="flex items-center gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleSendOtp}
                                    disabled={sendingOtp || otpCooldown > 0}
                                    className="gap-2"
                                >
                                    {sendingOtp ? (
                                        <Spinner className="size-4" />
                                    ) : (
                                        <Send className="size-4" />
                                    )}
                                    {otpSent
                                        ? otpCooldown > 0
                                            ? `Resend in ${otpCooldown}s`
                                            : 'Resend Code'
                                        : 'Send Verification Code'}
                                </Button>
                            </div>

                            {otpMessage && (
                                <Alert className="rounded-xl border-primary/20 bg-primary/5 text-foreground">
                                    <AlertDescription className="text-xs">
                                        {otpMessage}
                                    </AlertDescription>
                                </Alert>
                            )}

                            {/* OTP Code Input */}
                            {otpSent && (
                                <div className="max-w-xs space-y-2 pt-2">
                                    <Label htmlFor="otp_code">
                                        Enter 6-Digit Verification Code{' '}
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </Label>
                                    <Input
                                        id="otp_code"
                                        value={data.otp_code}
                                        onChange={(e) =>
                                            setData(
                                                'otp_code',
                                                e.target.value
                                                    .replace(/\D/g, '')
                                                    .slice(0, 6),
                                            )
                                        }
                                        placeholder="123456"
                                        maxLength={6}
                                        className="text-center text-lg font-bold tracking-widest"
                                        required
                                    />
                                    {errors.otp_code && (
                                        <p className="text-xs text-destructive">
                                            {errors.otp_code}
                                        </p>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <div className="flex justify-between">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setStep(2)}
                        >
                            ← Back
                        </Button>
                        <Button
                            type="button"
                            onClick={() => setStep(4)}
                            disabled={!otpSent || data.otp_code.length !== 6}
                        >
                            Next: Final Review →
                        </Button>
                    </div>
                </div>
            )}

            {/* Step 4: Final Review & Submission */}
            {step === 4 && (
                <div className="space-y-6">
                    <Card className="rounded-xl border-border">
                        <CardContent className="space-y-4 p-6">
                            <div className="flex items-center gap-2 font-semibold text-primary">
                                <CheckCircle2 className="size-5" />
                                <h3>Review Registration Summary</h3>
                            </div>

                            <div className="space-y-3 rounded-lg bg-muted/40 p-4 text-sm">
                                <div className="flex justify-between border-b border-border/50 pb-2">
                                    <span className="text-muted-foreground">
                                        Family Head
                                    </span>
                                    <span className="font-semibold">
                                        {profile
                                            ? `${profile.first_name} ${profile.last_name}`
                                            : user.name}
                                    </span>
                                </div>
                                <div className="flex justify-between border-b border-border/50 pb-2">
                                    <span className="text-muted-foreground">
                                        Purok / Sitio
                                    </span>
                                    <span className="font-semibold">
                                        {data.purok_sitio}
                                    </span>
                                </div>
                                <div className="flex justify-between border-b border-border/50 pb-2">
                                    <span className="text-muted-foreground">
                                        Street Address
                                    </span>
                                    <span className="font-semibold">
                                        {data.address}
                                    </span>
                                </div>
                                <div className="flex justify-between border-b border-border/50 pb-2">
                                    <span className="text-muted-foreground">
                                        OTP Verification
                                    </span>
                                    <span className="font-semibold text-emerald-600">
                                        Code Verified ({channel.toUpperCase()})
                                    </span>
                                </div>
                                {data.notes && (
                                    <div className="flex justify-between pt-1">
                                        <span className="text-muted-foreground">
                                            Notes
                                        </span>
                                        <span className="text-xs font-medium">
                                            {data.notes}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <p className="text-xs text-muted-foreground">
                                By clicking <strong>Submit Registration</strong>
                                , you certify that the provided household and
                                demographic details are true and correct. Your
                                submission will undergo administrative review by
                                Barangay Lallana.
                            </p>
                        </CardContent>
                    </Card>

                    <div className="flex justify-between">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setStep(3)}
                        >
                            ← Back
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="min-w-44"
                        >
                            {processing ? (
                                <div className="flex items-center gap-2">
                                    <Spinner className="size-4" />
                                    <span>Submitting...</span>
                                </div>
                            ) : (
                                'Submit Registration'
                            )}
                        </Button>
                    </div>
                </div>
            )}
        </form>
    );
}
