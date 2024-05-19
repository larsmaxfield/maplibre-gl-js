import {StyleLayer} from '../style_layer';

import properties, {HillshadePaintPropsPossiblyEvaluated} from './elevation_style_layer_properties.NOTg';
import {Transitionable, Transitioning, PossiblyEvaluated} from '../properties';

import type {HillshadePaintProps} from './elevation_style_layer_properties.NOTg';
import type {LayerSpecification} from '@maplibre/maplibre-gl-style-spec';

export class ElevationStyleLayer extends StyleLayer {
    _transitionablePaint: Transitionable<HillshadePaintProps>;
    _transitioningPaint: Transitioning<HillshadePaintProps>;
    paint: PossiblyEvaluated<HillshadePaintProps, HillshadePaintPropsPossiblyEvaluated>;

    constructor(layer: LayerSpecification) {
        super(layer, properties);
    }

    hasOffscreenPass() {
        return this.paint.get('hillshade-exaggeration') !== 0 && this.visibility !== 'none';
    }
}
