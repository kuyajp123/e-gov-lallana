import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
import residents from './residents'
/**
* @see \App\Http\Controllers\Admin\AdminDocumentRequestController::index
 * @see app/Http/Controllers/Admin/AdminDocumentRequestController.php:30
 * @route '/admin/document-requests'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/document-requests',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AdminDocumentRequestController::index
 * @see app/Http/Controllers/Admin/AdminDocumentRequestController.php:30
 * @route '/admin/document-requests'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminDocumentRequestController::index
 * @see app/Http/Controllers/Admin/AdminDocumentRequestController.php:30
 * @route '/admin/document-requests'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\AdminDocumentRequestController::index
 * @see app/Http/Controllers/Admin/AdminDocumentRequestController.php:30
 * @route '/admin/document-requests'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\AdminDocumentRequestController::index
 * @see app/Http/Controllers/Admin/AdminDocumentRequestController.php:30
 * @route '/admin/document-requests'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminDocumentRequestController::index
 * @see app/Http/Controllers/Admin/AdminDocumentRequestController.php:30
 * @route '/admin/document-requests'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\AdminDocumentRequestController::index
 * @see app/Http/Controllers/Admin/AdminDocumentRequestController.php:30
 * @route '/admin/document-requests'
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
* @see \App\Http\Controllers\Admin\AdminDocumentRequestController::createWalkin
 * @see app/Http/Controllers/Admin/AdminDocumentRequestController.php:151
 * @route '/admin/document-requests/walkin'
 */
export const createWalkin = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: createWalkin.url(options),
    method: 'get',
})

createWalkin.definition = {
    methods: ["get","head"],
    url: '/admin/document-requests/walkin',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AdminDocumentRequestController::createWalkin
 * @see app/Http/Controllers/Admin/AdminDocumentRequestController.php:151
 * @route '/admin/document-requests/walkin'
 */
createWalkin.url = (options?: RouteQueryOptions) => {
    return createWalkin.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminDocumentRequestController::createWalkin
 * @see app/Http/Controllers/Admin/AdminDocumentRequestController.php:151
 * @route '/admin/document-requests/walkin'
 */
createWalkin.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: createWalkin.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\AdminDocumentRequestController::createWalkin
 * @see app/Http/Controllers/Admin/AdminDocumentRequestController.php:151
 * @route '/admin/document-requests/walkin'
 */
createWalkin.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: createWalkin.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\AdminDocumentRequestController::createWalkin
 * @see app/Http/Controllers/Admin/AdminDocumentRequestController.php:151
 * @route '/admin/document-requests/walkin'
 */
    const createWalkinForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: createWalkin.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminDocumentRequestController::createWalkin
 * @see app/Http/Controllers/Admin/AdminDocumentRequestController.php:151
 * @route '/admin/document-requests/walkin'
 */
        createWalkinForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: createWalkin.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\AdminDocumentRequestController::createWalkin
 * @see app/Http/Controllers/Admin/AdminDocumentRequestController.php:151
 * @route '/admin/document-requests/walkin'
 */
        createWalkinForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: createWalkin.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    createWalkin.form = createWalkinForm
/**
* @see \App\Http\Controllers\Admin\AdminDocumentRequestController::storeWalkin
 * @see app/Http/Controllers/Admin/AdminDocumentRequestController.php:412
 * @route '/admin/document-requests/walkin'
 */
export const storeWalkin = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeWalkin.url(options),
    method: 'post',
})

storeWalkin.definition = {
    methods: ["post"],
    url: '/admin/document-requests/walkin',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\AdminDocumentRequestController::storeWalkin
 * @see app/Http/Controllers/Admin/AdminDocumentRequestController.php:412
 * @route '/admin/document-requests/walkin'
 */
storeWalkin.url = (options?: RouteQueryOptions) => {
    return storeWalkin.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminDocumentRequestController::storeWalkin
 * @see app/Http/Controllers/Admin/AdminDocumentRequestController.php:412
 * @route '/admin/document-requests/walkin'
 */
storeWalkin.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeWalkin.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\AdminDocumentRequestController::storeWalkin
 * @see app/Http/Controllers/Admin/AdminDocumentRequestController.php:412
 * @route '/admin/document-requests/walkin'
 */
    const storeWalkinForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeWalkin.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminDocumentRequestController::storeWalkin
 * @see app/Http/Controllers/Admin/AdminDocumentRequestController.php:412
 * @route '/admin/document-requests/walkin'
 */
        storeWalkinForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeWalkin.url(options),
            method: 'post',
        })
    
    storeWalkin.form = storeWalkinForm
/**
* @see \App\Http\Controllers\Admin\AdminDocumentRequestController::show
 * @see app/Http/Controllers/Admin/AdminDocumentRequestController.php:175
 * @route '/admin/document-requests/{documentRequest}'
 */
export const show = (args: { documentRequest: number | { id: number } } | [documentRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin/document-requests/{documentRequest}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AdminDocumentRequestController::show
 * @see app/Http/Controllers/Admin/AdminDocumentRequestController.php:175
 * @route '/admin/document-requests/{documentRequest}'
 */
show.url = (args: { documentRequest: number | { id: number } } | [documentRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { documentRequest: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { documentRequest: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    documentRequest: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        documentRequest: typeof args.documentRequest === 'object'
                ? args.documentRequest.id
                : args.documentRequest,
                }

    return show.definition.url
            .replace('{documentRequest}', parsedArgs.documentRequest.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminDocumentRequestController::show
 * @see app/Http/Controllers/Admin/AdminDocumentRequestController.php:175
 * @route '/admin/document-requests/{documentRequest}'
 */
show.get = (args: { documentRequest: number | { id: number } } | [documentRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\AdminDocumentRequestController::show
 * @see app/Http/Controllers/Admin/AdminDocumentRequestController.php:175
 * @route '/admin/document-requests/{documentRequest}'
 */
show.head = (args: { documentRequest: number | { id: number } } | [documentRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\AdminDocumentRequestController::show
 * @see app/Http/Controllers/Admin/AdminDocumentRequestController.php:175
 * @route '/admin/document-requests/{documentRequest}'
 */
    const showForm = (args: { documentRequest: number | { id: number } } | [documentRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminDocumentRequestController::show
 * @see app/Http/Controllers/Admin/AdminDocumentRequestController.php:175
 * @route '/admin/document-requests/{documentRequest}'
 */
        showForm.get = (args: { documentRequest: number | { id: number } } | [documentRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\AdminDocumentRequestController::show
 * @see app/Http/Controllers/Admin/AdminDocumentRequestController.php:175
 * @route '/admin/document-requests/{documentRequest}'
 */
        showForm.head = (args: { documentRequest: number | { id: number } } | [documentRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Admin\AdminDocumentRequestController::pdf
 * @see app/Http/Controllers/Admin/AdminDocumentRequestController.php:331
 * @route '/admin/document-requests/{documentRequest}/pdf'
 */
export const pdf = (args: { documentRequest: number | { id: number } } | [documentRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pdf.url(args, options),
    method: 'get',
})

pdf.definition = {
    methods: ["get","head"],
    url: '/admin/document-requests/{documentRequest}/pdf',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AdminDocumentRequestController::pdf
 * @see app/Http/Controllers/Admin/AdminDocumentRequestController.php:331
 * @route '/admin/document-requests/{documentRequest}/pdf'
 */
pdf.url = (args: { documentRequest: number | { id: number } } | [documentRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { documentRequest: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { documentRequest: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    documentRequest: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        documentRequest: typeof args.documentRequest === 'object'
                ? args.documentRequest.id
                : args.documentRequest,
                }

    return pdf.definition.url
            .replace('{documentRequest}', parsedArgs.documentRequest.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminDocumentRequestController::pdf
 * @see app/Http/Controllers/Admin/AdminDocumentRequestController.php:331
 * @route '/admin/document-requests/{documentRequest}/pdf'
 */
pdf.get = (args: { documentRequest: number | { id: number } } | [documentRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pdf.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\AdminDocumentRequestController::pdf
 * @see app/Http/Controllers/Admin/AdminDocumentRequestController.php:331
 * @route '/admin/document-requests/{documentRequest}/pdf'
 */
pdf.head = (args: { documentRequest: number | { id: number } } | [documentRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: pdf.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\AdminDocumentRequestController::pdf
 * @see app/Http/Controllers/Admin/AdminDocumentRequestController.php:331
 * @route '/admin/document-requests/{documentRequest}/pdf'
 */
    const pdfForm = (args: { documentRequest: number | { id: number } } | [documentRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: pdf.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminDocumentRequestController::pdf
 * @see app/Http/Controllers/Admin/AdminDocumentRequestController.php:331
 * @route '/admin/document-requests/{documentRequest}/pdf'
 */
        pdfForm.get = (args: { documentRequest: number | { id: number } } | [documentRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: pdf.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\AdminDocumentRequestController::pdf
 * @see app/Http/Controllers/Admin/AdminDocumentRequestController.php:331
 * @route '/admin/document-requests/{documentRequest}/pdf'
 */
        pdfForm.head = (args: { documentRequest: number | { id: number } } | [documentRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: pdf.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    pdf.form = pdfForm
/**
* @see \App\Http\Controllers\Admin\AdminDocumentRequestController::updateStatus
 * @see app/Http/Controllers/Admin/AdminDocumentRequestController.php:287
 * @route '/admin/document-requests/{documentRequest}/status'
 */
export const updateStatus = (args: { documentRequest: number | { id: number } } | [documentRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateStatus.url(args, options),
    method: 'patch',
})

updateStatus.definition = {
    methods: ["patch"],
    url: '/admin/document-requests/{documentRequest}/status',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Admin\AdminDocumentRequestController::updateStatus
 * @see app/Http/Controllers/Admin/AdminDocumentRequestController.php:287
 * @route '/admin/document-requests/{documentRequest}/status'
 */
updateStatus.url = (args: { documentRequest: number | { id: number } } | [documentRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { documentRequest: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { documentRequest: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    documentRequest: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        documentRequest: typeof args.documentRequest === 'object'
                ? args.documentRequest.id
                : args.documentRequest,
                }

    return updateStatus.definition.url
            .replace('{documentRequest}', parsedArgs.documentRequest.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminDocumentRequestController::updateStatus
 * @see app/Http/Controllers/Admin/AdminDocumentRequestController.php:287
 * @route '/admin/document-requests/{documentRequest}/status'
 */
updateStatus.patch = (args: { documentRequest: number | { id: number } } | [documentRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateStatus.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Admin\AdminDocumentRequestController::updateStatus
 * @see app/Http/Controllers/Admin/AdminDocumentRequestController.php:287
 * @route '/admin/document-requests/{documentRequest}/status'
 */
    const updateStatusForm = (args: { documentRequest: number | { id: number } } | [documentRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateStatus.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminDocumentRequestController::updateStatus
 * @see app/Http/Controllers/Admin/AdminDocumentRequestController.php:287
 * @route '/admin/document-requests/{documentRequest}/status'
 */
        updateStatusForm.patch = (args: { documentRequest: number | { id: number } } | [documentRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Admin\AdminDocumentRequestController::updatePayment
 * @see app/Http/Controllers/Admin/AdminDocumentRequestController.php:304
 * @route '/admin/document-requests/{documentRequest}/payment'
 */
export const updatePayment = (args: { documentRequest: number | { id: number } } | [documentRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updatePayment.url(args, options),
    method: 'patch',
})

updatePayment.definition = {
    methods: ["patch"],
    url: '/admin/document-requests/{documentRequest}/payment',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Admin\AdminDocumentRequestController::updatePayment
 * @see app/Http/Controllers/Admin/AdminDocumentRequestController.php:304
 * @route '/admin/document-requests/{documentRequest}/payment'
 */
updatePayment.url = (args: { documentRequest: number | { id: number } } | [documentRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { documentRequest: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { documentRequest: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    documentRequest: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        documentRequest: typeof args.documentRequest === 'object'
                ? args.documentRequest.id
                : args.documentRequest,
                }

    return updatePayment.definition.url
            .replace('{documentRequest}', parsedArgs.documentRequest.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminDocumentRequestController::updatePayment
 * @see app/Http/Controllers/Admin/AdminDocumentRequestController.php:304
 * @route '/admin/document-requests/{documentRequest}/payment'
 */
updatePayment.patch = (args: { documentRequest: number | { id: number } } | [documentRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updatePayment.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Admin\AdminDocumentRequestController::updatePayment
 * @see app/Http/Controllers/Admin/AdminDocumentRequestController.php:304
 * @route '/admin/document-requests/{documentRequest}/payment'
 */
    const updatePaymentForm = (args: { documentRequest: number | { id: number } } | [documentRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updatePayment.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminDocumentRequestController::updatePayment
 * @see app/Http/Controllers/Admin/AdminDocumentRequestController.php:304
 * @route '/admin/document-requests/{documentRequest}/payment'
 */
        updatePaymentForm.patch = (args: { documentRequest: number | { id: number } } | [documentRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updatePayment.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updatePayment.form = updatePaymentForm
/**
* @see \App\Http\Controllers\Admin\AdminDocumentRequestController::updateNotes
 * @see app/Http/Controllers/Admin/AdminDocumentRequestController.php:317
 * @route '/admin/document-requests/{documentRequest}/notes'
 */
export const updateNotes = (args: { documentRequest: number | { id: number } } | [documentRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateNotes.url(args, options),
    method: 'patch',
})

updateNotes.definition = {
    methods: ["patch"],
    url: '/admin/document-requests/{documentRequest}/notes',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Admin\AdminDocumentRequestController::updateNotes
 * @see app/Http/Controllers/Admin/AdminDocumentRequestController.php:317
 * @route '/admin/document-requests/{documentRequest}/notes'
 */
updateNotes.url = (args: { documentRequest: number | { id: number } } | [documentRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { documentRequest: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { documentRequest: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    documentRequest: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        documentRequest: typeof args.documentRequest === 'object'
                ? args.documentRequest.id
                : args.documentRequest,
                }

    return updateNotes.definition.url
            .replace('{documentRequest}', parsedArgs.documentRequest.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminDocumentRequestController::updateNotes
 * @see app/Http/Controllers/Admin/AdminDocumentRequestController.php:317
 * @route '/admin/document-requests/{documentRequest}/notes'
 */
updateNotes.patch = (args: { documentRequest: number | { id: number } } | [documentRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateNotes.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Admin\AdminDocumentRequestController::updateNotes
 * @see app/Http/Controllers/Admin/AdminDocumentRequestController.php:317
 * @route '/admin/document-requests/{documentRequest}/notes'
 */
    const updateNotesForm = (args: { documentRequest: number | { id: number } } | [documentRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateNotes.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminDocumentRequestController::updateNotes
 * @see app/Http/Controllers/Admin/AdminDocumentRequestController.php:317
 * @route '/admin/document-requests/{documentRequest}/notes'
 */
        updateNotesForm.patch = (args: { documentRequest: number | { id: number } } | [documentRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateNotes.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateNotes.form = updateNotesForm
const documentRequests = {
    index: Object.assign(index, index),
createWalkin: Object.assign(createWalkin, createWalkin),
storeWalkin: Object.assign(storeWalkin, storeWalkin),
residents: Object.assign(residents, residents),
show: Object.assign(show, show),
pdf: Object.assign(pdf, pdf),
updateStatus: Object.assign(updateStatus, updateStatus),
updatePayment: Object.assign(updatePayment, updatePayment),
updateNotes: Object.assign(updateNotes, updateNotes),
}

export default documentRequests