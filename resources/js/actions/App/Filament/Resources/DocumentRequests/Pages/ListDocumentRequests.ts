import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../../wayfinder'
/**
* @see \App\Filament\Resources\DocumentRequests\Pages\ListDocumentRequests::__invoke
 * @see app/Filament/Resources/DocumentRequests/Pages/ListDocumentRequests.php:7
 * @route '/admin/document-requests'
 */
const ListDocumentRequests = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ListDocumentRequests.url(options),
    method: 'get',
})

ListDocumentRequests.definition = {
    methods: ["get","head"],
    url: '/admin/document-requests',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Filament\Resources\DocumentRequests\Pages\ListDocumentRequests::__invoke
 * @see app/Filament/Resources/DocumentRequests/Pages/ListDocumentRequests.php:7
 * @route '/admin/document-requests'
 */
ListDocumentRequests.url = (options?: RouteQueryOptions) => {
    return ListDocumentRequests.definition.url + queryParams(options)
}

/**
* @see \App\Filament\Resources\DocumentRequests\Pages\ListDocumentRequests::__invoke
 * @see app/Filament/Resources/DocumentRequests/Pages/ListDocumentRequests.php:7
 * @route '/admin/document-requests'
 */
ListDocumentRequests.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ListDocumentRequests.url(options),
    method: 'get',
})
/**
* @see \App\Filament\Resources\DocumentRequests\Pages\ListDocumentRequests::__invoke
 * @see app/Filament/Resources/DocumentRequests/Pages/ListDocumentRequests.php:7
 * @route '/admin/document-requests'
 */
ListDocumentRequests.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: ListDocumentRequests.url(options),
    method: 'head',
})

    /**
* @see \App\Filament\Resources\DocumentRequests\Pages\ListDocumentRequests::__invoke
 * @see app/Filament/Resources/DocumentRequests/Pages/ListDocumentRequests.php:7
 * @route '/admin/document-requests'
 */
    const ListDocumentRequestsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: ListDocumentRequests.url(options),
        method: 'get',
    })

            /**
* @see \App\Filament\Resources\DocumentRequests\Pages\ListDocumentRequests::__invoke
 * @see app/Filament/Resources/DocumentRequests/Pages/ListDocumentRequests.php:7
 * @route '/admin/document-requests'
 */
        ListDocumentRequestsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: ListDocumentRequests.url(options),
            method: 'get',
        })
            /**
* @see \App\Filament\Resources\DocumentRequests\Pages\ListDocumentRequests::__invoke
 * @see app/Filament/Resources/DocumentRequests/Pages/ListDocumentRequests.php:7
 * @route '/admin/document-requests'
 */
        ListDocumentRequestsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: ListDocumentRequests.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    ListDocumentRequests.form = ListDocumentRequestsForm
export default ListDocumentRequests