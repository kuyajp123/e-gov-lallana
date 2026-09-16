import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Household\HouseholdInvitationController::accept
 * @see app/Http/Controllers/Household/HouseholdInvitationController.php:16
 * @route '/household/invitations/{member}/accept'
 */
export const accept = (args: { member: number | { id: number } } | [member: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: accept.url(args, options),
    method: 'post',
})

accept.definition = {
    methods: ["post"],
    url: '/household/invitations/{member}/accept',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Household\HouseholdInvitationController::accept
 * @see app/Http/Controllers/Household/HouseholdInvitationController.php:16
 * @route '/household/invitations/{member}/accept'
 */
accept.url = (args: { member: number | { id: number } } | [member: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { member: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { member: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    member: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        member: typeof args.member === 'object'
                ? args.member.id
                : args.member,
                }

    return accept.definition.url
            .replace('{member}', parsedArgs.member.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Household\HouseholdInvitationController::accept
 * @see app/Http/Controllers/Household/HouseholdInvitationController.php:16
 * @route '/household/invitations/{member}/accept'
 */
accept.post = (args: { member: number | { id: number } } | [member: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: accept.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Household\HouseholdInvitationController::accept
 * @see app/Http/Controllers/Household/HouseholdInvitationController.php:16
 * @route '/household/invitations/{member}/accept'
 */
    const acceptForm = (args: { member: number | { id: number } } | [member: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: accept.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Household\HouseholdInvitationController::accept
 * @see app/Http/Controllers/Household/HouseholdInvitationController.php:16
 * @route '/household/invitations/{member}/accept'
 */
        acceptForm.post = (args: { member: number | { id: number } } | [member: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: accept.url(args, options),
            method: 'post',
        })
    
    accept.form = acceptForm
/**
* @see \App\Http\Controllers\Household\HouseholdInvitationController::reject
 * @see app/Http/Controllers/Household/HouseholdInvitationController.php:70
 * @route '/household/invitations/{member}/reject'
 */
export const reject = (args: { member: number | { id: number } } | [member: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reject.url(args, options),
    method: 'post',
})

reject.definition = {
    methods: ["post"],
    url: '/household/invitations/{member}/reject',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Household\HouseholdInvitationController::reject
 * @see app/Http/Controllers/Household/HouseholdInvitationController.php:70
 * @route '/household/invitations/{member}/reject'
 */
reject.url = (args: { member: number | { id: number } } | [member: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { member: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { member: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    member: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        member: typeof args.member === 'object'
                ? args.member.id
                : args.member,
                }

    return reject.definition.url
            .replace('{member}', parsedArgs.member.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Household\HouseholdInvitationController::reject
 * @see app/Http/Controllers/Household/HouseholdInvitationController.php:70
 * @route '/household/invitations/{member}/reject'
 */
reject.post = (args: { member: number | { id: number } } | [member: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reject.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Household\HouseholdInvitationController::reject
 * @see app/Http/Controllers/Household/HouseholdInvitationController.php:70
 * @route '/household/invitations/{member}/reject'
 */
    const rejectForm = (args: { member: number | { id: number } } | [member: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: reject.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Household\HouseholdInvitationController::reject
 * @see app/Http/Controllers/Household/HouseholdInvitationController.php:70
 * @route '/household/invitations/{member}/reject'
 */
        rejectForm.post = (args: { member: number | { id: number } } | [member: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: reject.url(args, options),
            method: 'post',
        })
    
    reject.form = rejectForm
const invitations = {
    accept: Object.assign(accept, accept),
reject: Object.assign(reject, reject),
}

export default invitations