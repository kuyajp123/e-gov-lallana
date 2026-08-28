<?php

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

// 1. Ensure required temporary storage and cache directories exist in /tmp on Vercel serverless
if (isset($_ENV['VERCEL']) || isset($_SERVER['VERCEL']) || getenv('VERCEL')) {
    $directories = [
        '/tmp/storage/app/public',
        '/tmp/storage/framework/cache/data',
        '/tmp/storage/framework/sessions',
        '/tmp/storage/framework/views',
        '/tmp/storage/logs',
        '/tmp/bootstrap/cache',
    ];

    foreach ($directories as $directory) {
        if (! is_dir($directory)) {
            mkdir($directory, 0755, true);
        }
    }

    // Set writable cache paths for serverless execution
    putenv('APP_PACKAGES_CACHE=/tmp/bootstrap/cache/packages.php');
    putenv('APP_SERVICES_CACHE=/tmp/bootstrap/cache/services.php');
    putenv('VIEW_COMPILED_PATH=/tmp/storage/framework/views');
    $_ENV['APP_PACKAGES_CACHE'] = '/tmp/bootstrap/cache/packages.php';
    $_ENV['APP_SERVICES_CACHE'] = '/tmp/bootstrap/cache/services.php';
    $_ENV['VIEW_COMPILED_PATH'] = '/tmp/storage/framework/views';
}

define('LARAVEL_START', microtime(true));

$_SERVER['SCRIPT_NAME'] = '/index.php';
$_SERVER['SCRIPT_FILENAME'] = __DIR__.'/../public/index.php';

// 2. Register Composer Autoloader
require __DIR__.'/../vendor/autoload.php';

// 3. Bootstrap Laravel
/** @var Application $app */
$app = require_once __DIR__.'/../bootstrap/app.php';

// 4. Handle incoming HTTP request with exception fallback
try {
    $app->handleRequest(Request::capture());
} catch (Throwable $e) {
    error_log('LARAVEL_SERVERLESS_CRASH: '.$e->getMessage().' in '.$e->getFile().':'.$e->getLine()."\n".$e->getTraceAsString());
    if (! headers_sent()) {
        http_response_code(500);
        header('Content-Type: text/plain; charset=utf-8');
        echo "Laravel Serverless Boot Error:\n\n".$e->getMessage()."\n\nFile: ".$e->getFile().':'.$e->getLine()."\n\nTrace:\n".$e->getTraceAsString();
    }
}
