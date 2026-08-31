import {
    queryParams,
    type RouteQueryOptions,
    type RouteDefinition,
    type RouteFormDefinition,
} from './../../wayfinder';
/**
 * @see \App\Http\Controllers\Public\InquiryController::__invoke
 * @see app/Http/Controllers/Public/InquiryController.php:13
 * @route '/inquiry'
 */
export const submit = (
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: submit.url(options),
    method: 'post',
});

submit.definition = {
    methods: ['post'],
    url: '/inquiry',
} satisfies RouteDefinition<['post']>;

/**
 * @see \App\Http\Controllers\Public\InquiryController::__invoke
 * @see app/Http/Controllers/Public/InquiryController.php:13
 * @route '/inquiry'
 */
submit.url = (options?: RouteQueryOptions) => {
    return submit.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\Public\InquiryController::__invoke
 * @see app/Http/Controllers/Public/InquiryController.php:13
 * @route '/inquiry'
 */
submit.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: submit.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\Public\InquiryController::__invoke
 * @see app/Http/Controllers/Public/InquiryController.php:13
 * @route '/inquiry'
 */
const submitForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: submit.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\Public\InquiryController::__invoke
 * @see app/Http/Controllers/Public/InquiryController.php:13
 * @route '/inquiry'
 */
submitForm.post = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: submit.url(options),
    method: 'post',
});

submit.form = submitForm;
const inquiry = {
    submit: Object.assign(submit, submit),
};

export default inquiry;
