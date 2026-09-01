import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Filament\Resources\Staff\Pages\ListStaff::__invoke
 * @see app/Filament/Resources/Staff/Pages/ListStaff.php:7
 * @route '/admin/staff'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/staff',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Filament\Resources\Staff\Pages\ListStaff::__invoke
 * @see app/Filament/Resources/Staff/Pages/ListStaff.php:7
 * @route '/admin/staff'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Filament\Resources\Staff\Pages\ListStaff::__invoke
 * @see app/Filament/Resources/Staff/Pages/ListStaff.php:7
 * @route '/admin/staff'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Filament\Resources\Staff\Pages\ListStaff::__invoke
 * @see app/Filament/Resources/Staff/Pages/ListStaff.php:7
 * @route '/admin/staff'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Filament\Resources\Staff\Pages\ListStaff::__invoke
 * @see app/Filament/Resources/Staff/Pages/ListStaff.php:7
 * @route '/admin/staff'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Filament\Resources\Staff\Pages\ListStaff::__invoke
 * @see app/Filament/Resources/Staff/Pages/ListStaff.php:7
 * @route '/admin/staff'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Filament\Resources\Staff\Pages\ListStaff::__invoke
 * @see app/Filament/Resources/Staff/Pages/ListStaff.php:7
 * @route '/admin/staff'
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
const staff = {
    index: Object.assign(index, index),
}

export default staff