import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
import otp from './otp'
/**
* @see \App\Http\Controllers\Household\HouseholdRegistrationController::store
 * @see app/Http/Controllers/Household/HouseholdRegistrationController.php:127
 * @route '/household/register'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/household/register',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Household\HouseholdRegistrationController::store
 * @see app/Http/Controllers/Household/HouseholdRegistrationController.php:127
 * @route '/household/register'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Household\HouseholdRegistrationController::store
 * @see app/Http/Controllers/Household/HouseholdRegistrationController.php:127
 * @route '/household/register'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Household\HouseholdRegistrationController::store
 * @see app/Http/Controllers/Household/HouseholdRegistrationController.php:127
 * @route '/household/register'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Household\HouseholdRegistrationController::store
 * @see app/Http/Controllers/Household/HouseholdRegistrationController.php:127
 * @route '/household/register'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
const register = {
    otp: Object.assign(otp, otp),
store: Object.assign(store, store),
}

export default register