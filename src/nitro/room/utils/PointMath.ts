import { Point } from 'pixi.js';

export class PointMath
{
    public static sum(a: Point, b: Point): Point
    {
        return new Point((a.x + b.x), (a.y + b.y));
    }

    public static sub(a: Point, b: Point): Point
    {
        return new Point((a.x - b.x), (a.y - b.y));
    }

    public static mul(a: Point, b: number): Point
    {
        return new Point((a.x * b), (a.y * b));
    }
}
