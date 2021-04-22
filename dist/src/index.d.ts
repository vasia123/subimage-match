/// <reference types="node" />
declare const defaultOptions: {
    threshold: number;
};
interface inputImage {
    data: Buffer | Uint8Array | Uint8ClampedArray;
    width: number;
    height: number;
}
interface outputCoords {
    x: number;
    y: number;
}
export default function subImageMatch(img: inputImage, subImg: inputImage, optionsParam?: typeof defaultOptions): boolean | outputCoords;
export {};
