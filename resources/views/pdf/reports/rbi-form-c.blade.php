<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>RBI Form C - Semestral Monitoring Report</title>
    <style>
        @page {
            size: a4 portrait;
            margin: 8mm 12mm 8mm 12mm;
        }
        body {
            font-family: Arial, Helvetica, sans-serif;
            font-size: 7.5pt;
            color: #000;
            line-height: 1.15;
            margin: 0;
            padding: 0;
        }
        .form-code {
            font-weight: bold;
            font-size: 8.5pt;
            margin-bottom: 2px;
        }
        .title-block {
            text-align: center;
            margin-bottom: 6px;
        }
        .form-title {
            font-size: 10.5pt;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .form-subtitle {
            font-size: 8.5pt;
            margin-top: 1px;
        }
        .meta-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 4px;
            font-size: 7.5pt;
        }
        .meta-table td {
            padding: 1px 3px;
        }
        .meta-label {
            font-weight: bold;
            width: 200px;
        }
        .meta-value {
            border-bottom: 1px solid #000;
        }
        .data-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 4px;
            margin-bottom: 8px;
        }
        .data-table th, .data-table td {
            border: 1px solid #000;
            padding: 1.5px 4px;
            font-size: 7pt;
        }
        .data-table th {
            background-color: #d9e1d2;
            font-weight: bold;
            text-align: center;
        }
        .section-header {
            background-color: #d9e1d2;
            font-weight: bold;
            font-style: italic;
            text-align: left;
        }
        .text-center {
            text-align: center;
        }
        .text-right {
            text-align: right;
        }
        .signatories-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        .signatories-table td {
            width: 50%;
            vertical-align: top;
            font-size: 7.5pt;
            padding: 0 15px;
        }
        .sig-line {
            margin-top: 25px;
            border-top: 1px solid #000;
            text-align: center;
            padding-top: 2px;
        }
        .sig-name {
            font-weight: bold;
            font-size: 8pt;
            text-transform: uppercase;
        }
        .sig-sub {
            font-size: 7pt;
            color: #333;
        }
        .footer-note {
            margin-top: 10px;
            font-size: 6.5pt;
            font-style: italic;
            color: #333;
            border-top: 1px dashed #666;
            padding-top: 3px;
        }
    </style>
</head>
<body>
    <div class="form-code">RBI FORM C (Revised 2024)</div>
    <div class="title-block">
        <div class="form-title">Monitoring Report</div>
        <div class="form-subtitle">for <strong>{{ $semester ?? '1st' }}</strong> Semester of CY <strong>{{ $year ?? now()->year }}</strong></div>
    </div>

    <table class="meta-table">
        <tr>
            <td class="meta-label">REGION :</td>
            <td class="meta-value">{{ $region ?? 'REGION IV-A (CALABARZON)' }}</td>
        </tr>
        <tr>
            <td class="meta-label">PROVINCE :</td>
            <td class="meta-value">{{ $province ?? 'CAVITE' }}</td>
        </tr>
        <tr>
            <td class="meta-label">CITY/MUNICIPALITY :</td>
            <td class="meta-value">{{ $city ?? 'TRECE MARTIRES CITY' }}</td>
        </tr>
        <tr>
            <td class="meta-label">BARANGAY :</td>
            <td class="meta-value">{{ $barangay ?? 'BARANGAY LALLANA' }}</td>
        </tr>
        <tr>
            <td class="meta-label">Total No. of Barangay Inhabitants :</td>
            <td class="meta-value" style="font-weight: bold;">{{ number_format($stats['total_inhabitants'] ?? 0) }}</td>
        </tr>
        <tr>
            <td class="meta-label">Total No. of Households :</td>
            <td class="meta-value" style="font-weight: bold;">{{ number_format($stats['total_households'] ?? 0) }}</td>
        </tr>
        <tr>
            <td class="meta-label">Total No. of Families :</td>
            <td class="meta-value" style="font-weight: bold;">{{ number_format($stats['total_families'] ?? 0) }}</td>
        </tr>
    </table>

    <table class="data-table">
        <thead>
            <tr>
                <th style="width: 45%;">INDICATORS</th>
                <th style="width: 12%;">MALE</th>
                <th style="width: 12%;">FEMALE</th>
                <th style="width: 13%;">TOTAL</th>
                <th style="width: 18%;">REMARKS</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td colspan="5" class="section-header">Population by Age Bracket:</td>
            </tr>
            @foreach($ageBrackets as $bracket)
                <tr>
                    <td>{{ $bracket['label'] }}</td>
                    <td class="text-center">{{ number_format($bracket['male']) }}</td>
                    <td class="text-center">{{ number_format($bracket['female']) }}</td>
                    <td class="text-center" style="font-weight: bold;">{{ number_format($bracket['total']) }}</td>
                    <td></td>
                </tr>
            @endforeach

            <tr>
                <td colspan="5" class="section-header">Population by Sector:</td>
            </tr>
            @foreach($sectors as $sec)
                <tr>
                    <td>{{ $sec['label'] }}</td>
                    <td class="text-center">{{ isset($sec['male']) ? number_format($sec['male']) : '—' }}</td>
                    <td class="text-center">{{ isset($sec['female']) ? number_format($sec['female']) : '—' }}</td>
                    <td class="text-center" style="font-weight: bold;">{{ number_format($sec['total']) }}</td>
                    <td></td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <table class="signatories-table">
        <tr>
            <td>
                <div>Prepared by:</div>
                <div class="sig-line">
                    <div class="sig-name">{{ $officials['secretary'] ?? 'Barangay Secretary' }}</div>
                    <div class="sig-sub">Barangay Secretary<br>(Signature over Printed Name)</div>
                </div>
                <div style="margin-top: 10px; font-size: 7pt;">
                    Date Accomplished: <u>{{ now()->format('F d, Y') }}</u>
                </div>
            </td>
            <td>
                <div>Submitted by:</div>
                <div class="sig-line">
                    <div class="sig-name">{{ $officials['punong_barangay'] ?? 'Hon. Cecilia M. Decillo' }}</div>
                    <div class="sig-sub">Punong Barangay<br>(Signature over Printed Name)</div>
                </div>
            </td>
        </tr>
    </table>

    <div class="footer-note">
        Note: This RBI Form C (Semestral Monitoring Report) is to be submitted to DILG C/MLGOO as a reference for encoding to BIS-BPS.
    </div>
</body>
</html>
