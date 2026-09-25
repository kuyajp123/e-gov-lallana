<?php

namespace App\Http\Controllers\Admin;

use App\Enums\DocumentRequestStatus;
use App\Enums\PaymentStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateDocumentRequestPaymentRequest;
use App\Http\Requests\Admin\UpdateDocumentRequestStatusRequest;
use App\Models\DocumentRequest;
use App\Models\DocumentType;
use App\Services\Pdf\PdfGenerationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;

class AdminDocumentRequestController extends Controller
{
    /**
     * Display a listing of document requests in the administrative queue.
     */
    public function index(Request $request): Response
    {
        $search = $request->string('search')->trim()->toString();
        $status = $request->string('status')->trim()->toString();
        $documentTypeId = $request->integer('document_type_id');
        $paymentStatus = $request->string('payment_status')->trim()->toString();

        $query = DocumentRequest::query()
            ->with(['user.residentProfile', 'documentType'])
            ->latest('submitted_at')
            ->latest('id');

        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('reference_code', 'like', "%{$search}%")
                    ->orWhere('purpose', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($uq) use ($search) {
                        $uq->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%")
                            ->orWhere('phone_number', 'like', "%{$search}%");
                    });
            });
        }

        if ($status !== '' && $status !== 'all') {
            $query->where('current_status', $status);
        }

        if ($documentTypeId > 0) {
            $query->where('document_type_id', $documentTypeId);
        }

        if ($paymentStatus !== '' && $paymentStatus !== 'all') {
            $query->where('payment_status', $paymentStatus);
        }

        $paginated = $query->paginate(15)->withQueryString();

        $requests = $paginated->through(function (DocumentRequest $req) {
            return [
                'id' => $req->id,
                'reference_code' => $req->reference_code,
                'current_status' => $req->current_status->value,
                'status_label' => $req->current_status->label(),
                'status_color' => $req->current_status->color(),
                'fee_cents' => $req->fee_cents,
                'formatted_fee' => $req->formatted_fee,
                'payment_status' => $req->payment_status->value,
                'payment_label' => $req->payment_status->label(),
                'payment_color' => $req->payment_status->color(),
                'purpose' => $req->purpose,
                'admin_notes' => $req->admin_notes,
                'submitted_at' => $req->submitted_at?->toISOString(),
                'submitted_at_formatted' => $req->submitted_at?->format('M d, Y h:i A') ?? '—',
                'completed_at' => $req->completed_at?->toISOString(),
                'user' => [
                    'id' => $req->user->id,
                    'name' => $req->user->name,
                    'email' => $req->user->email,
                    'phone_number' => $req->user->phone_number,
                    'avatar_url' => $req->user->residentProfile?->avatar?->getUrl(),
                ],
                'document_type' => [
                    'id' => $req->documentType->id,
                    'name' => $req->documentType->name,
                    'slug' => $req->documentType->slug,
                ],
            ];
        });

        // Compute status badge counts for top tabs
        $statusCounts = [
            'all' => DocumentRequest::count(),
            'pending' => DocumentRequest::where('current_status', DocumentRequestStatus::Pending)->count(),
            'processing' => DocumentRequest::where('current_status', DocumentRequestStatus::Processing)->count(),
            'on_hold' => DocumentRequest::where('current_status', DocumentRequestStatus::OnHold)->count(),
            'ready_for_pickup' => DocumentRequest::where('current_status', DocumentRequestStatus::ReadyForPickup)->count(),
            'completed' => DocumentRequest::where('current_status', DocumentRequestStatus::Completed)->count(),
            'returned' => DocumentRequest::where('current_status', DocumentRequestStatus::Returned)->count(),
            'rejected' => DocumentRequest::where('current_status', DocumentRequestStatus::Rejected)->count(),
            'cancelled' => DocumentRequest::where('current_status', DocumentRequestStatus::Cancelled)->count(),
        ];

        $documentTypes = DocumentType::query()
            ->where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name', 'slug']);

        return Inertia::render('admin/document-requests/index', [
            'requests' => $requests,
            'statusCounts' => $statusCounts,
            'documentTypes' => $documentTypes,
            'filters' => [
                'search' => $search,
                'status' => $status ?: 'all',
                'document_type_id' => $documentTypeId ?: null,
                'payment_status' => $paymentStatus ?: 'all',
            ],
        ]);
    }

    /**
     * Display the specified document request with full audit trail and attachments.
     */
    public function show(DocumentRequest $documentRequest): Response
    {
        $documentRequest->load([
            'user.residentProfile.avatar',
            'documentType',
            'fileRecords',
            'statusHistory.changedByUser',
        ]);

        $files = $documentRequest->fileRecords->map(function ($file) {
            return [
                'id' => $file->id,
                'file_name' => $file->file_name,
                'mime_type' => $file->mime_type,
                'size_bytes' => $file->size_bytes,
                'file_type' => $file->pivot->file_type ?? 'supporting_document',
                'purpose' => $file->pivot->purpose ?? null,
                'url' => $file->getUrl(60),
            ];
        });

        $timeline = $documentRequest->statusHistory->map(function ($entry) {
            $statusEnum = DocumentRequestStatus::tryFrom($entry->status);

            return [
                'id' => $entry->id,
                'status' => $entry->status,
                'label' => $statusEnum?->label() ?? ucfirst(str_replace('_', ' ', $entry->status)),
                'color' => $statusEnum?->color() ?? 'gray',
                'remarks' => $entry->remarks,
                'changed_by' => $entry->changedByUser->name ?? 'System',
                'created_at' => $entry->created_at->toISOString(),
                'created_at_formatted' => $entry->created_at->format('M d, Y h:i A'),
                'created_at_human' => $entry->created_at->diffForHumans(),
            ];
        });

        $details = [
            'id' => $documentRequest->id,
            'reference_code' => $documentRequest->reference_code,
            'current_status' => $documentRequest->current_status->value,
            'status_label' => $documentRequest->current_status->label(),
            'status_color' => $documentRequest->current_status->color(),
            'fee_cents' => $documentRequest->fee_cents,
            'formatted_fee' => $documentRequest->formatted_fee,
            'payment_status' => $documentRequest->payment_status->value,
            'payment_label' => $documentRequest->payment_status->label(),
            'payment_color' => $documentRequest->payment_status->color(),
            'purpose' => $documentRequest->purpose,
            'admin_notes' => $documentRequest->admin_notes,
            'cancellation_reason' => $documentRequest->cancellation_reason?->value,
            'cancellation_reason_label' => $documentRequest->cancellation_reason?->label(),
            'cancellation_notes' => $documentRequest->cancellation_notes,
            'submitted_data' => $documentRequest->submitted_data ?? [],
            'submitted_at' => $documentRequest->submitted_at?->toISOString(),
            'submitted_at_formatted' => $documentRequest->submitted_at?->format('M d, Y h:i A'),
            'completed_at' => $documentRequest->completed_at?->toISOString(),
            'cancelled_at' => $documentRequest->cancelled_at?->toISOString(),
            'user' => [
                'id' => $documentRequest->user->id,
                'name' => $documentRequest->user->name,
                'email' => $documentRequest->user->email,
                'phone_number' => $documentRequest->user->phone_number,
                'avatar_url' => $documentRequest->user->residentProfile?->avatar?->getUrl(),
                'civil_status' => $documentRequest->user->residentProfile?->civil_status,
                'address' => 'Barangay Lallana',
            ],
            'document_type' => [
                'id' => $documentRequest->documentType->id,
                'name' => $documentRequest->documentType->name,
                'slug' => $documentRequest->documentType->slug,
                'description' => $documentRequest->documentType->description,
                'requirements' => $documentRequest->documentType->requirements ?? [],
            ],
            'files' => $files,
            'timeline' => $timeline,
        ];

        return Inertia::render('admin/document-requests/show', [
            'documentRequest' => $details,
        ]);
    }

    /**
     * Transition the status of a document request.
     */
    public function updateStatus(UpdateDocumentRequestStatusRequest $request, DocumentRequest $documentRequest): RedirectResponse
    {
        $validated = $request->validated();
        $newStatus = DocumentRequestStatus::from($validated['status']);

        $documentRequest->transitionTo(
            $newStatus,
            Auth::id(),
            $validated['remarks'] ?? null
        );

        return back()->with('success', "Request {$documentRequest->reference_code} transitioned to {$newStatus->label()}.");
    }

    /**
     * Update the payment status of a document request.
     */
    public function updatePayment(UpdateDocumentRequestPaymentRequest $request, DocumentRequest $documentRequest): RedirectResponse
    {
        $validated = $request->validated();
        $newStatus = PaymentStatus::from($validated['payment_status']);

        $documentRequest->update(['payment_status' => $newStatus]);

        return back()->with('success', "Payment status for {$documentRequest->reference_code} updated to {$newStatus->label()}.");
    }

    /**
     * Update internal staff administrative notes.
     */
    public function updateNotes(Request $request, DocumentRequest $documentRequest): RedirectResponse
    {
        $validated = $request->validate([
            'admin_notes' => ['nullable', 'string', 'max:5000'],
        ]);

        $documentRequest->update(['admin_notes' => $validated['admin_notes'] ?? null]);

        return back()->with('success', "Internal notes for {$documentRequest->reference_code} saved.");
    }

    /**
     * Download or view the official generated PDF certificate for a document request.
     */
    public function downloadPdf(DocumentRequest $documentRequest, PdfGenerationService $pdfService): SymfonyResponse
    {
        $fileRecord = $documentRequest->generatedPdf ?? $pdfService->generateDocumentPdf($documentRequest, Auth::user());

        if (Storage::disk($fileRecord->disk)->exists($fileRecord->path)) {
            return Storage::disk($fileRecord->disk)->response(
                $fileRecord->path,
                $fileRecord->file_name,
                [
                    'Content-Type' => 'application/pdf',
                    'Content-Disposition' => 'inline; filename="'.$fileRecord->file_name.'"',
                ]
            );
        }

        return redirect()->away($fileRecord->getUrl());
    }
}
