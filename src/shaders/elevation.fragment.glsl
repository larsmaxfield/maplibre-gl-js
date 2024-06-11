#ifdef GL_ES
precision highp float;
#endif

uniform sampler2D u_image;
in vec2 v_pos;

uniform vec2 u_latrange;
uniform vec2 u_light;
uniform vec4 u_shadow;
uniform vec4 u_highlight;
uniform vec4 u_accent;
uniform vec2 u_breakpoints;

#define PI 3.141592653589793

float getElevation(vec2 coord) {
    // Convert encoded elevation value to meters
    vec4 data = texture(u_image, coord) * 255.0;  // Retrieve RGBA texture values at that coordinate
    data.a = -1.0;  // Set alpha channel to -1.0 so that the baseshift is subtracted during dot product (e.g., 10000 baseshift results in -10000)
    vec4 u_unpack = vec4(256.0, 1.0, 1.0/256.0, 32768.0);
    return dot(data, u_unpack);
}

float unpackElevation(vec4 rgba) {
    vec4 data = rgba * 255.0;
    data.a = -1.0;  // Set alpha channel to -1.0 so that the baseshift is subtracted during dot product (e.g., 10000 baseshift results in -10000)
    vec4 u_unpack = vec4(256.0, 1.0, 1.0/256.0, 32768.0);
    return dot(data, u_unpack);
}

void main() {
    vec4 pixel = texture(u_image, v_pos);
     
    // vec2 deriv = ((pixel.rg * 2.0) - 1.0);
    // 
    // // We divide the slope by a scale factor based on the cosin of the pixel's approximate latitude
    // // to account for mercator projection distortion. see #4807 for details
    // float scaleFactor = cos(radians((u_latrange[0] - u_latrange[1]) * (1.0 - v_pos.y) + u_latrange[1]));
    // // We also multiply the slope by an arbitrary z-factor of 1.25
    // float slope = atan(1.25 * length(deriv) / scaleFactor);
    // float aspect = deriv.x != 0.0 ? atan(deriv.y, -deriv.x) : PI / 2.0 * (deriv.y > 0.0 ? 1.0 : -1.0);
    // 
    // float intensity = u_light.x;
    // // We add PI to make this property match the global light object, which adds PI/2 to the light's azimuthal
    // // position property to account for 0deg corresponding to north/the top of the viewport in the style spec
    // // and the original shader was written to accept (-illuminationDirection - 90) as the azimuthal.
    // float azimuth = u_light.y + PI;
    // 
    // // We scale the slope exponentially based on intensity, using a calculation similar to
    // // the exponential interpolation function in the style spec:
    // // src/style-spec/expression/definitions/interpolate.js#L217-L228
    // // so that higher intensity values create more opaque hillshading.
    // float base = 1.875 - intensity * 1.75;
    // float maxValue = 0.5 * PI;
    // float scaledSlope = intensity != 0.5 ? ((pow(base, slope) - 1.0) / (pow(base, maxValue) - 1.0)) * maxValue : slope;
    // 
    // // The accent color is calculated with the cosine of the slope while the shade color is calculated with the sine
    // // so that the accent color's rate of change eases in while the shade color's eases out.
    // float accent = cos(scaledSlope);
    // // We multiply both the accent and shade color by a clamped intensity value
    // // so that intensities >= 0.5 do not additionally affect the color values
    // // while intensity values < 0.5 make the overall color more transparent.
    // vec4 accent_color = (1.0 - accent) * u_accent * clamp(intensity * 2.0, 0.0, 1.0);
    // float shade = abs(mod((aspect + azimuth) / PI + 0.5, 2.0) - 1.0);
    // vec4 shade_color = mix(u_shadow, u_highlight, shade) * sin(scaledSlope) * clamp(intensity * 2.0, 0.0, 1.0);
    // // fragColor = accent_color * (1.0 - shade_color.a) + shade_color;


    /// fragColor = vec4(pixel.rgba);


    // float e = getElevation(v_pos);
    float e = unpackElevation(pixel);

    float high = u_breakpoints[1];
    float low = u_breakpoints[0];

    float e_norm = clamp(
        (e - low) / ( high - low ),
        0.0, 1.0);

    vec4 color = e < -100.0 ? vec4(1.0) : vec4(e_norm, e_norm, e_norm, 1.0);

    fragColor = color;

#ifdef OVERDRAW_INSPECTOR
    fragColor = vec4(1.0);
#endif
}
