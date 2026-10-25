@extends('pdf.layouts.official-document', ['title' => $customTitle ?? 'Barangay Certification'])

@section('content')
    <h2 class="doc-title">{{ strtoupper($customTitle ?? 'BARANGAY CERTIFICATION') }}</h2>

    <p class="salutation">To Whom It May Concern:</p>

    @if(!empty($customBody))
        <div class="doc-paragraph" style="white-space: pre-line; line-height: 1.6; margin-bottom: 20px;">
            {{ $customBody }}
        </div>
    @else
        <p class="doc-paragraph">
            This is to certify that <span class="highlight">{{ strtoupper($resident['name']) }}</span>, 
            <span class="highlight">{{ $resident['age'] ? $resident['age'].' years old' : 'legal age' }}</span>, 
            <span class="highlight">{{ $resident['civil_status'] ?? 'Single' }}</span>, Filipino citizen, 
            is a bonafide resident of 
            <span class="highlight">{{ $resident['purok'] ? $resident['purok'].', ' : '' }}Barangay Lallana, Trece Martires City, Cavite</span>.
        </p>

        <p class="doc-paragraph">
            This certification is issued upon the request of the interested party for 
            <span class="highlight">{{ strtoupper($purpose ?? 'OFFICIAL / LEGAL PURPOSES') }}</span>, 
            and for whatever legal intents and purposes it may serve best.
        </p>
    @endif

    <p class="doc-paragraph" style="margin-top: 25px;">
        Issued this <span class="highlight">{{ now()->format('jS') }}</span> day of 
        <span class="highlight">{{ now()->format('F, Y') }}</span> at the Barangay Hall of Barangay Lallana, 
        Trece Martires City, Province of Cavite, Philippines.
    </p>

    <!-- Punong Barangay Attestation -->
    <table class="signature-block" style="margin-top: 35px;">
        <tr>
            <td style="width: 50%;"></td>
            <td style="width: 50%; text-align: center;">
                <div class="captain-title">Approved & Issued by:</div>
                <div style="height: 35px;"></div>
                <div class="captain-name">{{ $officials['punong_barangay'] ?? 'HON. CECILIA M. DECILLO' }}</div>
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
                    <strong>Purpose:</strong> {{ $request->purpose ?? 'Official' }} | <strong>Fee:</strong> {{ $request->formatted_fee }}<br>
                    <span style="font-size: 7pt; color: #047857;">&bull; Scan QR with smartphone to verify digital authenticity on e-Gov Lallana portal.</span>
                </div>
            </td>
        </tr>
    </table>
@endsection
