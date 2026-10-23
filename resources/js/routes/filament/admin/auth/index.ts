import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\AdminAuthController::logout
 * @see app/Http/Controllers/Admin/AdminAuthController.php:96
 * @route '/admin/auth/logout'
 */
export const logout = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: logout.url(options),
    method: 'post',
})

logout.definition = {
    methods: ["post"],
    url: '/admin/auth/logout',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\AdminAuthController::logout
 * @see app/Http/Controllers/Admin/AdminAuthController.php:96
 * @route '/admin/auth/logout'
 */
logout.url = (options?: RouteQueryOptions) => {
    return logout.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminAuthController::logout
 * @see app/Http/Controllers/Admin/AdminAuthController.php:96
 * @route '/admin/auth/logout'
 */
logout.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: logout.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\AdminAuthController::logout
 * @see app/Http/Controllers/Admin/AdminAuthController.php:96
 * @route '/admin/auth/logout'
 */
    const logoutForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: logout.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminAuthController::logout
 * @see app/Http/Controllers/Admin/AdminAuthController.php:96
 * @route '/admin/auth/logout'
 */
        logoutForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: logout.url(options),
            method: 'post',
        })
    
    logout.form = logoutForm
const auth = {
    logout: Object.assign(logout, logout),
}

export default auth