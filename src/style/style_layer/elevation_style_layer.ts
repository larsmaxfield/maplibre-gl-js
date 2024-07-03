import {StyleLayer} from '../style_layer';

import properties, {ElevationPaintPropsPossiblyEvaluated} from './elevation_style_layer_properties.NOTg';
import {Transitionable, Transitioning, PossiblyEvaluated} from '../properties';

import type {ElevationPaintProps} from './elevation_style_layer_properties.NOTg';
import type {ColorSpecification, FilterSpecification, PropertyValueSpecification} from '@maplibre/maplibre-gl-style-spec';

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
		"elevation-colormap-breakpoint-low"?: PropertyValueSpecification<number>;
		"elevation-colormap-breakpoint-high"?: PropertyValueSpecification<number>;
		"elevation-colormap-function"?: PropertyValueSpecification<string>;
		"elevation-colormap-lowcutoff"?: PropertyValueSpecification<number>;
		"elevation-colormap-lowcutoff-color"?: PropertyValueSpecification<ColorSpecification>;
		"elevation-main-function"?: PropertyValueSpecification<string>;
		"elevation-prepare-main-function"?: PropertyValueSpecification<string>;
	};
};

export class ElevationStyleLayer extends StyleLayer {
    // _transitionablePaint: Transitionable<ElevationPaintProps>;
    // _transitioningPaint: Transitioning<ElevationPaintProps>;
    paint: PossiblyEvaluated<ElevationPaintProps, ElevationPaintPropsPossiblyEvaluated>;

    constructor(layer: ElevationLayerSpecification) {
        super(layer, properties);
    }

    hasOffscreenPass() {
        return this.paint.get('hillshade-exaggeration') !== 0 && this.visibility !== 'none';
    }
}
