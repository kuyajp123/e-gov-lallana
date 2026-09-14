import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
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
 * @see app/Http/Controllers/Resident/ProfileController.php:80
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
 * @see app/Http/Controllers/Resident/ProfileController.php:80
 * @route '/resident/profile'
 */
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Resident\ProfileController::update
 * @see app/Http/Controllers/Resident/ProfileController.php:80
 * @route '/resident/profile'
 */
update.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Resident\ProfileController::update
 * @see app/Http/Controllers/Resident/ProfileController.php:80
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
 * @see app/Http/Controllers/Resident/ProfileController.php:80
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
const ProfileController = { store, update }

export default ProfileController