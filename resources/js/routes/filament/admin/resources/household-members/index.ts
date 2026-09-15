import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Filament\Resources\HouseholdMembers\Pages\ListHouseholdMembers::__invoke
 * @see app/Filament/Resources/HouseholdMembers/Pages/ListHouseholdMembers.php:7
 * @route '/admin/household-members'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/household-members',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Filament\Resources\HouseholdMembers\Pages\ListHouseholdMembers::__invoke
 * @see app/Filament/Resources/HouseholdMembers/Pages/ListHouseholdMembers.php:7
 * @route '/admin/household-members'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Filament\Resources\HouseholdMembers\Pages\ListHouseholdMembers::__invoke
 * @see app/Filament/Resources/HouseholdMembers/Pages/ListHouseholdMembers.php:7
 * @route '/admin/household-members'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Filament\Resources\HouseholdMembers\Pages\ListHouseholdMembers::__invoke
 * @see app/Filament/Resources/HouseholdMembers/Pages/ListHouseholdMembers.php:7
 * @route '/admin/household-members'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Filament\Resources\HouseholdMembers\Pages\ListHouseholdMembers::__invoke
 * @see app/Filament/Resources/HouseholdMembers/Pages/ListHouseholdMembers.php:7
 * @route '/admin/household-members'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Filament\Resources\HouseholdMembers\Pages\ListHouseholdMembers::__invoke
 * @see app/Filament/Resources/HouseholdMembers/Pages/ListHouseholdMembers.php:7
 * @route '/admin/household-members'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Filament\Resources\HouseholdMembers\Pages\ListHouseholdMembers::__invoke
 * @see app/Filament/Resources/HouseholdMembers/Pages/ListHouseholdMembers.php:7
 * @route '/admin/household-members'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
const householdMembers = {
    index: Object.assign(index, index),
}

export default householdMembers