@extends('pdf.layouts.official-document', ['title' => 'Certificate of Residency'])

@section('content')
    <h2 class="doc-title">CERTIFICATE OF RESIDENCY</h2>

    <p class="salutation">To Whom It May Concern:</p>

    <p class="doc-paragraph">
        This is to certify that <span class="highlight">{{ strtoupper($resident['name']) }}</span>, 
        <span class="highlight">{{ $resident['age'] ? $resident['age'].' years old' : 'legal age' }}</span>, 
        <span class="highlight">{{ $resident['civil_status'] ?? 'Single' }}</span>, Filipino citizen, 
        is a bonafide and permanent resident of 
        <span class="highlight">{{ $resident['purok'] ? $resident['purok'].', ' : '' }}Barangay Lallana, Trece Martires City, Cavite</span>.
    </p>

    <p class="doc-paragraph">
        Records on file in this office show that the subject individual has been residing continuously in this Barangay, 
        is a peaceful and law-abiding member of this community, and maintains an active household profile under 
        Household Reference <span class="highlight">{{ $resident['household_code'] ?? 'N/A' }}</span>.
    </p>

    <p class="doc-paragraph">
        This certification is issued upon the request of the interested party for 
        <span class="highlight">{{ strtoupper($purpose ?? 'PROOF OF ADDRESS / IDENTIFICATION') }}</span>, 
        and for whatever legal intents and purposes it may serve best.
    </p>

    <p class="doc-paragraph">
        Issued this <span class="highlight">{{ now()->format('jS') }}</span> day of 
        <span class="highlight">{{ now()->format('F, Y') }}</span> at the Barangay Hall of Barangay Lallana, 
        Trece Martires City, Province of Cavite, Philippines.
    </p>

    <!-- Punong Barangay Attestation -->
    <table class="signature-block" style="margin-top: 40px;">
        <tr>
            <td style="width: 50%;"></td>
            <td style="width: 50%; text-align: center;">
                <div class="captain-title">Approved & Issued by:</div>
                <div style="height: 40px;"></div>
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
                    <strong>Household No:</strong> {{ $resident['household_code'] ?? 'Unassigned' }} | <strong>Fee:</strong> {{ $request->formatted_fee }}<br>
                    <span style="font-size: 7pt; color: #047857;">&bull; Scan QR with smartphone to verify digital authenticity on e-Gov Lallana portal.</span>
                </div>
            </td>
        </tr>
    </table>
@endsection
