import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import keepAlive from './keep-alive'
/**
* @see \App\Http\Controllers\Settings\SystemSettingController::edit
 * @see app/Http/Controllers/Settings/SystemSettingController.php:21
 * @route '/settings/system'
 */
export const edit = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/settings/system',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Settings\SystemSettingController::edit
 * @see app/Http/Controllers/Settings/SystemSettingController.php:21
 * @route '/settings/system'
 */
edit.url = (options?: RouteQueryOptions) => {
    return edit.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\SystemSettingController::edit
 * @see app/Http/Controllers/Settings/SystemSettingController.php:21
 * @route '/settings/system'
 */
edit.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Settings\SystemSettingController::edit
 * @see app/Http/Controllers/Settings/SystemSettingController.php:21
 * @route '/settings/system'
 */
edit.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Settings\SystemSettingController::edit
 * @see app/Http/Controllers/Settings/SystemSettingController.php:21
 * @route '/settings/system'
 */
    const editForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Settings\SystemSettingController::edit
 * @see app/Http/Controllers/Settings/SystemSettingController.php:21
 * @route '/settings/system'
 */
        editForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Settings\SystemSettingController::edit
 * @see app/Http/Controllers/Settings/SystemSettingController.php:21
 * @route '/settings/system'
 */
        editForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    edit.form = editForm
const system = {
    edit: Object.assign(edit, edit),
keepAlive: Object.assign(keepAlive, keepAlive),
}

export default system