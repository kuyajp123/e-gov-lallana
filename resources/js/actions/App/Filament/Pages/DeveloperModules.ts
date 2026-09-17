import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Filament\Pages\DeveloperModules::__invoke
 * @see app/Filament/Pages/DeveloperModules.php:7
 * @route '/admin/developer-modules'
 */
const DeveloperModules = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: DeveloperModules.url(options),
    method: 'get',
})

DeveloperModules.definition = {
    methods: ["get","head"],
    url: '/admin/developer-modules',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Filament\Pages\DeveloperModules::__invoke
 * @see app/Filament/Pages/DeveloperModules.php:7
 * @route '/admin/developer-modules'
 */
DeveloperModules.url = (options?: RouteQueryOptions) => {
    return DeveloperModules.definition.url + queryParams(options)
}

/**
* @see \App\Filament\Pages\DeveloperModules::__invoke
 * @see app/Filament/Pages/DeveloperModules.php:7
 * @route '/admin/developer-modules'
 */
DeveloperModules.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: DeveloperModules.url(options),
    method: 'get',
})
/**
* @see \App\Filament\Pages\DeveloperModules::__invoke
 * @see app/Filament/Pages/DeveloperModules.php:7
 * @route '/admin/developer-modules'
 */
DeveloperModules.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: DeveloperModules.url(options),
    method: 'head',
})

    /**
* @see \App\Filament\Pages\DeveloperModules::__invoke
 * @see app/Filament/Pages/DeveloperModules.php:7
 * @route '/admin/developer-modules'
 */
    const DeveloperModulesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: DeveloperModules.url(options),
        method: 'get',
    })

            /**
* @see \App\Filament\Pages\DeveloperModules::__invoke
 * @see app/Filament/Pages/DeveloperModules.php:7
 * @route '/admin/developer-modules'
 */
        DeveloperModulesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: DeveloperModules.url(options),
            method: 'get',
        })
            /**
* @see \App\Filament\Pages\DeveloperModules::__invoke
 * @see app/Filament/Pages/DeveloperModules.php:7
 * @route '/admin/developer-modules'
 */
        DeveloperModulesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: DeveloperModules.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    DeveloperModules.form = DeveloperModulesForm
export default DeveloperModules