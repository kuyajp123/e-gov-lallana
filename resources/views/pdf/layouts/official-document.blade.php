<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>{{ $title ?? 'Official Barangay Document' }} - Barangay Lallana</title>
    <style>
        @page {
            size: a4 portrait;
            margin: 20mm 15mm 15mm 15mm;
        }
        body {
            font-family: 'DejaVu Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
            color: #1a1a1a;
            line-height: 1.4;
            font-size: 11pt;
            margin: 0;
            padding: 0;
        }
        .header-table {
            width: 100%;
            border-collapse: collapse;
            text-align: center;
            margin-bottom: 8px;
        }
        .header-table td {
            vertical-align: middle;
        }
        .header-logo {
            width: 75px;
            height: 75px;
        }
        .header-text {
            line-height: 1.25;
        }
        .rep-title {
            font-size: 9pt;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #444;
            margin: 0;
        }
        .prov-title {
            font-size: 9.5pt;
            color: #333;
            margin: 1px 0;
        }
        .brgy-title {
            font-size: 14pt;
            font-weight: bold;
            color: #1e3a8a;
            margin: 2px 0;
            letter-spacing: 1px;
        }
        .office-title {
            font-size: 10pt;
            font-weight: bold;
            color: #b91c1c;
            text-transform: uppercase;
            margin-top: 3px;
        }
        .header-divider {
            border-top: 2px solid #1e3a8a;
            border-bottom: 1px solid #1e3a8a;
            height: 2px;
            margin-bottom: 14px;
        }
        .main-layout {
            width: 100%;
            border-collapse: collapse;
        }
        .sidebar {
            width: 28%;
            vertical-align: top;
            border-right: 1.5px solid #cbd5e1;
            padding-right: 12px;
            font-size: 8.5pt;
            line-height: 1.25;
            background-color: #f8fafc;
            padding-left: 6px;
            padding-top: 6px;
        }
        .officials-title {
            font-size: 9pt;
            font-weight: bold;
            color: #1e3a8a;
            text-align: center;
            text-transform: uppercase;
            border-bottom: 1px solid #94a3b8;
            padding-bottom: 4px;
            margin-bottom: 8px;
        }
        .official-group {
            margin-bottom: 8px;
            text-align: center;
        }
        .official-name {
            font-weight: bold;
            color: #0f172a;
            font-size: 8.5pt;
        }
        .official-role {
            font-size: 7.5pt;
            color: #64748b;
            font-style: italic;
        }
        .councilor-list {
            margin-top: 4px;
            margin-bottom: 6px;
            text-align: center;
        }
        .content-body {
            width: 72%;
            vertical-align: top;
            padding-left: 18px;
        }
        .doc-title {
            text-align: center;
            font-size: 18pt;
            font-weight: bold;
            color: #0f172a;
            letter-spacing: 1.5px;
            text-transform: uppercase;
            margin-top: 4px;
            margin-bottom: 14px;
            border-bottom: 2px solid #0f172a;
            padding-bottom: 4px;
        }
        .salutation {
            font-weight: bold;
            margin-bottom: 10px;
            font-size: 11pt;
            text-transform: uppercase;
        }
        .doc-paragraph {
            text-align: justify;
            text-justify: inter-word;
            text-indent: 28px;
            margin-bottom: 10px;
            line-height: 1.5;
            font-size: 10pt;
        }
        .highlight {
            font-weight: bold;
            color: #0f172a;
        }
        .signature-block {
            margin-top: 25px;
            width: 100%;
            border-collapse: collapse;
        }
        .signature-block td {
            vertical-align: top;
        }
        .captain-title {
            font-size: 8.5pt;
            color: #475569;
        }
        .captain-name {
            font-size: 10.5pt;
            font-weight: bold;
            color: #0f172a;
            border-bottom: 1px solid #0f172a;
            display: inline-block;
            padding-bottom: 1px;
            text-transform: uppercase;
        }
        .qr-section {
            margin-top: 15px;
            padding-top: 8px;
            border-top: 1px dashed #cbd5e1;
            width: 100%;
            border-collapse: collapse;
        }
        .qr-section td {
            vertical-align: middle;
        }
        .qr-meta {
            font-size: 7.5pt;
            color: #64748b;
            line-height: 1.3;
        }
        .qr-meta strong {
            color: #334155;
        }
        .dry-seal-notice {
            display: inline-block;
            border: 1px solid #94a3b8;
            border-radius: 50%;
            width: 70px;
            height: 70px;
            text-align: center;
            font-size: 7pt;
            color: #94a3b8;
            line-height: 1.1;
            padding-top: 18px;
            box-sizing: border-box;
            text-transform: uppercase;
        }
    </style>
    @yield('styles')
</head>
<body>

    <!-- Header Letterhead -->
    <table class="header-table">
        <tr>
            <td style="width: 15%; text-align: left;">
                @if(!empty($barangaySealBase64))
                    <img src="{{ $barangaySealBase64 }}" class="header-logo" alt="Barangay Seal" />
                @endif
            </td>
            <td style="width: 70%;">
                <div class="header-text">
                    <p class="rep-title">Republic of the Philippines</p>
                    <p class="prov-title">Province of Cavite &bull; City of Trece Martires</p>
                    <h1 class="brgy-title">BARANGAY LALLANA</h1>
                    <p class="office-title">Office of the Punong Barangay</p>
                </div>
            </td>
            <td style="width: 15%; text-align: right;">
                @if(!empty($citySealBase64))
                    <img src="{{ $citySealBase64 }}" class="header-logo" alt="City Seal" />
                @elseif(!empty($barangaySealBase64))
                    <img src="{{ $barangaySealBase64 }}" class="header-logo" alt="Official Seal" />
                @endif
            </td>
        </tr>
    </table>

    <div class="header-divider"></div>

    <!-- Main Two-Column Structure -->
    <table class="main-layout">
        <tr>
            <!-- Left Column: Sangguniang Barangay Roster -->
            <td class="sidebar">
                <div class="officials-title">Barangay Officials</div>

                <div class="official-group">
                    <div class="official-name">{{ $officials['punong_barangay'] ?? 'Hon. Crisanto V. Lallana' }}</div>
                    <div class="official-role">Punong Barangay</div>
                </div>

                <div class="officials-title" style="font-size: 8pt; margin-top: 6px;">Sangguniang Barangay</div>

                @php
                    $councilors = $officials['kagawads'] ?? [
                        'Hon. Maria Santos',
                        'Hon. Danilo Reyes',
                        'Hon. Elena Garcia',
                        'Hon. Roberto Cruz',
                        'Hon. Arlene Bautista',
                        'Hon. Fernando Ocampo',
                        'Hon. Grace Villanueva',
                    ];
                @endphp

                @foreach($councilors as $kagawad)
                    <div class="councilor-list">
                        <div class="official-name" style="font-size: 8pt;">{{ $kagawad }}</div>
                        <div class="official-role">Barangay Kagawad</div>
                    </div>
                @endforeach

                <div class="official-group" style="margin-top: 8px;">
                    <div class="official-name">{{ $officials['sk_chairperson'] ?? 'Hon. Justin Ramos' }}</div>
                    <div class="official-role">SK Chairperson</div>
                </div>

                <div class="official-group">
                    <div class="official-name">{{ $officials['secretary'] ?? 'Ana Patricia Diaz' }}</div>
                    <div class="official-role">Barangay Secretary</div>
                </div>

                <div class="official-group">
                    <div class="official-name">{{ $officials['treasurer'] ?? 'Ramonito Mendoza' }}</div>
                    <div class="official-role">Barangay Treasurer</div>
                </div>

                <div style="text-align: center; margin-top: 15px;">
                    <div class="dry-seal-notice">
                        Official<br>Dry Seal<br>Here
                    </div>
                </div>
            </td>

            <!-- Right Column: Certificate / Document Body -->
            <td class="content-body">
                @yield('content')
            </td>
        </tr>
    </table>

</body>
</html>
