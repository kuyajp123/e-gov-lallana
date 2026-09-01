import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../../wayfinder'
/**
* @see \App\Filament\Resources\ResidentProfiles\Pages\ListResidentProfiles::__invoke
 * @see app/Filament/Resources/ResidentProfiles/Pages/ListResidentProfiles.php:7
 * @route '/admin/resident-profiles'
 */
const ListResidentProfiles = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ListResidentProfiles.url(options),
    method: 'get',
})

ListResidentProfiles.definition = {
    methods: ["get","head"],
    url: '/admin/resident-profiles',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Filament\Resources\ResidentProfiles\Pages\ListResidentProfiles::__invoke
 * @see app/Filament/Resources/ResidentProfiles/Pages/ListResidentProfiles.php:7
 * @route '/admin/resident-profiles'
 */
ListResidentProfiles.url = (options?: RouteQueryOptions) => {
    return ListResidentProfiles.definition.url + queryParams(options)
}

/**
* @see \App\Filament\Resources\ResidentProfiles\Pages\ListResidentProfiles::__invoke
 * @see app/Filament/Resources/ResidentProfiles/Pages/ListResidentProfiles.php:7
 * @route '/admin/resident-profiles'
 */
ListResidentProfiles.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ListResidentProfiles.url(options),
    method: 'get',
})
/**
* @see \App\Filament\Resources\ResidentProfiles\Pages\ListResidentProfiles::__invoke
 * @see app/Filament/Resources/ResidentProfiles/Pages/ListResidentProfiles.php:7
 * @route '/admin/resident-profiles'
 */
ListResidentProfiles.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: ListResidentProfiles.url(options),
    method: 'head',
})

    /**
* @see \App\Filament\Resources\ResidentProfiles\Pages\ListResidentProfiles::__invoke
 * @see app/Filament/Resources/ResidentProfiles/Pages/ListResidentProfiles.php:7
 * @route '/admin/resident-profiles'
 */
    const ListResidentProfilesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: ListResidentProfiles.url(options),
        method: 'get',
    })

            /**
* @see \App\Filament\Resources\ResidentProfiles\Pages\ListResidentProfiles::__invoke
 * @see app/Filament/Resources/ResidentProfiles/Pages/ListResidentProfiles.php:7
 * @route '/admin/resident-profiles'
 */
        ListResidentProfilesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: ListResidentProfiles.url(options),
            method: 'get',
        })
            /**
* @see \App\Filament\Resources\ResidentProfiles\Pages\ListResidentProfiles::__invoke
 * @see app/Filament/Resources/ResidentProfiles/Pages/ListResidentProfiles.php:7
 * @route '/admin/resident-profiles'
 */
        ListResidentProfilesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: ListResidentProfiles.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    ListResidentProfiles.form = ListResidentProfilesForm
export default ListResidentProfiles