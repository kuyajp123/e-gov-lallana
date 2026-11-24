<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>RBI Form A - Records of Barangay Inhabitants by Household</title>
    <style>
        @page {
            size: a4 landscape;
            margin: 10mm 10mm 10mm 10mm;
        }
        body {
            font-family: Arial, Helvetica, sans-serif;
            font-size: 8pt;
            color: #000;
            line-height: 1.2;
            margin: 0;
            padding: 0;
        }
        .form-code {
            font-weight: bold;
            font-size: 9pt;
            margin-bottom: 2px;
        }
        .form-title {
            text-align: center;
            font-size: 11pt;
            font-weight: bold;
            letter-spacing: 0.5px;
            margin-bottom: 10px;
            text-transform: uppercase;
        }
        .meta-grid {
            width: 100%;
            margin-bottom: 8px;
            border-collapse: collapse;
        }
        .meta-grid td {
            padding: 1.5px 4px;
            font-size: 8pt;
        }
        .meta-label {
            font-weight: bold;
            width: 140px;
        }
        .meta-value {
            border-bottom: 1px solid #000;
        }
        .data-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 4px;
            margin-bottom: 10px;
        }
        .data-table th, .data-table td {
            border: 1px solid #000;
            padding: 3px 4px;
            font-size: 7.5pt;
            text-align: center;
            vertical-align: middle;
        }
        .data-table th {
            background-color: #d9e1d2;
            font-weight: bold;
        }
        .text-left {
            text-align: left !important;
        }
        .signatories-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }
        .signatories-table td {
            width: 33.33%;
            vertical-align: top;
            font-size: 8pt;
            padding: 0 10px;
        }
        .sig-line {
            margin-top: 35px;
            border-top: 1px solid #000;
            text-align: center;
            padding-top: 2px;
        }
        .sig-name {
            font-weight: bold;
            font-size: 8.5pt;
            text-transform: uppercase;
        }
        .sig-sub {
            font-size: 7.5pt;
            color: #333;
        }
        .disclaimer {
            margin-top: 12px;
            font-size: 6.5pt;
            text-align: justify;
            line-height: 1.25;
            color: #222;
        }
    </style>
</head>
<body>
    <div class="form-code">RBI FORM A (Revised 2024)</div>
    <div class="form-title">Records of Barangay Inhabitants by Household</div>

    <table class="meta-grid">
        <tr>
            <td class="meta-label">REGION :</td>
            <td class="meta-value">{{ $region ?? 'REGION IV-A (CALABARZON)' }}</td>
            <td style="width: 40px;"></td>
            <td class="meta-label">HOUSEHOLD ADDRESS :</td>
            <td class="meta-value">{{ $household->address ?? ($household->purok_sitio . ', Barangay Lallana') }}</td>
        </tr>
        <tr>
            <td class="meta-label">PROVINCE :</td>
            <td class="meta-value">{{ $province ?? 'CAVITE' }}</td>
            <td></td>
            <td class="meta-label">NO. OF HOUSEHOLD MEMBERS :</td>
            <td class="meta-value">{{ count($members) }}</td>
        </tr>
        <tr>
            <td class="meta-label">CITY/MUNICIPALITY :</td>
            <td class="meta-value">{{ $city ?? 'TRECE MARTIRES CITY' }}</td>
            <td></td>
            <td class="meta-label">HOUSEHOLD NUMBER :</td>
            <td class="meta-value">{{ $household->household_code }}</td>
        </tr>
        <tr>
            <td class="meta-label">BARANGAY :</td>
            <td class="meta-value">{{ $barangay ?? 'BARANGAY LALLANA' }}</td>
            <td></td>
            <td></td>
            <td></td>
        </tr>
    </table>

    <table class="data-table">
        <thead>
            <tr>
                <th colspan="4">NAME</th>
                <th rowspan="2" style="width: 10%;">PLACE OF BIRTH</th>
                <th rowspan="2" style="width: 8%;">DATE OF BIRTH</th>
                <th rowspan="2" style="width: 4%;">AGE</th>
                <th rowspan="2" style="width: 5%;">SEX</th>
                <th rowspan="2" style="width: 7%;">CIVIL STATUS</th>
                <th rowspan="2" style="width: 7%;">CITIZENSHIP</th>
                <th rowspan="2" style="width: 11%;">OCCUPATION</th>
                <th rowspan="2" style="width: 20%;">Indicate if Labor/employed, Unemployed, PWD, OFW, Solo Parent, Out of School Youth (OSY), Out of School Children (OSC) and/or IP</th>
            </tr>
            <tr>
                <th style="width: 8%;">LAST NAME</th>
                <th style="width: 8%;">FIRST NAME</th>
                <th style="width: 8%;">MIDDLE NAME</th>
                <th style="width: 4%;">EXT</th>
            </tr>
        </thead>
        <tbody>
            @forelse($members as $m)
                <tr>
                    <td class="text-left">{{ $m['last_name'] }}</td>
                    <td class="text-left">{{ $m['first_name'] }}</td>
                    <td class="text-left">{{ $m['middle_name'] ?? '—' }}</td>
                    <td>{{ $m['suffix'] ?? '—' }}</td>
                    <td class="text-left">{{ $m['birth_place'] ?? '—' }}</td>
                    <td>{{ $m['birthdate_formatted'] ?? '—' }}</td>
                    <td>{{ $m['age'] ?? '—' }}</td>
                    <td>{{ $m['gender'] ?? '—' }}</td>
                    <td>{{ $m['civil_status'] ?? '—' }}</td>
                    <td>{{ $m['citizenship'] ?? 'Filipino' }}</td>
                    <td class="text-left">{{ $m['occupation'] ?? '—' }}</td>
                    <td class="text-left">{{ $m['sectors_formatted'] ?: 'None' }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="12" style="padding: 15px; color: #666;">No household members recorded.</td>
                </tr>
            @endforelse
            {{-- Fill empty rows up to minimum rows for clean printed appearance --}}
            @for ($i = count($members); $i < max(6, count($members)); $i++)
                <tr>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                </tr>
            @endfor
        </tbody>
    </table>

    <table class="signatories-table">
        <tr>
            <td>
                <div>Prepared by:</div>
                <div class="sig-line">
                    <div class="sig-name">{{ $headName ?? 'Name of Household/Head Member' }}</div>
                    <div class="sig-sub">(Signature over Printed Name)</div>
                </div>
            </td>
            <td>
                <div>Certified Correct:</div>
                <div class="sig-line">
                    <div class="sig-name">{{ $officials['secretary'] ?? 'Barangay Secretary' }}</div>
                    <div class="sig-sub">Barangay Secretary<br>(Signature over Printed Name)</div>
                </div>
            </td>
            <td>
                <div>Validated by:</div>
                <div class="sig-line">
                    <div class="sig-name">{{ $officials['punong_barangay'] ?? 'Hon. Cecilia M. Decillo' }}</div>
                    <div class="sig-sub">Punong Barangay<br>(Signature over Printed Name)</div>
                </div>
            </td>
        </tr>
    </table>

    <div class="disclaimer">
        I hereby certify that the above information are true and correct to the best of my knowledge. I understand that for the Barangay to carry out its mandate pursuant to Section 394 (d)(6) of the Local Government Code of 1991, personal information is processed for inhabitant identification, planning, and reference, subject to the provisions of the Data Privacy Act of 2012.
    </div>
</body>
</html>
