import { Sprite, Texture } from 'pixi.js';
import { TextureUtils } from '../../../pixi-proxy';

export class Rasterizer
{
    public static getFlipHBitmapData(texture: Texture): Texture
    {
        if(!texture) return null;

        const sprite = new Sprite(texture);

        sprite.scale.set(-1, 1);
        sprite.position.set(texture.width, 0);

        return TextureUtils.generateTexture(sprite);
    }

    public static getFlipVBitmapData(texture: Texture): Texture
    {
        if(!texture) return null;

        const sprite = new Sprite(texture);

        sprite.scale.set(1, -1);
        sprite.position.set(0, texture.height);

        return TextureUtils.generateTexture(sprite);
    }

    public static getFlipHVBitmapData(texture: Texture): Texture
    {
        if(!texture) return null;

        const sprite = new Sprite(texture);

        sprite.scale.set(-1, -1);
        sprite.position.set(texture.width, texture.height);

        return TextureUtils.generateTexture(sprite);
    }
}
