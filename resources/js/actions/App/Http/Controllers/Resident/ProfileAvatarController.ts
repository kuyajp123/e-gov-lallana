import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Resident\ProfileAvatarController::update
 * @see app/Http/Controllers/Resident/ProfileAvatarController.php:14
 * @route '/resident/profile/avatar'
 */
export const update = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(options),
    method: 'post',
})

update.definition = {
    methods: ["post"],
    url: '/resident/profile/avatar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Resident\ProfileAvatarController::update
 * @see app/Http/Controllers/Resident/ProfileAvatarController.php:14
 * @route '/resident/profile/avatar'
 */
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Resident\ProfileAvatarController::update
 * @see app/Http/Controllers/Resident/ProfileAvatarController.php:14
 * @route '/resident/profile/avatar'
 */
update.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Resident\ProfileAvatarController::update
 * @see app/Http/Controllers/Resident/ProfileAvatarController.php:14
 * @route '/resident/profile/avatar'
 */
    const updateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Resident\ProfileAvatarController::update
 * @see app/Http/Controllers/Resident/ProfileAvatarController.php:14
 * @route '/resident/profile/avatar'
 */
        updateForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(options),
            method: 'post',
        })
    
    update.form = updateForm
const ProfileAvatarController = { update }

export default ProfileAvatarController