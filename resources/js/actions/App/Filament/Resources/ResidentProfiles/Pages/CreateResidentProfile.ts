import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../../wayfinder'
/**
* @see \App\Filament\Resources\ResidentProfiles\Pages\CreateResidentProfile::__invoke
 * @see app/Filament/Resources/ResidentProfiles/Pages/CreateResidentProfile.php:7
 * @route '/admin/resident-profiles/create'
 */
const CreateResidentProfile = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: CreateResidentProfile.url(options),
    method: 'get',
})

CreateResidentProfile.definition = {
    methods: ["get","head"],
    url: '/admin/resident-profiles/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Filament\Resources\ResidentProfiles\Pages\CreateResidentProfile::__invoke
 * @see app/Filament/Resources/ResidentProfiles/Pages/CreateResidentProfile.php:7
 * @route '/admin/resident-profiles/create'
 */
CreateResidentProfile.url = (options?: RouteQueryOptions) => {
    return CreateResidentProfile.definition.url + queryParams(options)
}

/**
* @see \App\Filament\Resources\ResidentProfiles\Pages\CreateResidentProfile::__invoke
 * @see app/Filament/Resources/ResidentProfiles/Pages/CreateResidentProfile.php:7
 * @route '/admin/resident-profiles/create'
 */
CreateResidentProfile.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: CreateResidentProfile.url(options),
    method: 'get',
})
/**
* @see \App\Filament\Resources\ResidentProfiles\Pages\CreateResidentProfile::__invoke
 * @see app/Filament/Resources/ResidentProfiles/Pages/CreateResidentProfile.php:7
 * @route '/admin/resident-profiles/create'
 */
CreateResidentProfile.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: CreateResidentProfile.url(options),
    method: 'head',
})

    /**
* @see \App\Filament\Resources\ResidentProfiles\Pages\CreateResidentProfile::__invoke
 * @see app/Filament/Resources/ResidentProfiles/Pages/CreateResidentProfile.php:7
 * @route '/admin/resident-profiles/create'
 */
    const CreateResidentProfileForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: CreateResidentProfile.url(options),
        method: 'get',
    })

            /**
* @see \App\Filament\Resources\ResidentProfiles\Pages\CreateResidentProfile::__invoke
 * @see app/Filament/Resources/ResidentProfiles/Pages/CreateResidentProfile.php:7
 * @route '/admin/resident-profiles/create'
 */
        CreateResidentProfileForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: CreateResidentProfile.url(options),
            method: 'get',
        })
            /**
* @see \App\Filament\Resources\ResidentProfiles\Pages\CreateResidentProfile::__invoke
 * @see app/Filament/Resources/ResidentProfiles/Pages/CreateResidentProfile.php:7
 * @route '/admin/resident-profiles/create'
 */
        CreateResidentProfileForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: CreateResidentProfile.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    CreateResidentProfile.form = CreateResidentProfileForm
export default CreateResidentProfile