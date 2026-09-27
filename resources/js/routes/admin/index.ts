import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import documentRequests from './document-requests'
import households from './households'
import residentProfiles from './resident-profiles'
import documentTypes from './document-types'
import staff from './staff'
import announcements from './announcements'
import qr from './qr'
/**
* @see \App\Http\Controllers\Admin\AdminDashboardController::__invoke
 * @see app/Http/Controllers/Admin/AdminDashboardController.php:18
 * @route '/admin/overview'
 */
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/admin/overview',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AdminDashboardController::__invoke
 * @see app/Http/Controllers/Admin/AdminDashboardController.php:18
 * @route '/admin/overview'
 */
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminDashboardController::__invoke
 * @see app/Http/Controllers/Admin/AdminDashboardController.php:18
 * @route '/admin/overview'
 */
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\AdminDashboardController::__invoke
 * @see app/Http/Controllers/Admin/AdminDashboardController.php:18
 * @route '/admin/overview'
 */
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\AdminDashboardController::__invoke
 * @see app/Http/Controllers/Admin/AdminDashboardController.php:18
 * @route '/admin/overview'
 */
    const dashboardForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: dashboard.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminDashboardController::__invoke
 * @see app/Http/Controllers/Admin/AdminDashboardController.php:18
 * @route '/admin/overview'
 */
        dashboardForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\AdminDashboardController::__invoke
 * @see app/Http/Controllers/Admin/AdminDashboardController.php:18
 * @route '/admin/overview'
 */
        dashboardForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    dashboard.form = dashboardForm
/**
* @see \App\Http\Controllers\Admin\AdminQrScannerController::qrScanner
 * @see app/Http/Controllers/Admin/AdminQrScannerController.php:17
 * @route '/admin/qr-scanner'
 */
export const qrScanner = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: qrScanner.url(options),
    method: 'get',
})

qrScanner.definition = {
    methods: ["get","head"],
    url: '/admin/qr-scanner',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AdminQrScannerController::qrScanner
 * @see app/Http/Controllers/Admin/AdminQrScannerController.php:17
 * @route '/admin/qr-scanner'
 */
qrScanner.url = (options?: RouteQueryOptions) => {
    return qrScanner.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminQrScannerController::qrScanner
 * @see app/Http/Controllers/Admin/AdminQrScannerController.php:17
 * @route '/admin/qr-scanner'
 */
qrScanner.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: qrScanner.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\AdminQrScannerController::qrScanner
 * @see app/Http/Controllers/Admin/AdminQrScannerController.php:17
 * @route '/admin/qr-scanner'
 */
qrScanner.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: qrScanner.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\AdminQrScannerController::qrScanner
 * @see app/Http/Controllers/Admin/AdminQrScannerController.php:17
 * @route '/admin/qr-scanner'
 */
    const qrScannerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: qrScanner.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminQrScannerController::qrScanner
 * @see app/Http/Controllers/Admin/AdminQrScannerController.php:17
 * @route '/admin/qr-scanner'
 */
        qrScannerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: qrScanner.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\AdminQrScannerController::qrScanner
 * @see app/Http/Controllers/Admin/AdminQrScannerController.php:17
 * @route '/admin/qr-scanner'
 */
        qrScannerForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: qrScanner.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    qrScanner.form = qrScannerForm
const admin = {
    dashboard: Object.assign(dashboard, dashboard),
documentRequests: Object.assign(documentRequests, documentRequests),
households: Object.assign(households, households),
residentProfiles: Object.assign(residentProfiles, residentProfiles),
documentTypes: Object.assign(documentTypes, documentTypes),
staff: Object.assign(staff, staff),
announcements: Object.assign(announcements, announcements),
qrScanner: Object.assign(qrScanner, qrScanner),
qr: Object.assign(qr, qr),
}

export default admin