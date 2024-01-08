import { Point, Sprite, Texture } from 'pixi.js';
import { AlphaTolerance } from '../../../../api';
import { TextureUtils } from '../../../../pixi-proxy';

export class ExtendedSprite extends Sprite
{
    private _offsetX: number = 0;
    private _offsetY: number = 0;
    private _tag: string = '';
    private _alphaTolerance: number = 128;
    private _varyingDepth: boolean = false;
    private _clickHandling: boolean = false;

    private _pairedSpriteId: number = -1;
    private _pairedSpriteUpdateCounter: number = -1;

    public needsUpdate(pairedSpriteId: number, pairedSpriteUpdateCounter: number): boolean
    {
        if((this._pairedSpriteId === pairedSpriteId) && (this._pairedSpriteUpdateCounter === pairedSpriteUpdateCounter)) return false;

        this._pairedSpriteId = pairedSpriteId;
        this._pairedSpriteUpdateCounter = pairedSpriteUpdateCounter;

        return true;
    }

    public setTexture(texture: Texture): void
    {
        if(!texture) texture = Texture.EMPTY;

        if(texture === this.texture) return;

        if(texture === Texture.EMPTY)
        {
            this._pairedSpriteId = -1;
            this._pairedSpriteUpdateCounter = -1;
        }

        this.texture = texture;
    }

    public containsPoint(point: Point): boolean
    {
        return this.containsPixelPerfectPoint(point);
    }

    public containsPixelPerfectPoint(point: Point): boolean
    {
        if(!point || (this.alphaTolerance > 255) || !this.texture || (this.texture === Texture.EMPTY) || (this.blendMode !== 'normal')) return false;

        const x = (point.x * this.scale.x);
        const y = (point.y * this.scale.y);

        if(!this.getLocalBounds().containsPoint(x, y)) return false;

        //@ts-ignore
        if(!this.texture.hitMap || !ExtendedSprite.generateHitMap(this.texture)) return false;

        //@ts-ignore
        const hitMap = (this.texture.hitMap as Uint32Array);

        let dx = (x + this.texture.frame.x);
        let dy = (y + this.texture.frame.y);

        if(this.texture.trim)
        {
            dx -= this.texture.trim.x;
            dy -= this.texture.trim.y;
        }

        dx = Math.round(dx);
        dy = Math.round(dy);

        const ind = (dx + dy * this.texture.width);
        const ind1 = ind % 32;
        const ind2 = ind / 32 | 0;

        return (hitMap[ind2] & (1 << ind1)) !== 0;
    }

    private static generateHitMap(texture: Texture): boolean
    {
        //@ts-ignore
        if(!texture || texture.hitMap) return false;

        const pixels = TextureUtils.getPixels(texture);
        const width = pixels.width;
        const height = pixels.height;
        const hitmap = new Uint32Array(Math.ceil(width * height / 32));

        for(let i = 0; i < width * height; i++)
        {
            const ind1 = i % 32;
            const ind2 = i / 32 | 0;

            if(pixels.pixels[i * 4 + 3] >= AlphaTolerance.MATCH_OPAQUE_PIXELS) hitmap[ind2] = hitmap[ind2] | (1 << ind1);
        }

        //@ts-ignore
        texture.hitMap = hitmap;

        return true;
    }

    public get offsetX(): number
    {
        return this._offsetX;
    }

    public set offsetX(offset: number)
    {
        this._offsetX = offset;
    }

    public get offsetY(): number
    {
        return this._offsetY;
    }

    public set offsetY(offset: number)
    {
        this._offsetY = offset;
    }

    public get tag(): string
    {
        return this._tag;
    }

    public set tag(tag: string)
    {
        this._tag = tag;
    }

    public get alphaTolerance(): number
    {
        return this._alphaTolerance;
    }

    public set alphaTolerance(tolerance: number)
    {
        this._alphaTolerance = tolerance;
    }

    public get varyingDepth(): boolean
    {
        return this._varyingDepth;
    }

    public set varyingDepth(flag: boolean)
    {
        this._varyingDepth = flag;
    }

    public get clickHandling(): boolean
    {
        return this._clickHandling;
    }

    public set clickHandling(flag: boolean)
    {
        this._clickHandling = flag;
    }
}
