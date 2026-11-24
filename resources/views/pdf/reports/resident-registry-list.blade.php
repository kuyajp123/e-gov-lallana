<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Barangay Lallana - Resident Registry Masterlist</title>
    <link rel="icon" type="image/svg+xml" href="{{ asset('favicon.svg') }}">
    <link rel="icon" type="image/x-icon" href="{{ asset('favicon.ico') }}">
    <style>
        @page {
            size: a4 landscape;
            margin: 8mm 10mm 12mm 10mm;
        }
        body {
            font-family: Arial, Helvetica, sans-serif;
            font-size: 7.5pt;
            color: #111827;
            line-height: 1.25;
            margin: 0;
            padding: 0;
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #0f172a;
            padding-bottom: 6px;
            margin-bottom: 8px;
        }
        .republic {
            font-size: 7.5pt;
            letter-spacing: 0.5px;
            color: #475569;
            text-transform: uppercase;
        }
        .lgu {
            font-size: 8.5pt;
            font-weight: 600;
            color: #334155;
            text-transform: uppercase;
        }
        .barangay-title {
            font-size: 11pt;
            font-weight: bold;
            color: #0f172a;
            letter-spacing: 0.75px;
            text-transform: uppercase;
            margin: 1px 0;
        }
        .doc-title {
            font-size: 10pt;
            font-weight: bold;
            color: #1e293b;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-top: 3px;
        }

        .meta-container {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 8px;
            background-color: #f8fafc;
            border: 1px solid #cbd5e1;
            border-radius: 4px;
        }
        .meta-container td {
            padding: 4px 8px;
            font-size: 7.5pt;
            vertical-align: top;
        }
        .meta-label {
            font-weight: bold;
            color: #475569;
        }
        .meta-value {
            color: #0f172a;
        }
        .filter-badge {
            display: inline-block;
            background-color: #e2e8f0;
            color: #1e293b;
            padding: 1.5px 5px;
            border-radius: 3px;
            font-size: 7pt;
            font-weight: 600;
            margin-right: 4px;
            margin-bottom: 2px;
        }

        .data-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 4px;
            margin-bottom: 12px;
        }
        .data-table th, .data-table td {
            border: 1px solid #cbd5e1;
            padding: 4px 5px;
            font-size: 7pt;
            vertical-align: middle;
        }
        .data-table th {
            background-color: #f1f5f9;
            color: #0f172a;
            font-weight: bold;
            text-align: center;
            text-transform: uppercase;
            letter-spacing: 0.3px;
        }
        .data-table tr:nth-child(even) {
            background-color: #fbfcfd;
        }
        .text-center {
            text-align: center !important;
        }
        .text-left {
            text-align: left !important;
        }
        .text-right {
            text-align: right !important;
        }
        .font-semibold {
            font-weight: 600;
        }
        .text-muted {
            color: #64748b;
        }

        .signatories-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 14px;
            page-break-inside: avoid;
        }
        .signatories-table td {
            width: 33.33%;
            vertical-align: top;
            font-size: 7.5pt;
            padding: 0 15px;
        }
        .sig-role {
            font-size: 7.5pt;
            color: #475569;
            margin-bottom: 32px;
        }
        .sig-line {
            border-top: 1px solid #0f172a;
            text-align: center;
            padding-top: 3px;
        }
        .sig-name {
            font-weight: bold;
            font-size: 8pt;
            text-transform: uppercase;
            color: #0f172a;
        }
        .sig-sub {
            font-size: 7pt;
            color: #64748b;
        }

        .doc-footer {
            margin-top: 10px;
            font-size: 6.5pt;
            color: #94a3b8;
            text-align: center;
            border-top: 1px dotted #cbd5e1;
            padding-top: 4px;
        }
    </style>
</head>
<body>
    <!-- Header -->
    <div class="header">
        <div class="republic">Republic of the Philippines</div>
        <div class="lgu">Province of Cavite &bull; City of Trece Martires</div>
        <div class="barangay-title">Barangay Lallana</div>
        <div class="doc-title">Official Resident Registry Masterlist</div>
    </div>

    <!-- Metadata & Filter Summary -->
    <table class="meta-container">
        <tr>
            <td style="width: 50%;">
                <span class="meta-label">Date &amp; Time Generated:</span>
                <span class="meta-value">{{ $generatedAt }}</span>
                <br>
                <span class="meta-label">Prepared By:</span>
                <span class="meta-value">{{ $issuerName }}</span>
            </td>
            <td style="width: 50%;">
                <span class="meta-label">Total Filtered Records:</span>
                <span class="meta-value font-semibold">{{ number_format($totalCount) }} resident{{ $totalCount === 1 ? '' : 's' }}</span>
                <br>
                <span class="meta-label">Active Filter Criteria:</span>
                <span class="meta-value">
                    @if(count($activeFilters) > 0)
                        @foreach($activeFilters as $filterLabel)
                            <span class="filter-badge">{{ $filterLabel }}</span>
                        @endforeach
                    @else
                        <span class="text-muted font-semibold">All Residents (Unfiltered Masterlist)</span>
                    @endif
                </span>
            </td>
        </tr>
    </table>

    <!-- Resident Masterlist Table -->
    <table class="data-table">
        <thead>
            <tr>
                <th style="width: 25px;">#</th>
                <th class="text-left" style="width: 140px;">Resident Full Name</th>
                <th style="width: 75px;">Birthdate</th>
                <th style="width: 32px;">Age</th>
                <th style="width: 45px;">Sex</th>
                <th style="width: 60px;">Civil Status</th>
                <th style="width: 60px;">Citizenship</th>
                <th style="width: 65px;">Residency</th>
                <th class="text-left" style="width: 130px;">Household / Address</th>
                <th class="text-left" style="width: 85px;">Occupation</th>
                <th style="width: 40px;">Voter</th>
                <th class="text-left" style="width: 110px;">Special Sectors</th>
                <th style="width: 70px;">Contact No.</th>
            </tr>
        </thead>
        <tbody>
            @forelse($rows as $row)
                <tr>
                    <td class="text-center font-semibold text-muted">{{ $row['index'] }}</td>
                    <td class="text-left font-semibold">{{ $row['full_name'] }}</td>
                    <td class="text-center">{{ $row['birthdate_formatted'] }}</td>
                    <td class="text-center font-semibold">{{ $row['age'] }}</td>
                    <td class="text-center">{{ $row['gender'] }}</td>
                    <td class="text-center">{{ $row['civil_status'] }}</td>
                    <td class="text-center">{{ $row['citizenship'] }}</td>
                    <td class="text-center">{{ $row['residency_status'] }}</td>
                    <td class="text-left">{{ $row['address'] }}</td>
                    <td class="text-left">{{ $row['occupation'] }}</td>
                    <td class="text-center">{{ $row['is_voter'] }}</td>
                    <td class="text-left font-semibold">{{ $row['special_statuses'] }}</td>
                    <td class="text-center">{{ $row['phone'] }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="13" class="text-center" style="padding: 16px; color: #64748b; font-style: italic;">
                        No registered resident profiles match the specified filter criteria.
                    </td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <!-- Signatories -->
    <table class="signatories-table">
        <tr>
            <td>
                <div class="sig-role">Prepared by:</div>
                <div class="sig-line">
                    <div class="sig-name">{{ $issuerName }}</div>
                    <div class="sig-sub">Barangay Civil Registry Officer / Staff</div>
                </div>
            </td>
            <td>
                <div class="sig-role">Certified Correct:</div>
                <div class="sig-line">
                    <div class="sig-name">{{ $officials['secretary'] ?? 'Barangay Secretary' }}</div>
                    <div class="sig-sub">Barangay Secretary</div>
                </div>
            </td>
            <td>
                <div class="sig-role">Attested &amp; Noted by:</div>
                <div class="sig-line">
                    <div class="sig-name">{{ $officials['punong_barangay'] ?? 'HON. CECILIA M. DECILLO' }}</div>
                    <div class="sig-sub">Punong Barangay</div>
                </div>
            </td>
        </tr>
    </table>

    <div class="doc-footer">
        Official Document &bull; Barangay Lallana e-Governance &amp; Civil Registry System &bull; Confidential and for Official Barangay Use Only
    </div>
</body>
</html>
