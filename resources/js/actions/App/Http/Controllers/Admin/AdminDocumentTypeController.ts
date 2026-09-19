import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\AdminDocumentTypeController::index
 * @see app/Http/Controllers/Admin/AdminDocumentTypeController.php:19
 * @route '/admin/document-types'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/document-types',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AdminDocumentTypeController::index
 * @see app/Http/Controllers/Admin/AdminDocumentTypeController.php:19
 * @route '/admin/document-types'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminDocumentTypeController::index
 * @see app/Http/Controllers/Admin/AdminDocumentTypeController.php:19
 * @route '/admin/document-types'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\AdminDocumentTypeController::index
 * @see app/Http/Controllers/Admin/AdminDocumentTypeController.php:19
 * @route '/admin/document-types'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\AdminDocumentTypeController::index
 * @see app/Http/Controllers/Admin/AdminDocumentTypeController.php:19
 * @route '/admin/document-types'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminDocumentTypeController::index
 * @see app/Http/Controllers/Admin/AdminDocumentTypeController.php:19
 * @route '/admin/document-types'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\AdminDocumentTypeController::index
 * @see app/Http/Controllers/Admin/AdminDocumentTypeController.php:19
 * @route '/admin/document-types'
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
* @see \App\Http\Controllers\Admin\AdminDocumentTypeController::create
 * @see app/Http/Controllers/Admin/AdminDocumentTypeController.php:87
 * @route '/admin/document-types/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/admin/document-types/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AdminDocumentTypeController::create
 * @see app/Http/Controllers/Admin/AdminDocumentTypeController.php:87
 * @route '/admin/document-types/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminDocumentTypeController::create
 * @see app/Http/Controllers/Admin/AdminDocumentTypeController.php:87
 * @route '/admin/document-types/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\AdminDocumentTypeController::create
 * @see app/Http/Controllers/Admin/AdminDocumentTypeController.php:87
 * @route '/admin/document-types/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\AdminDocumentTypeController::create
 * @see app/Http/Controllers/Admin/AdminDocumentTypeController.php:87
 * @route '/admin/document-types/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminDocumentTypeController::create
 * @see app/Http/Controllers/Admin/AdminDocumentTypeController.php:87
 * @route '/admin/document-types/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\AdminDocumentTypeController::create
 * @see app/Http/Controllers/Admin/AdminDocumentTypeController.php:87
 * @route '/admin/document-types/create'
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
* @see \App\Http\Controllers\Admin\AdminDocumentTypeController::store
 * @see app/Http/Controllers/Admin/AdminDocumentTypeController.php:95
 * @route '/admin/document-types'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/document-types',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\AdminDocumentTypeController::store
 * @see app/Http/Controllers/Admin/AdminDocumentTypeController.php:95
 * @route '/admin/document-types'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminDocumentTypeController::store
 * @see app/Http/Controllers/Admin/AdminDocumentTypeController.php:95
 * @route '/admin/document-types'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\AdminDocumentTypeController::store
 * @see app/Http/Controllers/Admin/AdminDocumentTypeController.php:95
 * @route '/admin/document-types'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminDocumentTypeController::store
 * @see app/Http/Controllers/Admin/AdminDocumentTypeController.php:95
 * @route '/admin/document-types'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Admin\AdminDocumentTypeController::edit
 * @see app/Http/Controllers/Admin/AdminDocumentTypeController.php:117
 * @route '/admin/document-types/{documentType}/edit'
 */
export const edit = (args: { documentType: number | { id: number } } | [documentType: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/admin/document-types/{documentType}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AdminDocumentTypeController::edit
 * @see app/Http/Controllers/Admin/AdminDocumentTypeController.php:117
 * @route '/admin/document-types/{documentType}/edit'
 */
edit.url = (args: { documentType: number | { id: number } } | [documentType: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { documentType: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { documentType: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    documentType: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        documentType: typeof args.documentType === 'object'
                ? args.documentType.id
                : args.documentType,
                }

    return edit.definition.url
            .replace('{documentType}', parsedArgs.documentType.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminDocumentTypeController::edit
 * @see app/Http/Controllers/Admin/AdminDocumentTypeController.php:117
 * @route '/admin/document-types/{documentType}/edit'
 */
edit.get = (args: { documentType: number | { id: number } } | [documentType: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\AdminDocumentTypeController::edit
 * @see app/Http/Controllers/Admin/AdminDocumentTypeController.php:117
 * @route '/admin/document-types/{documentType}/edit'
 */
edit.head = (args: { documentType: number | { id: number } } | [documentType: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\AdminDocumentTypeController::edit
 * @see app/Http/Controllers/Admin/AdminDocumentTypeController.php:117
 * @route '/admin/document-types/{documentType}/edit'
 */
    const editForm = (args: { documentType: number | { id: number } } | [documentType: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminDocumentTypeController::edit
 * @see app/Http/Controllers/Admin/AdminDocumentTypeController.php:117
 * @route '/admin/document-types/{documentType}/edit'
 */
        editForm.get = (args: { documentType: number | { id: number } } | [documentType: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\AdminDocumentTypeController::edit
 * @see app/Http/Controllers/Admin/AdminDocumentTypeController.php:117
 * @route '/admin/document-types/{documentType}/edit'
 */
        editForm.head = (args: { documentType: number | { id: number } } | [documentType: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Admin\AdminDocumentTypeController::update
 * @see app/Http/Controllers/Admin/AdminDocumentTypeController.php:141
 * @route '/admin/document-types/{documentType}'
 */
export const update = (args: { documentType: number | { id: number } } | [documentType: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/admin/document-types/{documentType}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\AdminDocumentTypeController::update
 * @see app/Http/Controllers/Admin/AdminDocumentTypeController.php:141
 * @route '/admin/document-types/{documentType}'
 */
update.url = (args: { documentType: number | { id: number } } | [documentType: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { documentType: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { documentType: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    documentType: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        documentType: typeof args.documentType === 'object'
                ? args.documentType.id
                : args.documentType,
                }

    return update.definition.url
            .replace('{documentType}', parsedArgs.documentType.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminDocumentTypeController::update
 * @see app/Http/Controllers/Admin/AdminDocumentTypeController.php:141
 * @route '/admin/document-types/{documentType}'
 */
update.put = (args: { documentType: number | { id: number } } | [documentType: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Admin\AdminDocumentTypeController::update
 * @see app/Http/Controllers/Admin/AdminDocumentTypeController.php:141
 * @route '/admin/document-types/{documentType}'
 */
    const updateForm = (args: { documentType: number | { id: number } } | [documentType: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminDocumentTypeController::update
 * @see app/Http/Controllers/Admin/AdminDocumentTypeController.php:141
 * @route '/admin/document-types/{documentType}'
 */
        updateForm.put = (args: { documentType: number | { id: number } } | [documentType: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Admin\AdminDocumentTypeController::toggleActive
 * @see app/Http/Controllers/Admin/AdminDocumentTypeController.php:163
 * @route '/admin/document-types/{documentType}/toggle'
 */
export const toggleActive = (args: { documentType: number | { id: number } } | [documentType: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleActive.url(args, options),
    method: 'post',
})

toggleActive.definition = {
    methods: ["post"],
    url: '/admin/document-types/{documentType}/toggle',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\AdminDocumentTypeController::toggleActive
 * @see app/Http/Controllers/Admin/AdminDocumentTypeController.php:163
 * @route '/admin/document-types/{documentType}/toggle'
 */
toggleActive.url = (args: { documentType: number | { id: number } } | [documentType: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { documentType: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { documentType: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    documentType: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        documentType: typeof args.documentType === 'object'
                ? args.documentType.id
                : args.documentType,
                }

    return toggleActive.definition.url
            .replace('{documentType}', parsedArgs.documentType.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminDocumentTypeController::toggleActive
 * @see app/Http/Controllers/Admin/AdminDocumentTypeController.php:163
 * @route '/admin/document-types/{documentType}/toggle'
 */
toggleActive.post = (args: { documentType: number | { id: number } } | [documentType: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleActive.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\AdminDocumentTypeController::toggleActive
 * @see app/Http/Controllers/Admin/AdminDocumentTypeController.php:163
 * @route '/admin/document-types/{documentType}/toggle'
 */
    const toggleActiveForm = (args: { documentType: number | { id: number } } | [documentType: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: toggleActive.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminDocumentTypeController::toggleActive
 * @see app/Http/Controllers/Admin/AdminDocumentTypeController.php:163
 * @route '/admin/document-types/{documentType}/toggle'
 */
        toggleActiveForm.post = (args: { documentType: number | { id: number } } | [documentType: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: toggleActive.url(args, options),
            method: 'post',
        })
    
    toggleActive.form = toggleActiveForm
/**
* @see \App\Http\Controllers\Admin\AdminDocumentTypeController::destroy
 * @see app/Http/Controllers/Admin/AdminDocumentTypeController.php:176
 * @route '/admin/document-types/{documentType}'
 */
export const destroy = (args: { documentType: number | { id: number } } | [documentType: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/document-types/{documentType}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\AdminDocumentTypeController::destroy
 * @see app/Http/Controllers/Admin/AdminDocumentTypeController.php:176
 * @route '/admin/document-types/{documentType}'
 */
destroy.url = (args: { documentType: number | { id: number } } | [documentType: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { documentType: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { documentType: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    documentType: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        documentType: typeof args.documentType === 'object'
                ? args.documentType.id
                : args.documentType,
                }

    return destroy.definition.url
            .replace('{documentType}', parsedArgs.documentType.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminDocumentTypeController::destroy
 * @see app/Http/Controllers/Admin/AdminDocumentTypeController.php:176
 * @route '/admin/document-types/{documentType}'
 */
destroy.delete = (args: { documentType: number | { id: number } } | [documentType: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Admin\AdminDocumentTypeController::destroy
 * @see app/Http/Controllers/Admin/AdminDocumentTypeController.php:176
 * @route '/admin/document-types/{documentType}'
 */
    const destroyForm = (args: { documentType: number | { id: number } } | [documentType: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminDocumentTypeController::destroy
 * @see app/Http/Controllers/Admin/AdminDocumentTypeController.php:176
 * @route '/admin/document-types/{documentType}'
 */
        destroyForm.delete = (args: { documentType: number | { id: number } } | [documentType: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const AdminDocumentTypeController = { index, create, store, edit, update, toggleActive, destroy }

export default AdminDocumentTypeController