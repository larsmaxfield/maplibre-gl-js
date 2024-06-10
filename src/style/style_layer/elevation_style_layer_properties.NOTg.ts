// NOT GENERATED.
/* eslint-disable */

import {latest as styleSpec} from '@maplibre/maplibre-gl-style-spec';

import {
    Properties,
    DataConstantProperty,
    DataDrivenProperty,
    CrossFadedDataDrivenProperty,
    CrossFadedProperty,
    ColorRampProperty,
    PossiblyEvaluatedPropertyValue,
    CrossFaded
} from '../properties';

import type {Color, Formatted, Padding, ResolvedImage, VariableAnchorOffsetCollection} from '@maplibre/maplibre-gl-style-spec';
import {StylePropertySpecification} from '@maplibre/maplibre-gl-style-spec';


export type ElevationPaintProps = {
    "hillshade-illumination-direction": DataConstantProperty<number>,
    "hillshade-illumination-anchor": DataConstantProperty<"map" | "viewport">,
    "hillshade-exaggeration": DataConstantProperty<number>,
    "hillshade-shadow-color": DataConstantProperty<Color>,
    "hillshade-highlight-color": DataConstantProperty<Color>,
    "hillshade-accent-color": DataConstantProperty<Color>,
    "elevation-colormap-breakpoint-low": DataConstantProperty<number>,
    "elevation-colormap-breakpoint-high": DataConstantProperty<number>,
    "elevation-colormap-function": DataConstantProperty<string>,
    "elevation-colormap-lowcutoff": DataConstantProperty<number>,
    "elevation-colormap-lowcutoff-color": DataConstantProperty<Color>,
};

export type ElevationPaintPropsPossiblyEvaluated = {
    "hillshade-illumination-direction": number,
    "hillshade-illumination-anchor": "map" | "viewport",
    "hillshade-exaggeration": number,
    "hillshade-shadow-color": Color,
    "hillshade-highlight-color": Color,
    "hillshade-accent-color": Color,
    "elevation-colormap-breakpoint-low": number,
    "elevation-colormap-breakpoint-high": number,
    "elevation-colormap-function": string,
    "elevation-colormap-lowcutoff": number,
    "elevation-colormap-lowcutoff-color": Color,
};

let paint: Properties<ElevationPaintProps>;
const getPaint = () => paint = paint || new Properties({
    "hillshade-illumination-direction": new DataConstantProperty(elevationDefaultStyleSpec["paint_hillshade"]["hillshade-illumination-direction"] as any as StylePropertySpecification),
    "hillshade-illumination-anchor": new DataConstantProperty(elevationDefaultStyleSpec["paint_hillshade"]["hillshade-illumination-anchor"] as any as StylePropertySpecification),
    "hillshade-exaggeration": new DataConstantProperty(elevationDefaultStyleSpec["paint_hillshade"]["hillshade-exaggeration"] as any as StylePropertySpecification),
    "hillshade-shadow-color": new DataConstantProperty(elevationDefaultStyleSpec["paint_hillshade"]["hillshade-shadow-color"] as any as StylePropertySpecification),
    "hillshade-highlight-color": new DataConstantProperty(elevationDefaultStyleSpec["paint_hillshade"]["hillshade-highlight-color"] as any as StylePropertySpecification),
    "hillshade-accent-color": new DataConstantProperty(elevationDefaultStyleSpec["paint_hillshade"]["hillshade-accent-color"] as any as StylePropertySpecification),
    "elevation-colormap-breakpoint-low": new DataConstantProperty(elevationDefaultStyleSpec["paint_elevation"]["elevation-colormap-breakpoint-low"] as any as StylePropertySpecification),
    "elevation-colormap-breakpoint-high": new DataConstantProperty(elevationDefaultStyleSpec["paint_elevation"]["elevation-colormap-breakpoint-high"] as any as StylePropertySpecification),
    "elevation-colormap-function": new DataConstantProperty(elevationDefaultStyleSpec["paint_elevation"]["elevation-colormap-function"] as any as StylePropertySpecification),
    "elevation-colormap-lowcutoff": new DataConstantProperty(elevationDefaultStyleSpec["paint_elevation"]["elevation-colormap-lowcutoff"] as any as StylePropertySpecification),
    "elevation-colormap-lowcutoff-color": new DataConstantProperty(elevationDefaultStyleSpec["paint_elevation"]["elevation-colormap-lowcutoff-color"] as any as StylePropertySpecification),
});

export default ({ get paint() { return getPaint() } });

const elevationDefaultStyleSpec = {
    "paint_elevation": {
        "elevation-colormap-breakpoint-low": {
            "type": "number",
            "doc": "The low breakpoint for the colormap in elevation units.",
            "default": 0,
            "transition": true,
            "sdk-support": {
                "basic functionality": {
                "js": "0.43.0",
                }
            },
            "expression": {
                "interpolated": true,
                "parameters": [
                "zoom"
                ]
            },
            "property-type": "data-constant"
        },
        "elevation-colormap-breakpoint-high": {
            "type": "number",
            "doc": "The high breakpoint for the colormap in elevation units.",
            "default": 65535,
            "transition": true,
            "sdk-support": {
                "basic functionality": {
                "js": "0.43.0",
                }
            },
            "expression": {
                "interpolated": true,
                "parameters": [
                "zoom"
                ]
            },
            "property-type": "data-constant"
        },
        "elevation-colormap-function": {
            "type": "string",
            "doc": "The shader function for assigning the vec4 color (rgba) given a float value [0,1].",
            "default": "vec4 colormap(float t) {return vec4(vec3(t), 1.0);}",
        },
        "elevation-colormap-lowcutoff": {
            "type": "number",
            "doc": "The value below which all values are assigned the same color. Useful for coloring NaNs.",
            "default": 1,
            "transition": true,
            "sdk-support": {
                "basic functionality": {
                "js": "0.43.0",
                }
            },
            "expression": {
                "interpolated": true,
                "parameters": [
                "zoom"
                ]
            },
            "property-type": "data-constant"
        },
        "elevation-colormap-lowcutoff-color": {
            "type": "color",
            "default": "#FF00FF",
            "doc": "The color of values below the low cutoff.",
            "transition": true,
            "sdk-support": {
                "basic functionality": {
                "js": "0.43.0",
                }
            },
            "expression": {
                "interpolated": true,
                "parameters": [
                "zoom"
                ]
            },
            "property-type": "data-constant"
        },
    },
    "paint_hillshade": {
        "hillshade-illumination-direction": {
            "type": "number",
            "default": 335,
            "minimum": 0,
            "maximum": 359,
            "doc": "The direction of the light source used to generate the hillshading with 0 as the top of the viewport if `hillshade-illumination-anchor` is set to `viewport` and due north if `hillshade-illumination-anchor` is set to `map`.",
            "transition": false,
            "sdk-support": {
                "basic functionality": {
                "js": "0.43.0",
                "android": "6.0.0",
                "ios": "4.0.0",
                "macos": "0.7.0"
                }
            },
            "expression": {
                "interpolated": true,
                "parameters": [
                "zoom"
                ]
            },
            "property-type": "data-constant"
        },
        "hillshade-illumination-anchor": {
            "type": "enum",
            "values": {
                "map": {
                "doc": "The hillshade illumination is relative to the north direction."
                },
                "viewport": {
                "doc": "The hillshade illumination is relative to the top of the viewport."
                }
            },
            "default": "viewport",
            "doc": "Direction of light source when map is rotated.",
            "sdk-support": {
                "basic functionality": {
                "js": "0.43.0",
                "android": "6.0.0",
                "ios": "4.0.0",
                "macos": "0.7.0"
                }
            },
            "expression": {
                "interpolated": false,
                "parameters": [
                "zoom"
                ]
            },
            "property-type": "data-constant"
        },
        "hillshade-exaggeration": {
            "type": "number",
            "doc": "Intensity of the hillshade",
            "default": 0.5,
            "minimum": 0,
            "maximum": 1,
            "transition": true,
            "sdk-support": {
                "basic functionality": {
                "js": "0.43.0",
                "android": "6.0.0",
                "ios": "4.0.0",
                "macos": "0.7.0"
                }
            },
            "expression": {
                "interpolated": true,
                "parameters": [
                "zoom"
                ]
            },
            "property-type": "data-constant"
        },
        "hillshade-shadow-color": {
            "type": "color",
            "default": "#000000",
            "doc": "The shading color of areas that face away from the light source.",
            "transition": true,
            "sdk-support": {
                "basic functionality": {
                "js": "0.43.0",
                "android": "6.0.0",
                "ios": "4.0.0",
                "macos": "0.7.0"
                }
            },
            "expression": {
                "interpolated": true,
                "parameters": [
                "zoom"
                ]
            },
            "property-type": "data-constant"
        },
        "hillshade-highlight-color": {
            "type": "color",
            "default": "#FFFFFF",
            "doc": "The shading color of areas that faces towards the light source.",
            "transition": true,
            "sdk-support": {
                "basic functionality": {
                "js": "0.43.0",
                "android": "6.0.0",
                "ios": "4.0.0",
                "macos": "0.7.0"
                }
            },
            "expression": {
                "interpolated": true,
                "parameters": [
                "zoom"
                ]
            },
            "property-type": "data-constant"
        },
        "hillshade-accent-color": {
            "type": "color",
            "default": "#000000",
            "doc": "The shading color used to accentuate rugged terrain like sharp cliffs and gorges.",
            "transition": true,
            "sdk-support": {
                "basic functionality": {
                "js": "0.43.0",
                "android": "6.0.0",
                "ios": "4.0.0",
                "macos": "0.7.0"
                }
            },
            "expression": {
                "interpolated": true,
                "parameters": [
                "zoom"
                ]
            },
            "property-type": "data-constant"
        }
    },
}