import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Household\HouseholdHeadTransferController::store
 * @see app/Http/Controllers/Household/HouseholdHeadTransferController.php:14
 * @route '/household/transfer-head'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/household/transfer-head',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Household\HouseholdHeadTransferController::store
 * @see app/Http/Controllers/Household/HouseholdHeadTransferController.php:14
 * @route '/household/transfer-head'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Household\HouseholdHeadTransferController::store
 * @see app/Http/Controllers/Household/HouseholdHeadTransferController.php:14
 * @route '/household/transfer-head'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Household\HouseholdHeadTransferController::store
 * @see app/Http/Controllers/Household/HouseholdHeadTransferController.php:14
 * @route '/household/transfer-head'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Household\HouseholdHeadTransferController::store
 * @see app/Http/Controllers/Household/HouseholdHeadTransferController.php:14
 * @route '/household/transfer-head'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
const HouseholdHeadTransferController = { store }

export default HouseholdHeadTransferController