import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Public\LocaleController::__invoke
 * @see app/Http/Controllers/Public/LocaleController.php:11
 * @route '/locale'
 */
export const switchMethod = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: switchMethod.url(options),
    method: 'post',
})

switchMethod.definition = {
    methods: ["post"],
    url: '/locale',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Public\LocaleController::__invoke
 * @see app/Http/Controllers/Public/LocaleController.php:11
 * @route '/locale'
 */
switchMethod.url = (options?: RouteQueryOptions) => {
    return switchMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Public\LocaleController::__invoke
 * @see app/Http/Controllers/Public/LocaleController.php:11
 * @route '/locale'
 */
switchMethod.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: switchMethod.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Public\LocaleController::__invoke
 * @see app/Http/Controllers/Public/LocaleController.php:11
 * @route '/locale'
 */
    const switchMethodForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: switchMethod.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Public\LocaleController::__invoke
 * @see app/Http/Controllers/Public/LocaleController.php:11
 * @route '/locale'
 */
        switchMethodForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: switchMethod.url(options),
            method: 'post',
        })
    
    switchMethod.form = switchMethodForm
const locale = {
    switch: Object.assign(switchMethod, switchMethod),
}

export default locale