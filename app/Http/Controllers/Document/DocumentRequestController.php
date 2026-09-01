<?php

namespace App\Http\Controllers\Document;

use App\Enums\CancellationReason;
use App\Enums\DocumentRequestStatus;
use App\Enums\PaymentStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Document\CancelDocumentRequestRequest;
use App\Http\Requests\Document\StoreDocumentRequestRequest;
use App\Http\Requests\Document\UpdateDocumentRequestRequest;
use App\Models\DocumentRequest;
use App\Models\DocumentRequestFile;
use App\Models\DocumentRequestStatusHistory;
use App\Models\DocumentType;
use App\Models\User;
use App\Services\Document\ReferenceCodeGenerator;
use App\Services\Files\FileUploadService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class DocumentRequestController extends Controller
{
    public function index(Request $request): Response
    {
        /** @var User $user */
        $user = $request->user();

        $documentTypes = DocumentType::active()
            ->get()
            ->map(fn (DocumentType $type): array => [
                'id' => $type->id,
                'name' => $type->name,
                'slug' => $type->slug,
                'description' => $type->description,
                'fee_cents' => $type->fee_cents,
                'formatted_fee' => $type->formatted_fee,
                'requirements' => $type->requirements ?? [],
                'form_schema' => $type->form_schema ?? [],
            ]);

        $requests = DocumentRequest::with(['documentType', 'statusHistory'])
            ->where('user_id', $user->id)
            ->orderByDesc('submitted_at')
            ->paginate(10)
            ->through(fn (DocumentRequest $docReq): array => [
                'id' => $docReq->id,
                'reference_code' => $docReq->reference_code,
                'document_type' => [
                    'id' => $docReq->documentType->id,
                    'name' => $docReq->documentType->name,
                    'slug' => $docReq->documentType->slug,
                ],
                'current_status' => $docReq->current_status->value,
                'status_label' => $docReq->current_status->label(),
                'status_color' => $docReq->current_status->color(),
                'fee_cents' => $docReq->fee_cents,
                'formatted_fee' => $docReq->formatted_fee,
                'payment_status' => $docReq->payment_status->value,
                'payment_label' => $docReq->payment_status->label(),
                'purpose' => $docReq->purpose,
                'submitted_at' => $docReq->submitted_at?->toISOString(),
                'submitted_at_formatted' => $docReq->submitted_at?->format('M d, Y'),
                'completed_at' => $docReq->completed_at?->toISOString(),
            ]);

        return Inertia::render('documents/index', [
            'documentTypes' => $documentTypes,
            'requests' => $requests,
            'isHouseholdVerified' => $user->belongsToVerifiedHousehold(),
        ]);
    }

    public function create(Request $request, DocumentType $documentType): Response
    {
        if (! $documentType->is_active) {
            abort(404, 'The requested document type is not available.');
        }

        /** @var User $user */
        $user = $request->user();
        $userProfile = $user->residentProfile;
        $existingIdRecord = $userProfile?->governmentId;

        return Inertia::render('documents/create', [
            'documentType' => [
                'id' => $documentType->id,
                'name' => $documentType->name,
                'slug' => $documentType->slug,
                'description' => $documentType->description,
                'fee_cents' => $documentType->fee_cents,
                'formatted_fee' => $documentType->formatted_fee,
                'requirements' => $documentType->requirements ?? [],
                'form_schema' => $documentType->form_schema ?? [],
            ],
            'existingGovernmentId' => $existingIdRecord ? [
                'id' => $existingIdRecord->id,
                'file_name' => $existingIdRecord->file_name,
                'url' => $existingIdRecord->getUrl(30),
            ] : null,
            'isHouseholdVerified' => $user->belongsToVerifiedHousehold(),
        ]);
    }

    public function store(
        StoreDocumentRequestRequest $request,
        ReferenceCodeGenerator $codeGenerator,
        FileUploadService $fileUploadService
    ): RedirectResponse {
        /** @var User $user */
        $user = $request->user();

        /** @var DocumentType $documentType */
        $documentType = DocumentType::findOrFail($request->validated('document_type_id'));

        $documentRequest = DB::transaction(function () use ($request, $user, $documentType, $codeGenerator, $fileUploadService) {
            $referenceCode = $codeGenerator->generate();

            $docReq = DocumentRequest::create([
                'reference_code' => $referenceCode,
                'user_id' => $user->id,
                'document_type_id' => $documentType->id,
                'submitted_data' => $request->input('submitted_data', []),
                'current_status' => DocumentRequestStatus::Pending,
                'fee_cents' => $documentType->fee_cents,
                'payment_status' => $documentType->fee_cents === 0 ? PaymentStatus::Waived : PaymentStatus::Unpaid,
                'purpose' => $request->validated('purpose'),
                'submitted_at' => now(),
            ]);

            // Handle Government ID linking or upload
            if ($request->boolean('use_existing_id') && $user->residentProfile?->government_id_file_id) {
                DocumentRequestFile::create([
                    'document_request_id' => $docReq->id,
                    'file_id' => $user->residentProfile->government_id_file_id,
                    'file_type' => 'government_id',
                    'purpose' => 'Reused government ID from resident profile',
                ]);
            } elseif ($request->hasFile('government_id_file')) {
                $file = $request->file('government_id_file');
                if ($file) {
                    $fileRecord = $fileUploadService->uploadGovernmentId($file, $user->id);
                    DocumentRequestFile::create([
                        'document_request_id' => $docReq->id,
                        'file_id' => $fileRecord->id,
                        'file_type' => 'government_id',
                        'purpose' => 'Government ID uploaded for document request',
                    ]);
                }
            }

            // Handle optional supporting files
            if ($request->hasFile('supporting_files')) {
                $supportingFiles = $request->file('supporting_files');
                if (is_array($supportingFiles)) {
                    foreach ($supportingFiles as $supportingFile) {
                        $fileRecord = $fileUploadService->uploadVerificationDocument($supportingFile, $user->id);
                        DocumentRequestFile::create([
                            'document_request_id' => $docReq->id,
                            'file_id' => $fileRecord->id,
                            'file_type' => 'supporting_document',
                            'purpose' => 'Supporting document attachment',
                        ]);
                    }
                }
            }

            // Initial status history
            DocumentRequestStatusHistory::create([
                'document_request_id' => $docReq->id,
                'status' => DocumentRequestStatus::Pending->value,
                'changed_by_user_id' => $user->id,
                'remarks' => 'Document request submitted by resident.',
                'created_at' => now(),
            ]);

            return $docReq;
        });

        return redirect()->route('documents.show', $documentRequest)
            ->with('success', 'Your document request has been submitted successfully! Reference Code: '.$documentRequest->reference_code);
    }

    public function show(Request $request, DocumentRequest $documentRequest): Response
    {
        Gate::authorize('view', $documentRequest);

        $documentRequest->load([
            'documentType',
            'statusHistory.changedByUser',
            'files.fileRecord',
        ]);

        $statusTimeline = $documentRequest->statusHistory->map(function (DocumentRequestStatusHistory $history): array {
            $statusEnum = DocumentRequestStatus::tryFrom($history->status);

            return [
                'id' => $history->id,
                'status' => $history->status,
                'status_label' => $statusEnum?->label() ?? ucfirst($history->status),
                'status_color' => $statusEnum?->color() ?? 'gray',
                'remarks' => $history->remarks,
                'changed_by' => $history->changedByUser ? $history->changedByUser->name : 'System',
                'created_at' => $history->created_at?->toISOString(),
                'created_at_formatted' => $history->created_at?->format('M d, Y, h:i A'),
            ];
        });

        $attachedFiles = $documentRequest->files->map(function (DocumentRequestFile $reqFile): array {
            return [
                'id' => $reqFile->id,
                'file_type' => $reqFile->file_type,
                'purpose' => $reqFile->purpose,
                'file_name' => $reqFile->fileRecord->file_name,
                'size_bytes' => $reqFile->fileRecord->size_bytes,
                'url' => $reqFile->fileRecord->getUrl(60),
            ];
        });

        return Inertia::render('documents/show', [
            'documentRequest' => [
                'id' => $documentRequest->id,
                'reference_code' => $documentRequest->reference_code,
                'current_status' => $documentRequest->current_status->value,
                'status_label' => $documentRequest->current_status->label(),
                'status_color' => $documentRequest->current_status->color(),
                'fee_cents' => $documentRequest->fee_cents,
                'formatted_fee' => $documentRequest->formatted_fee,
                'payment_status' => $documentRequest->payment_status->value,
                'payment_label' => $documentRequest->payment_status->label(),
                'purpose' => $documentRequest->purpose,
                'admin_notes' => $documentRequest->admin_notes,
                'cancellation_reason' => $documentRequest->cancellation_reason?->value,
                'cancellation_reason_label' => $documentRequest->cancellation_reason?->label(),
                'cancellation_notes' => $documentRequest->cancellation_notes,
                'submitted_data' => $documentRequest->submitted_data ?? [],
                'submitted_at' => $documentRequest->submitted_at?->toISOString(),
                'submitted_at_formatted' => $documentRequest->submitted_at?->format('M d, Y'),
                'completed_at' => $documentRequest->completed_at?->toISOString(),
                'cancelled_at' => $documentRequest->cancelled_at?->toISOString(),
                'can_be_cancelled' => $documentRequest->canBeCancelled(),
                'can_be_edited' => $documentRequest->canBeEdited(),
                'document_type' => [
                    'id' => $documentRequest->documentType->id,
                    'name' => $documentRequest->documentType->name,
                    'slug' => $documentRequest->documentType->slug,
                    'description' => $documentRequest->documentType->description,
                    'requirements' => $documentRequest->documentType->requirements ?? [],
                    'form_schema' => $documentRequest->documentType->form_schema ?? [],
                ],
                'files' => $attachedFiles,
                'status_timeline' => $statusTimeline,
            ],
            'cancellationReasons' => array_map(fn (CancellationReason $r): array => [
                'value' => $r->value,
                'label' => $r->label(),
            ], CancellationReason::cases()),
        ]);
    }

    public function edit(Request $request, DocumentRequest $documentRequest): Response|RedirectResponse
    {
        Gate::authorize('update', $documentRequest);

        if (! $documentRequest->canBeEdited()) {
            return redirect()->route('documents.show', $documentRequest)
                ->with('error', 'Only returned document requests can be edited and resubmitted.');
        }

        $documentRequest->load(['documentType', 'statusHistory', 'files.fileRecord']);

        // Find latest return remarks
        $latestReturn = $documentRequest->statusHistory
            ->where('status', DocumentRequestStatus::Returned->value)
            ->last();

        return Inertia::render('documents/edit', [
            'documentRequest' => [
                'id' => $documentRequest->id,
                'reference_code' => $documentRequest->reference_code,
                'current_status' => $documentRequest->current_status->value,
                'purpose' => $documentRequest->purpose,
                'submitted_data' => $documentRequest->submitted_data ?? [],
                'return_remarks' => $latestReturn->remarks ?? 'Please correct the information as requested by the Barangay Admin.',
                'document_type' => [
                    'id' => $documentRequest->documentType->id,
                    'name' => $documentRequest->documentType->name,
                    'slug' => $documentRequest->documentType->slug,
                    'description' => $documentRequest->documentType->description,
                    'requirements' => $documentRequest->documentType->requirements ?? [],
                    'form_schema' => $documentRequest->documentType->form_schema ?? [],
                ],
            ],
        ]);
    }

    public function update(
        UpdateDocumentRequestRequest $request,
        DocumentRequest $documentRequest,
        FileUploadService $fileUploadService
    ): RedirectResponse {
        Gate::authorize('update', $documentRequest);

        /** @var User $user */
        $user = $request->user();

        DB::transaction(function () use ($request, $documentRequest, $user, $fileUploadService) {
            $documentRequest->update([
                'purpose' => $request->validated('purpose'),
                'submitted_data' => $request->input('submitted_data', []),
                'submitted_at' => now(),
            ]);

            // Handle Government ID update if uploaded
            if ($request->hasFile('government_id_file')) {
                $file = $request->file('government_id_file');
                if ($file) {
                    $fileRecord = $fileUploadService->uploadGovernmentId($file, $user->id);
                    DocumentRequestFile::create([
                        'document_request_id' => $documentRequest->id,
                        'file_id' => $fileRecord->id,
                        'file_type' => 'government_id',
                        'purpose' => 'Updated Government ID uploaded upon correction',
                    ]);
                }
            }

            // Handle optional supporting files
            if ($request->hasFile('supporting_files')) {
                $supportingFiles = $request->file('supporting_files');
                if (is_array($supportingFiles)) {
                    foreach ($supportingFiles as $supportingFile) {
                        $fileRecord = $fileUploadService->uploadVerificationDocument($supportingFile, $user->id);
                        DocumentRequestFile::create([
                            'document_request_id' => $documentRequest->id,
                            'file_id' => $fileRecord->id,
                            'file_type' => 'supporting_document',
                            'purpose' => 'Corrected supporting document attachment',
                        ]);
                    }
                }
            }

            $documentRequest->transitionTo(
                DocumentRequestStatus::Pending,
                $user->id,
                'Resident corrected and resubmitted the document request.'
            );
        });

        return redirect()->route('documents.show', $documentRequest)
            ->with('success', 'Your corrected document request has been resubmitted for verification.');
    }

    public function cancel(CancelDocumentRequestRequest $request, DocumentRequest $documentRequest): RedirectResponse
    {
        Gate::authorize('cancel', $documentRequest);

        /** @var User $user */
        $user = $request->user();

        $reason = CancellationReason::from($request->validated('cancellation_reason'));
        $notes = $request->validated('cancellation_notes');

        $documentRequest->update([
            'cancellation_reason' => $reason,
            'cancellation_notes' => $notes,
        ]);

        $documentRequest->transitionTo(
            DocumentRequestStatus::Cancelled,
            $user->id,
            'Request cancelled by resident: '.$reason->label().($notes ? " ({$notes})" : '')
        );

        return redirect()->route('documents.show', $documentRequest)
            ->with('info', 'Document request '.$documentRequest->reference_code.' has been cancelled.');
    }
}
