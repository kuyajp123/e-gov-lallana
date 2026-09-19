import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\AdminDashboardController::__invoke
 * @see app/Http/Controllers/Admin/AdminDashboardController.php:18
 * @route '/admin'
 */
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/admin',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AdminDashboardController::__invoke
 * @see app/Http/Controllers/Admin/AdminDashboardController.php:18
 * @route '/admin'
 */
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminDashboardController::__invoke
 * @see app/Http/Controllers/Admin/AdminDashboardController.php:18
 * @route '/admin'
 */
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\AdminDashboardController::__invoke
 * @see app/Http/Controllers/Admin/AdminDashboardController.php:18
 * @route '/admin'
 */
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\AdminDashboardController::__invoke
 * @see app/Http/Controllers/Admin/AdminDashboardController.php:18
 * @route '/admin'
 */
    const dashboardForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: dashboard.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminDashboardController::__invoke
 * @see app/Http/Controllers/Admin/AdminDashboardController.php:18
 * @route '/admin'
 */
        dashboardForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\AdminDashboardController::__invoke
 * @see app/Http/Controllers/Admin/AdminDashboardController.php:18
 * @route '/admin'
 */
        dashboardForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    dashboard.form = dashboardForm
/**
* @see \App\Filament\Pages\DeveloperModules::__invoke
 * @see app/Filament/Pages/DeveloperModules.php:7
 * @route '/admin/developer-modules'
 */
export const developerModules = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: developerModules.url(options),
    method: 'get',
})

developerModules.definition = {
    methods: ["get","head"],
    url: '/admin/developer-modules',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Filament\Pages\DeveloperModules::__invoke
 * @see app/Filament/Pages/DeveloperModules.php:7
 * @route '/admin/developer-modules'
 */
developerModules.url = (options?: RouteQueryOptions) => {
    return developerModules.definition.url + queryParams(options)
}

/**
* @see \App\Filament\Pages\DeveloperModules::__invoke
 * @see app/Filament/Pages/DeveloperModules.php:7
 * @route '/admin/developer-modules'
 */
developerModules.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: developerModules.url(options),
    method: 'get',
})
/**
* @see \App\Filament\Pages\DeveloperModules::__invoke
 * @see app/Filament/Pages/DeveloperModules.php:7
 * @route '/admin/developer-modules'
 */
developerModules.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: developerModules.url(options),
    method: 'head',
})

    /**
* @see \App\Filament\Pages\DeveloperModules::__invoke
 * @see app/Filament/Pages/DeveloperModules.php:7
 * @route '/admin/developer-modules'
 */
    const developerModulesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: developerModules.url(options),
        method: 'get',
    })

            /**
* @see \App\Filament\Pages\DeveloperModules::__invoke
 * @see app/Filament/Pages/DeveloperModules.php:7
 * @route '/admin/developer-modules'
 */
        developerModulesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: developerModules.url(options),
            method: 'get',
        })
            /**
* @see \App\Filament\Pages\DeveloperModules::__invoke
 * @see app/Filament/Pages/DeveloperModules.php:7
 * @route '/admin/developer-modules'
 */
        developerModulesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: developerModules.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    developerModules.form = developerModulesForm
const pages = {
    dashboard: Object.assign(dashboard, dashboard),
developerModules: Object.assign(developerModules, developerModules),
}

export default pages