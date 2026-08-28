import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Public\LocaleController::__invoke
 * @see app/Http/Controllers/Public/LocaleController.php:11
 * @route '/locale'
 */
const LocaleController = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: LocaleController.url(options),
    method: 'post',
})

LocaleController.definition = {
    methods: ["post"],
    url: '/locale',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Public\LocaleController::__invoke
 * @see app/Http/Controllers/Public/LocaleController.php:11
 * @route '/locale'
 */
LocaleController.url = (options?: RouteQueryOptions) => {
    return LocaleController.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Public\LocaleController::__invoke
 * @see app/Http/Controllers/Public/LocaleController.php:11
 * @route '/locale'
 */
LocaleController.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: LocaleController.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Public\LocaleController::__invoke
 * @see app/Http/Controllers/Public/LocaleController.php:11
 * @route '/locale'
 */
    const LocaleControllerForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: LocaleController.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Public\LocaleController::__invoke
 * @see app/Http/Controllers/Public/LocaleController.php:11
 * @route '/locale'
 */
        LocaleControllerForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: LocaleController.url(options),
            method: 'post',
        })
    
    LocaleController.form = LocaleControllerForm
export default LocaleController