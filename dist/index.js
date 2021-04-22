"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.subImageMatchOnCoordinates = exports.subImageMatch = void 0;
var delta_1 = __importDefault(require("./delta"));
var defaultOptions = {
    threshold: 0.1, // matching threshold (0 to 1); smaller is more sensitive
    // includeAA: false,       // whether to skip anti-aliasing detection. WIP (see pixelmatch package)
};
function subImageMatch(img, subImg, optionsParam) {
    var imgData = img.data, imgWidth = img.width, imgHeight = img.height;
    var subImgData = subImg.data, subImgWidth = subImg.width;
    if (!isPixelData(imgData) || !isPixelData(subImgData)) {
        throw new Error("Image data: Uint8Array, Uint8ClampedArray or Buffer expected.");
    }
    if (img.width < subImg.width) {
        throw new Error("Subimage is larger than base image");
    }
    var options = Object.assign({}, defaultOptions, optionsParam);
    var maxDelta = 35215 * options.threshold * options.threshold;
    var subImgPos = 0;
    var matchingTopRowStartX = 0;
    var matchingTopRowStartY = 0;
    for (var y = 0; y < imgHeight; y++) {
        var matchingTopRowX = 0; // restart finding top row mode when we hit a new row in the main img
        for (var x = 0; x < imgWidth; x++) {
            var imgPos = posFromCoordinates(y, x, imgWidth);
            var matches = delta_1.default(imgData, subImgData, imgPos, subImgPos, maxDelta);
            if (matches) {
                if (matchingTopRowX === 0) {
                    // This means this is a new matching row, save these coordinates in the matchingTopRowStartX and Y
                    matchingTopRowStartX = x;
                    matchingTopRowStartY = y;
                }
                matchingTopRowX++;
                if (matchingTopRowX === subImgWidth) {
                    if (subImageMatchOnCoordinates(img, subImg, matchingTopRowStartY, matchingTopRowStartX, maxDelta)) {
                        console.log('subImageMatch matchingTopRowStartY', matchingTopRowStartY, 'matchingTopRowStartX', matchingTopRowStartX);
                        console.log('subImageMatch matchingTopRowX', matchingTopRowX);
                        return true;
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
exports.subImageMatch = subImageMatch;
function subImageMatchOnCoordinates(img, subImg, matchY, matchX, maxDelta) {
    var imgData = img.data, imgWidth = img.width;
    var subImgData = subImg.data, subImgWidth = subImg.width, subImgHeight = subImg.height;
    var subImgX = 0;
    var subImgY = 0;
    for (var imgY = matchY; imgY < (matchY + subImgHeight); imgY++) {
        subImgX = 0;
        for (var imgX = matchX; imgX < (matchX + subImgWidth); imgX++) {
            var imgPos = posFromCoordinates(imgY, imgX, imgWidth);
            var subImgPos = posFromCoordinates(subImgY, subImgX, subImgWidth);
            var matches = delta_1.default(imgData, subImgData, imgPos, subImgPos, maxDelta, imgY === 5);
            if (!matches) {
                console.log('subImageMatchOnCoordinates imgPos', imgPos, 'subImgPos', subImgPos);
                return false;
            }
            subImgX++;
        }
        subImgY++;
    }
    console.log('subImageMatchOnCoordinates subImgX', subImgX, 'subImgY', subImgY);
    return true;
}
exports.subImageMatchOnCoordinates = subImageMatchOnCoordinates;
function isPixelData(arr) {
    return Buffer.isBuffer(arr) || arr.constructor === Uint8Array || arr.constructor === Uint8ClampedArray;
}
function posFromCoordinates(y, x, width) {
    return (y * width + x) * 4;
}
