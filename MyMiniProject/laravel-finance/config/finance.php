<?php

return [
    // Same-origin Laravel API (no separate .NET backend)
    'api_url' => rtrim(env('FINANCE_API_URL', ''), '/'),
];
