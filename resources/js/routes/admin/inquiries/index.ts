import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\AdminInquiryController::index
 * @see app/Http/Controllers/Admin/AdminInquiryController.php:17
 * @route '/admin/inquiries'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/inquiries',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AdminInquiryController::index
 * @see app/Http/Controllers/Admin/AdminInquiryController.php:17
 * @route '/admin/inquiries'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminInquiryController::index
 * @see app/Http/Controllers/Admin/AdminInquiryController.php:17
 * @route '/admin/inquiries'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\AdminInquiryController::index
 * @see app/Http/Controllers/Admin/AdminInquiryController.php:17
 * @route '/admin/inquiries'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\AdminInquiryController::index
 * @see app/Http/Controllers/Admin/AdminInquiryController.php:17
 * @route '/admin/inquiries'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminInquiryController::index
 * @see app/Http/Controllers/Admin/AdminInquiryController.php:17
 * @route '/admin/inquiries'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\AdminInquiryController::index
 * @see app/Http/Controllers/Admin/AdminInquiryController.php:17
 * @route '/admin/inquiries'
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
* @see \App\Http\Controllers\Admin\AdminInquiryController::show
 * @see app/Http/Controllers/Admin/AdminInquiryController.php:81
 * @route '/admin/inquiries/{inquiry}'
 */
export const show = (args: { inquiry: number | { id: number } } | [inquiry: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin/inquiries/{inquiry}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AdminInquiryController::show
 * @see app/Http/Controllers/Admin/AdminInquiryController.php:81
 * @route '/admin/inquiries/{inquiry}'
 */
show.url = (args: { inquiry: number | { id: number } } | [inquiry: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { inquiry: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { inquiry: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    inquiry: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        inquiry: typeof args.inquiry === 'object'
                ? args.inquiry.id
                : args.inquiry,
                }

    return show.definition.url
            .replace('{inquiry}', parsedArgs.inquiry.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminInquiryController::show
 * @see app/Http/Controllers/Admin/AdminInquiryController.php:81
 * @route '/admin/inquiries/{inquiry}'
 */
show.get = (args: { inquiry: number | { id: number } } | [inquiry: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\AdminInquiryController::show
 * @see app/Http/Controllers/Admin/AdminInquiryController.php:81
 * @route '/admin/inquiries/{inquiry}'
 */
show.head = (args: { inquiry: number | { id: number } } | [inquiry: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\AdminInquiryController::show
 * @see app/Http/Controllers/Admin/AdminInquiryController.php:81
 * @route '/admin/inquiries/{inquiry}'
 */
    const showForm = (args: { inquiry: number | { id: number } } | [inquiry: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminInquiryController::show
 * @see app/Http/Controllers/Admin/AdminInquiryController.php:81
 * @route '/admin/inquiries/{inquiry}'
 */
        showForm.get = (args: { inquiry: number | { id: number } } | [inquiry: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\AdminInquiryController::show
 * @see app/Http/Controllers/Admin/AdminInquiryController.php:81
 * @route '/admin/inquiries/{inquiry}'
 */
        showForm.head = (args: { inquiry: number | { id: number } } | [inquiry: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
/**
* @see \App\Http\Controllers\Admin\AdminInquiryController::updateStatus
 * @see app/Http/Controllers/Admin/AdminInquiryController.php:109
 * @route '/admin/inquiries/{inquiry}/status'
 */
export const updateStatus = (args: { inquiry: number | { id: number } } | [inquiry: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateStatus.url(args, options),
    method: 'patch',
})

updateStatus.definition = {
    methods: ["patch"],
    url: '/admin/inquiries/{inquiry}/status',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Admin\AdminInquiryController::updateStatus
 * @see app/Http/Controllers/Admin/AdminInquiryController.php:109
 * @route '/admin/inquiries/{inquiry}/status'
 */
updateStatus.url = (args: { inquiry: number | { id: number } } | [inquiry: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { inquiry: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { inquiry: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    inquiry: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        inquiry: typeof args.inquiry === 'object'
                ? args.inquiry.id
                : args.inquiry,
                }

    return updateStatus.definition.url
            .replace('{inquiry}', parsedArgs.inquiry.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminInquiryController::updateStatus
 * @see app/Http/Controllers/Admin/AdminInquiryController.php:109
 * @route '/admin/inquiries/{inquiry}/status'
 */
updateStatus.patch = (args: { inquiry: number | { id: number } } | [inquiry: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateStatus.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Admin\AdminInquiryController::updateStatus
 * @see app/Http/Controllers/Admin/AdminInquiryController.php:109
 * @route '/admin/inquiries/{inquiry}/status'
 */
    const updateStatusForm = (args: { inquiry: number | { id: number } } | [inquiry: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateStatus.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminInquiryController::updateStatus
 * @see app/Http/Controllers/Admin/AdminInquiryController.php:109
 * @route '/admin/inquiries/{inquiry}/status'
 */
        updateStatusForm.patch = (args: { inquiry: number | { id: number } } | [inquiry: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateStatus.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateStatus.form = updateStatusForm
/**
* @see \App\Http\Controllers\Admin\AdminInquiryController::destroy
 * @see app/Http/Controllers/Admin/AdminInquiryController.php:135
 * @route '/admin/inquiries/{inquiry}'
 */
export const destroy = (args: { inquiry: number | { id: number } } | [inquiry: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/inquiries/{inquiry}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\AdminInquiryController::destroy
 * @see app/Http/Controllers/Admin/AdminInquiryController.php:135
 * @route '/admin/inquiries/{inquiry}'
 */
destroy.url = (args: { inquiry: number | { id: number } } | [inquiry: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { inquiry: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { inquiry: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    inquiry: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        inquiry: typeof args.inquiry === 'object'
                ? args.inquiry.id
                : args.inquiry,
                }

    return destroy.definition.url
            .replace('{inquiry}', parsedArgs.inquiry.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminInquiryController::destroy
 * @see app/Http/Controllers/Admin/AdminInquiryController.php:135
 * @route '/admin/inquiries/{inquiry}'
 */
destroy.delete = (args: { inquiry: number | { id: number } } | [inquiry: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Admin\AdminInquiryController::destroy
 * @see app/Http/Controllers/Admin/AdminInquiryController.php:135
 * @route '/admin/inquiries/{inquiry}'
 */
    const destroyForm = (args: { inquiry: number | { id: number } } | [inquiry: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminInquiryController::destroy
 * @see app/Http/Controllers/Admin/AdminInquiryController.php:135
 * @route '/admin/inquiries/{inquiry}'
 */
        destroyForm.delete = (args: { inquiry: number | { id: number } } | [inquiry: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const inquiries = {
    index: Object.assign(index, index),
show: Object.assign(show, show),
updateStatus: Object.assign(updateStatus, updateStatus),
destroy: Object.assign(destroy, destroy),
}

export default inquiries