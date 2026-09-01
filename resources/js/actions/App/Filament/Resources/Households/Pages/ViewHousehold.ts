import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../../wayfinder'
/**
* @see \App\Filament\Resources\Households\Pages\ViewHousehold::__invoke
 * @see app/Filament/Resources/Households/Pages/ViewHousehold.php:7
 * @route '/admin/households/{record}'
 */
const ViewHousehold = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ViewHousehold.url(args, options),
    method: 'get',
})

ViewHousehold.definition = {
    methods: ["get","head"],
    url: '/admin/households/{record}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Filament\Resources\Households\Pages\ViewHousehold::__invoke
 * @see app/Filament/Resources/Households/Pages/ViewHousehold.php:7
 * @route '/admin/households/{record}'
 */
ViewHousehold.url = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return ViewHousehold.definition.url
            .replace('{record}', parsedArgs.record.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Filament\Resources\Households\Pages\ViewHousehold::__invoke
 * @see app/Filament/Resources/Households/Pages/ViewHousehold.php:7
 * @route '/admin/households/{record}'
 */
ViewHousehold.get = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ViewHousehold.url(args, options),
    method: 'get',
})
/**
* @see \App\Filament\Resources\Households\Pages\ViewHousehold::__invoke
 * @see app/Filament/Resources/Households/Pages/ViewHousehold.php:7
 * @route '/admin/households/{record}'
 */
ViewHousehold.head = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: ViewHousehold.url(args, options),
    method: 'head',
})

    /**
* @see \App\Filament\Resources\Households\Pages\ViewHousehold::__invoke
 * @see app/Filament/Resources/Households/Pages/ViewHousehold.php:7
 * @route '/admin/households/{record}'
 */
    const ViewHouseholdForm = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: ViewHousehold.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Filament\Resources\Households\Pages\ViewHousehold::__invoke
 * @see app/Filament/Resources/Households/Pages/ViewHousehold.php:7
 * @route '/admin/households/{record}'
 */
        ViewHouseholdForm.get = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: ViewHousehold.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Filament\Resources\Households\Pages\ViewHousehold::__invoke
 * @see app/Filament/Resources/Households/Pages/ViewHousehold.php:7
 * @route '/admin/households/{record}'
 */
        ViewHouseholdForm.head = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: ViewHousehold.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    ViewHousehold.form = ViewHouseholdForm
export default ViewHousehold