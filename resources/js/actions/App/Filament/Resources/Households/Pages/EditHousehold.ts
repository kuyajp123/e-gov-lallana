import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../../wayfinder'
/**
* @see \App\Filament\Resources\Households\Pages\EditHousehold::__invoke
 * @see app/Filament/Resources/Households/Pages/EditHousehold.php:7
 * @route '/admin/households/{record}/edit'
 */
const EditHousehold = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: EditHousehold.url(args, options),
    method: 'get',
})

EditHousehold.definition = {
    methods: ["get","head"],
    url: '/admin/households/{record}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Filament\Resources\Households\Pages\EditHousehold::__invoke
 * @see app/Filament/Resources/Households/Pages/EditHousehold.php:7
 * @route '/admin/households/{record}/edit'
 */
EditHousehold.url = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return EditHousehold.definition.url
            .replace('{record}', parsedArgs.record.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Filament\Resources\Households\Pages\EditHousehold::__invoke
 * @see app/Filament/Resources/Households/Pages/EditHousehold.php:7
 * @route '/admin/households/{record}/edit'
 */
EditHousehold.get = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: EditHousehold.url(args, options),
    method: 'get',
})
/**
* @see \App\Filament\Resources\Households\Pages\EditHousehold::__invoke
 * @see app/Filament/Resources/Households/Pages/EditHousehold.php:7
 * @route '/admin/households/{record}/edit'
 */
EditHousehold.head = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: EditHousehold.url(args, options),
    method: 'head',
})

    /**
* @see \App\Filament\Resources\Households\Pages\EditHousehold::__invoke
 * @see app/Filament/Resources/Households/Pages/EditHousehold.php:7
 * @route '/admin/households/{record}/edit'
 */
    const EditHouseholdForm = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: EditHousehold.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Filament\Resources\Households\Pages\EditHousehold::__invoke
 * @see app/Filament/Resources/Households/Pages/EditHousehold.php:7
 * @route '/admin/households/{record}/edit'
 */
        EditHouseholdForm.get = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: EditHousehold.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Filament\Resources\Households\Pages\EditHousehold::__invoke
 * @see app/Filament/Resources/Households/Pages/EditHousehold.php:7
 * @route '/admin/households/{record}/edit'
 */
        EditHouseholdForm.head = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: EditHousehold.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    EditHousehold.form = EditHouseholdForm
export default EditHousehold