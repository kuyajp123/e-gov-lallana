import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../../wayfinder'
/**
* @see \App\Filament\Resources\DocumentTypes\Pages\CreateDocumentType::__invoke
 * @see app/Filament/Resources/DocumentTypes/Pages/CreateDocumentType.php:7
 * @route '/admin/document-types/create'
 */
const CreateDocumentType = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: CreateDocumentType.url(options),
    method: 'get',
})

CreateDocumentType.definition = {
    methods: ["get","head"],
    url: '/admin/document-types/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Filament\Resources\DocumentTypes\Pages\CreateDocumentType::__invoke
 * @see app/Filament/Resources/DocumentTypes/Pages/CreateDocumentType.php:7
 * @route '/admin/document-types/create'
 */
CreateDocumentType.url = (options?: RouteQueryOptions) => {
    return CreateDocumentType.definition.url + queryParams(options)
}

/**
* @see \App\Filament\Resources\DocumentTypes\Pages\CreateDocumentType::__invoke
 * @see app/Filament/Resources/DocumentTypes/Pages/CreateDocumentType.php:7
 * @route '/admin/document-types/create'
 */
CreateDocumentType.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: CreateDocumentType.url(options),
    method: 'get',
})
/**
* @see \App\Filament\Resources\DocumentTypes\Pages\CreateDocumentType::__invoke
 * @see app/Filament/Resources/DocumentTypes/Pages/CreateDocumentType.php:7
 * @route '/admin/document-types/create'
 */
CreateDocumentType.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: CreateDocumentType.url(options),
    method: 'head',
})

    /**
* @see \App\Filament\Resources\DocumentTypes\Pages\CreateDocumentType::__invoke
 * @see app/Filament/Resources/DocumentTypes/Pages/CreateDocumentType.php:7
 * @route '/admin/document-types/create'
 */
    const CreateDocumentTypeForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: CreateDocumentType.url(options),
        method: 'get',
    })

            /**
* @see \App\Filament\Resources\DocumentTypes\Pages\CreateDocumentType::__invoke
 * @see app/Filament/Resources/DocumentTypes/Pages/CreateDocumentType.php:7
 * @route '/admin/document-types/create'
 */
        CreateDocumentTypeForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: CreateDocumentType.url(options),
            method: 'get',
        })
            /**
* @see \App\Filament\Resources\DocumentTypes\Pages\CreateDocumentType::__invoke
 * @see app/Filament/Resources/DocumentTypes/Pages/CreateDocumentType.php:7
 * @route '/admin/document-types/create'
 */
        CreateDocumentTypeForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: CreateDocumentType.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    CreateDocumentType.form = CreateDocumentTypeForm
export default CreateDocumentType