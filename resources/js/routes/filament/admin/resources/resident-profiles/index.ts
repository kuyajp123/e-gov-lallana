import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Filament\Resources\ResidentProfiles\Pages\ListResidentProfiles::__invoke
 * @see app/Filament/Resources/ResidentProfiles/Pages/ListResidentProfiles.php:7
 * @route '/admin/resident-profiles'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/resident-profiles',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Filament\Resources\ResidentProfiles\Pages\ListResidentProfiles::__invoke
 * @see app/Filament/Resources/ResidentProfiles/Pages/ListResidentProfiles.php:7
 * @route '/admin/resident-profiles'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Filament\Resources\ResidentProfiles\Pages\ListResidentProfiles::__invoke
 * @see app/Filament/Resources/ResidentProfiles/Pages/ListResidentProfiles.php:7
 * @route '/admin/resident-profiles'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Filament\Resources\ResidentProfiles\Pages\ListResidentProfiles::__invoke
 * @see app/Filament/Resources/ResidentProfiles/Pages/ListResidentProfiles.php:7
 * @route '/admin/resident-profiles'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Filament\Resources\ResidentProfiles\Pages\ListResidentProfiles::__invoke
 * @see app/Filament/Resources/ResidentProfiles/Pages/ListResidentProfiles.php:7
 * @route '/admin/resident-profiles'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Filament\Resources\ResidentProfiles\Pages\ListResidentProfiles::__invoke
 * @see app/Filament/Resources/ResidentProfiles/Pages/ListResidentProfiles.php:7
 * @route '/admin/resident-profiles'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Filament\Resources\ResidentProfiles\Pages\ListResidentProfiles::__invoke
 * @see app/Filament/Resources/ResidentProfiles/Pages/ListResidentProfiles.php:7
 * @route '/admin/resident-profiles'
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
/**
* @see \App\Filament\Resources\ResidentProfiles\Pages\ViewResidentProfile::__invoke
 * @see app/Filament/Resources/ResidentProfiles/Pages/ViewResidentProfile.php:7
 * @route '/admin/resident-profiles/{record}'
 */
export const view = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: view.url(args, options),
    method: 'get',
})

view.definition = {
    methods: ["get","head"],
    url: '/admin/resident-profiles/{record}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Filament\Resources\ResidentProfiles\Pages\ViewResidentProfile::__invoke
 * @see app/Filament/Resources/ResidentProfiles/Pages/ViewResidentProfile.php:7
 * @route '/admin/resident-profiles/{record}'
 */
view.url = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return view.definition.url
            .replace('{record}', parsedArgs.record.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Filament\Resources\ResidentProfiles\Pages\ViewResidentProfile::__invoke
 * @see app/Filament/Resources/ResidentProfiles/Pages/ViewResidentProfile.php:7
 * @route '/admin/resident-profiles/{record}'
 */
view.get = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: view.url(args, options),
    method: 'get',
})
/**
* @see \App\Filament\Resources\ResidentProfiles\Pages\ViewResidentProfile::__invoke
 * @see app/Filament/Resources/ResidentProfiles/Pages/ViewResidentProfile.php:7
 * @route '/admin/resident-profiles/{record}'
 */
view.head = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: view.url(args, options),
    method: 'head',
})

    /**
* @see \App\Filament\Resources\ResidentProfiles\Pages\ViewResidentProfile::__invoke
 * @see app/Filament/Resources/ResidentProfiles/Pages/ViewResidentProfile.php:7
 * @route '/admin/resident-profiles/{record}'
 */
    const viewForm = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: view.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Filament\Resources\ResidentProfiles\Pages\ViewResidentProfile::__invoke
 * @see app/Filament/Resources/ResidentProfiles/Pages/ViewResidentProfile.php:7
 * @route '/admin/resident-profiles/{record}'
 */
        viewForm.get = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: view.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Filament\Resources\ResidentProfiles\Pages\ViewResidentProfile::__invoke
 * @see app/Filament/Resources/ResidentProfiles/Pages/ViewResidentProfile.php:7
 * @route '/admin/resident-profiles/{record}'
 */
        viewForm.head = (args: { record: string | number } | [record: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: view.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    view.form = viewForm
const residentProfiles = {
    index: Object.assign(index, index),
view: Object.assign(view, view),
}

export default residentProfiles