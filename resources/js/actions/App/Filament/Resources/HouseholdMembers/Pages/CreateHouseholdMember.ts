import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../../wayfinder'
/**
* @see \App\Filament\Resources\HouseholdMembers\Pages\CreateHouseholdMember::__invoke
 * @see app/Filament/Resources/HouseholdMembers/Pages/CreateHouseholdMember.php:7
 * @route '/admin/household-members/create'
 */
const CreateHouseholdMember = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: CreateHouseholdMember.url(options),
    method: 'get',
})

CreateHouseholdMember.definition = {
    methods: ["get","head"],
    url: '/admin/household-members/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Filament\Resources\HouseholdMembers\Pages\CreateHouseholdMember::__invoke
 * @see app/Filament/Resources/HouseholdMembers/Pages/CreateHouseholdMember.php:7
 * @route '/admin/household-members/create'
 */
CreateHouseholdMember.url = (options?: RouteQueryOptions) => {
    return CreateHouseholdMember.definition.url + queryParams(options)
}

/**
* @see \App\Filament\Resources\HouseholdMembers\Pages\CreateHouseholdMember::__invoke
 * @see app/Filament/Resources/HouseholdMembers/Pages/CreateHouseholdMember.php:7
 * @route '/admin/household-members/create'
 */
CreateHouseholdMember.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: CreateHouseholdMember.url(options),
    method: 'get',
})
/**
* @see \App\Filament\Resources\HouseholdMembers\Pages\CreateHouseholdMember::__invoke
 * @see app/Filament/Resources/HouseholdMembers/Pages/CreateHouseholdMember.php:7
 * @route '/admin/household-members/create'
 */
CreateHouseholdMember.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: CreateHouseholdMember.url(options),
    method: 'head',
})

    /**
* @see \App\Filament\Resources\HouseholdMembers\Pages\CreateHouseholdMember::__invoke
 * @see app/Filament/Resources/HouseholdMembers/Pages/CreateHouseholdMember.php:7
 * @route '/admin/household-members/create'
 */
    const CreateHouseholdMemberForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: CreateHouseholdMember.url(options),
        method: 'get',
    })

            /**
* @see \App\Filament\Resources\HouseholdMembers\Pages\CreateHouseholdMember::__invoke
 * @see app/Filament/Resources/HouseholdMembers/Pages/CreateHouseholdMember.php:7
 * @route '/admin/household-members/create'
 */
        CreateHouseholdMemberForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: CreateHouseholdMember.url(options),
            method: 'get',
        })
            /**
* @see \App\Filament\Resources\HouseholdMembers\Pages\CreateHouseholdMember::__invoke
 * @see app/Filament/Resources/HouseholdMembers/Pages/CreateHouseholdMember.php:7
 * @route '/admin/household-members/create'
 */
        CreateHouseholdMemberForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: CreateHouseholdMember.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    CreateHouseholdMember.form = CreateHouseholdMemberForm
export default CreateHouseholdMember