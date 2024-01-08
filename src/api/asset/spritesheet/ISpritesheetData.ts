import { SpritesheetData } from 'pixi.js';
import { ISpritesheetMeta } from './ISpritesheetMeta';

export interface ISpritesheetData extends SpritesheetData
{
    meta: ISpritesheetMeta;
}
