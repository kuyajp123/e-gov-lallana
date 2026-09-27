import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\AdminHouseholdController::index
 * @see app/Http/Controllers/Admin/AdminHouseholdController.php:39
 * @route '/admin/households'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/households',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AdminHouseholdController::index
 * @see app/Http/Controllers/Admin/AdminHouseholdController.php:39
 * @route '/admin/households'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminHouseholdController::index
 * @see app/Http/Controllers/Admin/AdminHouseholdController.php:39
 * @route '/admin/households'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\AdminHouseholdController::index
 * @see app/Http/Controllers/Admin/AdminHouseholdController.php:39
 * @route '/admin/households'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\AdminHouseholdController::index
 * @see app/Http/Controllers/Admin/AdminHouseholdController.php:39
 * @route '/admin/households'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminHouseholdController::index
 * @see app/Http/Controllers/Admin/AdminHouseholdController.php:39
 * @route '/admin/households'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\AdminHouseholdController::index
 * @see app/Http/Controllers/Admin/AdminHouseholdController.php:39
 * @route '/admin/households'
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
* @see \App\Http\Controllers\Admin\AdminHouseholdController::exportRbiPdf
 * @see app/Http/Controllers/Admin/AdminHouseholdController.php:469
 * @route '/admin/households/export/rbi-pdf'
 */
export const exportRbiPdf = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportRbiPdf.url(options),
    method: 'get',
})

exportRbiPdf.definition = {
    methods: ["get","head"],
    url: '/admin/households/export/rbi-pdf',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AdminHouseholdController::exportRbiPdf
 * @see app/Http/Controllers/Admin/AdminHouseholdController.php:469
 * @route '/admin/households/export/rbi-pdf'
 */
exportRbiPdf.url = (options?: RouteQueryOptions) => {
    return exportRbiPdf.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminHouseholdController::exportRbiPdf
 * @see app/Http/Controllers/Admin/AdminHouseholdController.php:469
 * @route '/admin/households/export/rbi-pdf'
 */
exportRbiPdf.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportRbiPdf.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\AdminHouseholdController::exportRbiPdf
 * @see app/Http/Controllers/Admin/AdminHouseholdController.php:469
 * @route '/admin/households/export/rbi-pdf'
 */
exportRbiPdf.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportRbiPdf.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\AdminHouseholdController::exportRbiPdf
 * @see app/Http/Controllers/Admin/AdminHouseholdController.php:469
 * @route '/admin/households/export/rbi-pdf'
 */
    const exportRbiPdfForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: exportRbiPdf.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminHouseholdController::exportRbiPdf
 * @see app/Http/Controllers/Admin/AdminHouseholdController.php:469
 * @route '/admin/households/export/rbi-pdf'
 */
        exportRbiPdfForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportRbiPdf.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\AdminHouseholdController::exportRbiPdf
 * @see app/Http/Controllers/Admin/AdminHouseholdController.php:469
 * @route '/admin/households/export/rbi-pdf'
 */
        exportRbiPdfForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportRbiPdf.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    exportRbiPdf.form = exportRbiPdfForm
/**
* @see \App\Http\Controllers\Admin\AdminHouseholdController::show
 * @see app/Http/Controllers/Admin/AdminHouseholdController.php:144
 * @route '/admin/households/{household}'
 */
export const show = (args: { household: number | { id: number } } | [household: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin/households/{household}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AdminHouseholdController::show
 * @see app/Http/Controllers/Admin/AdminHouseholdController.php:144
 * @route '/admin/households/{household}'
 */
show.url = (args: { household: number | { id: number } } | [household: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { household: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { household: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    household: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        household: typeof args.household === 'object'
                ? args.household.id
                : args.household,
                }

    return show.definition.url
            .replace('{household}', parsedArgs.household.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminHouseholdController::show
 * @see app/Http/Controllers/Admin/AdminHouseholdController.php:144
 * @route '/admin/households/{household}'
 */
show.get = (args: { household: number | { id: number } } | [household: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\AdminHouseholdController::show
 * @see app/Http/Controllers/Admin/AdminHouseholdController.php:144
 * @route '/admin/households/{household}'
 */
show.head = (args: { household: number | { id: number } } | [household: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\AdminHouseholdController::show
 * @see app/Http/Controllers/Admin/AdminHouseholdController.php:144
 * @route '/admin/households/{household}'
 */
    const showForm = (args: { household: number | { id: number } } | [household: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminHouseholdController::show
 * @see app/Http/Controllers/Admin/AdminHouseholdController.php:144
 * @route '/admin/households/{household}'
 */
        showForm.get = (args: { household: number | { id: number } } | [household: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\AdminHouseholdController::show
 * @see app/Http/Controllers/Admin/AdminHouseholdController.php:144
 * @route '/admin/households/{household}'
 */
        showForm.head = (args: { household: number | { id: number } } | [household: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Admin\AdminHouseholdController::verify
 * @see app/Http/Controllers/Admin/AdminHouseholdController.php:261
 * @route '/admin/households/{household}/verify'
 */
export const verify = (args: { household: number | { id: number } } | [household: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verify.url(args, options),
    method: 'post',
})

verify.definition = {
    methods: ["post"],
    url: '/admin/households/{household}/verify',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\AdminHouseholdController::verify
 * @see app/Http/Controllers/Admin/AdminHouseholdController.php:261
 * @route '/admin/households/{household}/verify'
 */
verify.url = (args: { household: number | { id: number } } | [household: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { household: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { household: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    household: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        household: typeof args.household === 'object'
                ? args.household.id
                : args.household,
                }

    return verify.definition.url
            .replace('{household}', parsedArgs.household.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminHouseholdController::verify
 * @see app/Http/Controllers/Admin/AdminHouseholdController.php:261
 * @route '/admin/households/{household}/verify'
 */
verify.post = (args: { household: number | { id: number } } | [household: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verify.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\AdminHouseholdController::verify
 * @see app/Http/Controllers/Admin/AdminHouseholdController.php:261
 * @route '/admin/households/{household}/verify'
 */
    const verifyForm = (args: { household: number | { id: number } } | [household: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: verify.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminHouseholdController::verify
 * @see app/Http/Controllers/Admin/AdminHouseholdController.php:261
 * @route '/admin/households/{household}/verify'
 */
        verifyForm.post = (args: { household: number | { id: number } } | [household: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: verify.url(args, options),
            method: 'post',
        })
    
    verify.form = verifyForm
/**
* @see \App\Http\Controllers\Admin\AdminHouseholdController::restrict
 * @see app/Http/Controllers/Admin/AdminHouseholdController.php:357
 * @route '/admin/households/{household}/restrict'
 */
export const restrict = (args: { household: number | { id: number } } | [household: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: restrict.url(args, options),
    method: 'post',
})

restrict.definition = {
    methods: ["post"],
    url: '/admin/households/{household}/restrict',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\AdminHouseholdController::restrict
 * @see app/Http/Controllers/Admin/AdminHouseholdController.php:357
 * @route '/admin/households/{household}/restrict'
 */
restrict.url = (args: { household: number | { id: number } } | [household: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { household: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { household: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    household: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        household: typeof args.household === 'object'
                ? args.household.id
                : args.household,
                }

    return restrict.definition.url
            .replace('{household}', parsedArgs.household.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminHouseholdController::restrict
 * @see app/Http/Controllers/Admin/AdminHouseholdController.php:357
 * @route '/admin/households/{household}/restrict'
 */
restrict.post = (args: { household: number | { id: number } } | [household: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: restrict.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\AdminHouseholdController::restrict
 * @see app/Http/Controllers/Admin/AdminHouseholdController.php:357
 * @route '/admin/households/{household}/restrict'
 */
    const restrictForm = (args: { household: number | { id: number } } | [household: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: restrict.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminHouseholdController::restrict
 * @see app/Http/Controllers/Admin/AdminHouseholdController.php:357
 * @route '/admin/households/{household}/restrict'
 */
        restrictForm.post = (args: { household: number | { id: number } } | [household: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: restrict.url(args, options),
            method: 'post',
        })
    
    restrict.form = restrictForm
/**
* @see \App\Http\Controllers\Admin\AdminHouseholdController::archive
 * @see app/Http/Controllers/Admin/AdminHouseholdController.php:432
 * @route '/admin/households/{household}/archive'
 */
export const archive = (args: { household: number | { id: number } } | [household: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: archive.url(args, options),
    method: 'post',
})

archive.definition = {
    methods: ["post"],
    url: '/admin/households/{household}/archive',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\AdminHouseholdController::archive
 * @see app/Http/Controllers/Admin/AdminHouseholdController.php:432
 * @route '/admin/households/{household}/archive'
 */
archive.url = (args: { household: number | { id: number } } | [household: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { household: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { household: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    household: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        household: typeof args.household === 'object'
                ? args.household.id
                : args.household,
                }

    return archive.definition.url
            .replace('{household}', parsedArgs.household.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminHouseholdController::archive
 * @see app/Http/Controllers/Admin/AdminHouseholdController.php:432
 * @route '/admin/households/{household}/archive'
 */
archive.post = (args: { household: number | { id: number } } | [household: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: archive.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\AdminHouseholdController::archive
 * @see app/Http/Controllers/Admin/AdminHouseholdController.php:432
 * @route '/admin/households/{household}/archive'
 */
    const archiveForm = (args: { household: number | { id: number } } | [household: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: archive.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminHouseholdController::archive
 * @see app/Http/Controllers/Admin/AdminHouseholdController.php:432
 * @route '/admin/households/{household}/archive'
 */
        archiveForm.post = (args: { household: number | { id: number } } | [household: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: archive.url(args, options),
            method: 'post',
        })
    
    archive.form = archiveForm
/**
* @see \App\Http\Controllers\Admin\AdminHouseholdController::transferHead
 * @see app/Http/Controllers/Admin/AdminHouseholdController.php:455
 * @route '/admin/households/{household}/transfer-head'
 */
export const transferHead = (args: { household: number | { id: number } } | [household: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: transferHead.url(args, options),
    method: 'post',
})

transferHead.definition = {
    methods: ["post"],
    url: '/admin/households/{household}/transfer-head',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\AdminHouseholdController::transferHead
 * @see app/Http/Controllers/Admin/AdminHouseholdController.php:455
 * @route '/admin/households/{household}/transfer-head'
 */
transferHead.url = (args: { household: number | { id: number } } | [household: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { household: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { household: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    household: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        household: typeof args.household === 'object'
                ? args.household.id
                : args.household,
                }

    return transferHead.definition.url
            .replace('{household}', parsedArgs.household.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminHouseholdController::transferHead
 * @see app/Http/Controllers/Admin/AdminHouseholdController.php:455
 * @route '/admin/households/{household}/transfer-head'
 */
transferHead.post = (args: { household: number | { id: number } } | [household: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: transferHead.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\AdminHouseholdController::transferHead
 * @see app/Http/Controllers/Admin/AdminHouseholdController.php:455
 * @route '/admin/households/{household}/transfer-head'
 */
    const transferHeadForm = (args: { household: number | { id: number } } | [household: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: transferHead.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminHouseholdController::transferHead
 * @see app/Http/Controllers/Admin/AdminHouseholdController.php:455
 * @route '/admin/households/{household}/transfer-head'
 */
        transferHeadForm.post = (args: { household: number | { id: number } } | [household: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: transferHead.url(args, options),
            method: 'post',
        })
    
    transferHead.form = transferHeadForm
const households = {
    index: Object.assign(index, index),
exportRbiPdf: Object.assign(exportRbiPdf, exportRbiPdf),
show: Object.assign(show, show),
verify: Object.assign(verify, verify),
restrict: Object.assign(restrict, restrict),
archive: Object.assign(archive, archive),
transferHead: Object.assign(transferHead, transferHead),
}

export default households