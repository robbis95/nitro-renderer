import { GetTickerTime } from '../../../common';
import { AvatarImageDirectionCache } from './AvatarImageDirectionCache';

export class AvatarImageActionCache
{
    private _cache: Map<string, AvatarImageDirectionCache> = new Map();
    private _lastAccessTime: number = 0;

    constructor()
    {
        this.setLastAccessTime(GetTickerTime());
    }

    public dispose(): void
    {
        if(!this._cache) return;

        for(const direction of this._cache.values())
        {
            if(direction) direction.dispose();
        }

        this._cache.clear();
    }

    public getDirectionCache(direction: number): AvatarImageDirectionCache
    {
        const existing = this._cache.get(direction.toString());

        if(!existing) return null;

        return existing;
    }

    public updateDirectionCache(direction: number, cache: AvatarImageDirectionCache): void
    {
        this._cache.set(direction.toString(), cache);
    }

    public setLastAccessTime(time: number): void
    {
        this._lastAccessTime = time;
    }

    public getLastAccessTime(): number
    {
        return this._lastAccessTime;
    }
}
