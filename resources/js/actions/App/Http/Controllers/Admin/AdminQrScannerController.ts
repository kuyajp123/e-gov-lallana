import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\AdminQrScannerController::index
 * @see app/Http/Controllers/Admin/AdminQrScannerController.php:17
 * @route '/admin/qr-scanner'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/qr-scanner',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AdminQrScannerController::index
 * @see app/Http/Controllers/Admin/AdminQrScannerController.php:17
 * @route '/admin/qr-scanner'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminQrScannerController::index
 * @see app/Http/Controllers/Admin/AdminQrScannerController.php:17
 * @route '/admin/qr-scanner'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\AdminQrScannerController::index
 * @see app/Http/Controllers/Admin/AdminQrScannerController.php:17
 * @route '/admin/qr-scanner'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\AdminQrScannerController::index
 * @see app/Http/Controllers/Admin/AdminQrScannerController.php:17
 * @route '/admin/qr-scanner'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminQrScannerController::index
 * @see app/Http/Controllers/Admin/AdminQrScannerController.php:17
 * @route '/admin/qr-scanner'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\AdminQrScannerController::index
 * @see app/Http/Controllers/Admin/AdminQrScannerController.php:17
 * @route '/admin/qr-scanner'
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
const AdminQrScannerController = { index, verify }

export default AdminQrScannerController