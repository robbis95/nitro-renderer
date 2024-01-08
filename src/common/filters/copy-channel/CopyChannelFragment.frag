varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform sampler2D mask;
uniform int fromChannel;
uniform int toChannel;

void main(void) {
    vec4 maskColor = texture2D(mask, vTextureCoord);
    vec4 currentColor = texture2D(uSampler, vTextureCoord);
    vec4 adjusted = currentColor;

    if(maskColor.r == 0.0 && maskColor.g == 0.0 && maskColor.b == 0.0)
    {
        adjusted.a = 0.0;
    }

    gl_FragColor = vec4(adjusted.r, adjusted.g, adjusted.b, adjusted.a);
}
