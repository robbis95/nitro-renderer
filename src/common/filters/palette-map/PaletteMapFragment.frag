varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform sampler2D lut;
uniform int channel;

void main(void) {
    vec4 currentColor = texture2D(uSampler, vTextureCoord);
    vec4 adjusted = currentColor;

    if(currentColor.a > 0.0)
    {
        if(channel == 0)
        {
            adjusted = texture2D(lut, vec2((currentColor.r * 255.0 + 0.5) / 256.0, 0.5));
        } else if(channel == 1) {
            adjusted = texture2D(lut, vec2((currentColor.g * 255.0 + 0.5) / 256.0, 0.5));
        } else if(channel == 2) {
            adjusted = texture2D(lut, vec2((currentColor.b * 255.0 + 0.5) / 256.0, 0.5));
        } else if(channel == 3) {
            adjusted = texture2D(lut, vec2((currentColor.a * 255.0 + 0.5) / 256.0, 0.5));
        }
    }

    gl_FragColor = vec4(adjusted.r, adjusted.g, adjusted.b, currentColor.a);
}
