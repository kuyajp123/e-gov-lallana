import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../../wayfinder'
/**
* @see \App\Filament\Resources\HouseholdMembers\Pages\EditHouseholdMember::__invoke
 * @see app/Filament/Resources/HouseholdMembers/Pages/EditHouseholdMember.php:7
 * @route '/admin/household-members/{record}/edit'
 */
const EditHouseholdMember = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: EditHouseholdMember.url(args, options),
    method: 'get',
})

EditHouseholdMember.definition = {
    methods: ["get","head"],
    url: '/admin/household-members/{record}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Filament\Resources\HouseholdMembers\Pages\EditHouseholdMember::__invoke
 * @see app/Filament/Resources/HouseholdMembers/Pages/EditHouseholdMember.php:7
 * @route '/admin/household-members/{record}/edit'
 */
EditHouseholdMember.url = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return EditHouseholdMember.definition.url
            .replace('{record}', parsedArgs.record.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Filament\Resources\HouseholdMembers\Pages\EditHouseholdMember::__invoke
 * @see app/Filament/Resources/HouseholdMembers/Pages/EditHouseholdMember.php:7
 * @route '/admin/household-members/{record}/edit'
 */
EditHouseholdMember.get = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: EditHouseholdMember.url(args, options),
    method: 'get',
})
/**
* @see \App\Filament\Resources\HouseholdMembers\Pages\EditHouseholdMember::__invoke
 * @see app/Filament/Resources/HouseholdMembers/Pages/EditHouseholdMember.php:7
 * @route '/admin/household-members/{record}/edit'
 */
EditHouseholdMember.head = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: EditHouseholdMember.url(args, options),
    method: 'head',
})

    /**
* @see \App\Filament\Resources\HouseholdMembers\Pages\EditHouseholdMember::__invoke
 * @see app/Filament/Resources/HouseholdMembers/Pages/EditHouseholdMember.php:7
 * @route '/admin/household-members/{record}/edit'
 */
    const EditHouseholdMemberForm = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: EditHouseholdMember.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Filament\Resources\HouseholdMembers\Pages\EditHouseholdMember::__invoke
 * @see app/Filament/Resources/HouseholdMembers/Pages/EditHouseholdMember.php:7
 * @route '/admin/household-members/{record}/edit'
 */
        EditHouseholdMemberForm.get = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: EditHouseholdMember.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Filament\Resources\HouseholdMembers\Pages\EditHouseholdMember::__invoke
 * @see app/Filament/Resources/HouseholdMembers/Pages/EditHouseholdMember.php:7
 * @route '/admin/household-members/{record}/edit'
 */
        EditHouseholdMemberForm.head = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: EditHouseholdMember.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    EditHouseholdMember.form = EditHouseholdMemberForm
export default EditHouseholdMember