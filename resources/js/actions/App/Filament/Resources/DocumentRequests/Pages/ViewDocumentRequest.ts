import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../../wayfinder'
/**
* @see \App\Filament\Resources\DocumentRequests\Pages\ViewDocumentRequest::__invoke
 * @see app/Filament/Resources/DocumentRequests/Pages/ViewDocumentRequest.php:7
 * @route '/admin/document-requests/{record}'
 */
const ViewDocumentRequest = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ViewDocumentRequest.url(args, options),
    method: 'get',
})

ViewDocumentRequest.definition = {
    methods: ["get","head"],
    url: '/admin/document-requests/{record}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Filament\Resources\DocumentRequests\Pages\ViewDocumentRequest::__invoke
 * @see app/Filament/Resources/DocumentRequests/Pages/ViewDocumentRequest.php:7
 * @route '/admin/document-requests/{record}'
 */
ViewDocumentRequest.url = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { record: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    record: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        record: args.record,
                }

    return ViewDocumentRequest.definition.url
            .replace('{record}', parsedArgs.record.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Filament\Resources\DocumentRequests\Pages\ViewDocumentRequest::__invoke
 * @see app/Filament/Resources/DocumentRequests/Pages/ViewDocumentRequest.php:7
 * @route '/admin/document-requests/{record}'
 */
ViewDocumentRequest.get = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ViewDocumentRequest.url(args, options),
    method: 'get',
})
/**
* @see \App\Filament\Resources\DocumentRequests\Pages\ViewDocumentRequest::__invoke
 * @see app/Filament/Resources/DocumentRequests/Pages/ViewDocumentRequest.php:7
 * @route '/admin/document-requests/{record}'
 */
ViewDocumentRequest.head = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: ViewDocumentRequest.url(args, options),
    method: 'head',
})

    /**
* @see \App\Filament\Resources\DocumentRequests\Pages\ViewDocumentRequest::__invoke
 * @see app/Filament/Resources/DocumentRequests/Pages/ViewDocumentRequest.php:7
 * @route '/admin/document-requests/{record}'
 */
    const ViewDocumentRequestForm = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: ViewDocumentRequest.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Filament\Resources\DocumentRequests\Pages\ViewDocumentRequest::__invoke
 * @see app/Filament/Resources/DocumentRequests/Pages/ViewDocumentRequest.php:7
 * @route '/admin/document-requests/{record}'
 */
        ViewDocumentRequestForm.get = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: ViewDocumentRequest.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Filament\Resources\DocumentRequests\Pages\ViewDocumentRequest::__invoke
 * @see app/Filament/Resources/DocumentRequests/Pages/ViewDocumentRequest.php:7
 * @route '/admin/document-requests/{record}'
 */
        ViewDocumentRequestForm.head = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: ViewDocumentRequest.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    ViewDocumentRequest.form = ViewDocumentRequestForm
export default ViewDocumentRequest