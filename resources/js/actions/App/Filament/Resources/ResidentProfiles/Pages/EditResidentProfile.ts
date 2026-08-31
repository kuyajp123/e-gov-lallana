import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../../wayfinder'
/**
* @see \App\Filament\Resources\ResidentProfiles\Pages\EditResidentProfile::__invoke
 * @see app/Filament/Resources/ResidentProfiles/Pages/EditResidentProfile.php:7
 * @route '/admin/resident-profiles/{record}/edit'
 */
const EditResidentProfile = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: EditResidentProfile.url(args, options),
    method: 'get',
})

EditResidentProfile.definition = {
    methods: ["get","head"],
    url: '/admin/resident-profiles/{record}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Filament\Resources\ResidentProfiles\Pages\EditResidentProfile::__invoke
 * @see app/Filament/Resources/ResidentProfiles/Pages/EditResidentProfile.php:7
 * @route '/admin/resident-profiles/{record}/edit'
 */
EditResidentProfile.url = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return EditResidentProfile.definition.url
            .replace('{record}', parsedArgs.record.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Filament\Resources\ResidentProfiles\Pages\EditResidentProfile::__invoke
 * @see app/Filament/Resources/ResidentProfiles/Pages/EditResidentProfile.php:7
 * @route '/admin/resident-profiles/{record}/edit'
 */
EditResidentProfile.get = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: EditResidentProfile.url(args, options),
    method: 'get',
})
/**
* @see \App\Filament\Resources\ResidentProfiles\Pages\EditResidentProfile::__invoke
 * @see app/Filament/Resources/ResidentProfiles/Pages/EditResidentProfile.php:7
 * @route '/admin/resident-profiles/{record}/edit'
 */
EditResidentProfile.head = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: EditResidentProfile.url(args, options),
    method: 'head',
})

    /**
* @see \App\Filament\Resources\ResidentProfiles\Pages\EditResidentProfile::__invoke
 * @see app/Filament/Resources/ResidentProfiles/Pages/EditResidentProfile.php:7
 * @route '/admin/resident-profiles/{record}/edit'
 */
    const EditResidentProfileForm = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: EditResidentProfile.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Filament\Resources\ResidentProfiles\Pages\EditResidentProfile::__invoke
 * @see app/Filament/Resources/ResidentProfiles/Pages/EditResidentProfile.php:7
 * @route '/admin/resident-profiles/{record}/edit'
 */
        EditResidentProfileForm.get = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: EditResidentProfile.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Filament\Resources\ResidentProfiles\Pages\EditResidentProfile::__invoke
 * @see app/Filament/Resources/ResidentProfiles/Pages/EditResidentProfile.php:7
 * @route '/admin/resident-profiles/{record}/edit'
 */
        EditResidentProfileForm.head = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: EditResidentProfile.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    EditResidentProfile.form = EditResidentProfileForm
export default EditResidentProfile