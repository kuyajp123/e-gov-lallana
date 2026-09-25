<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>RBI Summary Report - Barangay Lallana</title>
    <style>
        @page {
            size: a4 landscape;
            margin: 12mm 10mm 10mm 10mm;
        }
        body {
            font-family: 'DejaVu Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
            color: #0f172a;
            font-size: 8.5pt;
            line-height: 1.3;
            margin: 0;
            padding: 0;
        }
        .header {
            text-align: center;
            margin-bottom: 12px;
            border-bottom: 2px solid #1e3a8a;
            padding-bottom: 6px;
        }
        .header h1 {
            font-size: 13pt;
            margin: 2px 0;
            color: #1e3a8a;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .header p {
            margin: 1px 0;
            font-size: 8pt;
            color: #475569;
        }
        .report-meta {
            width: 100%;
            margin-bottom: 10px;
            border-collapse: collapse;
        }
        .report-meta td {
            font-size: 8.5pt;
            vertical-align: middle;
        }
        .badge {
            background-color: #e0e7ff;
            color: #3730a3;
            padding: 2px 6px;
            border-radius: 4px;
            font-weight: bold;
            font-size: 8pt;
        }
        .data-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 14px;
        }
        .data-table th, .data-table td {
            border: 1px solid #cbd5e1;
            padding: 4px 6px;
            text-align: left;
        }
        .data-table th {
            background-color: #f1f5f9;
            color: #1e293b;
            font-weight: bold;
            font-size: 8pt;
            text-transform: uppercase;
        }
        .data-table tr:nth-child(even) {
            background-color: #f8fafc;
        }
        .text-center {
            text-align: center !important;
        }
        .text-right {
            text-align: right !important;
        }
        .summary-cards {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 12px;
        }
        .summary-card {
            border: 1px solid #cbd5e1;
            background-color: #f8fafc;
            padding: 6px 10px;
            text-align: center;
        }
        .summary-num {
            font-size: 11pt;
            font-weight: bold;
            color: #1e3a8a;
        }
        .summary-lbl {
            font-size: 7pt;
            color: #64748b;
            text-transform: uppercase;
        }
        .signatures {
            width: 100%;
            margin-top: 15px;
            border-collapse: collapse;
        }
        .signatures td {
            width: 50%;
            text-align: center;
            vertical-align: top;
            font-size: 8.5pt;
        }
        .sig-line {
            width: 60%;
            margin: 25px auto 4px auto;
            border-bottom: 1px solid #0f172a;
        }
    </style>
</head>
<body>

    <!-- Header -->
    <div class="header">
        <p>Republic of the Philippines &bull; Province of Cavite &bull; City of Trece Martires</p>
        <h1>BARANGAY LALLANA</h1>
        <p style="font-weight: bold; color: #b91c1c;">RECORD OF BARANGAY INHABITANTS (RBI) SUMMARY REPORT</p>
    </div>

    <!-- Meta Info -->
    <table class="report-meta">
        <tr>
            <td><strong>Filter Scope:</strong> <span class="badge">{{ $purok ? 'Purok '.$purok : 'All Puroks (1 to 6)' }}</span></td>
            <td class="text-right"><strong>Generated On:</strong> {{ now()->format('F d, Y h:i A') }}</td>
        </tr>
    </table>

    <!-- Demographic KPI Cards -->
    <table class="summary-cards">
        <tr>
            <td class="summary-card">
                <div class="summary-num">{{ number_format($stats['total_households']) }}</div>
                <div class="summary-lbl">Total Households</div>
            </td>
            <td class="summary-card">
                <div class="summary-num">{{ number_format($stats['total_inhabitants']) }}</div>
                <div class="summary-lbl">Total Inhabitants</div>
            </td>
            <td class="summary-card">
                <div class="summary-num">{{ number_format($stats['total_seniors']) }}</div>
                <div class="summary-lbl">Senior Citizens</div>
            </td>
            <td class="summary-card">
                <div class="summary-num">{{ number_format($stats['total_pwds']) }}</div>
                <div class="summary-lbl">PWDs</div>
            </td>
            <td class="summary-card">
                <div class="summary-num">{{ number_format($stats['total_solo_parents']) }}</div>
                <div class="summary-lbl">Solo Parents</div>
            </td>
            <td class="summary-card">
                <div class="summary-num">{{ number_format($stats['total_minors']) }}</div>
                <div class="summary-lbl">Minors (&lt;18)</div>
            </td>
            <td class="summary-card">
                <div class="summary-num">{{ number_format($stats['total_voters']) }}</div>
                <div class="summary-lbl">Registered Voters</div>
            </td>
        </tr>
    </table>

    <!-- Household Listing Table -->
    <table class="data-table">
        <thead>
            <tr>
                <th style="width: 25px;" class="text-center">#</th>
                <th style="width: 100px;">Household No.</th>
                <th>Family Head Name</th>
                <th style="width: 110px;">Purok / Address</th>
                <th style="width: 45px;" class="text-center">Members</th>
                <th style="width: 45px;" class="text-center">Seniors</th>
                <th style="width: 45px;" class="text-center">PWD</th>
                <th style="width: 45px;" class="text-center">Solo P.</th>
                <th style="width: 45px;" class="text-center">Minors</th>
                <th style="width: 45px;" class="text-center">Voters</th>
                <th style="width: 75px;" class="text-center">Status</th>
            </tr>
        </thead>
        <tbody>
            @forelse($households as $index => $hh)
                <tr>
                    <td class="text-center">{{ $index + 1 }}</td>
                    <td style="font-weight: bold; font-family: monospace;">{{ $hh['household_number'] }}</td>
                    <td style="font-weight: 600;">{{ $hh['family_head_name'] }}</td>
                    <td>{{ $hh['purok'] }}</td>
                    <td class="text-center">{{ $hh['members_count'] }}</td>
                    <td class="text-center">{{ $hh['seniors_count'] }}</td>
                    <td class="text-center">{{ $hh['pwds_count'] }}</td>
                    <td class="text-center">{{ $hh['solo_parents_count'] }}</td>
                    <td class="text-center">{{ $hh['minors_count'] }}</td>
                    <td class="text-center">{{ $hh['voters_count'] }}</td>
                    <td class="text-center">
                        <span style="font-size: 7pt; font-weight: bold; color: {{ $hh['status'] === 'verified' ? '#047857' : '#b45309' }};">
                            {{ strtoupper($hh['status']) }}
                        </span>
                    </td>
                </tr>
            @empty
                <tr>
                    <td colspan="11" class="text-center" style="padding: 15px; color: #64748b;">
                        No household records found matching the specified filter criteria.
                    </td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <!-- Signatures -->
    <table class="signatures">
        <tr>
            <td>
                Prepared by:
                <div class="sig-line"></div>
                <strong>{{ $officials['secretary'] ?? 'ANA PATRICIA DIAZ' }}</strong><br>
                <span style="color: #64748b; font-size: 7.5pt;">Barangay Secretary</span>
            </td>
            <td>
                Attested & Approved by:
                <div class="sig-line"></div>
                <strong>{{ $officials['punong_barangay'] ?? 'HON. CRISANTO V. LALLANA' }}</strong><br>
                <span style="color: #64748b; font-size: 7.5pt;">Punong Barangay</span>
            </td>
        </tr>
    </table>

</body>
</html>
