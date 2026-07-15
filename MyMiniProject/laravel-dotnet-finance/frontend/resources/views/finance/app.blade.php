<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="finance-api-url" content="{{ config('finance.api_url') }}">
    <title>Ledger Laravel</title>
    <link rel="icon" href="{{ asset('favicon.ico') }}">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Prompt:wght@400;500;600;700&family=Sarabun:wght@400;500;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="{{ asset('css/finance.css') }}">
    <script>
        window.FINANCE_API = @json(config('finance.api_url'));
    </script>
</head>
<body>
    <div id="app"></div>
    <script src="{{ asset('js/finance-app.js') }}" defer></script>
</body>
</html>
