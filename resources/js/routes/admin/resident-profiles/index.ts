import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\AdminResidentProfileController::index
 * @see app/Http/Controllers/Admin/AdminResidentProfileController.php:26
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
* @see \App\Http\Controllers\Admin\AdminResidentProfileController::index
 * @see app/Http/Controllers/Admin/AdminResidentProfileController.php:26
 * @route '/admin/resident-profiles'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminResidentProfileController::index
 * @see app/Http/Controllers/Admin/AdminResidentProfileController.php:26
 * @route '/admin/resident-profiles'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\AdminResidentProfileController::index
 * @see app/Http/Controllers/Admin/AdminResidentProfileController.php:26
 * @route '/admin/resident-profiles'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\AdminResidentProfileController::index
 * @see app/Http/Controllers/Admin/AdminResidentProfileController.php:26
 * @route '/admin/resident-profiles'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminResidentProfileController::index
 * @see app/Http/Controllers/Admin/AdminResidentProfileController.php:26
 * @route '/admin/resident-profiles'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\AdminResidentProfileController::index
 * @see app/Http/Controllers/Admin/AdminResidentProfileController.php:26
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
* @see \App\Http\Controllers\Admin\AdminResidentProfileController::show
 * @see app/Http/Controllers/Admin/AdminResidentProfileController.php:140
 * @route '/admin/resident-profiles/{residentProfile}'
 */
export const show = (args: { residentProfile: number | { id: number } } | [residentProfile: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin/resident-profiles/{residentProfile}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AdminResidentProfileController::show
 * @see app/Http/Controllers/Admin/AdminResidentProfileController.php:140
 * @route '/admin/resident-profiles/{residentProfile}'
 */
show.url = (args: { residentProfile: number | { id: number } } | [residentProfile: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { residentProfile: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { residentProfile: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    residentProfile: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        residentProfile: typeof args.residentProfile === 'object'
                ? args.residentProfile.id
                : args.residentProfile,
                }

    return show.definition.url
            .replace('{residentProfile}', parsedArgs.residentProfile.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminResidentProfileController::show
 * @see app/Http/Controllers/Admin/AdminResidentProfileController.php:140
 * @route '/admin/resident-profiles/{residentProfile}'
 */
show.get = (args: { residentProfile: number | { id: number } } | [residentProfile: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\AdminResidentProfileController::show
 * @see app/Http/Controllers/Admin/AdminResidentProfileController.php:140
 * @route '/admin/resident-profiles/{residentProfile}'
 */
show.head = (args: { residentProfile: number | { id: number } } | [residentProfile: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\AdminResidentProfileController::show
 * @see app/Http/Controllers/Admin/AdminResidentProfileController.php:140
 * @route '/admin/resident-profiles/{residentProfile}'
 */
    const showForm = (args: { residentProfile: number | { id: number } } | [residentProfile: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminResidentProfileController::show
 * @see app/Http/Controllers/Admin/AdminResidentProfileController.php:140
 * @route '/admin/resident-profiles/{residentProfile}'
 */
        showForm.get = (args: { residentProfile: number | { id: number } } | [residentProfile: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\AdminResidentProfileController::show
 * @see app/Http/Controllers/Admin/AdminResidentProfileController.php:140
 * @route '/admin/resident-profiles/{residentProfile}'
 */
        showForm.head = (args: { residentProfile: number | { id: number } } | [residentProfile: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Admin\AdminResidentProfileController::exportFormB
 * @see app/Http/Controllers/Admin/AdminResidentProfileController.php:266
 * @route '/admin/resident-profiles/{residentProfile}/export/form-b'
 */
export const exportFormB = (args: { residentProfile: number | { id: number } } | [residentProfile: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportFormB.url(args, options),
    method: 'get',
})

exportFormB.definition = {
    methods: ["get","head"],
    url: '/admin/resident-profiles/{residentProfile}/export/form-b',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AdminResidentProfileController::exportFormB
 * @see app/Http/Controllers/Admin/AdminResidentProfileController.php:266
 * @route '/admin/resident-profiles/{residentProfile}/export/form-b'
 */
exportFormB.url = (args: { residentProfile: number | { id: number } } | [residentProfile: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { residentProfile: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { residentProfile: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    residentProfile: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        residentProfile: typeof args.residentProfile === 'object'
                ? args.residentProfile.id
                : args.residentProfile,
                }

    return exportFormB.definition.url
            .replace('{residentProfile}', parsedArgs.residentProfile.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminResidentProfileController::exportFormB
 * @see app/Http/Controllers/Admin/AdminResidentProfileController.php:266
 * @route '/admin/resident-profiles/{residentProfile}/export/form-b'
 */
exportFormB.get = (args: { residentProfile: number | { id: number } } | [residentProfile: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportFormB.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\AdminResidentProfileController::exportFormB
 * @see app/Http/Controllers/Admin/AdminResidentProfileController.php:266
 * @route '/admin/resident-profiles/{residentProfile}/export/form-b'
 */
exportFormB.head = (args: { residentProfile: number | { id: number } } | [residentProfile: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportFormB.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\AdminResidentProfileController::exportFormB
 * @see app/Http/Controllers/Admin/AdminResidentProfileController.php:266
 * @route '/admin/resident-profiles/{residentProfile}/export/form-b'
 */
    const exportFormBForm = (args: { residentProfile: number | { id: number } } | [residentProfile: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: exportFormB.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminResidentProfileController::exportFormB
 * @see app/Http/Controllers/Admin/AdminResidentProfileController.php:266
 * @route '/admin/resident-profiles/{residentProfile}/export/form-b'
 */
        exportFormBForm.get = (args: { residentProfile: number | { id: number } } | [residentProfile: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportFormB.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\AdminResidentProfileController::exportFormB
 * @see app/Http/Controllers/Admin/AdminResidentProfileController.php:266
 * @route '/admin/resident-profiles/{residentProfile}/export/form-b'
 */
        exportFormBForm.head = (args: { residentProfile: number | { id: number } } | [residentProfile: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportFormB.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    exportFormB.form = exportFormBForm
/**
* @see \App\Http\Controllers\Admin\AdminResidentProfileController::destroy
 * @see app/Http/Controllers/Admin/AdminResidentProfileController.php:241
 * @route '/admin/resident-profiles/{residentProfile}'
 */
export const destroy = (args: { residentProfile: number | { id: number } } | [residentProfile: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/resident-profiles/{residentProfile}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\AdminResidentProfileController::destroy
 * @see app/Http/Controllers/Admin/AdminResidentProfileController.php:241
 * @route '/admin/resident-profiles/{residentProfile}'
 */
destroy.url = (args: { residentProfile: number | { id: number } } | [residentProfile: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { residentProfile: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { residentProfile: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    residentProfile: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        residentProfile: typeof args.residentProfile === 'object'
                ? args.residentProfile.id
                : args.residentProfile,
                }

    return destroy.definition.url
            .replace('{residentProfile}', parsedArgs.residentProfile.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminResidentProfileController::destroy
 * @see app/Http/Controllers/Admin/AdminResidentProfileController.php:241
 * @route '/admin/resident-profiles/{residentProfile}'
 */
destroy.delete = (args: { residentProfile: number | { id: number } } | [residentProfile: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Admin\AdminResidentProfileController::destroy
 * @see app/Http/Controllers/Admin/AdminResidentProfileController.php:241
 * @route '/admin/resident-profiles/{residentProfile}'
 */
    const destroyForm = (args: { residentProfile: number | { id: number } } | [residentProfile: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminResidentProfileController::destroy
 * @see app/Http/Controllers/Admin/AdminResidentProfileController.php:241
 * @route '/admin/resident-profiles/{residentProfile}'
 */
        destroyForm.delete = (args: { residentProfile: number | { id: number } } | [residentProfile: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const residentProfiles = {
    index: Object.assign(index, index),
show: Object.assign(show, show),
exportFormB: Object.assign(exportFormB, exportFormB),
destroy: Object.assign(destroy, destroy),
}

export default residentProfiles