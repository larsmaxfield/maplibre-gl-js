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

// Replaced in shaders.ts; default is below for reference.
<main>
void main() {

    fragColor = texture(u_image, v_pos);

#ifdef OVERDRAW_INSPECTOR
    fragColor = vec4(1.0);
#endif
}
</main>
