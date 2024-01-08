import { Assets, Spritesheet, Texture } from 'pixi.js';
import { NitroLogger } from '../common';
import { ArrayBufferToBase64, NitroBundle } from '../utils';
import { GraphicAssetCollection } from './GraphicAssetCollection';
import { IAssetData } from './IAssetData';
import { IAssetManager } from './IAssetManager';
import { IGraphicAsset } from './IGraphicAsset';
import { IGraphicAssetCollection } from './IGraphicAssetCollection';
import { ISpritesheetData } from './spritesheet';

export class AssetManager implements IAssetManager
{
    public static _INSTANCE: IAssetManager = new AssetManager();

    private _textures: Map<string, Texture> = new Map();
    private _collections: Map<string, IGraphicAssetCollection> = new Map();

    public getTexture(name: string): Texture
    {
        if(!name) return null;

        const existing = this._textures.get(name);

        if(!existing) return null;

        return existing;
    }

    public setTexture(name: string, texture: Texture): void
    {
        if(!name || !texture) return;

        this._textures.set(name, texture);
    }

    public getAsset(name: string): IGraphicAsset
    {
        if(!name) return null;

        for(const collection of this._collections.values())
        {
            if(!collection) continue;

            const existing = collection.getAsset(name);

            if(!existing) continue;

            return existing;
        }

        return null;
    }

    public getCollection(name: string): IGraphicAssetCollection
    {
        if(!name) return null;

        const existing = this._collections.get(name);

        if(!existing) return null;

        return existing;
    }

    public createCollection(data: IAssetData, spritesheet: Spritesheet): IGraphicAssetCollection
    {
        if(!data) return null;

        const collection = new GraphicAssetCollection(data, spritesheet);

        if(collection)
        {
            for(const [name, texture] of collection.textures.entries()) this.setTexture(name, texture);

            this._collections.set(collection.name, collection);
        }

        return collection;
    }

    public async downloadAsset(url: string): Promise<boolean>
    {
        return await this.downloadAssets([url]);
    }

    public async downloadAssets(urls: string[]): Promise<boolean>
    {
        if(!urls || !urls.length) return Promise.resolve(true);

        try
        {
            for(const url of urls)
            {
                const response = await fetch(url);

                if(response.status !== 200) continue;

                let contentType = 'application/octet-stream';

                if(response.headers.has('Content-Type'))
                {
                    contentType = response.headers.get('Content-Type');
                }

                switch(contentType)
                {
                    case 'application/octet-stream': {
                        const buffer = await response.arrayBuffer();
                        const nitroBundle = await NitroBundle.from(buffer);

                        await this.processAsset(
                            nitroBundle.texture,
                            nitroBundle.file as IAssetData
                        );
                        break;
                    }
                    case 'image/png':
                    case 'image/jpeg': {
                        const buffer = await response.arrayBuffer();
                        const base64 = ArrayBufferToBase64(buffer);
                        const texture = await Assets.load(`data:${ contentType };base64,${ base64 }`);

                        this.setTexture(url, texture);
                    }
                }
            }

            return Promise.resolve(true);
        }
        catch (err)
        {
            NitroLogger.error(err);

            return Promise.resolve(false);
        }
    }

    private async processAsset(texture: Texture, data: IAssetData): Promise<void>
    {
        let spritesheet: Spritesheet<ISpritesheetData> = null;

        if(texture && data?.spritesheet && Object.keys(data.spritesheet).length)
        {
            spritesheet = new Spritesheet(texture, data.spritesheet);

            await spritesheet.parse();
        }

        this.createCollection(data, spritesheet);
    }

    public get collections(): Map<string, IGraphicAssetCollection>
    {
        return this._collections;
    }
}
