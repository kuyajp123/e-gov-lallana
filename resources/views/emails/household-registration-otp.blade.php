<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Household Registration Verification Code</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 24px; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; border: 1px solid #e2e8f0; padding: 32px; }
        .header { border-bottom: 2px solid #0284c7; padding-bottom: 16px; margin-bottom: 24px; }
        .header h1 { font-size: 20px; color: #0f172a; margin: 0; }
        .content { font-size: 15px; line-height: 1.6; }
        .otp-box { background: #f0fdf4; border: 2px dashed #16a34a; padding: 20px; margin: 24px 0; border-radius: 8px; text-align: center; }
        .otp-code { font-size: 32px; font-weight: 800; letter-spacing: 6px; color: #15803d; font-family: monospace; }
        .note { font-size: 13px; color: #64748b; margin-top: 8px; }
        .footer { margin-top: 32px; font-size: 12px; color: #64748b; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 16px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Barangay Lallana E-Government Portal</h1>
        </div>
        <div class="content">
            <p>Hello {{ $residentName }},</p>
            <p>You recently requested a verification code to register your official household record with Barangay Lallana.</p>
            
            <div class="otp-box">
                <div class="note">Your 6-Digit One-Time Verification Code is:</div>
                <div class="otp-code">{{ $otpCode }}</div>
                <div class="note">This code is valid for <strong>5 minutes</strong>. Do not share this code with anyone.</div>
            </div>

            <p>If you did not initiate this request, please ignore this email or report it to the Barangay Hall immediately.</p>
        </div>
        <div class="footer">
            <p>This is an automated security verification from Barangay Lallana E-Services.</p>
        </div>
    </div>
</body>
</html>
