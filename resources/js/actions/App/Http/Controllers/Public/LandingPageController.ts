import {
    queryParams,
    type RouteQueryOptions,
    type RouteDefinition,
    type RouteFormDefinition,
} from './../../../../../wayfinder';
/**
 * @see \App\Http\Controllers\Public\LandingPageController::__invoke
 * @see app/Http/Controllers/Public/LandingPageController.php:16
 * @route '/'
 */
const LandingPageController = (
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: LandingPageController.url(options),
    method: 'get',
});

LandingPageController.definition = {
    methods: ['get', 'head'],
    url: '/',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\Public\LandingPageController::__invoke
 * @see app/Http/Controllers/Public/LandingPageController.php:16
 * @route '/'
 */
LandingPageController.url = (options?: RouteQueryOptions) => {
    return LandingPageController.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\Public\LandingPageController::__invoke
 * @see app/Http/Controllers/Public/LandingPageController.php:16
 * @route '/'
 */
LandingPageController.get = (
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: LandingPageController.url(options),
    method: 'get',
});
/**
 * @see \App\Http\Controllers\Public\LandingPageController::__invoke
 * @see app/Http/Controllers/Public/LandingPageController.php:16
 * @route '/'
 */
LandingPageController.head = (
    options?: RouteQueryOptions,
): RouteDefinition<'head'> => ({
    url: LandingPageController.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\Public\LandingPageController::__invoke
 * @see app/Http/Controllers/Public/LandingPageController.php:16
 * @route '/'
 */
const LandingPageControllerForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: LandingPageController.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\Public\LandingPageController::__invoke
 * @see app/Http/Controllers/Public/LandingPageController.php:16
 * @route '/'
 */
LandingPageControllerForm.get = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: LandingPageController.url(options),
    method: 'get',
});
/**
 * @see \App\Http\Controllers\Public\LandingPageController::__invoke
 * @see app/Http/Controllers/Public/LandingPageController.php:16
 * @route '/'
 */
LandingPageControllerForm.head = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: LandingPageController.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'get',
});

LandingPageController.form = LandingPageControllerForm;
export default LandingPageController;
