import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\AdminAuthController::destroy
 * @see app/Http/Controllers/Admin/AdminAuthController.php:96
 * @route '/admin/logout'
 */
const destroy0bf9725898bf54069779505e96ede62a = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: destroy0bf9725898bf54069779505e96ede62a.url(options),
    method: 'post',
})

destroy0bf9725898bf54069779505e96ede62a.definition = {
    methods: ["post"],
    url: '/admin/logout',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\AdminAuthController::destroy
 * @see app/Http/Controllers/Admin/AdminAuthController.php:96
 * @route '/admin/logout'
 */
destroy0bf9725898bf54069779505e96ede62a.url = (options?: RouteQueryOptions) => {
    return destroy0bf9725898bf54069779505e96ede62a.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminAuthController::destroy
 * @see app/Http/Controllers/Admin/AdminAuthController.php:96
 * @route '/admin/logout'
 */
destroy0bf9725898bf54069779505e96ede62a.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: destroy0bf9725898bf54069779505e96ede62a.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\AdminAuthController::destroy
 * @see app/Http/Controllers/Admin/AdminAuthController.php:96
 * @route '/admin/logout'
 */
    const destroy0bf9725898bf54069779505e96ede62aForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy0bf9725898bf54069779505e96ede62a.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminAuthController::destroy
 * @see app/Http/Controllers/Admin/AdminAuthController.php:96
 * @route '/admin/logout'
 */
        destroy0bf9725898bf54069779505e96ede62aForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy0bf9725898bf54069779505e96ede62a.url(options),
            method: 'post',
        })
    
    destroy0bf9725898bf54069779505e96ede62a.form = destroy0bf9725898bf54069779505e96ede62aForm
    /**
* @see \App\Http\Controllers\Admin\AdminAuthController::destroy
 * @see app/Http/Controllers/Admin/AdminAuthController.php:96
 * @route '/admin/auth/logout'
 */
const destroy6bc42a439297b02653a76924f8d5abd5 = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: destroy6bc42a439297b02653a76924f8d5abd5.url(options),
    method: 'post',
})

destroy6bc42a439297b02653a76924f8d5abd5.definition = {
    methods: ["post"],
    url: '/admin/auth/logout',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\AdminAuthController::destroy
 * @see app/Http/Controllers/Admin/AdminAuthController.php:96
 * @route '/admin/auth/logout'
 */
destroy6bc42a439297b02653a76924f8d5abd5.url = (options?: RouteQueryOptions) => {
    return destroy6bc42a439297b02653a76924f8d5abd5.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminAuthController::destroy
 * @see app/Http/Controllers/Admin/AdminAuthController.php:96
 * @route '/admin/auth/logout'
 */
destroy6bc42a439297b02653a76924f8d5abd5.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: destroy6bc42a439297b02653a76924f8d5abd5.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\AdminAuthController::destroy
 * @see app/Http/Controllers/Admin/AdminAuthController.php:96
 * @route '/admin/auth/logout'
 */
    const destroy6bc42a439297b02653a76924f8d5abd5Form = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy6bc42a439297b02653a76924f8d5abd5.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminAuthController::destroy
 * @see app/Http/Controllers/Admin/AdminAuthController.php:96
 * @route '/admin/auth/logout'
 */
        destroy6bc42a439297b02653a76924f8d5abd5Form.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy6bc42a439297b02653a76924f8d5abd5.url(options),
            method: 'post',
        })
    
    destroy6bc42a439297b02653a76924f8d5abd5.form = destroy6bc42a439297b02653a76924f8d5abd5Form

/**
* Multiple routes resolve to \App\Http\Controllers\Admin\AdminAuthController::destroy, so this export is a
* dictionary keyed by URI rather than a callable. Call a specific route with `destroy['<uri>'](...)`,
* or import the route by name from your generated `routes/` directory.
*/
export const destroy = {
    '/admin/logout': destroy0bf9725898bf54069779505e96ede62a,
    '/admin/auth/logout': destroy6bc42a439297b02653a76924f8d5abd5,
}

/**
* @see \App\Http\Controllers\Admin\AdminAuthController::create
 * @see app/Http/Controllers/Admin/AdminAuthController.php:23
 * @route '/admin/login'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/admin/login',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AdminAuthController::create
 * @see app/Http/Controllers/Admin/AdminAuthController.php:23
 * @route '/admin/login'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminAuthController::create
 * @see app/Http/Controllers/Admin/AdminAuthController.php:23
 * @route '/admin/login'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\AdminAuthController::create
 * @see app/Http/Controllers/Admin/AdminAuthController.php:23
 * @route '/admin/login'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\AdminAuthController::create
 * @see app/Http/Controllers/Admin/AdminAuthController.php:23
 * @route '/admin/login'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminAuthController::create
 * @see app/Http/Controllers/Admin/AdminAuthController.php:23
 * @route '/admin/login'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\AdminAuthController::create
 * @see app/Http/Controllers/Admin/AdminAuthController.php:23
 * @route '/admin/login'
 */
        createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    create.form = createForm
/**
* @see \App\Http\Controllers\Admin\AdminAuthController::store
 * @see app/Http/Controllers/Admin/AdminAuthController.php:39
 * @route '/admin/login'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/login',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\AdminAuthController::store
 * @see app/Http/Controllers/Admin/AdminAuthController.php:39
 * @route '/admin/login'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminAuthController::store
 * @see app/Http/Controllers/Admin/AdminAuthController.php:39
 * @route '/admin/login'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\AdminAuthController::store
 * @see app/Http/Controllers/Admin/AdminAuthController.php:39
 * @route '/admin/login'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminAuthController::store
 * @see app/Http/Controllers/Admin/AdminAuthController.php:39
 * @route '/admin/login'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
const AdminAuthController = { destroy, create, store }

export default AdminAuthController