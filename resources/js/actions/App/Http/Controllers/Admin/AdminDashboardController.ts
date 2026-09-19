import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\AdminDashboardController::__invoke
 * @see app/Http/Controllers/Admin/AdminDashboardController.php:18
 * @route '/admin'
 */
const AdminDashboardController35f58437d9250c39f332f5e8e70440b7 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: AdminDashboardController35f58437d9250c39f332f5e8e70440b7.url(options),
    method: 'get',
})

AdminDashboardController35f58437d9250c39f332f5e8e70440b7.definition = {
    methods: ["get","head"],
    url: '/admin',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AdminDashboardController::__invoke
 * @see app/Http/Controllers/Admin/AdminDashboardController.php:18
 * @route '/admin'
 */
AdminDashboardController35f58437d9250c39f332f5e8e70440b7.url = (options?: RouteQueryOptions) => {
    return AdminDashboardController35f58437d9250c39f332f5e8e70440b7.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminDashboardController::__invoke
 * @see app/Http/Controllers/Admin/AdminDashboardController.php:18
 * @route '/admin'
 */
AdminDashboardController35f58437d9250c39f332f5e8e70440b7.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: AdminDashboardController35f58437d9250c39f332f5e8e70440b7.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\AdminDashboardController::__invoke
 * @see app/Http/Controllers/Admin/AdminDashboardController.php:18
 * @route '/admin'
 */
AdminDashboardController35f58437d9250c39f332f5e8e70440b7.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: AdminDashboardController35f58437d9250c39f332f5e8e70440b7.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\AdminDashboardController::__invoke
 * @see app/Http/Controllers/Admin/AdminDashboardController.php:18
 * @route '/admin'
 */
    const AdminDashboardController35f58437d9250c39f332f5e8e70440b7Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: AdminDashboardController35f58437d9250c39f332f5e8e70440b7.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminDashboardController::__invoke
 * @see app/Http/Controllers/Admin/AdminDashboardController.php:18
 * @route '/admin'
 */
        AdminDashboardController35f58437d9250c39f332f5e8e70440b7Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: AdminDashboardController35f58437d9250c39f332f5e8e70440b7.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\AdminDashboardController::__invoke
 * @see app/Http/Controllers/Admin/AdminDashboardController.php:18
 * @route '/admin'
 */
        AdminDashboardController35f58437d9250c39f332f5e8e70440b7Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: AdminDashboardController35f58437d9250c39f332f5e8e70440b7.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    AdminDashboardController35f58437d9250c39f332f5e8e70440b7.form = AdminDashboardController35f58437d9250c39f332f5e8e70440b7Form
    /**
* @see \App\Http\Controllers\Admin\AdminDashboardController::__invoke
 * @see app/Http/Controllers/Admin/AdminDashboardController.php:18
 * @route '/admin/overview'
 */
const AdminDashboardController1ab6d5d327b3d921bc79f01f1636a929 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: AdminDashboardController1ab6d5d327b3d921bc79f01f1636a929.url(options),
    method: 'get',
})

AdminDashboardController1ab6d5d327b3d921bc79f01f1636a929.definition = {
    methods: ["get","head"],
    url: '/admin/overview',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AdminDashboardController::__invoke
 * @see app/Http/Controllers/Admin/AdminDashboardController.php:18
 * @route '/admin/overview'
 */
AdminDashboardController1ab6d5d327b3d921bc79f01f1636a929.url = (options?: RouteQueryOptions) => {
    return AdminDashboardController1ab6d5d327b3d921bc79f01f1636a929.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminDashboardController::__invoke
 * @see app/Http/Controllers/Admin/AdminDashboardController.php:18
 * @route '/admin/overview'
 */
AdminDashboardController1ab6d5d327b3d921bc79f01f1636a929.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: AdminDashboardController1ab6d5d327b3d921bc79f01f1636a929.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\AdminDashboardController::__invoke
 * @see app/Http/Controllers/Admin/AdminDashboardController.php:18
 * @route '/admin/overview'
 */
AdminDashboardController1ab6d5d327b3d921bc79f01f1636a929.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: AdminDashboardController1ab6d5d327b3d921bc79f01f1636a929.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\AdminDashboardController::__invoke
 * @see app/Http/Controllers/Admin/AdminDashboardController.php:18
 * @route '/admin/overview'
 */
    const AdminDashboardController1ab6d5d327b3d921bc79f01f1636a929Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: AdminDashboardController1ab6d5d327b3d921bc79f01f1636a929.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminDashboardController::__invoke
 * @see app/Http/Controllers/Admin/AdminDashboardController.php:18
 * @route '/admin/overview'
 */
        AdminDashboardController1ab6d5d327b3d921bc79f01f1636a929Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: AdminDashboardController1ab6d5d327b3d921bc79f01f1636a929.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\AdminDashboardController::__invoke
 * @see app/Http/Controllers/Admin/AdminDashboardController.php:18
 * @route '/admin/overview'
 */
        AdminDashboardController1ab6d5d327b3d921bc79f01f1636a929Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: AdminDashboardController1ab6d5d327b3d921bc79f01f1636a929.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    AdminDashboardController1ab6d5d327b3d921bc79f01f1636a929.form = AdminDashboardController1ab6d5d327b3d921bc79f01f1636a929Form

/**
* Multiple routes resolve to \App\Http\Controllers\Admin\AdminDashboardController::AdminDashboardController, so this export is a
* dictionary keyed by URI rather than a callable. Call a specific route with `AdminDashboardController['<uri>'](...)`,
* or import the route by name from your generated `routes/` directory.
*/
const AdminDashboardController = {
    '/admin': AdminDashboardController35f58437d9250c39f332f5e8e70440b7,
    '/admin/overview': AdminDashboardController1ab6d5d327b3d921bc79f01f1636a929,
}

export default AdminDashboardController