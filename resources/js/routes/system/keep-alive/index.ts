import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Settings\SystemSettingController::update
 * @see app/Http/Controllers/Settings/SystemSettingController.php:33
 * @route '/settings/system/keep-alive'
 */
export const update = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(options),
    method: 'post',
})

update.definition = {
    methods: ["post"],
    url: '/settings/system/keep-alive',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Settings\SystemSettingController::update
 * @see app/Http/Controllers/Settings/SystemSettingController.php:33
 * @route '/settings/system/keep-alive'
 */
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Settings\SystemSettingController::update
 * @see app/Http/Controllers/Settings/SystemSettingController.php:33
 * @route '/settings/system/keep-alive'
 */
update.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Settings\SystemSettingController::update
 * @see app/Http/Controllers/Settings/SystemSettingController.php:33
 * @route '/settings/system/keep-alive'
 */
    const updateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Settings\SystemSettingController::update
 * @see app/Http/Controllers/Settings/SystemSettingController.php:33
 * @route '/settings/system/keep-alive'
 */
        updateForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(options),
            method: 'post',
        })
    
    update.form = updateForm
const keepAlive = {
    update: Object.assign(update, update),
}

export default keepAlive