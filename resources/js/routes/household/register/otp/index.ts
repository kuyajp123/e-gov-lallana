import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Household\HouseholdRegistrationController::send
 * @see app/Http/Controllers/Household/HouseholdRegistrationController.php:59
 * @route '/household/register/otp/send'
 */
export const send = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: send.url(options),
    method: 'post',
})

send.definition = {
    methods: ["post"],
    url: '/household/register/otp/send',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Household\HouseholdRegistrationController::send
 * @see app/Http/Controllers/Household/HouseholdRegistrationController.php:59
 * @route '/household/register/otp/send'
 */
send.url = (options?: RouteQueryOptions) => {
    return send.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Household\HouseholdRegistrationController::send
 * @see app/Http/Controllers/Household/HouseholdRegistrationController.php:59
 * @route '/household/register/otp/send'
 */
send.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: send.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Household\HouseholdRegistrationController::send
 * @see app/Http/Controllers/Household/HouseholdRegistrationController.php:59
 * @route '/household/register/otp/send'
 */
    const sendForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: send.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Household\HouseholdRegistrationController::send
 * @see app/Http/Controllers/Household/HouseholdRegistrationController.php:59
 * @route '/household/register/otp/send'
 */
        sendForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: send.url(options),
            method: 'post',
        })
    
    send.form = sendForm
/**
* @see \App\Http\Controllers\Household\HouseholdRegistrationController::verify
 * @see app/Http/Controllers/Household/HouseholdRegistrationController.php:107
 * @route '/household/register/otp/verify'
 */
export const verify = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verify.url(options),
    method: 'post',
})

verify.definition = {
    methods: ["post"],
    url: '/household/register/otp/verify',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Household\HouseholdRegistrationController::verify
 * @see app/Http/Controllers/Household/HouseholdRegistrationController.php:107
 * @route '/household/register/otp/verify'
 */
verify.url = (options?: RouteQueryOptions) => {
    return verify.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Household\HouseholdRegistrationController::verify
 * @see app/Http/Controllers/Household/HouseholdRegistrationController.php:107
 * @route '/household/register/otp/verify'
 */
verify.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verify.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Household\HouseholdRegistrationController::verify
 * @see app/Http/Controllers/Household/HouseholdRegistrationController.php:107
 * @route '/household/register/otp/verify'
 */
    const verifyForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: verify.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Household\HouseholdRegistrationController::verify
 * @see app/Http/Controllers/Household/HouseholdRegistrationController.php:107
 * @route '/household/register/otp/verify'
 */
        verifyForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: verify.url(options),
            method: 'post',
        })
    
    verify.form = verifyForm
const otp = {
    send: Object.assign(send, send),
verify: Object.assign(verify, verify),
}

export default otp