<?php

use Illuminate\Support\Facades\Route;

Route::view('/{any?}', 'finance.app')->where('any', '.*');
