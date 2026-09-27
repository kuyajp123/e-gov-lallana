import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\AdminQrScannerController::verify
 * @see app/Http/Controllers/Admin/AdminQrScannerController.php:38
 * @route '/admin/qr/verify'
 */
export const verify = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verify.url(options),
    method: 'post',
})

verify.definition = {
    methods: ["post"],
    url: '/admin/qr/verify',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\AdminQrScannerController::verify
 * @see app/Http/Controllers/Admin/AdminQrScannerController.php:38
 * @route '/admin/qr/verify'
 */
verify.url = (options?: RouteQueryOptions) => {
    return verify.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminQrScannerController::verify
 * @see app/Http/Controllers/Admin/AdminQrScannerController.php:38
 * @route '/admin/qr/verify'
 */
verify.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verify.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\AdminQrScannerController::verify
 * @see app/Http/Controllers/Admin/AdminQrScannerController.php:38
 * @route '/admin/qr/verify'
 */
    const verifyForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: verify.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminQrScannerController::verify
 * @see app/Http/Controllers/Admin/AdminQrScannerController.php:38
 * @route '/admin/qr/verify'
 */
        verifyForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: verify.url(options),
            method: 'post',
        })
    
    verify.form = verifyForm
const qr = {
    verify: Object.assign(verify, verify),
}

export default qr