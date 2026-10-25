<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Inquiry;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminInquiryController extends Controller
{
    /**
     * Display a listing of citizen inquiries.
     */
    public function index(Request $request): Response
    {
        $search = $request->string('search')->trim()->toString();
        $status = $request->string('status')->trim()->toString();

        $query = Inquiry::query()
            ->with('resolvedBy:id,name,email')
            ->latest('id');

        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('subject', 'like', "%{$search}%")
                    ->orWhere('message', 'like', "%{$search}%");
            });
        }

        if ($status !== '' && $status !== 'all') {
            $query->where('status', $status);
        }

        $paginated = $query->paginate(15)->withQueryString();

        $inquiries = $paginated->through(function (Inquiry $item) {
            return [
                'id' => $item->id,
                'name' => $item->name,
                'email' => $item->email,
                'subject' => $item->subject,
                'message' => $item->message,
                'ip_address' => $item->ip_address,
                'status' => $item->status,
                'admin_notes' => $item->admin_notes,
                'resolved_by' => $item->resolvedBy ? [
                    'id' => $item->resolvedBy->id,
                    'name' => $item->resolvedBy->name,
                ] : null,
                'resolved_at_formatted' => $item->resolved_at?->toDayDateTimeString(),
                'created_at_formatted' => $item->created_at?->diffForHumans(),
                'created_at_full' => $item->created_at?->toDayDateTimeString(),
            ];
        });

        $stats = [
            'total' => Inquiry::count(),
            'pending' => Inquiry::where('status', 'pending')->count(),
            'in_progress' => Inquiry::where('status', 'in_progress')->count(),
            'resolved' => Inquiry::where('status', 'resolved')->count(),
        ];

        return Inertia::render('admin/inquiries/index', [
            'inquiries' => $inquiries,
            'stats' => $stats,
            'filters' => [
                'search' => $search,
                'status' => $status ?: 'all',
            ],
        ]);
    }

    /**
     * Display the specified inquiry details.
     */
    public function show(Inquiry $inquiry): Response
    {
        $inquiry->load('resolvedBy:id,name,email');

        return Inertia::render('admin/inquiries/show', [
            'inquiry' => [
                'id' => $inquiry->id,
                'name' => $inquiry->name,
                'email' => $inquiry->email,
                'subject' => $inquiry->subject,
                'message' => $inquiry->message,
                'ip_address' => $inquiry->ip_address,
                'status' => $inquiry->status,
                'admin_notes' => $inquiry->admin_notes,
                'resolved_by' => $inquiry->resolvedBy ? [
                    'id' => $inquiry->resolvedBy->id,
                    'name' => $inquiry->resolvedBy->name,
                ] : null,
                'resolved_at_formatted' => $inquiry->resolved_at?->toDayDateTimeString(),
                'created_at_formatted' => $inquiry->created_at?->diffForHumans(),
                'created_at_full' => $inquiry->created_at?->toDayDateTimeString(),
            ],
        ]);
    }

    /**
     * Update the status and admin notes of the inquiry.
     */
    public function updateStatus(Request $request, Inquiry $inquiry): RedirectResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'string', 'in:pending,in_progress,resolved,spam'],
            'admin_notes' => ['nullable', 'string', 'max:2000'],
        ]);

        $inquiry->status = $validated['status'];
        $inquiry->admin_notes = $validated['admin_notes'] ?? null;

        if ($inquiry->isDirty('status')) {
            if ($validated['status'] === 'resolved') {
                $inquiry->resolved_by_id = $request->user()?->id;
                $inquiry->resolved_at = now();
            } else {
                $inquiry->resolved_by_id = null;
                $inquiry->resolved_at = null;
            }
        }

        $inquiry->save();

        return back()->with('success', 'Inquiry status updated successfully.');
    }

    /**
     * Remove the specified inquiry from storage.
     */
    public function destroy(Inquiry $inquiry): RedirectResponse
    {
        $inquiry->delete();

        return back()->with('success', 'Inquiry deleted successfully.');
    }
}
