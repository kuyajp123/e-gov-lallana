import {
    queryParams,
    type RouteQueryOptions,
    type RouteDefinition,
    type RouteFormDefinition,
} from './../../../../../wayfinder';
/**
 * @see \App\Http\Controllers\Public\InquiryController::__invoke
 * @see app/Http/Controllers/Public/InquiryController.php:13
 * @route '/inquiry'
 */
const InquiryController = (
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: InquiryController.url(options),
    method: 'post',
});

InquiryController.definition = {
    methods: ['post'],
    url: '/inquiry',
} satisfies RouteDefinition<['post']>;

/**
 * @see \App\Http\Controllers\Public\InquiryController::__invoke
 * @see app/Http/Controllers/Public/InquiryController.php:13
 * @route '/inquiry'
 */
InquiryController.url = (options?: RouteQueryOptions) => {
    return InquiryController.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\Public\InquiryController::__invoke
 * @see app/Http/Controllers/Public/InquiryController.php:13
 * @route '/inquiry'
 */
InquiryController.post = (
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: InquiryController.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\Public\InquiryController::__invoke
 * @see app/Http/Controllers/Public/InquiryController.php:13
 * @route '/inquiry'
 */
const InquiryControllerForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: InquiryController.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\Public\InquiryController::__invoke
 * @see app/Http/Controllers/Public/InquiryController.php:13
 * @route '/inquiry'
 */
InquiryControllerForm.post = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: InquiryController.url(options),
    method: 'post',
});

InquiryController.form = InquiryControllerForm;
export default InquiryController;
