"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const pngjs_1 = __importDefault(require("pngjs"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const index_1 = __importDefault(require("../src/index"));
// eslint-disable-next-line no-undef
const getTestImgPath = (filename) => path_1.default.join(__dirname, `testimages/${filename}.png`);
const readImage = (path) => {
    return pngjs_1.default.PNG.sync.read(fs_1.default.readFileSync(path));
};
describe('matches-subimage', function () {
    it("throws error if provided wrong image data format", () => {
        const err = "Image data: Uint8Array, Uint8ClampedArray or Buffer expected";
        const testArr = {
            data: new Uint8Array(4 * 20 * 20),
            width: 20,
            height: 20
        };
        const badArr = {
            data: new Array(testArr.width * testArr.height).fill(0),
            width: 20,
            height: 20
        };
        // @ts-ignore
        chai_1.expect(() => index_1.default(badArr, testArr)).to.throw(err);
        // @ts-ignore
        chai_1.expect(() => index_1.default(testArr, badArr)).to.throw(err);
    });
    it("throws error sub image is larger than base image", () => {
        const err = "Subimage is larger than base image";
        const smallArr = {
            data: new Uint8Array(4 * 10 * 10),
            width: 10,
            height: 10
        };
        const largeArr = {
            data: new Uint8Array(4 * 20 * 20),
            width: 20,
            height: 20
        };
        chai_1.expect(() => index_1.default(smallArr, largeArr)).to.throw(err);
    });
    it("Matches on 2 identical images", () => {
        const img1 = readImage(getTestImgPath("1"));
        const img2 = readImage(getTestImgPath("1"));
        const matches = index_1.default(img1, img2);
        chai_1.expect(matches).to.equal(true);
    });
    it("Doesn't match on 2 different images", () => {
        const img1 = readImage(getTestImgPath("1-sub"));
        const img2 = readImage(getTestImgPath("2"));
        const matches = index_1.default(img1, img2);
        chai_1.expect(matches).to.equal(false);
    });
    it("Find sub-image match within image", () => {
        const img = readImage(getTestImgPath("1"));
        const subImg = readImage(getTestImgPath("1-sub"));
        const matches = index_1.default(img, subImg);
        chai_1.expect(matches).to.equal(true);
    });
    it("Find sub-image match within image when first row matches in multiple places", () => {
        const img = readImage(getTestImgPath("1b"));
        const subImg = readImage(getTestImgPath("1-sub"));
        const matches = index_1.default(img, subImg);
        chai_1.expect(matches).to.equal(true);
    });
    it("Find sub-image match within image when first row matches in multiple places 2", () => {
        const img = readImage(getTestImgPath("1c"));
        const subImg = readImage(getTestImgPath("1-sub"));
        const matches = index_1.default(img, subImg);
        chai_1.expect(matches).to.equal(true);
    });
    it("Find sub-image match within image when first row matches in multiple places 3", () => {
        const img = readImage(getTestImgPath("1d"));
        const subImg = readImage(getTestImgPath("1-sub"));
        const matches = index_1.default(img, subImg);
        chai_1.expect(matches).to.equal(true);
    });
    it("Find sub-image on big image", () => {
        const img = readImage(getTestImgPath("3"));
        const subImg = readImage(getTestImgPath("3-sub"));
        const matches = index_1.default(img, subImg);
        chai_1.expect(matches).to.equal(true);
    });
});
