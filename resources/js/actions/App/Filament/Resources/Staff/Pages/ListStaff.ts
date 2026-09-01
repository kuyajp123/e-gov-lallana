import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../../wayfinder'
/**
* @see \App\Filament\Resources\Staff\Pages\ListStaff::__invoke
 * @see app/Filament/Resources/Staff/Pages/ListStaff.php:7
 * @route '/admin/staff'
 */
const ListStaff = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ListStaff.url(options),
    method: 'get',
})

ListStaff.definition = {
    methods: ["get","head"],
    url: '/admin/staff',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Filament\Resources\Staff\Pages\ListStaff::__invoke
 * @see app/Filament/Resources/Staff/Pages/ListStaff.php:7
 * @route '/admin/staff'
 */
ListStaff.url = (options?: RouteQueryOptions) => {
    return ListStaff.definition.url + queryParams(options)
}

/**
* @see \App\Filament\Resources\Staff\Pages\ListStaff::__invoke
 * @see app/Filament/Resources/Staff/Pages/ListStaff.php:7
 * @route '/admin/staff'
 */
ListStaff.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ListStaff.url(options),
    method: 'get',
})
/**
* @see \App\Filament\Resources\Staff\Pages\ListStaff::__invoke
 * @see app/Filament/Resources/Staff/Pages/ListStaff.php:7
 * @route '/admin/staff'
 */
ListStaff.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: ListStaff.url(options),
    method: 'head',
})

    /**
* @see \App\Filament\Resources\Staff\Pages\ListStaff::__invoke
 * @see app/Filament/Resources/Staff/Pages/ListStaff.php:7
 * @route '/admin/staff'
 */
    const ListStaffForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: ListStaff.url(options),
        method: 'get',
    })

            /**
* @see \App\Filament\Resources\Staff\Pages\ListStaff::__invoke
 * @see app/Filament/Resources/Staff/Pages/ListStaff.php:7
 * @route '/admin/staff'
 */
        ListStaffForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: ListStaff.url(options),
            method: 'get',
        })
            /**
* @see \App\Filament\Resources\Staff\Pages\ListStaff::__invoke
 * @see app/Filament/Resources/Staff/Pages/ListStaff.php:7
 * @route '/admin/staff'
 */
        ListStaffForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: ListStaff.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    ListStaff.form = ListStaffForm
export default ListStaff