<x-filament::page>
    {{-- Card view for mobile --}}
    <div class="block sm:hidden">
        @php
            $resource = $this->getResource();
            $modelClass = $resource::getModel();
            $records = $modelClass::latest()->limit(10)->get();
            $resourceSlug = $resource::getSlug();
        @endphp
        @if ($resourceSlug === 'courses')
            @include('vendor.filament.resources.course-resource.partials.course-card', ['records' => $records])
        @elseif ($resourceSlug === 'users')
            @include('vendor.filament.resources.user-resource.partials.user-card', ['records' => $records])
        @elseif ($resourceSlug === 'enrollments')
            @include('vendor.filament.resources.enrollment-resource.partials.enrollment-card', ['records' => $records])
        @else
            <div class="p-4 text-gray-500 text-center">Card view for mobile coming soon.</div>
        @endif
    </div>
    {{-- Table for tablet/desktop --}}
    <div class="hidden sm:block">
        {{ $this->table }}
    </div>
</x-filament::page>
