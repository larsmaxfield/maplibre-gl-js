#ifdef GL_ES
precision highp float;
#endif

uniform sampler2D u_image;
in vec2 v_pos;


uniform vec2 u_dimension;
uniform float u_zoom;
uniform vec4 u_unpack;  // Unpacking (decoding) values: red factor, green factor, blue factor, baseshift
uniform vec2 u_breakpoints;  // Lowest and highest elevation breakpoints of colormap in elevation units [ low, high ]
uniform float u_lowcutoff;  // Cutoff value such that any value lower than it is assigned the same color, useful for coloring NaNs or values below sea-level
uniform vec4 u_lowcutoffcolor;  // Color by which to assign values lower than the minimum cutoff

float getElevation(vec2 coord, float bias) {
    // Convert encoded elevation value to meters
    vec4 data = texture(u_image, coord) * 255.0;  // Retrieve RGBA texture values at that coordinate
    data.a = -1.0;  // Set alpha channel to -1.0 so that the baseshift is subtracted during dot product (e.g., 10000 baseshift results in -10000)
    return dot(data, u_unpack);
}

// fitting polynomials to matplotlib colormaps
// https://www.shadertoy.com/view/WlfXRN
//
// License CC0 (public domain) 
//   https://creativecommons.org/share-your-work/public-domain/cc0/
//
// feel free to use these in your own work!
//
// similar to https://www.shadertoy.com/view/XtGGzG but with a couple small differences:
//
//  - use degree 6 instead of degree 5 polynomials
//  - use nested horner representation for polynomials
//  - polynomials were fitted to minimize maximum error (as opposed to least squares)
//
// data fitted from https://github.com/BIDS/colormap/blob/master/colormaps.py
// (which is licensed CC0)

<COLORMAP>  // Replaced in shaders.ts; example: 'vec4 colormap(float t) {vec4(vec3(t), 1.0)};'

vec3 viridis(float t) {

    const vec3 c0 = vec3(0.2777273272234177, 0.005407344544966578, 0.3340998053353061);
    const vec3 c1 = vec3(0.1050930431085774, 1.404613529898575, 1.384590162594685);
    const vec3 c2 = vec3(-0.3308618287255563, 0.214847559468213, 0.09509516302823659);
    const vec3 c3 = vec3(-4.634230498983486, -5.799100973351585, -19.33244095627987);
    const vec3 c4 = vec3(6.228269936347081, 14.17993336680509, 56.69055260068105);
    const vec3 c5 = vec3(4.776384997670288, -13.74514537774601, -65.35303263337234);
    const vec3 c6 = vec3(-5.435455855934631, 4.645852612178535, 26.3124352495832);

    return c0+t*(c1+t*(c2+t*(c3+t*(c4+t*(c5+t*c6)))));

}

vec3 plasma(float t) {

    const vec3 c0 = vec3(0.05873234392399702, 0.02333670892565664, 0.5433401826748754);
    const vec3 c1 = vec3(2.176514634195958, 0.2383834171260182, 0.7539604599784036);
    const vec3 c2 = vec3(-2.689460476458034, -7.455851135738909, 3.110799939717086);
    const vec3 c3 = vec3(6.130348345893603, 42.3461881477227, -28.51885465332158);
    const vec3 c4 = vec3(-11.10743619062271, -82.66631109428045, 60.13984767418263);
    const vec3 c5 = vec3(10.02306557647065, 71.41361770095349, -54.07218655560067);
    const vec3 c6 = vec3(-3.658713842777788, -22.93153465461149, 18.19190778539828);

    return c0+t*(c1+t*(c2+t*(c3+t*(c4+t*(c5+t*c6)))));

}

vec3 magma(float t) {

    const vec3 c0 = vec3(-0.002136485053939582, -0.000749655052795221, -0.005386127855323933);
    const vec3 c1 = vec3(0.2516605407371642, 0.6775232436837668, 2.494026599312351);
    const vec3 c2 = vec3(8.353717279216625, -3.577719514958484, 0.3144679030132573);
    const vec3 c3 = vec3(-27.66873308576866, 14.26473078096533, -13.64921318813922);
    const vec3 c4 = vec3(52.17613981234068, -27.94360607168351, 12.94416944238394);
    const vec3 c5 = vec3(-50.76852536473588, 29.04658282127291, 4.23415299384598);
    const vec3 c6 = vec3(18.65570506591883, -11.48977351997711, -5.601961508734096);

    return c0+t*(c1+t*(c2+t*(c3+t*(c4+t*(c5+t*c6)))));

}

vec3 inferno(float t) {

    const vec3 c0 = vec3(0.0002189403691192265, 0.001651004631001012, -0.01948089843709184);
    const vec3 c1 = vec3(0.1065134194856116, 0.5639564367884091, 3.932712388889277);
    const vec3 c2 = vec3(11.60249308247187, -3.972853965665698, -15.9423941062914);
    const vec3 c3 = vec3(-41.70399613139459, 17.43639888205313, 44.35414519872813);
    const vec3 c4 = vec3(77.162935699427, -33.40235894210092, -81.80730925738993);
    const vec3 c5 = vec3(-71.31942824499214, 32.62606426397723, 73.20951985803202);
    const vec3 c6 = vec3(25.13112622477341, -12.24266895238567, -23.07032500287172);

    return c0+t*(c1+t*(c2+t*(c3+t*(c4+t*(c5+t*c6)))));

}

void main() {
    // vec2 epsilon = 1.0 / u_dimension;

    // queried pixels:
    // +-----------+
    // |   |   |   |
    // | a | b | c |
    // |   |   |   |
    // +-----------+
    // |   |   |   |
    // | d | e | f |
    // |   |   |   |
    // +-----------+
    // |   |   |   |
    // | g | h | i |
    // |   |   |   |
    // +-----------+

    // float a = getElevation(v_pos + vec2(-epsilon.x, -epsilon.y), 0.0);
    // float b = getElevation(v_pos + vec2(0, -epsilon.y), 0.0);
    // float c = getElevation(v_pos + vec2(epsilon.x, -epsilon.y), 0.0);
    // float d = getElevation(v_pos + vec2(-epsilon.x, 0), 0.0);
    // float e = getElevation(v_pos, 0.0);
    // float f = getElevation(v_pos + vec2(epsilon.x, 0), 0.0);
    // float g = getElevation(v_pos + vec2(-epsilon.x, epsilon.y), 0.0);
    // float h = getElevation(v_pos + vec2(0, epsilon.y), 0.0);
    // float i = getElevation(v_pos + vec2(epsilon.x, epsilon.y), 0.0);

    // Here we divide the x and y slopes by 8 * pixel size
    // where pixel size (aka meters/pixel) is:
    // circumference of the world / (pixels per tile * number of tiles)
    // which is equivalent to: 8 * 40075016.6855785 / (512 * pow(2, u_zoom))
    // which can be reduced to: pow(2, 19.25619978527 - u_zoom).
    // We want to vertically exaggerate the hillshading because otherwise
    // it is barely noticeable at low zooms. To do this, we multiply this by
    // a scale factor that is a function of zooms below 15, which is an arbitrary
    // that corresponds to the max zoom level of Mapbox terrain-RGB tiles.
    // See nickidlugash's awesome breakdown for more info:
    // https://github.com/mapbox/mapbox-gl-js/pull/5286#discussion_r148419556

    // float exaggerationFactor = u_zoom < 2.0 ? 0.4 : u_zoom < 4.5 ? 0.35 : 0.3;
    // float exaggeration = u_zoom < 15.0 ? (u_zoom - 15.0) * exaggerationFactor : 0.0;

    // vec2 deriv = vec2(
    //     (c + f + f + i) - (a + d + d + g),
    //     (g + h + h + i) - (a + b + b + c)
    // ) / pow(2.0, exaggeration + (19.2562 - u_zoom));

    // fragColor = clamp(vec4(
    //    deriv.x / 2.0 + 0.5,
    //    deriv.y / 2.0 + 0.5,
    //    1.0,
    //    1.0), 0.0, 1.0);

    // vec3 color = viridis(a/1000.0);


    /// float e = getElevation(v_pos, 0.0);
/// 
    /// float high = u_breakpoints[1];
    /// float low = u_breakpoints[0];
/// 
    /// float e_norm = clamp(
    ///     (e - low) / ( high - low ),
    ///     0.0, 1.0);
/// 
    /// vec4 color = e < u_lowcutoff ? u_lowcutoffcolor : colormap(e_norm);
/// 
    /// fragColor = clamp(
    ///     color,
    ///     0.0, 1.0);


    fragColor = texture(u_image, v_pos);

#ifdef OVERDRAW_INSPECTOR
    fragColor = vec4(1.0);
#endif
}
