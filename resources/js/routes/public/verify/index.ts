import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Public\PublicDocumentVerificationController::qr
 * @see app/Http/Controllers/Public/PublicDocumentVerificationController.php:12
 * @route '/verify/qr/{token}'
 */
export const qr = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: qr.url(args, options),
    method: 'get',
})

qr.definition = {
    methods: ["get","head"],
    url: '/verify/qr/{token}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Public\PublicDocumentVerificationController::qr
 * @see app/Http/Controllers/Public/PublicDocumentVerificationController.php:12
 * @route '/verify/qr/{token}'
 */
qr.url = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { token: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    token: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        token: args.token,
                }

    return qr.definition.url
            .replace('{token}', parsedArgs.token.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Public\PublicDocumentVerificationController::qr
 * @see app/Http/Controllers/Public/PublicDocumentVerificationController.php:12
 * @route '/verify/qr/{token}'
 */
qr.get = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: qr.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Public\PublicDocumentVerificationController::qr
 * @see app/Http/Controllers/Public/PublicDocumentVerificationController.php:12
 * @route '/verify/qr/{token}'
 */
qr.head = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: qr.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Public\PublicDocumentVerificationController::qr
 * @see app/Http/Controllers/Public/PublicDocumentVerificationController.php:12
 * @route '/verify/qr/{token}'
 */
    const qrForm = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: qr.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Public\PublicDocumentVerificationController::qr
 * @see app/Http/Controllers/Public/PublicDocumentVerificationController.php:12
 * @route '/verify/qr/{token}'
 */
        qrForm.get = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: qr.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Public\PublicDocumentVerificationController::qr
 * @see app/Http/Controllers/Public/PublicDocumentVerificationController.php:12
 * @route '/verify/qr/{token}'
 */
        qrForm.head = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: qr.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    qr.form = qrForm
const verify = {
    qr: Object.assign(qr, qr),
}

export default verify