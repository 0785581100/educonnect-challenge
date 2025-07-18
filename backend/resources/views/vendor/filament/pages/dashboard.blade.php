<x-filament::page class="filament-dashboard-page">
    <div class="px-2 sm:px-4">
        <x-filament::widgets
            :widgets="$this->getWidgets()"
            :columns="$this->getColumns()"
        />
    </div>
</x-filament::page>
