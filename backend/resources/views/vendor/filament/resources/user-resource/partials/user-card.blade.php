@foreach ($records as $record)
    <div class="bg-white rounded-lg shadow p-4 mb-6">
        <div class="font-bold text-lg">{{ $record->name }}</div>
        <div class="text-sm text-gray-600 mb-1">Email: {{ $record->email }}</div>
        <div class="text-sm text-gray-600 mb-1">Role: {{ ucfirst($record->role) }}</div>
        <div class="text-sm text-gray-600 mb-1">Enrollments: {{ $record->enrollments()->count() }}</div>
        <div class="text-xs text-gray-400 mt-1">Joined: {{ $record->created_at->format('M d, Y') }}</div>
        <div class="flex gap-4 mt-4 items-center">
            <a href="{{ url('/admin/users/' . $record->id . '/edit') }}"
               class="flex items-center text-primary-600 hover:text-primary-700 text-sm font-medium">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-2.828 0L5 12.828a2 2 0 010-2.828L9 13z"></path>
                </svg>
                Edit
            </a>
            <form action="{{ url('/admin/users/' . $record->id) }}" method="POST" onsubmit="return confirm('Are you sure?');" style="display:inline;">
                @csrf
                @method('DELETE')
                <button type="submit"
                        class="flex items-center text-danger-600 hover:text-danger-700 text-sm font-medium">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2"></path>
                    </svg>
                    Delete
                </button>
            </form>
        </div>
    </div>
@endforeach 