import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Dev\DevSmsController::index
 * @see app/Http/Controllers/Dev/DevSmsController.php:19
 * @route '/dev/sms'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/dev/sms',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Dev\DevSmsController::index
 * @see app/Http/Controllers/Dev/DevSmsController.php:19
 * @route '/dev/sms'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Dev\DevSmsController::index
 * @see app/Http/Controllers/Dev/DevSmsController.php:19
 * @route '/dev/sms'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Dev\DevSmsController::index
 * @see app/Http/Controllers/Dev/DevSmsController.php:19
 * @route '/dev/sms'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Dev\DevSmsController::index
 * @see app/Http/Controllers/Dev/DevSmsController.php:19
 * @route '/dev/sms'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Dev\DevSmsController::index
 * @see app/Http/Controllers/Dev/DevSmsController.php:19
 * @route '/dev/sms'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Dev\DevSmsController::index
 * @see app/Http/Controllers/Dev/DevSmsController.php:19
 * @route '/dev/sms'
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
* @see \App\Http\Controllers\Dev\DevSmsController::setMode
 * @see app/Http/Controllers/Dev/DevSmsController.php:32
 * @route '/dev/sms/mode'
 */
export const setMode = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: setMode.url(options),
    method: 'post',
})

setMode.definition = {
    methods: ["post"],
    url: '/dev/sms/mode',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Dev\DevSmsController::setMode
 * @see app/Http/Controllers/Dev/DevSmsController.php:32
 * @route '/dev/sms/mode'
 */
setMode.url = (options?: RouteQueryOptions) => {
    return setMode.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Dev\DevSmsController::setMode
 * @see app/Http/Controllers/Dev/DevSmsController.php:32
 * @route '/dev/sms/mode'
 */
setMode.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: setMode.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Dev\DevSmsController::setMode
 * @see app/Http/Controllers/Dev/DevSmsController.php:32
 * @route '/dev/sms/mode'
 */
    const setModeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: setMode.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Dev\DevSmsController::setMode
 * @see app/Http/Controllers/Dev/DevSmsController.php:32
 * @route '/dev/sms/mode'
 */
        setModeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: setMode.url(options),
            method: 'post',
        })
    
    setMode.form = setModeForm
/**
* @see \App\Http\Controllers\Dev\DevSmsController::sendTest
 * @see app/Http/Controllers/Dev/DevSmsController.php:46
 * @route '/dev/sms/send'
 */
export const sendTest = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: sendTest.url(options),
    method: 'post',
})

sendTest.definition = {
    methods: ["post"],
    url: '/dev/sms/send',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Dev\DevSmsController::sendTest
 * @see app/Http/Controllers/Dev/DevSmsController.php:46
 * @route '/dev/sms/send'
 */
sendTest.url = (options?: RouteQueryOptions) => {
    return sendTest.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Dev\DevSmsController::sendTest
 * @see app/Http/Controllers/Dev/DevSmsController.php:46
 * @route '/dev/sms/send'
 */
sendTest.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: sendTest.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Dev\DevSmsController::sendTest
 * @see app/Http/Controllers/Dev/DevSmsController.php:46
 * @route '/dev/sms/send'
 */
    const sendTestForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: sendTest.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Dev\DevSmsController::sendTest
 * @see app/Http/Controllers/Dev/DevSmsController.php:46
 * @route '/dev/sms/send'
 */
        sendTestForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: sendTest.url(options),
            method: 'post',
        })
    
    sendTest.form = sendTestForm
/**
* @see \App\Http\Controllers\Dev\DevSmsController::clear
 * @see app/Http/Controllers/Dev/DevSmsController.php:64
 * @route '/dev/sms/clear'
 */
export const clear = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: clear.url(options),
    method: 'delete',
})

clear.definition = {
    methods: ["delete"],
    url: '/dev/sms/clear',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Dev\DevSmsController::clear
 * @see app/Http/Controllers/Dev/DevSmsController.php:64
 * @route '/dev/sms/clear'
 */
clear.url = (options?: RouteQueryOptions) => {
    return clear.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Dev\DevSmsController::clear
 * @see app/Http/Controllers/Dev/DevSmsController.php:64
 * @route '/dev/sms/clear'
 */
clear.delete = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: clear.url(options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Dev\DevSmsController::clear
 * @see app/Http/Controllers/Dev/DevSmsController.php:64
 * @route '/dev/sms/clear'
 */
    const clearForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: clear.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Dev\DevSmsController::clear
 * @see app/Http/Controllers/Dev/DevSmsController.php:64
 * @route '/dev/sms/clear'
 */
        clearForm.delete = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: clear.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    clear.form = clearForm
const DevSmsController = { index, setMode, sendTest, clear }

export default DevSmsController