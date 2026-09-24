import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Public\PublicAnnouncementController::index
 * @see app/Http/Controllers/Public/PublicAnnouncementController.php:18
 * @route '/announcements'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/announcements',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Public\PublicAnnouncementController::index
 * @see app/Http/Controllers/Public/PublicAnnouncementController.php:18
 * @route '/announcements'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Public\PublicAnnouncementController::index
 * @see app/Http/Controllers/Public/PublicAnnouncementController.php:18
 * @route '/announcements'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Public\PublicAnnouncementController::index
 * @see app/Http/Controllers/Public/PublicAnnouncementController.php:18
 * @route '/announcements'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Public\PublicAnnouncementController::index
 * @see app/Http/Controllers/Public/PublicAnnouncementController.php:18
 * @route '/announcements'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Public\PublicAnnouncementController::index
 * @see app/Http/Controllers/Public/PublicAnnouncementController.php:18
 * @route '/announcements'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Public\PublicAnnouncementController::index
 * @see app/Http/Controllers/Public/PublicAnnouncementController.php:18
 * @route '/announcements'
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
* @see \App\Http\Controllers\Public\PublicAnnouncementController::show
 * @see app/Http/Controllers/Public/PublicAnnouncementController.php:95
 * @route '/announcements/{announcement}'
 */
export const show = (args: { announcement: string | { slug: string } } | [announcement: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/announcements/{announcement}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Public\PublicAnnouncementController::show
 * @see app/Http/Controllers/Public/PublicAnnouncementController.php:95
 * @route '/announcements/{announcement}'
 */
show.url = (args: { announcement: string | { slug: string } } | [announcement: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { announcement: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'slug' in args) {
            args = { announcement: args.slug }
        }
    
    if (Array.isArray(args)) {
        args = {
                    announcement: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        announcement: typeof args.announcement === 'object'
                ? args.announcement.slug
                : args.announcement,
                }

    return show.definition.url
            .replace('{announcement}', parsedArgs.announcement.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Public\PublicAnnouncementController::show
 * @see app/Http/Controllers/Public/PublicAnnouncementController.php:95
 * @route '/announcements/{announcement}'
 */
show.get = (args: { announcement: string | { slug: string } } | [announcement: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Public\PublicAnnouncementController::show
 * @see app/Http/Controllers/Public/PublicAnnouncementController.php:95
 * @route '/announcements/{announcement}'
 */
show.head = (args: { announcement: string | { slug: string } } | [announcement: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Public\PublicAnnouncementController::show
 * @see app/Http/Controllers/Public/PublicAnnouncementController.php:95
 * @route '/announcements/{announcement}'
 */
    const showForm = (args: { announcement: string | { slug: string } } | [announcement: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Public\PublicAnnouncementController::show
 * @see app/Http/Controllers/Public/PublicAnnouncementController.php:95
 * @route '/announcements/{announcement}'
 */
        showForm.get = (args: { announcement: string | { slug: string } } | [announcement: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Public\PublicAnnouncementController::show
 * @see app/Http/Controllers/Public/PublicAnnouncementController.php:95
 * @route '/announcements/{announcement}'
 */
        showForm.head = (args: { announcement: string | { slug: string } } | [announcement: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
const PublicAnnouncementController = { index, show }

export default PublicAnnouncementController