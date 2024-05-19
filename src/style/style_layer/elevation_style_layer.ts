import {StyleLayer} from '../style_layer';

import properties, {HillshadePaintPropsPossiblyEvaluated} from './elevation_style_layer_properties.NOTg';
import {Transitionable, Transitioning, PossiblyEvaluated} from '../properties';

import type {HillshadePaintProps} from './elevation_style_layer_properties.NOTg';
import type {ColorSpecification, FilterSpecification, LayerSpecification, PropertyValueSpecification} from '@maplibre/maplibre-gl-style-spec';

export type ElevationLayerSpecification = {
	"id": string;
	"type": "elevation";
	"metadata"?: unknown;
	"source": string;
	"source-layer"?: string;
	"minzoom"?: number;
	"maxzoom"?: number;
	"filter"?: FilterSpecification;
	"layout"?: {
		"visibility"?: "visible" | "none";
	};
	"paint"?: {
		"hillshade-illumination-direction"?: PropertyValueSpecification<number>;
		"hillshade-illumination-anchor"?: PropertyValueSpecification<"map" | "viewport">;
		"hillshade-exaggeration"?: PropertyValueSpecification<number>;
		"hillshade-shadow-color"?: PropertyValueSpecification<ColorSpecification>;
		"hillshade-highlight-color"?: PropertyValueSpecification<ColorSpecification>;
		"hillshade-accent-color"?: PropertyValueSpecification<ColorSpecification>;
	};
};

export class ElevationStyleLayer extends StyleLayer {
    _transitionablePaint: Transitionable<HillshadePaintProps>;
    _transitioningPaint: Transitioning<HillshadePaintProps>;
    paint: PossiblyEvaluated<HillshadePaintProps, HillshadePaintPropsPossiblyEvaluated>;

    constructor(layer: ElevationLayerSpecification) {
        super(layer, properties);
    }

    hasOffscreenPass() {
        return this.paint.get('hillshade-exaggeration') !== 0 && this.visibility !== 'none';
    }
}
