<?php

namespace App\Providers;

use Filament\Facades\Filament;
use Illuminate\Support\ServiceProvider;
use App\Filament\Resources\EduConnectResource\Widgets\StatsOverview;

class FilamentServiceProvider extends ServiceProvider
{
    public function boot()
    {
        Filament::registerWidgets([
            StatsOverview::class,
        ]);
    }
} 