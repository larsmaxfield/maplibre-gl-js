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
uniform vec4 u_unpack;  // Unpacking (decoding) values: red factor, green factor, blue factor, baseshift
uniform vec2 u_breakpoints;  // Lowest and highest elevation breakpoints of colormap in elevation units [ low, high ]
uniform float u_lowcutoff;  // Cutoff value such that any value lower than it is assigned the same color, useful for coloring NaNs or values below sea-level
uniform vec4 u_lowcutoffcolor;  // Color by which to assign values lower than the minimum cutoff

#define PI 3.141592653589793

float getElevation(vec2 coord) {
    // Convert encoded elevation value to meters
    vec4 data = texture(u_image, coord) * 255.0;  // Retrieve RGBA texture values at that coordinate
    data.a = -1.0;  // Set alpha channel to -1.0 so that the baseshift is subtracted during dot product (e.g., 10000 baseshift results in -10000)
    return dot(data, u_unpack);
}

// Replaced in shaders.ts; default is grayscale: 'vec4 colormap(float t) {return vec4(vec3(t), 1.0);}'
<colormap>
vec4 colormap(float t) {
    return vec4(vec3(t), 1.0);
}
</colormap>

void main() {

    float e = getElevation(v_pos);

    float high = u_breakpoints[1];
    float low = u_breakpoints[0];

    float e_norm = clamp(
        (e - low) / ( high - low ),
        0.0, 1.0);

    vec4 color = e < u_lowcutoff ? u_lowcutoffcolor : colormap(e_norm);

    fragColor = clamp(
        color,
        0.0, 1.0);

#ifdef OVERDRAW_INSPECTOR
    fragColor = vec4(1.0);
#endif
}
