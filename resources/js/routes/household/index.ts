import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import register702019 from './register'
import members from './members'
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
* @see \App\Http\Controllers\Household\HouseholdRegistrationController::register
 * @see app/Http/Controllers/Household/HouseholdRegistrationController.php:24
 * @route '/household/register'
 */
export const register = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: register.url(options),
    method: 'get',
})

register.definition = {
    methods: ["get","head"],
    url: '/household/register',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Household\HouseholdRegistrationController::register
 * @see app/Http/Controllers/Household/HouseholdRegistrationController.php:24
 * @route '/household/register'
 */
register.url = (options?: RouteQueryOptions) => {
    return register.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Household\HouseholdRegistrationController::register
 * @see app/Http/Controllers/Household/HouseholdRegistrationController.php:24
 * @route '/household/register'
 */
register.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: register.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Household\HouseholdRegistrationController::register
 * @see app/Http/Controllers/Household/HouseholdRegistrationController.php:24
 * @route '/household/register'
 */
register.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: register.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Household\HouseholdRegistrationController::register
 * @see app/Http/Controllers/Household/HouseholdRegistrationController.php:24
 * @route '/household/register'
 */
    const registerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: register.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Household\HouseholdRegistrationController::register
 * @see app/Http/Controllers/Household/HouseholdRegistrationController.php:24
 * @route '/household/register'
 */
        registerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: register.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Household\HouseholdRegistrationController::register
 * @see app/Http/Controllers/Household/HouseholdRegistrationController.php:24
 * @route '/household/register'
 */
        registerForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: register.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    register.form = registerForm
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
/**
* @see \App\Http\Controllers\Household\HouseholdHeadTransferController::transferHead
 * @see app/Http/Controllers/Household/HouseholdHeadTransferController.php:14
 * @route '/household/transfer-head'
 */
export const transferHead = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: transferHead.url(options),
    method: 'post',
})

transferHead.definition = {
    methods: ["post"],
    url: '/household/transfer-head',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Household\HouseholdHeadTransferController::transferHead
 * @see app/Http/Controllers/Household/HouseholdHeadTransferController.php:14
 * @route '/household/transfer-head'
 */
transferHead.url = (options?: RouteQueryOptions) => {
    return transferHead.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Household\HouseholdHeadTransferController::transferHead
 * @see app/Http/Controllers/Household/HouseholdHeadTransferController.php:14
 * @route '/household/transfer-head'
 */
transferHead.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: transferHead.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Household\HouseholdHeadTransferController::transferHead
 * @see app/Http/Controllers/Household/HouseholdHeadTransferController.php:14
 * @route '/household/transfer-head'
 */
    const transferHeadForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: transferHead.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Household\HouseholdHeadTransferController::transferHead
 * @see app/Http/Controllers/Household/HouseholdHeadTransferController.php:14
 * @route '/household/transfer-head'
 */
        transferHeadForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: transferHead.url(options),
            method: 'post',
        })
    
    transferHead.form = transferHeadForm
const household = {
    index: Object.assign(index, index),
register: Object.assign(register, register702019),
edit: Object.assign(edit, edit),
update: Object.assign(update, update),
members: Object.assign(members, members),
transferHead: Object.assign(transferHead, transferHead),
}

export default household