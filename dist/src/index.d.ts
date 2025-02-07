/// <reference types="node" />
declare const defaultOptions: {
    threshold: number;
};
export interface inputImage {
    data: Buffer | Uint8Array | Uint8ClampedArray;
    width: number;
    height: number;
}
export interface outputCoords {
    x: number;
    y: number;
    found: boolean;
}
export default function subImageMatch(img: inputImage, subImg: inputImage, optionsParam?: typeof defaultOptions): outputCoords;
export {};
