"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.subImageMatchOnCoordinates = void 0;
const delta_1 = __importDefault(require("./delta"));
const defaultOptions = {
    threshold: 0.1, // matching threshold (0 to 1); smaller is more sensitive
    // includeAA: false,       // whether to skip anti-aliasing detection. WIP (see pixelmatch package)
};
function subImageMatch(img, subImg, optionsParam) {
    const { data: imgData, width: imgWidth, height: imgHeight } = img;
    const { data: subImgData, width: subImgWidth } = subImg;
    if (!isPixelData(imgData) || !isPixelData(subImgData)) {
        throw new Error("Image data: Uint8Array, Uint8ClampedArray or Buffer expected.");
    }
    if (imgWidth < subImgWidth) {
        throw new Error("Subimage is larger than base image");
    }
    const options = Object.assign({}, defaultOptions, optionsParam);
    const maxDelta = 35215 * options.threshold * options.threshold;
    let subImgPos = 0;
    let matchingTopRowStartX = 0;
    let matchingTopRowStartY = 0;
    for (let y = 0; y < imgHeight; y++) {
        let matchingTopRowX = 0; // restart finding top row mode when we hit a new row in the main img
        for (let x = 0; x < imgWidth; x++) {
            const imgPos = posFromCoordinates(y, x, imgWidth);
            const matches = delta_1.default(imgData, subImgData, imgPos, subImgPos, maxDelta);
            if (matches) {
                if (matchingTopRowX === 0) {
                    // This means this is a new matching row, save these coordinates in the matchingTopRowStartX and Y
                    matchingTopRowStartX = x;
                    matchingTopRowStartY = y;
                }
                matchingTopRowX++;
                if (matchingTopRowX === subImgWidth) {
                    if (subImageMatchOnCoordinates(img, subImg, matchingTopRowStartY, matchingTopRowStartX, maxDelta)) {
                        return { x: matchingTopRowStartX, y: matchingTopRowStartY };
                    }
                    x = matchingTopRowStartX; // put our search position x back to where the matching row began
                    matchingTopRowX = 0;
                }
            }
            else {
                matchingTopRowX = 0; // restart finding top row mode when 2 pixels don't match
            }
        }
    }
    return false;
}
exports.default = subImageMatch;
function subImageMatchOnCoordinates(img, subImg, matchY, matchX, maxDelta) {
    const { data: imgData, width: imgWidth } = img;
    const { data: subImgData, width: subImgWidth, height: subImgHeight } = subImg;
    let subImgX = 0;
    let subImgY = 0;
    for (let imgY = matchY; imgY < (matchY + subImgHeight); imgY++) {
        subImgX = 0;
        for (let imgX = matchX; imgX < (matchX + subImgWidth); imgX++) {
            const imgPos = posFromCoordinates(imgY, imgX, imgWidth);
            const subImgPos = posFromCoordinates(subImgY, subImgX, subImgWidth);
            const matches = delta_1.default(imgData, subImgData, imgPos, subImgPos, maxDelta, imgY === 5);
            if (!matches) {
                return false;
            }
            subImgX++;
        }
        subImgY++;
    }
    return true;
}
exports.subImageMatchOnCoordinates = subImageMatchOnCoordinates;
function isPixelData(arr) {
    return Buffer.isBuffer(arr) || arr.constructor === Uint8Array || arr.constructor === Uint8ClampedArray;
}
function posFromCoordinates(y, x, width) {
    return (y * width + x) * 4;
}
