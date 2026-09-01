import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../../wayfinder'
/**
* @see \App\Filament\Resources\DocumentTypes\Pages\ListDocumentTypes::__invoke
 * @see app/Filament/Resources/DocumentTypes/Pages/ListDocumentTypes.php:7
 * @route '/admin/document-types'
 */
const ListDocumentTypes = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ListDocumentTypes.url(options),
    method: 'get',
})

ListDocumentTypes.definition = {
    methods: ["get","head"],
    url: '/admin/document-types',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Filament\Resources\DocumentTypes\Pages\ListDocumentTypes::__invoke
 * @see app/Filament/Resources/DocumentTypes/Pages/ListDocumentTypes.php:7
 * @route '/admin/document-types'
 */
ListDocumentTypes.url = (options?: RouteQueryOptions) => {
    return ListDocumentTypes.definition.url + queryParams(options)
}

/**
* @see \App\Filament\Resources\DocumentTypes\Pages\ListDocumentTypes::__invoke
 * @see app/Filament/Resources/DocumentTypes/Pages/ListDocumentTypes.php:7
 * @route '/admin/document-types'
 */
ListDocumentTypes.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ListDocumentTypes.url(options),
    method: 'get',
})
/**
* @see \App\Filament\Resources\DocumentTypes\Pages\ListDocumentTypes::__invoke
 * @see app/Filament/Resources/DocumentTypes/Pages/ListDocumentTypes.php:7
 * @route '/admin/document-types'
 */
ListDocumentTypes.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: ListDocumentTypes.url(options),
    method: 'head',
})

    /**
* @see \App\Filament\Resources\DocumentTypes\Pages\ListDocumentTypes::__invoke
 * @see app/Filament/Resources/DocumentTypes/Pages/ListDocumentTypes.php:7
 * @route '/admin/document-types'
 */
    const ListDocumentTypesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: ListDocumentTypes.url(options),
        method: 'get',
    })

            /**
* @see \App\Filament\Resources\DocumentTypes\Pages\ListDocumentTypes::__invoke
 * @see app/Filament/Resources/DocumentTypes/Pages/ListDocumentTypes.php:7
 * @route '/admin/document-types'
 */
        ListDocumentTypesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: ListDocumentTypes.url(options),
            method: 'get',
        })
            /**
* @see \App\Filament\Resources\DocumentTypes\Pages\ListDocumentTypes::__invoke
 * @see app/Filament/Resources/DocumentTypes/Pages/ListDocumentTypes.php:7
 * @route '/admin/document-types'
 */
        ListDocumentTypesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: ListDocumentTypes.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    ListDocumentTypes.form = ListDocumentTypesForm
export default ListDocumentTypes