import { ArrowDown, Check, CheckCircle2, ShieldAlert } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/shared/components/ui/dialog';

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onAccept: () => void;
    hasRead: boolean;
};

export function TermsAndPrivacyModal({
    open,
    onOpenChange,
    onAccept,
    hasRead,
}: Props) {
    const [userScrolledToBottom, setUserScrolledToBottom] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const hasScrolledToBottom = hasRead || userScrolledToBottom;

    useEffect(() => {
        if (open && !hasRead) {
            const timer = setTimeout(() => {
                if (scrollContainerRef.current) {
                    const { scrollHeight, clientHeight } =
                        scrollContainerRef.current;

                    if (scrollHeight <= clientHeight + 10) {
                        setUserScrolledToBottom(true);
                    }
                }
            }, 100);

            return () => clearTimeout(timer);
        }
    }, [open, hasRead]);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        const maxScroll = scrollHeight - clientHeight;
        const currentPercent =
            maxScroll > 0
                ? Math.min(100, Math.round((scrollTop / maxScroll) * 100))
                : 100;

        if (
            scrollTop + clientHeight >= scrollHeight - 25 ||
            currentPercent >= 98
        ) {
            setUserScrolledToBottom(true);
        }
    };

    const handleAcceptAndClose = () => {
        onAccept();
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="flex max-h-[90vh] w-[95vw] flex-col overflow-hidden rounded-none border-border bg-background p-6 shadow-2xl sm:max-w-4xl lg:max-w-5xl xl:max-w-6xl">
                {/* Header Section */}
                <DialogHeader className="shrink-0 space-y-2 text-left">
                    <div className="flex items-center gap-3">
                        <img
                            src="/lallana-seal.png"
                            alt="Barangay Lallana Seal"
                            className="size-10 object-contain drop-shadow"
                        />
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-extrabold tracking-widest text-violet-700 uppercase dark:text-violet-400">
                                    Republic of the Philippines • Trece Martires
                                    City
                                </span>
                            </div>
                            <DialogTitle className="text-lg font-extrabold tracking-tight sm:text-xl">
                                Terms of Service & Privacy Policy
                            </DialogTitle>
                        </div>
                    </div>
                    <DialogDescription className="text-xs text-muted-foreground">
                        Barangay Lallana E-Government Portal Citizen Agreement •
                        Last updated: October 2026
                    </DialogDescription>
                </DialogHeader>

                {/* Progress / Status Banner */}
                <div className="shrink-0 pt-1">
                    {!hasScrolledToBottom ? (
                        <div className="flex items-center justify-between gap-3 border border-amber-500/30 bg-amber-500/10 px-3.5 py-2.5 text-xs text-amber-900 dark:text-amber-200">
                            <div className="flex items-center gap-2.5">
                                <ArrowDown className="size-4 shrink-0 text-amber-600 dark:text-amber-400" />
                                <span>
                                    <strong className="font-semibold">
                                        Reading required:
                                    </strong>{' '}
                                    Please scroll completely to the bottom of
                                    the document to read and acknowledge the
                                    Terms of Service and Privacy
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-between gap-3 border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2.5 text-xs text-emerald-900 dark:text-emerald-200">
                            <div className="flex items-center gap-2.5">
                                <CheckCircle2 className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                                <span>
                                    <strong className="font-semibold">
                                        Document completed:
                                    </strong>{' '}
                                    You have read the full document. You may now
                                    accept the terms and proceed with
                                    registration.
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Scrollable Document Container */}
                <div
                    ref={scrollContainerRef}
                    onScroll={handleScroll}
                    className="flex-1 space-y-6 overflow-y-auto rounded-none border border-border bg-muted/15 p-4 text-xs leading-relaxed text-foreground/90 focus:outline-none sm:p-6 sm:text-sm"
                    tabIndex={0}
                    aria-label="Terms of Service and Privacy Policy full text"
                >
                    {/* Civic Preamble */}
                    <div className="border-b border-border/80 pb-4 text-xs text-muted-foreground">
                        <p className="font-medium tracking-wider text-foreground uppercase">
                            Barangay Government of Lallana, Trece Martires City,
                            Cavite
                        </p>
                        <p className="mt-1">
                            This agreement governs the registration, identity
                            verification, and electronic civil services provided
                            to residents and stakeholders of Barangay Lallana.
                            Please review these terms carefully before
                            submitting your information.
                        </p>
                    </div>

                    {/* Section 1 */}
                    <section className="space-y-2">
                        <h3 className="flex items-center gap-2 font-bold text-foreground">
                            <span className="flex size-5 items-center justify-center rounded-none bg-violet-600 text-[10px] font-bold text-white">
                                1
                            </span>
                            Statutory Framework & Acceptance of Terms
                        </h3>
                        <p className="text-muted-foreground">
                            By creating an account on the Barangay Lallana
                            E-Government Portal, you formally acknowledge and
                            agree to be bound by these Terms of Service and
                            Privacy Policy. This system operates pursuant to the
                            provisions of the Local Government Code of 1991
                            (Republic Act No. 7160), the Data Privacy Act of
                            2012 (Republic Act No. 10173), and the Ease of Doing
                            Business and Efficient Government Service Delivery
                            Act of 2018 (Republic Act No. 11032).
                        </p>
                    </section>

                    {/* Section 2 */}
                    <section className="space-y-2">
                        <h3 className="flex items-center gap-2 font-bold text-foreground">
                            <span className="flex size-5 items-center justify-center rounded-none bg-violet-600 text-[10px] font-bold text-white">
                                2
                            </span>
                            Resident Eligibility and Account Authenticity
                        </h3>
                        <p className="text-muted-foreground">
                            Registration is restricted to bona fide residents,
                            property owners, business proprietors, and
                            authorized household members residing within the
                            territorial jurisdiction of Barangay Lallana, Trece
                            Martires City, Cavite.
                        </p>
                        <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
                            <li>
                                <strong>Truthfulness of Declarations:</strong>{' '}
                                You certify that all information
                                submitted—including full name, birthdate, civil
                                status, residency address, and identification
                                numbers—is true, complete, and accurate.
                            </li>
                            <li>
                                <strong>Single Account Rule:</strong> Each
                                citizen is permitted exactly one registered
                                account. Creating fictitious accounts, duplicate
                                profiles, or registering on behalf of another
                                person without verified legal power of attorney
                                is strictly prohibited.
                            </li>
                            <li>
                                <strong>Identity Verification (KYC):</strong>{' '}
                                The Barangay Administration reserves the
                                authority to request physical or digital
                                verification documents (e.g., government-issued
                                photo ID, proof of residency) before activating
                                full service issuance capabilities.
                            </li>
                        </ul>
                    </section>

                    {/* Section 3 */}
                    <section className="space-y-2">
                        <h3 className="flex items-center gap-2 font-bold text-foreground">
                            <span className="flex size-5 items-center justify-center rounded-none bg-violet-600 text-[10px] font-bold text-white">
                                3
                            </span>
                            Privacy Notice & Compliance with Republic Act No.
                            10173
                        </h3>
                        <p className="text-muted-foreground">
                            The Barangay Government of Lallana acts as the
                            Personal Information Controller (PIC) under Republic
                            Act No. 10173. We implement stringent technical,
                            organizational, and physical safeguards to guarantee
                            the privacy and integrity of your personal data.
                        </p>
                        <div className="space-y-2 rounded-none border border-border/80 bg-background/50 p-3.5">
                            <h4 className="text-xs font-semibold tracking-wider text-foreground uppercase">
                                Specific Purposes of Data Processing:
                            </h4>
                            <ul className="list-disc space-y-1 pl-5 text-xs text-muted-foreground">
                                <li>
                                    Maintenance of the official Registry of
                                    Barangay Inhabitants (RBI) required by
                                    national law;
                                </li>
                                <li>
                                    Processing and issuance of Barangay
                                    Clearance, Certificates of Indigency,
                                    Certificates of Residency, and Barangay
                                    Business Clearances;
                                </li>
                                <li>
                                    Distribution of emergency financial
                                    assistance, ayuda, disaster relief, and
                                    health monitoring;
                                </li>
                                <li>
                                    Special sector accreditation and benefits
                                    delivery (Senior Citizens, PWDs, Solo
                                    Parents);
                                </li>
                                <li>
                                    Peace, order, and public safety verification
                                    within the community.
                                </li>
                            </ul>
                        </div>
                    </section>

                    {/* Section 4 */}
                    <section className="space-y-2">
                        <h3 className="flex items-center gap-2 font-bold text-foreground">
                            <span className="flex size-5 items-center justify-center rounded-none bg-violet-600 text-[10px] font-bold text-white">
                                4
                            </span>
                            Citizen Data Subject Rights
                        </h3>
                        <p className="text-muted-foreground">
                            Under Chapter VIII of Republic Act No. 10173, as a
                            data subject, you possess the following protected
                            statutory rights:
                        </p>
                        <div className="grid grid-cols-1 gap-2.5 pt-1 sm:grid-cols-2">
                            <div className="rounded-none border border-border p-2.5">
                                <span className="block text-xs font-semibold text-foreground">
                                    Right to be Informed
                                </span>
                                <span className="text-[11px] text-muted-foreground">
                                    Know why, how, and for how long your records
                                    are processed.
                                </span>
                            </div>
                            <div className="rounded-none border border-border p-2.5">
                                <span className="block text-xs font-semibold text-foreground">
                                    Right of Access
                                </span>
                                <span className="text-[11px] text-muted-foreground">
                                    Request a summary or copy of your personal
                                    data on file.
                                </span>
                            </div>
                            <div className="rounded-none border border-border p-2.5">
                                <span className="block text-xs font-semibold text-foreground">
                                    Right to Rectification
                                </span>
                                <span className="text-[11px] text-muted-foreground">
                                    Dispute inaccuracies and correct outdated
                                    civil details.
                                </span>
                            </div>
                            <div className="rounded-none border border-border p-2.5">
                                <span className="block text-xs font-semibold text-foreground">
                                    Right to Lodge Complaint
                                </span>
                                <span className="text-[11px] text-muted-foreground">
                                    File grievances directly with the National
                                    Privacy Commission (NPC).
                                </span>
                            </div>
                        </div>
                    </section>

                    {/* Section 5 */}
                    <section className="space-y-2">
                        <h3 className="flex items-center gap-2 font-bold text-foreground">
                            <span className="flex size-5 items-center justify-center rounded-none bg-violet-600 text-[10px] font-bold text-white">
                                5
                            </span>
                            Document Issuance, Anti-Fraud & Penal Sanctions
                        </h3>
                        <div className="space-y-2 text-muted-foreground">
                            <p>
                                Official documents issued through this portal
                                contain digital cryptographic tokens and
                                verifiable QR codes. Any unauthorized
                                alteration, duplication, or fraudulent
                                reproduction of issued barangay documents is
                                strictly tracked and logged.
                            </p>
                            <div className="flex items-start gap-2.5 rounded-none border border-rose-500/30 bg-rose-500/5 p-3 text-rose-950 dark:text-rose-200">
                                <ShieldAlert className="mt-0.5 size-4 shrink-0 text-rose-600" />
                                <div className="text-xs">
                                    <strong className="font-bold">
                                        Criminal Penalty Warning:
                                    </strong>{' '}
                                    Submitting falsified documents,
                                    impersonating another resident, or
                                    fabricating signatures constitutes a
                                    criminal offense punishable under Articles
                                    171 and 172 (Falsification of Public
                                    Documents) of the Revised Penal Code of the
                                    Philippines, in addition to civil damages.
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 6 */}
                    <section className="space-y-2">
                        <h3 className="flex items-center gap-2 font-bold text-foreground">
                            <span className="flex size-5 items-center justify-center rounded-none bg-violet-600 text-[10px] font-bold text-white">
                                6
                            </span>
                            Account Security & Citizen Responsibilities
                        </h3>
                        <p className="text-muted-foreground">
                            You are personally responsible for maintaining the
                            confidentiality of your login credentials. Never
                            disclose your password, two-factor authentication
                            tokens, or recovery codes to unauthorized third
                            parties. Barangay personnel will never request your
                            account password.
                        </p>
                    </section>

                    {/* Section 7 */}
                    <section className="space-y-2">
                        <h3 className="flex items-center gap-2 font-bold text-foreground">
                            <span className="flex size-5 items-center justify-center rounded-none bg-violet-600 text-[10px] font-bold text-white">
                                7
                            </span>
                            Service Inquiries & Data Protection Officer (DPO)
                        </h3>
                        <p className="text-muted-foreground">
                            For inquiries, clarifications, or requests
                            concerning your data subject rights, you may contact
                            the Barangay Hall Administration:
                        </p>
                        <div className="rounded-none border border-border bg-card p-3 text-xs text-muted-foreground">
                            <p className="font-semibold text-foreground">
                                Office of the Barangay Council & Data Protection
                                Desk
                            </p>
                            <p>
                                Barangay Hall of Lallana, Trece Martires City,
                                Cavite
                            </p>
                            <p>Email: privacy@barangay-lallana.gov.ph</p>
                            <p>
                                Official Public Hours: Monday to Friday, 8:00 AM
                                – 5:00 PM
                            </p>
                        </div>
                    </section>
                </div>

                {/* Footer Section */}
                <DialogFooter className="flex shrink-0 flex-col-reverse gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="rounded-none text-xs shadow-none"
                    >
                        Close
                    </Button>

                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            disabled={!hasScrolledToBottom}
                            onClick={
                                hasScrolledToBottom
                                    ? handleAcceptAndClose
                                    : undefined
                            }
                            className={`gap-1.5 rounded-none text-xs shadow-none ${
                                !hasScrolledToBottom
                                    ? 'cursor-not-allowed bg-muted text-muted-foreground'
                                    : 'bg-emerald-600 font-semibold text-white hover:bg-emerald-700 active:bg-emerald-800'
                            }`}
                        >
                            {hasScrolledToBottom && (
                                <Check className="size-4" />
                            )}
                            <span>I Have Read & Agree to Terms</span>
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
