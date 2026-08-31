import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Resident\ProfileController::show
 * @see app/Http/Controllers/Resident/ProfileController.php:18
 * @route '/resident/profile'
 */
export const show = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/resident/profile',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Resident\ProfileController::show
 * @see app/Http/Controllers/Resident/ProfileController.php:18
 * @route '/resident/profile'
 */
show.url = (options?: RouteQueryOptions) => {
    return show.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Resident\ProfileController::show
 * @see app/Http/Controllers/Resident/ProfileController.php:18
 * @route '/resident/profile'
 */
show.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Resident\ProfileController::show
 * @see app/Http/Controllers/Resident/ProfileController.php:18
 * @route '/resident/profile'
 */
show.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Resident\ProfileController::show
 * @see app/Http/Controllers/Resident/ProfileController.php:18
 * @route '/resident/profile'
 */
    const showForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Resident\ProfileController::show
 * @see app/Http/Controllers/Resident/ProfileController.php:18
 * @route '/resident/profile'
 */
        showForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Resident\ProfileController::show
 * @see app/Http/Controllers/Resident/ProfileController.php:18
 * @route '/resident/profile'
 */
        showForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
/**
* @see \App\Http\Controllers\Resident\ProfileController::edit
 * @see app/Http/Controllers/Resident/ProfileController.php:34
 * @route '/resident/profile/edit'
 */
export const edit = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/resident/profile/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Resident\ProfileController::edit
 * @see app/Http/Controllers/Resident/ProfileController.php:34
 * @route '/resident/profile/edit'
 */
edit.url = (options?: RouteQueryOptions) => {
    return edit.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Resident\ProfileController::edit
 * @see app/Http/Controllers/Resident/ProfileController.php:34
 * @route '/resident/profile/edit'
 */
edit.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Resident\ProfileController::edit
 * @see app/Http/Controllers/Resident/ProfileController.php:34
 * @route '/resident/profile/edit'
 */
edit.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Resident\ProfileController::edit
 * @see app/Http/Controllers/Resident/ProfileController.php:34
 * @route '/resident/profile/edit'
 */
    const editForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Resident\ProfileController::edit
 * @see app/Http/Controllers/Resident/ProfileController.php:34
 * @route '/resident/profile/edit'
 */
        editForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Resident\ProfileController::edit
 * @see app/Http/Controllers/Resident/ProfileController.php:34
 * @route '/resident/profile/edit'
 */
        editForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    edit.form = editForm
/**
* @see \App\Http\Controllers\Resident\ProfileController::store
 * @see app/Http/Controllers/Resident/ProfileController.php:50
 * @route '/resident/profile'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/resident/profile',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Resident\ProfileController::store
 * @see app/Http/Controllers/Resident/ProfileController.php:50
 * @route '/resident/profile'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Resident\ProfileController::store
 * @see app/Http/Controllers/Resident/ProfileController.php:50
 * @route '/resident/profile'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Resident\ProfileController::store
 * @see app/Http/Controllers/Resident/ProfileController.php:50
 * @route '/resident/profile'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Resident\ProfileController::store
 * @see app/Http/Controllers/Resident/ProfileController.php:50
 * @route '/resident/profile'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Resident\ProfileController::update
 * @see app/Http/Controllers/Resident/ProfileController.php:74
 * @route '/resident/profile'
 */
export const update = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/resident/profile',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Resident\ProfileController::update
 * @see app/Http/Controllers/Resident/ProfileController.php:74
 * @route '/resident/profile'
 */
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Resident\ProfileController::update
 * @see app/Http/Controllers/Resident/ProfileController.php:74
 * @route '/resident/profile'
 */
update.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Resident\ProfileController::update
 * @see app/Http/Controllers/Resident/ProfileController.php:74
 * @route '/resident/profile'
 */
    const updateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Resident\ProfileController::update
 * @see app/Http/Controllers/Resident/ProfileController.php:74
 * @route '/resident/profile'
 */
        updateForm.put = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
const ProfileController = { show, edit, store, update }

export default ProfileController