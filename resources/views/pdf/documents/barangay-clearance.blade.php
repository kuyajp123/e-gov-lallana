@extends('pdf.layouts.official-document', ['title' => 'Barangay Clearance'])

@section('content')
    <h2 class="doc-title">BARANGAY CLEARANCE</h2>

    <p class="salutation">To Whom It May Concern:</p>

    <p class="doc-paragraph">
        This is to certify that <span class="highlight">{{ strtoupper($resident['name']) }}</span>, 
        <span class="highlight">{{ $resident['age'] ? $resident['age'].' years old' : 'legal age' }}</span>, 
        <span class="highlight">{{ $resident['civil_status'] ?? 'Single' }}</span>, Filipino citizen, 
        is a permanent and bonafide resident of 
        <span class="highlight">{{ $resident['purok'] ? $resident['purok'].', ' : '' }}Barangay Lallana, Trece Martires City, Cavite</span>.
    </p>

    <p class="doc-paragraph">
        Based on existing records on file in this office, the subject individual is known to be of 
        <span class="highlight">good moral character</span>, a law-abiding citizen, and has 
        <span class="highlight">no derogatory record or pending complaint</span> filed against them in this Barangay.
    </p>

    <p class="doc-paragraph">
        This clearance is being issued upon the request of the interested party for 
        <span class="highlight">{{ strtoupper($purpose ?? 'GENERAL / LEGAL PURPOSES') }}</span>, 
        and for whatever legal intents and purposes it may serve best.
    </p>

    <p class="doc-paragraph">
        Issued this <span class="highlight">{{ now()->format('jS') }}</span> day of 
        <span class="highlight">{{ now()->format('F, Y') }}</span> at the Barangay Hall of Barangay Lallana, 
        Trece Martires City, Province of Cavite, Philippines.
    </p>

    <!-- Thumbmark and Specimen Signature Boxes -->
    <table style="width: 100%; margin-top: 15px; border-collapse: collapse;">
        <tr>
            <td style="width: 32%; text-align: center; vertical-align: top;">
                <div style="border: 1px solid #64748b; height: 60px; width: 85px; margin: 0 auto; background-color: #f8fafc;"></div>
                <div style="font-size: 7.5pt; color: #64748b; margin-top: 3px;">Left Thumbmark</div>
            </td>
            <td style="width: 32%; text-align: center; vertical-align: top;">
                <div style="border: 1px solid #64748b; height: 60px; width: 85px; margin: 0 auto; background-color: #f8fafc;"></div>
                <div style="font-size: 7.5pt; color: #64748b; margin-top: 3px;">Right Thumbmark</div>
            </td>
            <td style="width: 36%; text-align: center; vertical-align: bottom;">
                <div style="border-bottom: 1px solid #0f172a; width: 90%; margin: 0 auto 3px auto; height: 35px;"></div>
                <div style="font-size: 8pt; font-weight: bold; color: #0f172a;">{{ strtoupper($resident['name']) }}</div>
                <div style="font-size: 7.5pt; color: #64748b;">Applicant Signature</div>
            </td>
        </tr>
    </table>

    <!-- Punong Barangay Attestation -->
    <table class="signature-block">
        <tr>
            <td style="width: 50%;"></td>
            <td style="width: 50%; text-align: center;">
                <div class="captain-title">Approved & Issued by:</div>
                <div style="height: 35px;"></div>
                <div class="captain-name">{{ $officials['punong_barangay'] ?? 'HON. CRISANTO V. LALLANA' }}</div>
                <div class="captain-title" style="font-weight: bold; margin-top: 2px;">Punong Barangay</div>
            </td>
        </tr>
    </table>

    <!-- QR Code & Security Stamp -->
    <table class="qr-section">
        <tr>
            <td style="width: 85px; text-align: center;">
                @if(!empty($qrCodeSvg))
                    <img src="{{ $qrCodeSvg }}" style="width: 75px; height: 75px;" alt="Verification QR" />
                @endif
            </td>
            <td style="padding-left: 10px;">
                <div class="qr-meta">
                    <strong>Ref No:</strong> {{ $request->reference_code }} | <strong>Security Token:</strong> <span style="font-family: monospace; font-size: 6.5pt;">{{ $qr->token ?? 'N/A' }}</span><br>
                    <strong>Issued On:</strong> {{ now()->format('M d, Y') }} | <strong>Valid Until:</strong> {{ now()->addMonths(6)->format('M d, Y') }}<br>
                    <strong>CTC No:</strong> {{ $submittedData['ctc_number'] ?? 'N/A' }} | <strong>Fee:</strong> {{ $request->formatted_fee }}<br>
                    <span style="font-size: 7pt; color: #047857;">&bull; Scan QR with smartphone to verify digital authenticity on e-Gov Lallana portal.</span>
                </div>
            </td>
        </tr>
    </table>
@endsection
