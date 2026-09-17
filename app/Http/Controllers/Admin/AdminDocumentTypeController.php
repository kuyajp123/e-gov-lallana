<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreDocumentTypeRequest;
use App\Http\Requests\Admin\UpdateDocumentTypeRequest;
use App\Models\DocumentType;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminDocumentTypeController extends Controller
{
    /**
     * Display a listing of document types.
     */
    public function index(Request $request): Response
    {
        $search = $request->string('search')->trim()->toString();
        $status = $request->string('status')->trim()->toString();

        $query = DocumentType::query()
            ->withCount('documentRequests')
            ->orderBy('name');

        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('slug', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($status === 'active') {
            $query->where('is_active', true);
        } elseif ($status === 'inactive') {
            $query->where('is_active', false);
        }

        $paginated = $query->paginate(15)->withQueryString();

        $documentTypes = $paginated->through(function (DocumentType $type) {
            $requirements = is_array($type->requirements) ? $type->requirements : [];
            $formSchema = is_array($type->form_schema) ? $type->form_schema : [];

            return [
                'id' => $type->id,
                'name' => $type->name,
                'slug' => $type->slug,
                'description' => $type->description,
                'fee_cents' => $type->fee_cents,
                'formatted_fee' => $type->formatted_fee,
                'is_free' => $type->fee_cents === 0,
                'requirements' => $requirements,
                'requirements_count' => count($requirements),
                'form_schema' => $formSchema,
                'form_fields_count' => count($formSchema),
                'is_active' => (bool) $type->is_active,
                'document_requests_count' => $type->document_requests_count ?? 0,
                'created_at_formatted' => $type->created_at?->format('M d, Y') ?? '—',
                'updated_at_formatted' => $type->updated_at?->format('M d, Y h:i A') ?? '—',
            ];
        });

        $stats = [
            'total' => DocumentType::count(),
            'active' => DocumentType::where('is_active', true)->count(),
            'inactive' => DocumentType::where('is_active', false)->count(),
            'free' => DocumentType::where('fee_cents', 0)->count(),
        ];

        return Inertia::render('admin/document-types/index', [
            'documentTypes' => $documentTypes,
            'stats' => $stats,
            'filters' => [
                'search' => $search,
                'status' => $status ?: 'all',
            ],
        ]);
    }

    /**
     * Show the form for creating a new document type.
     */
    public function create(): Response
    {
        return Inertia::render('admin/document-types/create');
    }

    /**
     * Store a newly created document type in storage.
     */
    public function store(StoreDocumentTypeRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $documentType = DocumentType::create([
            'name' => $validated['name'],
            'slug' => $validated['slug'],
            'fee_cents' => (int) $validated['fee_cents'],
            'description' => $validated['description'] ?? null,
            'requirements' => $validated['requirements'] ?? [],
            'form_schema' => $validated['form_schema'] ?? [],
            'is_active' => (bool) ($validated['is_active'] ?? true),
        ]);

        return redirect()
            ->route('admin.document-types.index')
            ->with('success', "Document type '{$documentType->name}' has been created successfully.");
    }

    /**
     * Show the form for editing the specified document type.
     */
    public function edit(DocumentType $documentType): Response
    {
        $requirements = is_array($documentType->requirements) ? $documentType->requirements : [];
        $formSchema = is_array($documentType->form_schema) ? $documentType->form_schema : [];

        return Inertia::render('admin/document-types/edit', [
            'documentType' => [
                'id' => $documentType->id,
                'name' => $documentType->name,
                'slug' => $documentType->slug,
                'description' => $documentType->description,
                'fee_cents' => $documentType->fee_cents,
                'fee_pesos' => number_format($documentType->fee_cents / 100, 2, '.', ''),
                'requirements' => $requirements,
                'form_schema' => $formSchema,
                'is_active' => (bool) $documentType->is_active,
                'document_requests_count' => $documentType->documentRequests()->count(),
            ],
        ]);
    }

    /**
     * Update the specified document type in storage.
     */
    public function update(UpdateDocumentTypeRequest $request, DocumentType $documentType): RedirectResponse
    {
        $validated = $request->validated();

        $documentType->update([
            'name' => $validated['name'],
            'slug' => $validated['slug'],
            'fee_cents' => (int) $validated['fee_cents'],
            'description' => $validated['description'] ?? null,
            'requirements' => $validated['requirements'] ?? [],
            'form_schema' => $validated['form_schema'] ?? [],
            'is_active' => (bool) ($validated['is_active'] ?? $documentType->is_active),
        ]);

        return redirect()
            ->route('admin.document-types.index')
            ->with('success', "Document type '{$documentType->name}' has been updated.");
    }

    /**
     * Toggle active status for the specified document type.
     */
    public function toggleActive(DocumentType $documentType): RedirectResponse
    {
        $newStatus = ! $documentType->is_active;
        $documentType->update(['is_active' => $newStatus]);

        $statusLabel = $newStatus ? 'activated' : 'deactivated';

        return back()->with('success', "Document type '{$documentType->name}' has been {$statusLabel}.");
    }

    /**
     * Remove the specified document type from storage.
     */
    public function destroy(DocumentType $documentType): RedirectResponse
    {
        if ($documentType->documentRequests()->exists()) {
            return back()->withErrors([
                'delete' => "Cannot delete '{$documentType->name}' because it has existing document requests linked to it. Consider deactivating it instead.",
            ]);
        }

        $documentType->delete();

        return redirect()
            ->route('admin.document-types.index')
            ->with('success', "Document type '{$documentType->name}' deleted successfully.");
    }
}
