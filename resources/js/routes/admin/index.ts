import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import loginDf2c2a from './login'
import documentRequests from './document-requests'
import households from './households'
import residentProfiles from './resident-profiles'
import documentTypes from './document-types'
import staff from './staff'
import announcements from './announcements'
import inquiries from './inquiries'
import qr from './qr'
/**
* @see \App\Http\Controllers\Admin\AdminAuthController::logout
 * @see app/Http/Controllers/Admin/AdminAuthController.php:96
 * @route '/admin/logout'
 */
export const logout = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: logout.url(options),
    method: 'post',
})

logout.definition = {
    methods: ["post"],
    url: '/admin/logout',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\AdminAuthController::logout
 * @see app/Http/Controllers/Admin/AdminAuthController.php:96
 * @route '/admin/logout'
 */
logout.url = (options?: RouteQueryOptions) => {
    return logout.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminAuthController::logout
 * @see app/Http/Controllers/Admin/AdminAuthController.php:96
 * @route '/admin/logout'
 */
logout.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: logout.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\AdminAuthController::logout
 * @see app/Http/Controllers/Admin/AdminAuthController.php:96
 * @route '/admin/logout'
 */
    const logoutForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: logout.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminAuthController::logout
 * @see app/Http/Controllers/Admin/AdminAuthController.php:96
 * @route '/admin/logout'
 */
        logoutForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: logout.url(options),
            method: 'post',
        })
    
    logout.form = logoutForm
/**
* @see \App\Http\Controllers\Admin\AdminAuthController::login
 * @see app/Http/Controllers/Admin/AdminAuthController.php:23
 * @route '/admin/login'
 */
export const login = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: login.url(options),
    method: 'get',
})

login.definition = {
    methods: ["get","head"],
    url: '/admin/login',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AdminAuthController::login
 * @see app/Http/Controllers/Admin/AdminAuthController.php:23
 * @route '/admin/login'
 */
login.url = (options?: RouteQueryOptions) => {
    return login.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminAuthController::login
 * @see app/Http/Controllers/Admin/AdminAuthController.php:23
 * @route '/admin/login'
 */
login.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: login.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\AdminAuthController::login
 * @see app/Http/Controllers/Admin/AdminAuthController.php:23
 * @route '/admin/login'
 */
login.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: login.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\AdminAuthController::login
 * @see app/Http/Controllers/Admin/AdminAuthController.php:23
 * @route '/admin/login'
 */
    const loginForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: login.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminAuthController::login
 * @see app/Http/Controllers/Admin/AdminAuthController.php:23
 * @route '/admin/login'
 */
        loginForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: login.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\AdminAuthController::login
 * @see app/Http/Controllers/Admin/AdminAuthController.php:23
 * @route '/admin/login'
 */
        loginForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: login.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    login.form = loginForm
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
    logout: Object.assign(logout, logout),
login: Object.assign(login, loginDf2c2a),
dashboard: Object.assign(dashboard, dashboard),
documentRequests: Object.assign(documentRequests, documentRequests),
households: Object.assign(households, households),
residentProfiles: Object.assign(residentProfiles, residentProfiles),
documentTypes: Object.assign(documentTypes, documentTypes),
staff: Object.assign(staff, staff),
announcements: Object.assign(announcements, announcements),
inquiries: Object.assign(inquiries, inquiries),
qrScanner: Object.assign(qrScanner, qrScanner),
qr: Object.assign(qr, qr),
}

export default admin