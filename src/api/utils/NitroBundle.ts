import { Data, inflate } from 'pako';
import { Assets, Texture } from 'pixi.js';
import { ArrayBufferToBase64 } from './ArrayBufferToBase64';
import { BinaryReader } from './BinaryReader';

export class NitroBundle
{
    private static TEXT_DECODER: TextDecoder = new TextDecoder('utf-8');

    private _file: Object = null;
    private _texture: Texture = null;

    public static async from(buffer: ArrayBuffer): Promise<NitroBundle>
    {
        const bundle = new NitroBundle();

        await bundle.parse(buffer);

        return bundle;
    }

    private async parse(buffer: ArrayBuffer): Promise<void>
    {
        const binaryReader = new BinaryReader(buffer);

        let fileCount = binaryReader.readShort();

        while(fileCount > 0)
        {
            const fileNameLength = binaryReader.readShort();
            const fileName = binaryReader.readBytes(fileNameLength).toString();
            const fileLength = binaryReader.readInt();
            const buffer = binaryReader.readBytes(fileLength);

            if(fileName.endsWith('.json'))
            {
                const decompressed = inflate((buffer.toArrayBuffer() as Data));

                this._file = JSON.parse(NitroBundle.TEXT_DECODER.decode(decompressed));
            }
            else
            {
                const decompressed = inflate((buffer.toArrayBuffer() as Data));
                const base64 = ArrayBufferToBase64(decompressed);

                this._texture = await Assets.load<Texture>(`data:image/png;base64,${ base64 }`);
            }

            fileCount--;
        }
    }

    public get file(): Object
    {
        return this._file;
    }

    public get texture(): Texture
    {
        return this._texture;
    }
}
