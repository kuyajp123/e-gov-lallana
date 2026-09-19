import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
import preferences from './preferences'
/**
* @see \App\Http\Controllers\Notification\NotificationController::index
 * @see app/Http/Controllers/Notification/NotificationController.php:23
 * @route '/notifications'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/notifications',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Notification\NotificationController::index
 * @see app/Http/Controllers/Notification/NotificationController.php:23
 * @route '/notifications'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Notification\NotificationController::index
 * @see app/Http/Controllers/Notification/NotificationController.php:23
 * @route '/notifications'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Notification\NotificationController::index
 * @see app/Http/Controllers/Notification/NotificationController.php:23
 * @route '/notifications'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Notification\NotificationController::index
 * @see app/Http/Controllers/Notification/NotificationController.php:23
 * @route '/notifications'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Notification\NotificationController::index
 * @see app/Http/Controllers/Notification/NotificationController.php:23
 * @route '/notifications'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Notification\NotificationController::index
 * @see app/Http/Controllers/Notification/NotificationController.php:23
 * @route '/notifications'
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
* @see \App\Http\Controllers\Notification\NotificationController::read
 * @see app/Http/Controllers/Notification/NotificationController.php:47
 * @route '/notifications/{id}/read'
 */
export const read = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: read.url(args, options),
    method: 'patch',
})

read.definition = {
    methods: ["patch"],
    url: '/notifications/{id}/read',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Notification\NotificationController::read
 * @see app/Http/Controllers/Notification/NotificationController.php:47
 * @route '/notifications/{id}/read'
 */
read.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    id: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        id: args.id,
                }

    return read.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Notification\NotificationController::read
 * @see app/Http/Controllers/Notification/NotificationController.php:47
 * @route '/notifications/{id}/read'
 */
read.patch = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: read.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Notification\NotificationController::read
 * @see app/Http/Controllers/Notification/NotificationController.php:47
 * @route '/notifications/{id}/read'
 */
    const readForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: read.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Notification\NotificationController::read
 * @see app/Http/Controllers/Notification/NotificationController.php:47
 * @route '/notifications/{id}/read'
 */
        readForm.patch = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: read.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    read.form = readForm
/**
* @see \App\Http\Controllers\Notification\NotificationController::readAll
 * @see app/Http/Controllers/Notification/NotificationController.php:62
 * @route '/notifications/read-all'
 */
export const readAll = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: readAll.url(options),
    method: 'post',
})

readAll.definition = {
    methods: ["post"],
    url: '/notifications/read-all',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Notification\NotificationController::readAll
 * @see app/Http/Controllers/Notification/NotificationController.php:62
 * @route '/notifications/read-all'
 */
readAll.url = (options?: RouteQueryOptions) => {
    return readAll.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Notification\NotificationController::readAll
 * @see app/Http/Controllers/Notification/NotificationController.php:62
 * @route '/notifications/read-all'
 */
readAll.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: readAll.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Notification\NotificationController::readAll
 * @see app/Http/Controllers/Notification/NotificationController.php:62
 * @route '/notifications/read-all'
 */
    const readAllForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: readAll.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Notification\NotificationController::readAll
 * @see app/Http/Controllers/Notification/NotificationController.php:62
 * @route '/notifications/read-all'
 */
        readAllForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: readAll.url(options),
            method: 'post',
        })
    
    readAll.form = readAllForm
const notifications = {
    index: Object.assign(index, index),
read: Object.assign(read, read),
readAll: Object.assign(readAll, readAll),
preferences: Object.assign(preferences, preferences),
}

export default notifications