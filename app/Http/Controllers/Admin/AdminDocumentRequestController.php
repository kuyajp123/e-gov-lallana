<?php

namespace App\Http\Controllers\Admin;

use App\Enums\DocumentRequestStatus;
use App\Enums\PaymentStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateDocumentRequestPaymentRequest;
use App\Http\Requests\Admin\UpdateDocumentRequestStatusRequest;
use App\Models\DocumentRequest;
use App\Models\DocumentType;
use App\Models\User;
use App\Services\Document\ReferenceCodeGenerator;
use App\Services\Pdf\PdfGenerationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
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
                    ->orWhere('walkin_name', 'like', "%{$search}%")
                    ->orWhere('walkin_email', 'like', "%{$search}%")
                    ->orWhere('walkin_contact_number', 'like', "%{$search}%")
                    ->orWhere('custom_document_title', 'like', "%{$search}%")
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
                'is_walkin' => (bool) $req->is_walkin,
                'walkin_name' => $req->walkin_name,
                'custom_document_title' => $req->custom_document_title,
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
                'user' => $req->user ? [
                    'id' => $req->user->id,
                    'name' => $req->user->name,
                    'email' => $req->user->email,
                    'phone_number' => $req->user->phone_number,
                    'avatar_url' => $req->user->residentProfile?->avatar?->getUrl(),
                ] : [
                    'id' => null,
                    'name' => $req->walkin_name ?? 'Walk-in Citizen',
                    'email' => $req->walkin_email ?? '—',
                    'phone_number' => $req->walkin_contact_number ?? '—',
                    'avatar_url' => null,
                ],
                'document_type' => $req->documentType ? [
                    'id' => $req->documentType->id,
                    'name' => $req->documentType->name,
                    'slug' => $req->documentType->slug,
                ] : [
                    'id' => null,
                    'name' => $req->custom_document_title ?? 'Custom Document',
                    'slug' => 'custom',
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
     * Show the dedicated walk-in document request issuance page.
     */
    public function createWalkin(): Response
    {
        $documentTypes = DocumentType::query()
            ->where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name', 'slug', 'fee_cents', 'description', 'form_schema']);

        return Inertia::render('admin/document-requests/walkin', [
            'documentTypes' => $documentTypes,
            'purokOptions' => [
                'Purok 1',
                'Purok 2',
                'Purok 3',
                'Purok 4',
                'Purok 5',
                'Purok 6',
                'Purok 7',
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
            'is_walkin' => (bool) $documentRequest->is_walkin,
            'walkin_name' => $documentRequest->walkin_name,
            'walkin_purok' => $documentRequest->walkin_purok,
            'walkin_address' => $documentRequest->walkin_address,
            'walkin_birthdate' => $documentRequest->walkin_birthdate?->format('Y-m-d'),
            'walkin_age' => $documentRequest->walkin_age,
            'walkin_gender' => $documentRequest->walkin_gender,
            'walkin_civil_status' => $documentRequest->walkin_civil_status,
            'walkin_contact_number' => $documentRequest->walkin_contact_number,
            'walkin_email' => $documentRequest->walkin_email,
            'custom_document_title' => $documentRequest->custom_document_title,
            'custom_document_body' => $documentRequest->custom_document_body,
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
            'user' => $documentRequest->user ? [
                'id' => $documentRequest->user->id,
                'name' => $documentRequest->user->name,
                'email' => $documentRequest->user->email,
                'phone_number' => $documentRequest->user->phone_number,
                'avatar_url' => $documentRequest->user->residentProfile?->avatar?->getUrl(),
                'civil_status' => $documentRequest->user->residentProfile?->civil_status,
                'address' => $documentRequest->user->household() ? "{$documentRequest->user->household()->purok_sitio}, Barangay Lallana" : 'Barangay Lallana',
            ] : [
                'id' => null,
                'name' => $documentRequest->walkin_name ?? 'Walk-in Citizen',
                'email' => $documentRequest->walkin_email ?? '—',
                'phone_number' => $documentRequest->walkin_contact_number ?? '—',
                'avatar_url' => null,
                'civil_status' => $documentRequest->walkin_civil_status ?? '—',
                'address' => $documentRequest->walkin_address ?? ($documentRequest->walkin_purok ? "{$documentRequest->walkin_purok}, Barangay Lallana" : 'Barangay Lallana'),
            ],
            'document_type' => $documentRequest->documentType ? [
                'id' => $documentRequest->documentType->id,
                'name' => $documentRequest->documentType->name,
                'slug' => $documentRequest->documentType->slug,
                'description' => $documentRequest->documentType->description,
                'requirements' => $documentRequest->documentType->requirements ?? [],
            ] : [
                'id' => null,
                'name' => $documentRequest->custom_document_title ?? 'Custom Document',
                'slug' => 'custom',
                'description' => 'Custom Barangay Certification issued over-the-counter.',
                'requirements' => [],
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
        $allowedStatuses = [
            DocumentRequestStatus::Processing,
            DocumentRequestStatus::ReadyForPickup,
            DocumentRequestStatus::Completed,
        ];

        if (! in_array($documentRequest->current_status, $allowedStatuses, true)) {
            abort(403, 'PDF certificates can only be generated or viewed for requests in Processing, Ready for Pickup, or Completed status.');
        }

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

    /**
     * Search active registered residents for walk-in form autofill.
     */
    public function searchResidents(Request $request): JsonResponse
    {
        $search = $request->string('q')->trim()->toString();

        if (strlen($search) < 2) {
            return response()->json(['residents' => []]);
        }

        $residents = User::query()
            ->where(function ($roleQ) {
                $roleQ->whereHas('role', fn ($rq) => $rq->where('slug', 'resident'))
                    ->orWhereDoesntHave('role');
            })
            ->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone_number', 'like', "%{$search}%");
            })
            ->with(['residentProfile'])
            ->limit(10)
            ->get()
            ->map(function (User $user) {
                $profile = $user->residentProfile;
                $household = $user->household();
                $age = null;
                if ($profile?->birthdate) {
                    $age = Carbon::parse($profile->birthdate)->age;
                }

                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone_number' => $user->phone_number,
                    'birthdate' => $profile?->birthdate?->format('Y-m-d'),
                    'age' => $age,
                    'gender' => $profile?->gender,
                    'civil_status' => $profile?->civil_status,
                    'purok' => $household ? $household->purok_sitio : '',
                    'address' => $household ? "{$household->purok_sitio}, Barangay Lallana" : 'Barangay Lallana',
                    'household_code' => $household?->household_code,
                ];
            });

        return response()->json(['residents' => $residents]);
    }

    /**
     * Issue an official document request for a walk-in citizen.
     */
    public function storeWalkin(
        Request $request,
        ReferenceCodeGenerator $codeGenerator,
        PdfGenerationService $pdfService
    ): RedirectResponse {
        $validated = $request->validate([
            'resident_mode' => ['required', 'string', 'in:registered,unregistered'],
            'user_id' => ['nullable', 'required_if:resident_mode,registered', 'exists:users,id'],
            'walkin_name' => ['nullable', 'required_if:resident_mode,unregistered', 'string', 'max:255'],
            'walkin_purok' => ['nullable', 'string', 'max:255'],
            'walkin_address' => ['nullable', 'string', 'max:255'],
            'walkin_birthdate' => ['nullable', 'date'],
            'walkin_age' => ['nullable', 'integer', 'min:0', 'max:150'],
            'walkin_gender' => ['nullable', 'string', 'max:50'],
            'walkin_civil_status' => ['nullable', 'string', 'max:50'],
            'walkin_contact_number' => ['nullable', 'string', 'max:50'],
            'walkin_email' => ['nullable', 'email', 'max:255'],

            'document_type_id' => ['required', 'exists:document_types,id'],
            'submitted_data' => ['nullable', 'array'],

            'purpose' => ['required', 'string', 'max:255'],
            'payment_status' => ['required', 'string', 'in:paid,waived,unpaid'],
            'admin_notes' => ['nullable', 'string', 'max:5000'],
            'action' => ['required', 'string', 'in:complete_and_print,create_processing'],
        ]);

        $referenceCode = $codeGenerator->generate();

        $userId = $validated['resident_mode'] === 'registered' ? (int) $validated['user_id'] : null;
        $documentTypeId = (int) $validated['document_type_id'];
        $docType = DocumentType::findOrFail($documentTypeId);
        $feeCents = $docType->fee_cents;

        $paymentStatusEnum = match ($validated['payment_status']) {
            'paid' => PaymentStatus::Paid,
            'waived' => PaymentStatus::Waived,
            default => PaymentStatus::Unpaid,
        };

        $initialStatus = DocumentRequestStatus::Processing;

        $docRequest = DocumentRequest::create([
            'reference_code' => $referenceCode,
            'user_id' => $userId,
            'document_type_id' => $documentTypeId,
            'current_status' => $initialStatus,
            'is_walkin' => true,
            'walkin_name' => $userId ? null : $validated['walkin_name'],
            'walkin_purok' => $validated['walkin_purok'] ?? null,
            'walkin_address' => $validated['walkin_address'] ?? null,
            'walkin_birthdate' => $validated['walkin_birthdate'] ?? null,
            'walkin_age' => $validated['walkin_age'] ?? null,
            'walkin_gender' => $validated['walkin_gender'] ?? null,
            'walkin_civil_status' => $validated['walkin_civil_status'] ?? null,
            'walkin_contact_number' => $validated['walkin_contact_number'] ?? null,
            'walkin_email' => $validated['walkin_email'] ?? null,
            'custom_document_title' => null,
            'custom_document_body' => null,
            'submitted_data' => $validated['submitted_data'] ?? null,
            'fee_cents' => $feeCents,
            'payment_status' => $paymentStatusEnum,
            'purpose' => $validated['purpose'],
            'admin_notes' => $validated['admin_notes'] ?? null,
            'submitted_at' => Carbon::now(),
        ]);

        $docRequest->statusHistory()->create([
            'status' => $initialStatus->value,
            'changed_by_user_id' => Auth::id(),
            'remarks' => 'Walk-in request created at Barangay Hall desk.',
        ]);

        if ($validated['action'] === 'complete_and_print') {
            $docRequest->transitionTo(
                DocumentRequestStatus::Completed,
                Auth::id(),
                'Walk-in document issued and completed immediately over-the-counter.'
            );

            // Generate the PDF immediately
            $pdfService->generateDocumentPdf($docRequest, Auth::user());
        }

        $message = "Walk-in document request {$referenceCode} created successfully.";
        if ($validated['action'] === 'complete_and_print') {
            $message .= ' Document has been completed and certificate is ready for download/print.';
        }

        return redirect()->route('admin.document-requests.index')
            ->with('success', $message)
            ->with('issued_walkin_id', $docRequest->id);
    }
}
