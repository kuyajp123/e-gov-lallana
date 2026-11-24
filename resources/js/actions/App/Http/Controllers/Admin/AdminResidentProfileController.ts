import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\AdminResidentProfileController::index
 * @see app/Http/Controllers/Admin/AdminResidentProfileController.php:274
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
 * @see app/Http/Controllers/Admin/AdminResidentProfileController.php:274
 * @route '/admin/resident-profiles'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminResidentProfileController::index
 * @see app/Http/Controllers/Admin/AdminResidentProfileController.php:274
 * @route '/admin/resident-profiles'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\AdminResidentProfileController::index
 * @see app/Http/Controllers/Admin/AdminResidentProfileController.php:274
 * @route '/admin/resident-profiles'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\AdminResidentProfileController::index
 * @see app/Http/Controllers/Admin/AdminResidentProfileController.php:274
 * @route '/admin/resident-profiles'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminResidentProfileController::index
 * @see app/Http/Controllers/Admin/AdminResidentProfileController.php:274
 * @route '/admin/resident-profiles'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\AdminResidentProfileController::index
 * @see app/Http/Controllers/Admin/AdminResidentProfileController.php:274
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
* @see \App\Http\Controllers\Admin\AdminResidentProfileController::exportPdf
 * @see app/Http/Controllers/Admin/AdminResidentProfileController.php:362
 * @route '/admin/resident-profiles/export-pdf'
 */
export const exportPdf = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportPdf.url(options),
    method: 'get',
})

exportPdf.definition = {
    methods: ["get","head"],
    url: '/admin/resident-profiles/export-pdf',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AdminResidentProfileController::exportPdf
 * @see app/Http/Controllers/Admin/AdminResidentProfileController.php:362
 * @route '/admin/resident-profiles/export-pdf'
 */
exportPdf.url = (options?: RouteQueryOptions) => {
    return exportPdf.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminResidentProfileController::exportPdf
 * @see app/Http/Controllers/Admin/AdminResidentProfileController.php:362
 * @route '/admin/resident-profiles/export-pdf'
 */
exportPdf.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportPdf.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\AdminResidentProfileController::exportPdf
 * @see app/Http/Controllers/Admin/AdminResidentProfileController.php:362
 * @route '/admin/resident-profiles/export-pdf'
 */
exportPdf.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportPdf.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\AdminResidentProfileController::exportPdf
 * @see app/Http/Controllers/Admin/AdminResidentProfileController.php:362
 * @route '/admin/resident-profiles/export-pdf'
 */
    const exportPdfForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: exportPdf.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminResidentProfileController::exportPdf
 * @see app/Http/Controllers/Admin/AdminResidentProfileController.php:362
 * @route '/admin/resident-profiles/export-pdf'
 */
        exportPdfForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportPdf.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\AdminResidentProfileController::exportPdf
 * @see app/Http/Controllers/Admin/AdminResidentProfileController.php:362
 * @route '/admin/resident-profiles/export-pdf'
 */
        exportPdfForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportPdf.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    exportPdf.form = exportPdfForm
/**
* @see \App\Http\Controllers\Admin\AdminResidentProfileController::show
 * @see app/Http/Controllers/Admin/AdminResidentProfileController.php:387
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
 * @see app/Http/Controllers/Admin/AdminResidentProfileController.php:387
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
 * @see app/Http/Controllers/Admin/AdminResidentProfileController.php:387
 * @route '/admin/resident-profiles/{residentProfile}'
 */
show.get = (args: { residentProfile: number | { id: number } } | [residentProfile: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\AdminResidentProfileController::show
 * @see app/Http/Controllers/Admin/AdminResidentProfileController.php:387
 * @route '/admin/resident-profiles/{residentProfile}'
 */
show.head = (args: { residentProfile: number | { id: number } } | [residentProfile: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\AdminResidentProfileController::show
 * @see app/Http/Controllers/Admin/AdminResidentProfileController.php:387
 * @route '/admin/resident-profiles/{residentProfile}'
 */
    const showForm = (args: { residentProfile: number | { id: number } } | [residentProfile: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminResidentProfileController::show
 * @see app/Http/Controllers/Admin/AdminResidentProfileController.php:387
 * @route '/admin/resident-profiles/{residentProfile}'
 */
        showForm.get = (args: { residentProfile: number | { id: number } } | [residentProfile: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\AdminResidentProfileController::show
 * @see app/Http/Controllers/Admin/AdminResidentProfileController.php:387
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
* @see \App\Http\Controllers\Admin\AdminResidentProfileController::exportFormBPdf
 * @see app/Http/Controllers/Admin/AdminResidentProfileController.php:513
 * @route '/admin/resident-profiles/{residentProfile}/export/form-b'
 */
export const exportFormBPdf = (args: { residentProfile: number | { id: number } } | [residentProfile: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportFormBPdf.url(args, options),
    method: 'get',
})

exportFormBPdf.definition = {
    methods: ["get","head"],
    url: '/admin/resident-profiles/{residentProfile}/export/form-b',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AdminResidentProfileController::exportFormBPdf
 * @see app/Http/Controllers/Admin/AdminResidentProfileController.php:513
 * @route '/admin/resident-profiles/{residentProfile}/export/form-b'
 */
exportFormBPdf.url = (args: { residentProfile: number | { id: number } } | [residentProfile: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return exportFormBPdf.definition.url
            .replace('{residentProfile}', parsedArgs.residentProfile.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminResidentProfileController::exportFormBPdf
 * @see app/Http/Controllers/Admin/AdminResidentProfileController.php:513
 * @route '/admin/resident-profiles/{residentProfile}/export/form-b'
 */
exportFormBPdf.get = (args: { residentProfile: number | { id: number } } | [residentProfile: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportFormBPdf.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\AdminResidentProfileController::exportFormBPdf
 * @see app/Http/Controllers/Admin/AdminResidentProfileController.php:513
 * @route '/admin/resident-profiles/{residentProfile}/export/form-b'
 */
exportFormBPdf.head = (args: { residentProfile: number | { id: number } } | [residentProfile: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportFormBPdf.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\AdminResidentProfileController::exportFormBPdf
 * @see app/Http/Controllers/Admin/AdminResidentProfileController.php:513
 * @route '/admin/resident-profiles/{residentProfile}/export/form-b'
 */
    const exportFormBPdfForm = (args: { residentProfile: number | { id: number } } | [residentProfile: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: exportFormBPdf.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminResidentProfileController::exportFormBPdf
 * @see app/Http/Controllers/Admin/AdminResidentProfileController.php:513
 * @route '/admin/resident-profiles/{residentProfile}/export/form-b'
 */
        exportFormBPdfForm.get = (args: { residentProfile: number | { id: number } } | [residentProfile: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportFormBPdf.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\AdminResidentProfileController::exportFormBPdf
 * @see app/Http/Controllers/Admin/AdminResidentProfileController.php:513
 * @route '/admin/resident-profiles/{residentProfile}/export/form-b'
 */
        exportFormBPdfForm.head = (args: { residentProfile: number | { id: number } } | [residentProfile: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportFormBPdf.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    exportFormBPdf.form = exportFormBPdfForm
/**
* @see \App\Http\Controllers\Admin\AdminResidentProfileController::destroy
 * @see app/Http/Controllers/Admin/AdminResidentProfileController.php:488
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
 * @see app/Http/Controllers/Admin/AdminResidentProfileController.php:488
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
 * @see app/Http/Controllers/Admin/AdminResidentProfileController.php:488
 * @route '/admin/resident-profiles/{residentProfile}'
 */
destroy.delete = (args: { residentProfile: number | { id: number } } | [residentProfile: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Admin\AdminResidentProfileController::destroy
 * @see app/Http/Controllers/Admin/AdminResidentProfileController.php:488
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
 * @see app/Http/Controllers/Admin/AdminResidentProfileController.php:488
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
const AdminResidentProfileController = { index, exportPdf, show, exportFormBPdf, destroy }

export default AdminResidentProfileController