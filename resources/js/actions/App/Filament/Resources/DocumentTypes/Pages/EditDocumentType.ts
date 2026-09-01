import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../../wayfinder'
/**
* @see \App\Filament\Resources\DocumentTypes\Pages\EditDocumentType::__invoke
 * @see app/Filament/Resources/DocumentTypes/Pages/EditDocumentType.php:7
 * @route '/admin/document-types/{record}/edit'
 */
const EditDocumentType = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: EditDocumentType.url(args, options),
    method: 'get',
})

EditDocumentType.definition = {
    methods: ["get","head"],
    url: '/admin/document-types/{record}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Filament\Resources\DocumentTypes\Pages\EditDocumentType::__invoke
 * @see app/Filament/Resources/DocumentTypes/Pages/EditDocumentType.php:7
 * @route '/admin/document-types/{record}/edit'
 */
EditDocumentType.url = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return EditDocumentType.definition.url
            .replace('{record}', parsedArgs.record.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Filament\Resources\DocumentTypes\Pages\EditDocumentType::__invoke
 * @see app/Filament/Resources/DocumentTypes/Pages/EditDocumentType.php:7
 * @route '/admin/document-types/{record}/edit'
 */
EditDocumentType.get = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: EditDocumentType.url(args, options),
    method: 'get',
})
/**
* @see \App\Filament\Resources\DocumentTypes\Pages\EditDocumentType::__invoke
 * @see app/Filament/Resources/DocumentTypes/Pages/EditDocumentType.php:7
 * @route '/admin/document-types/{record}/edit'
 */
EditDocumentType.head = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: EditDocumentType.url(args, options),
    method: 'head',
})

    /**
* @see \App\Filament\Resources\DocumentTypes\Pages\EditDocumentType::__invoke
 * @see app/Filament/Resources/DocumentTypes/Pages/EditDocumentType.php:7
 * @route '/admin/document-types/{record}/edit'
 */
    const EditDocumentTypeForm = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: EditDocumentType.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Filament\Resources\DocumentTypes\Pages\EditDocumentType::__invoke
 * @see app/Filament/Resources/DocumentTypes/Pages/EditDocumentType.php:7
 * @route '/admin/document-types/{record}/edit'
 */
        EditDocumentTypeForm.get = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: EditDocumentType.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Filament\Resources\DocumentTypes\Pages\EditDocumentType::__invoke
 * @see app/Filament/Resources/DocumentTypes/Pages/EditDocumentType.php:7
 * @route '/admin/document-types/{record}/edit'
 */
        EditDocumentTypeForm.head = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: EditDocumentType.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    EditDocumentType.form = EditDocumentTypeForm
export default EditDocumentType