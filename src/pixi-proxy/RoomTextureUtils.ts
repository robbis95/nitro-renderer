import { Container, Matrix, RenderSurface, Texture } from 'pixi.js';
import { TextureUtils } from './TextureUtils';

export class PlaneTextureCache extends TextureUtils
{
    private static DEFAULT_PLANE_ID = 'DEFAULT';

    public RENDER_TEXTURE_POOL: Map<string, Texture> = new Map();
    public RENDER_TEXTURE_CACHE: RenderSurface[] = [];

    public clearCache(): void
    {
        this.RENDER_TEXTURE_POOL.forEach(renderTexture => renderTexture?.destroy(true));

        this.RENDER_TEXTURE_POOL.clear();
        this.RENDER_TEXTURE_CACHE = [];
    }

    private getTextureIdentifier(width: number, height: number, planeId: string): string
    {
        return `${ planeId ?? PlaneTextureCache.DEFAULT_PLANE_ID }:${ width }:${ height }`;
    }

    public createTexture(width: number, height: number, planeId: string = null): Texture
    {
        if((width < 0) || (height < 0)) return null;

        if(!planeId)
        {
            const texture = TextureUtils.createTexture(width, height);

            this.RENDER_TEXTURE_CACHE.push(texture);

            return texture;
        }

        planeId = this.getTextureIdentifier(width, height, planeId);

        let texture = this.RENDER_TEXTURE_POOL.get(planeId);

        if(!texture)
        {
            texture = TextureUtils.createTexture(width, height);

            this.RENDER_TEXTURE_CACHE.push(texture);

            this.RENDER_TEXTURE_POOL.set(planeId, texture);
        }

        return texture;
    }

    public createAndFillRenderTexture(width: number, height: number, planeId = null, color: number = 16777215): RenderSurface
    {
        if((width < 0) || (height < 0)) return null;

        const renderTexture = this.createTexture(width, height, planeId);

        return TextureUtils.clearAndFillTexture(renderTexture, color);
    }

    public createAndWriteRenderTexture(width: number, height: number, container: Container, planeId: string = null, transform: Matrix = null): RenderSurface
    {
        if((width < 0) || (height < 0)) return null;

        const renderTexture = this.createTexture(width, height, planeId);

        return TextureUtils.writeToTexture(container, renderTexture, true, transform);
    }
}
