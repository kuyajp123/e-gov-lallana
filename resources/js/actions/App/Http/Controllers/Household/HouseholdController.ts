import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Household\HouseholdController::index
 * @see app/Http/Controllers/Household/HouseholdController.php:17
 * @route '/household'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/household',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Household\HouseholdController::index
 * @see app/Http/Controllers/Household/HouseholdController.php:17
 * @route '/household'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Household\HouseholdController::index
 * @see app/Http/Controllers/Household/HouseholdController.php:17
 * @route '/household'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Household\HouseholdController::index
 * @see app/Http/Controllers/Household/HouseholdController.php:17
 * @route '/household'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Household\HouseholdController::index
 * @see app/Http/Controllers/Household/HouseholdController.php:17
 * @route '/household'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Household\HouseholdController::index
 * @see app/Http/Controllers/Household/HouseholdController.php:17
 * @route '/household'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Household\HouseholdController::index
 * @see app/Http/Controllers/Household/HouseholdController.php:17
 * @route '/household'
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
* @see \App\Http\Controllers\Household\HouseholdController::edit
 * @see app/Http/Controllers/Household/HouseholdController.php:78
 * @route '/household/edit'
 */
export const edit = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/household/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Household\HouseholdController::edit
 * @see app/Http/Controllers/Household/HouseholdController.php:78
 * @route '/household/edit'
 */
edit.url = (options?: RouteQueryOptions) => {
    return edit.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Household\HouseholdController::edit
 * @see app/Http/Controllers/Household/HouseholdController.php:78
 * @route '/household/edit'
 */
edit.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Household\HouseholdController::edit
 * @see app/Http/Controllers/Household/HouseholdController.php:78
 * @route '/household/edit'
 */
edit.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Household\HouseholdController::edit
 * @see app/Http/Controllers/Household/HouseholdController.php:78
 * @route '/household/edit'
 */
    const editForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Household\HouseholdController::edit
 * @see app/Http/Controllers/Household/HouseholdController.php:78
 * @route '/household/edit'
 */
        editForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Household\HouseholdController::edit
 * @see app/Http/Controllers/Household/HouseholdController.php:78
 * @route '/household/edit'
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
* @see \App\Http\Controllers\Household\HouseholdController::update
 * @see app/Http/Controllers/Household/HouseholdController.php:114
 * @route '/household'
 */
export const update = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/household',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Household\HouseholdController::update
 * @see app/Http/Controllers/Household/HouseholdController.php:114
 * @route '/household'
 */
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Household\HouseholdController::update
 * @see app/Http/Controllers/Household/HouseholdController.php:114
 * @route '/household'
 */
update.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Household\HouseholdController::update
 * @see app/Http/Controllers/Household/HouseholdController.php:114
 * @route '/household'
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
* @see \App\Http\Controllers\Household\HouseholdController::update
 * @see app/Http/Controllers/Household/HouseholdController.php:114
 * @route '/household'
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
const HouseholdController = { index, edit, update }

export default HouseholdController