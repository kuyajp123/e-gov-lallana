import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../../wayfinder'
/**
* @see \App\Filament\Resources\Households\Pages\CreateHousehold::__invoke
 * @see app/Filament/Resources/Households/Pages/CreateHousehold.php:7
 * @route '/admin/households/create'
 */
const CreateHousehold = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: CreateHousehold.url(options),
    method: 'get',
})

CreateHousehold.definition = {
    methods: ["get","head"],
    url: '/admin/households/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Filament\Resources\Households\Pages\CreateHousehold::__invoke
 * @see app/Filament/Resources/Households/Pages/CreateHousehold.php:7
 * @route '/admin/households/create'
 */
CreateHousehold.url = (options?: RouteQueryOptions) => {
    return CreateHousehold.definition.url + queryParams(options)
}

/**
* @see \App\Filament\Resources\Households\Pages\CreateHousehold::__invoke
 * @see app/Filament/Resources/Households/Pages/CreateHousehold.php:7
 * @route '/admin/households/create'
 */
CreateHousehold.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: CreateHousehold.url(options),
    method: 'get',
})
/**
* @see \App\Filament\Resources\Households\Pages\CreateHousehold::__invoke
 * @see app/Filament/Resources/Households/Pages/CreateHousehold.php:7
 * @route '/admin/households/create'
 */
CreateHousehold.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: CreateHousehold.url(options),
    method: 'head',
})

    /**
* @see \App\Filament\Resources\Households\Pages\CreateHousehold::__invoke
 * @see app/Filament/Resources/Households/Pages/CreateHousehold.php:7
 * @route '/admin/households/create'
 */
    const CreateHouseholdForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: CreateHousehold.url(options),
        method: 'get',
    })

            /**
* @see \App\Filament\Resources\Households\Pages\CreateHousehold::__invoke
 * @see app/Filament/Resources/Households/Pages/CreateHousehold.php:7
 * @route '/admin/households/create'
 */
        CreateHouseholdForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: CreateHousehold.url(options),
            method: 'get',
        })
            /**
* @see \App\Filament\Resources\Households\Pages\CreateHousehold::__invoke
 * @see app/Filament/Resources/Households/Pages/CreateHousehold.php:7
 * @route '/admin/households/create'
 */
        CreateHouseholdForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: CreateHousehold.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    CreateHousehold.form = CreateHouseholdForm
export default CreateHousehold