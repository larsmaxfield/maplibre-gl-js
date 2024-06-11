import {mat4} from 'gl-matrix';

import {
    Uniform1i,
    Uniform1f,
    Uniform2f,
    UniformColor,
    UniformMatrix4f,
    Uniform4f
} from '../uniform_binding';
import {EXTENT} from '../../data/extent';
import {MercatorCoordinate} from '../../geo/mercator_coordinate';

import type {Context} from '../../gl/context';
import type {UniformValues, UniformLocations} from '../uniform_binding';
import type {Tile} from '../../source/tile';
import type {Painter} from '../painter';
import type {ElevationStyleLayer} from '../../style/style_layer/elevation_style_layer';
import type {DEMData} from '../../data/dem_data';
import type {OverscaledTileID} from '../../source/tile_id';

export type ElevationUniformsType = {
    'u_matrix': UniformMatrix4f;
    'u_image': Uniform1i;
    'u_latrange': Uniform2f;
    'u_light': Uniform2f;
    'u_shadow': UniformColor;
    'u_highlight': UniformColor;
    'u_accent': UniformColor;
    'u_unpack': Uniform4f;
    'u_breakpoints': Uniform2f;
    'u_lowcutoff': Uniform1f;
    'u_lowcutoffcolor': UniformColor;
};

export type ElevationPrepareUniformsType = {
    'u_matrix': UniformMatrix4f;
    'u_image': Uniform1i;
    'u_dimension': Uniform2f;
    'u_zoom': Uniform1f;
    'u_unpack': Uniform4f;
    'u_breakpoints': Uniform2f;
    'u_lowcutoff': Uniform1f;
    'u_lowcutoffcolor': UniformColor;
};

const elevationUniforms = (context: Context, locations: UniformLocations): ElevationUniformsType => ({
    'u_matrix': new UniformMatrix4f(context, locations.u_matrix),
    'u_image': new Uniform1i(context, locations.u_image),
    'u_latrange': new Uniform2f(context, locations.u_latrange),
    'u_light': new Uniform2f(context, locations.u_light),
    'u_shadow': new UniformColor(context, locations.u_shadow),
    'u_highlight': new UniformColor(context, locations.u_highlight),
    'u_accent': new UniformColor(context, locations.u_accent),
    'u_unpack': new Uniform4f(context, locations.u_unpack),
    'u_breakpoints': new Uniform2f(context, locations.u_breakpoints),
    'u_lowcutoff': new Uniform1f(context, locations.u_lowcutoff),
    'u_lowcutoffcolor': new UniformColor(context, locations.u_lowcutoffcolor),
});

const elevationPrepareUniforms = (context: Context, locations: UniformLocations): ElevationPrepareUniformsType => ({
    'u_matrix': new UniformMatrix4f(context, locations.u_matrix),
    'u_image': new Uniform1i(context, locations.u_image),
    'u_dimension': new Uniform2f(context, locations.u_dimension),
    'u_zoom': new Uniform1f(context, locations.u_zoom),
    'u_unpack': new Uniform4f(context, locations.u_unpack),
    'u_breakpoints': new Uniform2f(context, locations.u_breakpoints),
    'u_lowcutoff': new Uniform1f(context, locations.u_lowcutoff),
    'u_lowcutoffcolor': new UniformColor(context, locations.u_lowcutoffcolor),
});

const elevationUniformValues = (
    painter: Painter,
    tile: Tile,
    dem: DEMData,
    layer: ElevationStyleLayer,
    coord: OverscaledTileID
): UniformValues<ElevationUniformsType> => {
    const shadow = layer.paint.get('hillshade-shadow-color');
    const highlight = layer.paint.get('hillshade-highlight-color');
    const accent = layer.paint.get('hillshade-accent-color');

    let azimuthal = layer.paint.get('hillshade-illumination-direction') * (Math.PI / 180);
    // modify azimuthal angle by map rotation if light is anchored at the viewport
    if (layer.paint.get('hillshade-illumination-anchor') === 'viewport') {
        azimuthal -= painter.transform.angle;
    }
    const align = !painter.options.moving;

    const breaklow = layer.paint.get('elevation-colormap-breakpoint-low');
    const breakhigh = layer.paint.get('elevation-colormap-breakpoint-high');
    const lowcutoff = layer.paint.get('elevation-colormap-lowcutoff');
    const lowcutoffcolor = layer.paint.get('elevation-colormap-lowcutoff-color');

    return {
        'u_matrix': coord ? coord.posMatrix : painter.transform.calculatePosMatrix(tile.tileID.toUnwrapped(), align),
        'u_image': 0,
        'u_latrange': getTileLatRange(painter, tile.tileID),
        'u_light': [layer.paint.get('hillshade-exaggeration'), azimuthal],
        'u_shadow': shadow,
        'u_highlight': highlight,
        'u_accent': accent,
        'u_unpack': dem.getUnpackVector(),
        'u_breakpoints': [breaklow, breakhigh],
        'u_lowcutoff': lowcutoff,
        'u_lowcutoffcolor': lowcutoffcolor,
    };
};

const elevationUniformPrepareValues = (tileID: OverscaledTileID, dem: DEMData, layer: ElevationStyleLayer): UniformValues<ElevationPrepareUniformsType> => {

    const stride = dem.stride;
    const matrix = mat4.create();
    // Flip rendering at y axis.
    mat4.ortho(matrix, 0, EXTENT, -EXTENT, 0, 0, 1);
    mat4.translate(matrix, matrix, [0, -EXTENT, 0]);

    const breaklow = layer.paint.get('elevation-colormap-breakpoint-low');
    const breakhigh = layer.paint.get('elevation-colormap-breakpoint-high');
    const lowcutoff = layer.paint.get('elevation-colormap-lowcutoff');
    const lowcutoffcolor = layer.paint.get('elevation-colormap-lowcutoff-color');

    return {
        'u_matrix': matrix,
        'u_image': 1,
        'u_dimension': [stride, stride],
        'u_zoom': tileID.overscaledZ,
        'u_unpack': dem.getUnpackVector(),
        'u_breakpoints': [breaklow, breakhigh],
        'u_lowcutoff': lowcutoff,
        'u_lowcutoffcolor': lowcutoffcolor,
    };
};

function getTileLatRange(painter: Painter, tileID: OverscaledTileID) {
    // for scaling the magnitude of a points slope by its latitude
    const tilesAtZoom = Math.pow(2, tileID.canonical.z);
    const y = tileID.canonical.y;
    return [
        new MercatorCoordinate(0, y / tilesAtZoom).toLngLat().lat,
        new MercatorCoordinate(0, (y + 1) / tilesAtZoom).toLngLat().lat];
}

// TODO: Function to get highest and lowest elevation in the viewable tiles to set breakpoints automatically 
// Get inspiration from getTileLatRange
// getTileElevationRange()

export {
    elevationUniforms,
    elevationPrepareUniforms,
    elevationUniformValues,
    elevationUniformPrepareValues
};
