import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Document\DocumentRequestController::index
 * @see app/Http/Controllers/Document/DocumentRequestController.php:28
 * @route '/documents'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/documents',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Document\DocumentRequestController::index
 * @see app/Http/Controllers/Document/DocumentRequestController.php:28
 * @route '/documents'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Document\DocumentRequestController::index
 * @see app/Http/Controllers/Document/DocumentRequestController.php:28
 * @route '/documents'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Document\DocumentRequestController::index
 * @see app/Http/Controllers/Document/DocumentRequestController.php:28
 * @route '/documents'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Document\DocumentRequestController::index
 * @see app/Http/Controllers/Document/DocumentRequestController.php:28
 * @route '/documents'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Document\DocumentRequestController::index
 * @see app/Http/Controllers/Document/DocumentRequestController.php:28
 * @route '/documents'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Document\DocumentRequestController::index
 * @see app/Http/Controllers/Document/DocumentRequestController.php:28
 * @route '/documents'
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
* @see \App\Http\Controllers\Document\DocumentRequestController::show
 * @see app/Http/Controllers/Document/DocumentRequestController.php:188
 * @route '/documents/{documentRequest}'
 */
export const show = (args: { documentRequest: number | { id: number } } | [documentRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/documents/{documentRequest}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Document\DocumentRequestController::show
 * @see app/Http/Controllers/Document/DocumentRequestController.php:188
 * @route '/documents/{documentRequest}'
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
* @see \App\Http\Controllers\Document\DocumentRequestController::show
 * @see app/Http/Controllers/Document/DocumentRequestController.php:188
 * @route '/documents/{documentRequest}'
 */
show.get = (args: { documentRequest: number | { id: number } } | [documentRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Document\DocumentRequestController::show
 * @see app/Http/Controllers/Document/DocumentRequestController.php:188
 * @route '/documents/{documentRequest}'
 */
show.head = (args: { documentRequest: number | { id: number } } | [documentRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Document\DocumentRequestController::show
 * @see app/Http/Controllers/Document/DocumentRequestController.php:188
 * @route '/documents/{documentRequest}'
 */
    const showForm = (args: { documentRequest: number | { id: number } } | [documentRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Document\DocumentRequestController::show
 * @see app/Http/Controllers/Document/DocumentRequestController.php:188
 * @route '/documents/{documentRequest}'
 */
        showForm.get = (args: { documentRequest: number | { id: number } } | [documentRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Document\DocumentRequestController::show
 * @see app/Http/Controllers/Document/DocumentRequestController.php:188
 * @route '/documents/{documentRequest}'
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
* @see \App\Http\Controllers\Document\DocumentRequestController::create
 * @see app/Http/Controllers/Document/DocumentRequestController.php:78
 * @route '/documents/create/{documentType}'
 */
export const create = (args: { documentType: string | { slug: string } } | [documentType: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(args, options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/documents/create/{documentType}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Document\DocumentRequestController::create
 * @see app/Http/Controllers/Document/DocumentRequestController.php:78
 * @route '/documents/create/{documentType}'
 */
create.url = (args: { documentType: string | { slug: string } } | [documentType: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { documentType: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'slug' in args) {
            args = { documentType: args.slug }
        }
    
    if (Array.isArray(args)) {
        args = {
                    documentType: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        documentType: typeof args.documentType === 'object'
                ? args.documentType.slug
                : args.documentType,
                }

    return create.definition.url
            .replace('{documentType}', parsedArgs.documentType.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Document\DocumentRequestController::create
 * @see app/Http/Controllers/Document/DocumentRequestController.php:78
 * @route '/documents/create/{documentType}'
 */
create.get = (args: { documentType: string | { slug: string } } | [documentType: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Document\DocumentRequestController::create
 * @see app/Http/Controllers/Document/DocumentRequestController.php:78
 * @route '/documents/create/{documentType}'
 */
create.head = (args: { documentType: string | { slug: string } } | [documentType: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Document\DocumentRequestController::create
 * @see app/Http/Controllers/Document/DocumentRequestController.php:78
 * @route '/documents/create/{documentType}'
 */
    const createForm = (args: { documentType: string | { slug: string } } | [documentType: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Document\DocumentRequestController::create
 * @see app/Http/Controllers/Document/DocumentRequestController.php:78
 * @route '/documents/create/{documentType}'
 */
        createForm.get = (args: { documentType: string | { slug: string } } | [documentType: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Document\DocumentRequestController::create
 * @see app/Http/Controllers/Document/DocumentRequestController.php:78
 * @route '/documents/create/{documentType}'
 */
        createForm.head = (args: { documentType: string | { slug: string } } | [documentType: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    create.form = createForm
/**
* @see \App\Http\Controllers\Document\DocumentRequestController::store
 * @see app/Http/Controllers/Document/DocumentRequestController.php:109
 * @route '/documents'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/documents',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Document\DocumentRequestController::store
 * @see app/Http/Controllers/Document/DocumentRequestController.php:109
 * @route '/documents'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Document\DocumentRequestController::store
 * @see app/Http/Controllers/Document/DocumentRequestController.php:109
 * @route '/documents'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Document\DocumentRequestController::store
 * @see app/Http/Controllers/Document/DocumentRequestController.php:109
 * @route '/documents'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Document\DocumentRequestController::store
 * @see app/Http/Controllers/Document/DocumentRequestController.php:109
 * @route '/documents'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Document\DocumentRequestController::edit
 * @see app/Http/Controllers/Document/DocumentRequestController.php:265
 * @route '/documents/{documentRequest}/edit'
 */
export const edit = (args: { documentRequest: number | { id: number } } | [documentRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/documents/{documentRequest}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Document\DocumentRequestController::edit
 * @see app/Http/Controllers/Document/DocumentRequestController.php:265
 * @route '/documents/{documentRequest}/edit'
 */
edit.url = (args: { documentRequest: number | { id: number } } | [documentRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return edit.definition.url
            .replace('{documentRequest}', parsedArgs.documentRequest.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Document\DocumentRequestController::edit
 * @see app/Http/Controllers/Document/DocumentRequestController.php:265
 * @route '/documents/{documentRequest}/edit'
 */
edit.get = (args: { documentRequest: number | { id: number } } | [documentRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Document\DocumentRequestController::edit
 * @see app/Http/Controllers/Document/DocumentRequestController.php:265
 * @route '/documents/{documentRequest}/edit'
 */
edit.head = (args: { documentRequest: number | { id: number } } | [documentRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Document\DocumentRequestController::edit
 * @see app/Http/Controllers/Document/DocumentRequestController.php:265
 * @route '/documents/{documentRequest}/edit'
 */
    const editForm = (args: { documentRequest: number | { id: number } } | [documentRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Document\DocumentRequestController::edit
 * @see app/Http/Controllers/Document/DocumentRequestController.php:265
 * @route '/documents/{documentRequest}/edit'
 */
        editForm.get = (args: { documentRequest: number | { id: number } } | [documentRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Document\DocumentRequestController::edit
 * @see app/Http/Controllers/Document/DocumentRequestController.php:265
 * @route '/documents/{documentRequest}/edit'
 */
        editForm.head = (args: { documentRequest: number | { id: number } } | [documentRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    edit.form = editForm
/**
* @see \App\Http\Controllers\Document\DocumentRequestController::update
 * @see app/Http/Controllers/Document/DocumentRequestController.php:301
 * @route '/documents/{documentRequest}'
 */
export const update = (args: { documentRequest: number | { id: number } } | [documentRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/documents/{documentRequest}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Document\DocumentRequestController::update
 * @see app/Http/Controllers/Document/DocumentRequestController.php:301
 * @route '/documents/{documentRequest}'
 */
update.url = (args: { documentRequest: number | { id: number } } | [documentRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return update.definition.url
            .replace('{documentRequest}', parsedArgs.documentRequest.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Document\DocumentRequestController::update
 * @see app/Http/Controllers/Document/DocumentRequestController.php:301
 * @route '/documents/{documentRequest}'
 */
update.put = (args: { documentRequest: number | { id: number } } | [documentRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Document\DocumentRequestController::update
 * @see app/Http/Controllers/Document/DocumentRequestController.php:301
 * @route '/documents/{documentRequest}'
 */
    const updateForm = (args: { documentRequest: number | { id: number } } | [documentRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Document\DocumentRequestController::update
 * @see app/Http/Controllers/Document/DocumentRequestController.php:301
 * @route '/documents/{documentRequest}'
 */
        updateForm.put = (args: { documentRequest: number | { id: number } } | [documentRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Document\DocumentRequestController::cancel
 * @see app/Http/Controllers/Document/DocumentRequestController.php:359
 * @route '/documents/{documentRequest}/cancel'
 */
export const cancel = (args: { documentRequest: number | { id: number } } | [documentRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancel.url(args, options),
    method: 'post',
})

cancel.definition = {
    methods: ["post"],
    url: '/documents/{documentRequest}/cancel',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Document\DocumentRequestController::cancel
 * @see app/Http/Controllers/Document/DocumentRequestController.php:359
 * @route '/documents/{documentRequest}/cancel'
 */
cancel.url = (args: { documentRequest: number | { id: number } } | [documentRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return cancel.definition.url
            .replace('{documentRequest}', parsedArgs.documentRequest.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Document\DocumentRequestController::cancel
 * @see app/Http/Controllers/Document/DocumentRequestController.php:359
 * @route '/documents/{documentRequest}/cancel'
 */
cancel.post = (args: { documentRequest: number | { id: number } } | [documentRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancel.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Document\DocumentRequestController::cancel
 * @see app/Http/Controllers/Document/DocumentRequestController.php:359
 * @route '/documents/{documentRequest}/cancel'
 */
    const cancelForm = (args: { documentRequest: number | { id: number } } | [documentRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: cancel.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Document\DocumentRequestController::cancel
 * @see app/Http/Controllers/Document/DocumentRequestController.php:359
 * @route '/documents/{documentRequest}/cancel'
 */
        cancelForm.post = (args: { documentRequest: number | { id: number } } | [documentRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: cancel.url(args, options),
            method: 'post',
        })
    
    cancel.form = cancelForm
const DocumentRequestController = { index, show, create, store, edit, update, cancel }

export default DocumentRequestController