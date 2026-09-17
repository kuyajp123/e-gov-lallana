import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\AdminStaffController::index
 * @see app/Http/Controllers/Admin/AdminStaffController.php:43
 * @route '/admin/staff'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/staff',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AdminStaffController::index
 * @see app/Http/Controllers/Admin/AdminStaffController.php:43
 * @route '/admin/staff'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminStaffController::index
 * @see app/Http/Controllers/Admin/AdminStaffController.php:43
 * @route '/admin/staff'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\AdminStaffController::index
 * @see app/Http/Controllers/Admin/AdminStaffController.php:43
 * @route '/admin/staff'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\AdminStaffController::index
 * @see app/Http/Controllers/Admin/AdminStaffController.php:43
 * @route '/admin/staff'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminStaffController::index
 * @see app/Http/Controllers/Admin/AdminStaffController.php:43
 * @route '/admin/staff'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\AdminStaffController::index
 * @see app/Http/Controllers/Admin/AdminStaffController.php:43
 * @route '/admin/staff'
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
* @see \App\Http\Controllers\Admin\AdminStaffController::store
 * @see app/Http/Controllers/Admin/AdminStaffController.php:151
 * @route '/admin/staff'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/staff',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\AdminStaffController::store
 * @see app/Http/Controllers/Admin/AdminStaffController.php:151
 * @route '/admin/staff'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminStaffController::store
 * @see app/Http/Controllers/Admin/AdminStaffController.php:151
 * @route '/admin/staff'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\AdminStaffController::store
 * @see app/Http/Controllers/Admin/AdminStaffController.php:151
 * @route '/admin/staff'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminStaffController::store
 * @see app/Http/Controllers/Admin/AdminStaffController.php:151
 * @route '/admin/staff'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Admin\AdminStaffController::designate
 * @see app/Http/Controllers/Admin/AdminStaffController.php:173
 * @route '/admin/staff/designate'
 */
export const designate = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: designate.url(options),
    method: 'post',
})

designate.definition = {
    methods: ["post"],
    url: '/admin/staff/designate',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\AdminStaffController::designate
 * @see app/Http/Controllers/Admin/AdminStaffController.php:173
 * @route '/admin/staff/designate'
 */
designate.url = (options?: RouteQueryOptions) => {
    return designate.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminStaffController::designate
 * @see app/Http/Controllers/Admin/AdminStaffController.php:173
 * @route '/admin/staff/designate'
 */
designate.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: designate.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\AdminStaffController::designate
 * @see app/Http/Controllers/Admin/AdminStaffController.php:173
 * @route '/admin/staff/designate'
 */
    const designateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: designate.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminStaffController::designate
 * @see app/Http/Controllers/Admin/AdminStaffController.php:173
 * @route '/admin/staff/designate'
 */
        designateForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: designate.url(options),
            method: 'post',
        })
    
    designate.form = designateForm
/**
* @see \App\Http\Controllers\Admin\AdminStaffController::update
 * @see app/Http/Controllers/Admin/AdminStaffController.php:192
 * @route '/admin/staff/{user}'
 */
export const update = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/admin/staff/{user}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\AdminStaffController::update
 * @see app/Http/Controllers/Admin/AdminStaffController.php:192
 * @route '/admin/staff/{user}'
 */
update.url = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { user: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    user: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        user: typeof args.user === 'object'
                ? args.user.id
                : args.user,
                }

    return update.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminStaffController::update
 * @see app/Http/Controllers/Admin/AdminStaffController.php:192
 * @route '/admin/staff/{user}'
 */
update.put = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Admin\AdminStaffController::update
 * @see app/Http/Controllers/Admin/AdminStaffController.php:192
 * @route '/admin/staff/{user}'
 */
    const updateForm = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminStaffController::update
 * @see app/Http/Controllers/Admin/AdminStaffController.php:192
 * @route '/admin/staff/{user}'
 */
        updateForm.put = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\Admin\AdminStaffController::toggleStatus
 * @see app/Http/Controllers/Admin/AdminStaffController.php:230
 * @route '/admin/staff/{user}/toggle-status'
 */
export const toggleStatus = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleStatus.url(args, options),
    method: 'post',
})

toggleStatus.definition = {
    methods: ["post"],
    url: '/admin/staff/{user}/toggle-status',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\AdminStaffController::toggleStatus
 * @see app/Http/Controllers/Admin/AdminStaffController.php:230
 * @route '/admin/staff/{user}/toggle-status'
 */
toggleStatus.url = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { user: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    user: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        user: typeof args.user === 'object'
                ? args.user.id
                : args.user,
                }

    return toggleStatus.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminStaffController::toggleStatus
 * @see app/Http/Controllers/Admin/AdminStaffController.php:230
 * @route '/admin/staff/{user}/toggle-status'
 */
toggleStatus.post = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleStatus.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\AdminStaffController::toggleStatus
 * @see app/Http/Controllers/Admin/AdminStaffController.php:230
 * @route '/admin/staff/{user}/toggle-status'
 */
    const toggleStatusForm = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: toggleStatus.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminStaffController::toggleStatus
 * @see app/Http/Controllers/Admin/AdminStaffController.php:230
 * @route '/admin/staff/{user}/toggle-status'
 */
        toggleStatusForm.post = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: toggleStatus.url(args, options),
            method: 'post',
        })
    
    toggleStatus.form = toggleStatusForm
/**
* @see \App\Http\Controllers\Admin\AdminStaffController::revoke
 * @see app/Http/Controllers/Admin/AdminStaffController.php:258
 * @route '/admin/staff/{user}/revoke'
 */
export const revoke = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: revoke.url(args, options),
    method: 'post',
})

revoke.definition = {
    methods: ["post"],
    url: '/admin/staff/{user}/revoke',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\AdminStaffController::revoke
 * @see app/Http/Controllers/Admin/AdminStaffController.php:258
 * @route '/admin/staff/{user}/revoke'
 */
revoke.url = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { user: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    user: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        user: typeof args.user === 'object'
                ? args.user.id
                : args.user,
                }

    return revoke.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminStaffController::revoke
 * @see app/Http/Controllers/Admin/AdminStaffController.php:258
 * @route '/admin/staff/{user}/revoke'
 */
revoke.post = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: revoke.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\AdminStaffController::revoke
 * @see app/Http/Controllers/Admin/AdminStaffController.php:258
 * @route '/admin/staff/{user}/revoke'
 */
    const revokeForm = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: revoke.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminStaffController::revoke
 * @see app/Http/Controllers/Admin/AdminStaffController.php:258
 * @route '/admin/staff/{user}/revoke'
 */
        revokeForm.post = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: revoke.url(args, options),
            method: 'post',
        })
    
    revoke.form = revokeForm
const AdminStaffController = { index, store, designate, update, toggleStatus, revoke }

export default AdminStaffController