import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../../wayfinder'
/**
* @see \App\Filament\Resources\ResidentProfiles\Pages\ViewResidentProfile::__invoke
 * @see app/Filament/Resources/ResidentProfiles/Pages/ViewResidentProfile.php:7
 * @route '/admin/resident-profiles/{record}'
 */
const ViewResidentProfile = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ViewResidentProfile.url(args, options),
    method: 'get',
})

ViewResidentProfile.definition = {
    methods: ["get","head"],
    url: '/admin/resident-profiles/{record}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Filament\Resources\ResidentProfiles\Pages\ViewResidentProfile::__invoke
 * @see app/Filament/Resources/ResidentProfiles/Pages/ViewResidentProfile.php:7
 * @route '/admin/resident-profiles/{record}'
 */
ViewResidentProfile.url = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return ViewResidentProfile.definition.url
            .replace('{record}', parsedArgs.record.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Filament\Resources\ResidentProfiles\Pages\ViewResidentProfile::__invoke
 * @see app/Filament/Resources/ResidentProfiles/Pages/ViewResidentProfile.php:7
 * @route '/admin/resident-profiles/{record}'
 */
ViewResidentProfile.get = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ViewResidentProfile.url(args, options),
    method: 'get',
})
/**
* @see \App\Filament\Resources\ResidentProfiles\Pages\ViewResidentProfile::__invoke
 * @see app/Filament/Resources/ResidentProfiles/Pages/ViewResidentProfile.php:7
 * @route '/admin/resident-profiles/{record}'
 */
ViewResidentProfile.head = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: ViewResidentProfile.url(args, options),
    method: 'head',
})

    /**
* @see \App\Filament\Resources\ResidentProfiles\Pages\ViewResidentProfile::__invoke
 * @see app/Filament/Resources/ResidentProfiles/Pages/ViewResidentProfile.php:7
 * @route '/admin/resident-profiles/{record}'
 */
    const ViewResidentProfileForm = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: ViewResidentProfile.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Filament\Resources\ResidentProfiles\Pages\ViewResidentProfile::__invoke
 * @see app/Filament/Resources/ResidentProfiles/Pages/ViewResidentProfile.php:7
 * @route '/admin/resident-profiles/{record}'
 */
        ViewResidentProfileForm.get = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: ViewResidentProfile.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Filament\Resources\ResidentProfiles\Pages\ViewResidentProfile::__invoke
 * @see app/Filament/Resources/ResidentProfiles/Pages/ViewResidentProfile.php:7
 * @route '/admin/resident-profiles/{record}'
 */
        ViewResidentProfileForm.head = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: ViewResidentProfile.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    ViewResidentProfile.form = ViewResidentProfileForm
export default ViewResidentProfile