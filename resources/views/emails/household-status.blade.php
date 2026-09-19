<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>{{ $title }}</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 24px; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; border: 1px solid #e2e8f0; padding: 32px; }
        .header { border-bottom: 2px solid #0284c7; padding-bottom: 16px; margin-bottom: 24px; }
        .header h1 { font-size: 20px; color: #0f172a; margin: 0; }
        .content { font-size: 15px; line-height: 1.6; }
        .status-box { background: #f1f5f9; border-left: 4px solid #0284c7; padding: 16px; margin: 20px 0; border-radius: 4px; }
        .button { display: inline-block; background: #0284c7; color: #ffffff !important; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin-top: 16px; }
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
            <div class="status-box">
                <p><strong>{{ $title }}</strong></p>
                <p>{{ $bodyMessage }}</p>
            </div>
            @if(!empty($actionUrl))
                <p>
                    <a href="{{ $actionUrl }}" class="button">View in Portal</a>
                </p>
            @endif
            <p>If you have any questions or require assistance, please visit the Barangay Hall during official business hours.</p>
        </div>
        <div class="footer">
            <p>This is an automated notification from Barangay Lallana E-Services.</p>
        </div>
    </div>
</body>
</html>
