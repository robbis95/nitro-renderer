import { Filter, Texture } from 'pixi.js';

const vertex = `
attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;
uniform mat3 projectionMatrix;
varying vec2 vTextureCoord;
void main(void)
{
    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
    vTextureCoord = aTextureCoord;
}`;

export class CopyChannelFilter extends Filter
{
    public static readonly CHANNEL_RED = 0;
    public static readonly CHANNEL_GREEN = 1;
    public static readonly CHANNEL_BLUE = 2;
    public static readonly CHANNEL_ALPHA = 3;

    constructor(mask: Texture, fromChannel: number, toChannel: number)
    {
        /* const gpuProgram = new GpuProgram({
            vertex: {
                source,
                entryPoint: 'mainVertex',
            },
            fragment: {
                source,
                entryPoint: 'mainFragment',
            },
        }); */

        super(null);
    }
}
