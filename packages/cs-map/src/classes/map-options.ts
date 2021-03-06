import { WidgetOptions, Form, FormField, IDatasource } from '@csnext/cs-core';
import { MapboxOptions } from 'mapbox-gl'

@Form({ title: 'Map Options'})
export class MapOptions extends WidgetOptions
{
    // @FormField({title: 'MapGL token'})
    public token?: string;
    public mbOptions?: MapboxOptions;
    public activeLayers?: string[] = [];
}
