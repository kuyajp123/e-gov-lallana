import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../../wayfinder'
/**
* @see \App\Filament\Resources\HouseholdMembers\Pages\ListHouseholdMembers::__invoke
 * @see app/Filament/Resources/HouseholdMembers/Pages/ListHouseholdMembers.php:7
 * @route '/admin/household-members'
 */
const ListHouseholdMembers = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ListHouseholdMembers.url(options),
    method: 'get',
})

ListHouseholdMembers.definition = {
    methods: ["get","head"],
    url: '/admin/household-members',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Filament\Resources\HouseholdMembers\Pages\ListHouseholdMembers::__invoke
 * @see app/Filament/Resources/HouseholdMembers/Pages/ListHouseholdMembers.php:7
 * @route '/admin/household-members'
 */
ListHouseholdMembers.url = (options?: RouteQueryOptions) => {
    return ListHouseholdMembers.definition.url + queryParams(options)
}

/**
* @see \App\Filament\Resources\HouseholdMembers\Pages\ListHouseholdMembers::__invoke
 * @see app/Filament/Resources/HouseholdMembers/Pages/ListHouseholdMembers.php:7
 * @route '/admin/household-members'
 */
ListHouseholdMembers.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ListHouseholdMembers.url(options),
    method: 'get',
})
/**
* @see \App\Filament\Resources\HouseholdMembers\Pages\ListHouseholdMembers::__invoke
 * @see app/Filament/Resources/HouseholdMembers/Pages/ListHouseholdMembers.php:7
 * @route '/admin/household-members'
 */
ListHouseholdMembers.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: ListHouseholdMembers.url(options),
    method: 'head',
})

    /**
* @see \App\Filament\Resources\HouseholdMembers\Pages\ListHouseholdMembers::__invoke
 * @see app/Filament/Resources/HouseholdMembers/Pages/ListHouseholdMembers.php:7
 * @route '/admin/household-members'
 */
    const ListHouseholdMembersForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: ListHouseholdMembers.url(options),
        method: 'get',
    })

            /**
* @see \App\Filament\Resources\HouseholdMembers\Pages\ListHouseholdMembers::__invoke
 * @see app/Filament/Resources/HouseholdMembers/Pages/ListHouseholdMembers.php:7
 * @route '/admin/household-members'
 */
        ListHouseholdMembersForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: ListHouseholdMembers.url(options),
            method: 'get',
        })
            /**
* @see \App\Filament\Resources\HouseholdMembers\Pages\ListHouseholdMembers::__invoke
 * @see app/Filament/Resources/HouseholdMembers/Pages/ListHouseholdMembers.php:7
 * @route '/admin/household-members'
 */
        ListHouseholdMembersForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: ListHouseholdMembers.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    ListHouseholdMembers.form = ListHouseholdMembersForm
export default ListHouseholdMembers