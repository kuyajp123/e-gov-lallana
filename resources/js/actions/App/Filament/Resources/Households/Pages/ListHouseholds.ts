import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../../wayfinder'
/**
* @see \App\Filament\Resources\Households\Pages\ListHouseholds::__invoke
 * @see app/Filament/Resources/Households/Pages/ListHouseholds.php:7
 * @route '/admin/households'
 */
const ListHouseholds = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ListHouseholds.url(options),
    method: 'get',
})

ListHouseholds.definition = {
    methods: ["get","head"],
    url: '/admin/households',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Filament\Resources\Households\Pages\ListHouseholds::__invoke
 * @see app/Filament/Resources/Households/Pages/ListHouseholds.php:7
 * @route '/admin/households'
 */
ListHouseholds.url = (options?: RouteQueryOptions) => {
    return ListHouseholds.definition.url + queryParams(options)
}

/**
* @see \App\Filament\Resources\Households\Pages\ListHouseholds::__invoke
 * @see app/Filament/Resources/Households/Pages/ListHouseholds.php:7
 * @route '/admin/households'
 */
ListHouseholds.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ListHouseholds.url(options),
    method: 'get',
})
/**
* @see \App\Filament\Resources\Households\Pages\ListHouseholds::__invoke
 * @see app/Filament/Resources/Households/Pages/ListHouseholds.php:7
 * @route '/admin/households'
 */
ListHouseholds.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: ListHouseholds.url(options),
    method: 'head',
})

    /**
* @see \App\Filament\Resources\Households\Pages\ListHouseholds::__invoke
 * @see app/Filament/Resources/Households/Pages/ListHouseholds.php:7
 * @route '/admin/households'
 */
    const ListHouseholdsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: ListHouseholds.url(options),
        method: 'get',
    })

            /**
* @see \App\Filament\Resources\Households\Pages\ListHouseholds::__invoke
 * @see app/Filament/Resources/Households/Pages/ListHouseholds.php:7
 * @route '/admin/households'
 */
        ListHouseholdsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: ListHouseholds.url(options),
            method: 'get',
        })
            /**
* @see \App\Filament\Resources\Households\Pages\ListHouseholds::__invoke
 * @see app/Filament/Resources/Households/Pages/ListHouseholds.php:7
 * @route '/admin/households'
 */
        ListHouseholdsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: ListHouseholds.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    ListHouseholds.form = ListHouseholdsForm
export default ListHouseholds