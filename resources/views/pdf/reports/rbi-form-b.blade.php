<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>RBI Form B - Individual Records of Barangay Inhabitant</title>
    <style>
        @page {
            size: a4 portrait;
            margin: 12mm 14mm 12mm 14mm;
        }
        body {
            font-family: Arial, Helvetica, sans-serif;
            font-size: 8.5pt;
            color: #000;
            line-height: 1.3;
            margin: 0;
            padding: 0;
        }
        .form-code {
            font-weight: bold;
            font-size: 9.5pt;
            margin-bottom: 2px;
        }
        .form-title {
            text-align: center;
            font-size: 11pt;
            font-weight: bold;
            margin-bottom: 8px;
            letter-spacing: 0.5px;
            text-transform: uppercase;
        }
        .meta-header {
            width: 100%;
            margin-bottom: 8px;
            border-collapse: collapse;
            font-size: 8.5pt;
        }
        .meta-header td {
            padding: 2px 4px;
        }
        .meta-line {
            display: inline-block;
            border-bottom: 1px solid #000;
            min-width: 130px;
            padding: 0 4px;
            font-weight: bold;
        }
        .main-container {
            border: 2px solid #000;
            padding: 12px 14px;
            margin-top: 4px;
        }
        .section-header {
            text-align: center;
            font-weight: bold;
            font-size: 10pt;
            letter-spacing: 0.5px;
            margin-bottom: 10px;
            text-transform: uppercase;
        }
        .field-box {
            border: 1px solid #000;
            padding: 4px 6px;
            min-height: 16px;
            font-size: 8.5pt;
            font-weight: 500;
            background-color: #fff;
        }
        .field-sublabel {
            font-size: 7pt;
            text-align: center;
            color: #222;
            margin-top: 2px;
            margin-bottom: 6px;
        }
        .grid-row {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 4px;
        }
        .grid-row td {
            vertical-align: top;
            padding: 0 4px;
        }
        .checkbox-container {
            display: inline-block;
            width: 10px;
            height: 10px;
            border: 1px solid #000;
            text-align: center;
            line-height: 10px;
            font-size: 8pt;
            vertical-align: middle;
            margin-right: 3px;
        }
        .education-row {
            border: 1px solid #000;
            padding: 6px 8px;
            margin: 8px 0;
            font-size: 7.5pt;
        }
        .disclaimer {
            font-size: 6.5pt;
            text-align: justify;
            line-height: 1.25;
            margin: 12px 0 16px 0;
            color: #222;
        }
        .bottom-section {
            width: 100%;
            border-collapse: collapse;
        }
        .bottom-section td {
            vertical-align: top;
        }
        .thumbmark-box {
            width: 75px;
            height: 85px;
            border: 1px solid #000;
            text-align: center;
            display: inline-block;
            margin-left: 8px;
        }
        .thumbmark-label {
            font-size: 7pt;
            margin-top: 88px;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="form-code">RBI Form B (Revised 2024)</div>
    <div class="form-title">Individual Records of Barangay Inhabitant</div>

    <table class="meta-header">
        <tr>
            <td style="width: 50%;">REGION : <span class="meta-line">{{ $region ?? 'REGION IV-A (CALABARZON)' }}</span></td>
            <td style="width: 50%;">CITY/MUN: <span class="meta-line">{{ $city ?? 'TRECE MARTIRES CITY' }}</span></td>
        </tr>
        <tr>
            <td>PROVINCE : <span class="meta-line">{{ $province ?? 'CAVITE' }}</span></td>
            <td>BARANGAY : <span class="meta-line">{{ $barangay ?? 'BARANGAY LALLANA' }}</span></td>
        </tr>
    </table>

    <div class="main-container">
        <div class="section-header">Personal Information</div>

        {{-- PhilSys Card No --}}
        <div style="width: 200px; margin-bottom: 6px;">
            <div class="field-box" style="font-family: monospace; font-size: 9pt;">
                {{ $resident->philsys_card_no ?: '—' }}
            </div>
            <div class="field-sublabel">(PhilSys Card No.)</div>
        </div>

        {{-- Name Row --}}
        <table class="grid-row">
            <tr>
                <td style="width: 32%;">
                    <div class="field-box">{{ $resident->last_name }}</div>
                    <div class="field-sublabel">(Last Name)</div>
                </td>
                <td style="width: 12%;">
                    <div class="field-box">{{ $resident->suffix ?: '—' }}</div>
                    <div class="field-sublabel">(Suffix)</div>
                </td>
                <td style="width: 28%;">
                    <div class="field-box">{{ $resident->first_name }}</div>
                    <div class="field-sublabel">(First Name)</div>
                </td>
                <td style="width: 28%;">
                    <div class="field-box">{{ $resident->middle_name ?: '—' }}</div>
                    <div class="field-sublabel">(Middle Name)</div>
                </td>
            </tr>
        </table>

        {{-- Birth & Status Row --}}
        <table class="grid-row">
            <tr>
                <td style="width: 22%;">
                    <div class="field-box">{{ $resident->birthdate ? \Illuminate\Support\Carbon::parse($resident->birthdate)->format('m/d/Y') : '—' }}</div>
                    <div class="field-sublabel">(Birth Date: mm/dd/yyyy)</div>
                </td>
                <td style="width: 32%;">
                    <div class="field-box">{{ $resident->birth_place ?: '—' }}</div>
                    <div class="field-sublabel">(Birth Place)</div>
                </td>
                <td style="width: 12%;">
                    <div class="field-box">{{ ucfirst($resident->gender ?? '—') }}</div>
                    <div class="field-sublabel">(Sex)</div>
                </td>
                <td style="width: 17%;">
                    <div class="field-box">{{ ucfirst($resident->civil_status ?? '—') }}</div>
                    <div class="field-sublabel">(Civil Status)</div>
                </td>
                <td style="width: 17%;">
                    <div class="field-box">{{ $resident->religion ?: '—' }}</div>
                    <div class="field-sublabel">(Religion)</div>
                </td>
            </tr>
        </table>

        {{-- Residence & Citizenship --}}
        <table class="grid-row">
            <tr>
                <td style="width: 72%;">
                    <div class="field-box">{{ $household->address ?? ($household->purok_sitio ? $household->purok_sitio . ', Barangay Lallana' : 'Barangay Lallana, Trece Martires City') }}</div>
                    <div class="field-sublabel">(Residence Address)</div>
                </td>
                <td style="width: 28%;">
                    <div class="field-box">{{ $resident->citizenship ?: 'Filipino' }}</div>
                    <div class="field-sublabel">(Citizenship)</div>
                </td>
            </tr>
        </table>

        {{-- Occupation & Contacts --}}
        <table class="grid-row">
            <tr>
                <td style="width: 38%;">
                    <div class="field-box">{{ $resident->occupation ?: '—' }}</div>
                    <div class="field-sublabel">(Profession / Occupation)</div>
                </td>
                <td style="width: 31%;">
                    <div class="field-box">{{ $user->phone_number ?? '—' }}</div>
                    <div class="field-sublabel">(Contact Number)</div>
                </td>
                <td style="width: 31%;">
                    <div class="field-box">{{ $user->email ?? '—' }}</div>
                    <div class="field-sublabel">(E-mail Address)</div>
                </td>
            </tr>
        </table>

        {{-- Education Row --}}
        <div class="education-row">
            <div style="margin-bottom: 6px;">
                <strong>HIGHEST EDUCATIONAL ATTAINMENT:</strong>
                &nbsp;&nbsp;
                <span class="checkbox-container">{{ strtolower($resident->educational_attainment ?? '') === 'elementary' ? 'X' : '' }}</span> ELEMENTARY
                &nbsp;&nbsp;&nbsp;
                <span class="checkbox-container">{{ strtolower($resident->educational_attainment ?? '') === 'high_school' ? 'X' : '' }}</span> HIGH SCHOOL
                &nbsp;&nbsp;&nbsp;
                <span class="checkbox-container">{{ strtolower($resident->educational_attainment ?? '') === 'college' ? 'X' : '' }}</span> COLLEGE
                &nbsp;&nbsp;&nbsp;
                <span class="checkbox-container">{{ strtolower($resident->educational_attainment ?? '') === 'post_graduate' ? 'X' : '' }}</span> POST GRAD
                &nbsp;&nbsp;&nbsp;
                <span class="checkbox-container">{{ strtolower($resident->educational_attainment ?? '') === 'vocational' ? 'X' : '' }}</span> VOCATIONAL
            </div>
            <div style="margin-left: 20px;">
                <em>Please specify:</em>
                &nbsp;&nbsp;&nbsp;
                <span class="checkbox-container">{{ strtolower($resident->educational_status ?? '') === 'graduate' ? 'X' : '' }}</span> Graduate
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <span class="checkbox-container">{{ strtolower($resident->educational_status ?? '') === 'undergraduate' ? 'X' : '' }}</span> Undergraduate
            </div>
        </div>

        <div class="disclaimer">
            I hereby certify that the above information is true and correct to the best of my knowledge. I understand that for the Barangay to carry out its mandate pursuant to Section 394 (d)(6) of the Local Government Code of 1991, personal information is processed for inhabitant identification, planning, and reference, subject to the provisions of the Data Privacy Act of 2012.
        </div>

        {{-- Signatures and Thumbmarks --}}
        <table class="bottom-section">
            <tr>
                <td style="width: 50%; padding-right: 15px;">
                    <div style="margin-top: 15px;">
                        <div style="border-bottom: 1px solid #000; width: 170px; text-align: center; font-size: 8.5pt;">
                            {{ now()->format('F d, Y') }}
                        </div>
                        <div style="font-size: 7.5pt; color: #333; margin-top: 2px;">Date Accomplished</div>
                    </div>

                    <div style="margin-top: 25px;">
                        <div style="font-size: 8pt; margin-bottom: 25px;">Attested By:</div>
                        <div style="border-bottom: 1px solid #000; width: 220px; text-align: center; font-weight: bold; font-size: 8.5pt;">
                            {{ $officials['secretary'] ?? 'Barangay Secretary' }}
                        </div>
                        <div style="font-size: 7.5pt; color: #333; margin-top: 2px;">Barangay Secretary</div>
                    </div>

                    <div style="margin-top: 20px;">
                        <div style="display: inline-block; vertical-align: middle; font-size: 8pt; font-weight: bold;">Household Number:</div>
                        <div style="display: inline-block; vertical-align: middle; border: 1px solid #000; padding: 3px 8px; min-width: 100px; font-weight: bold; font-family: monospace;">
                            {{ $household->household_code ?? '—' }}
                        </div>
                        <div style="font-size: 6.5pt; font-style: italic; color: #444; margin-top: 3px;">
                            Note: The household number shall be filled up by the Barangay Secretary.
                        </div>
                    </div>
                </td>
                <td style="width: 50%; text-align: right;">
                    <div style="margin-top: 15px; text-align: center; float: right;">
                        <div style="border-bottom: 1px solid #000; width: 250px; font-weight: bold; font-size: 8.5pt;">
                            {{ $resident->full_name }}
                        </div>
                        <div style="font-size: 7pt; color: #333; margin-top: 2px;">Name/Signature of Person Accomplishing the Form</div>

                        <div style="margin-top: 25px; display: inline-block;">
                            <div style="display: inline-block; text-align: center; margin-right: 12px;">
                                <div class="thumbmark-box"></div>
                                <div style="font-size: 7pt; margin-top: 4px;">Left Thumbmark</div>
                            </div>
                            <div style="display: inline-block; text-align: center;">
                                <div class="thumbmark-box"></div>
                                <div style="font-size: 7pt; margin-top: 4px;">Right Thumbmark</div>
                            </div>
                        </div>
                    </div>
                </td>
            </tr>
        </table>
    </div>
</body>
</html>
