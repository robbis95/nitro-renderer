import { Filter, TextureSource } from 'pixi.js';

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

export class PaletteMapFilter extends Filter
{
    public static readonly CHANNEL_RED = 0;
    public static readonly CHANNEL_GREEN = 1;
    public static readonly CHANNEL_BLUE = 2;
    public static readonly CHANNEL_ALPHA = 3;

    private _lut: TextureSource;
    private _channel: number;

    constructor(palette: number[], channel = PaletteMapFilter.CHANNEL_RED)
    {
        super(null);
        /* this._channel = channel;
        let lut: number[] = [];

        lut = this.getLutForPalette(palette);

        new TextureSource({
            resource: Uint8Array.from(lut),
            width: lut.length / 4,
            height: 1,
            mipLevelCount: 0,

        });

        this._lut = TextureSource.fromBuffer(Uint8Array.from(lut), lut.length / 4, 1, { mipmap: 0, scaleMode: 0 });

        this.uniforms.lut = this._lut;
        this.uniforms.channel = this._channel; */
    }

    private getLutForPalette(data: number[]): number[]
    {
        const lut = [];

        for(let i = 0; i < data.length; i++)
        {
            // R
            lut[(i * 4) + PaletteMapFilter.CHANNEL_RED] = ((data[i] >> 16) & 0xFF);
            // G
            lut[(i * 4) + PaletteMapFilter.CHANNEL_GREEN] = ((data[i] >> 8) & 0xFF);
            // B
            lut[(i * 4) + PaletteMapFilter.CHANNEL_BLUE] = (data[i] & 0xFF);
            // A
            lut[(i * 4) + PaletteMapFilter.CHANNEL_ALPHA] = ((data[i] >> 24) & 0xFF);
        }

        return lut;
    }

    public get lut(): TextureSource
    {
        return this._lut;
    }

    public get channel(): number
    {
        return this._channel;
    }
}
