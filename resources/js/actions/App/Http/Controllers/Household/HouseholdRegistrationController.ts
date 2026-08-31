import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Household\HouseholdRegistrationController::create
 * @see app/Http/Controllers/Household/HouseholdRegistrationController.php:24
 * @route '/household/register'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/household/register',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Household\HouseholdRegistrationController::create
 * @see app/Http/Controllers/Household/HouseholdRegistrationController.php:24
 * @route '/household/register'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Household\HouseholdRegistrationController::create
 * @see app/Http/Controllers/Household/HouseholdRegistrationController.php:24
 * @route '/household/register'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Household\HouseholdRegistrationController::create
 * @see app/Http/Controllers/Household/HouseholdRegistrationController.php:24
 * @route '/household/register'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Household\HouseholdRegistrationController::create
 * @see app/Http/Controllers/Household/HouseholdRegistrationController.php:24
 * @route '/household/register'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Household\HouseholdRegistrationController::create
 * @see app/Http/Controllers/Household/HouseholdRegistrationController.php:24
 * @route '/household/register'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Household\HouseholdRegistrationController::create
 * @see app/Http/Controllers/Household/HouseholdRegistrationController.php:24
 * @route '/household/register'
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
* @see \App\Http\Controllers\Household\HouseholdRegistrationController::sendOtp
 * @see app/Http/Controllers/Household/HouseholdRegistrationController.php:59
 * @route '/household/register/otp/send'
 */
export const sendOtp = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: sendOtp.url(options),
    method: 'post',
})

sendOtp.definition = {
    methods: ["post"],
    url: '/household/register/otp/send',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Household\HouseholdRegistrationController::sendOtp
 * @see app/Http/Controllers/Household/HouseholdRegistrationController.php:59
 * @route '/household/register/otp/send'
 */
sendOtp.url = (options?: RouteQueryOptions) => {
    return sendOtp.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Household\HouseholdRegistrationController::sendOtp
 * @see app/Http/Controllers/Household/HouseholdRegistrationController.php:59
 * @route '/household/register/otp/send'
 */
sendOtp.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: sendOtp.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Household\HouseholdRegistrationController::sendOtp
 * @see app/Http/Controllers/Household/HouseholdRegistrationController.php:59
 * @route '/household/register/otp/send'
 */
    const sendOtpForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: sendOtp.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Household\HouseholdRegistrationController::sendOtp
 * @see app/Http/Controllers/Household/HouseholdRegistrationController.php:59
 * @route '/household/register/otp/send'
 */
        sendOtpForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: sendOtp.url(options),
            method: 'post',
        })
    
    sendOtp.form = sendOtpForm
/**
* @see \App\Http\Controllers\Household\HouseholdRegistrationController::verifyOtp
 * @see app/Http/Controllers/Household/HouseholdRegistrationController.php:107
 * @route '/household/register/otp/verify'
 */
export const verifyOtp = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verifyOtp.url(options),
    method: 'post',
})

verifyOtp.definition = {
    methods: ["post"],
    url: '/household/register/otp/verify',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Household\HouseholdRegistrationController::verifyOtp
 * @see app/Http/Controllers/Household/HouseholdRegistrationController.php:107
 * @route '/household/register/otp/verify'
 */
verifyOtp.url = (options?: RouteQueryOptions) => {
    return verifyOtp.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Household\HouseholdRegistrationController::verifyOtp
 * @see app/Http/Controllers/Household/HouseholdRegistrationController.php:107
 * @route '/household/register/otp/verify'
 */
verifyOtp.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verifyOtp.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Household\HouseholdRegistrationController::verifyOtp
 * @see app/Http/Controllers/Household/HouseholdRegistrationController.php:107
 * @route '/household/register/otp/verify'
 */
    const verifyOtpForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: verifyOtp.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Household\HouseholdRegistrationController::verifyOtp
 * @see app/Http/Controllers/Household/HouseholdRegistrationController.php:107
 * @route '/household/register/otp/verify'
 */
        verifyOtpForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: verifyOtp.url(options),
            method: 'post',
        })
    
    verifyOtp.form = verifyOtpForm
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
const HouseholdRegistrationController = { create, sendOtp, verifyOtp, store }

export default HouseholdRegistrationController