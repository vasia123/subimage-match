import { expect } from 'chai';
import pngjs from "pngjs";
import path from "path";
import fs from "fs";
import subImageMatch from "../src/index";

// eslint-disable-next-line no-undef
const getTestImgPath = (filename: string) => path.join(__dirname, `testimages/${filename}.png`);

const readImage = (path: string) => {
    return pngjs.PNG.sync.read(fs.readFileSync(path));
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
        expect(() => subImageMatch(badArr, testArr)).to.throw(err)
        // @ts-ignore
        expect(() => subImageMatch(testArr, badArr)).to.throw(err)
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
        expect(() => subImageMatch(smallArr, largeArr)).to.throw(err)
    });

    it("Matches on 2 identical images", () => {
        const img1 = readImage(getTestImgPath("1"));
        const img2 = readImage(getTestImgPath("1"));
        const matches = subImageMatch(img1, img2);
        expect(matches).to.deep.equal({ x: 0, y: 0 });
    });

    it("Doesn't match on 2 different images", () => {
        const img1 = readImage(getTestImgPath("1-sub"));
        const img2 = readImage(getTestImgPath("2"));
        const matches = subImageMatch(img1, img2);
        expect(matches).to.equal(false);
    });

    it("Find sub-image match within image", () => {
        const img = readImage(getTestImgPath("1"));
        const subImg = readImage(getTestImgPath("1-sub"));
        const matches = subImageMatch(img, subImg);
        expect(matches).to.deep.equal({ x: 3, y: 2 });
    });

    it("Find sub-image match within image when first row matches in multiple places", () => {
        const img = readImage(getTestImgPath("1b"));
        const subImg = readImage(getTestImgPath("1-sub"));
        const matches = subImageMatch(img, subImg);
        expect(matches).to.deep.equal({ x: 3, y: 2 });
    });

    it("Find sub-image match within image when first row matches in multiple places 2", () => {
        const img = readImage(getTestImgPath("1c"));
        const subImg = readImage(getTestImgPath("1-sub"));
        const matches = subImageMatch(img, subImg);
        expect(matches).to.deep.equal({ x: 3, y: 2 });
    });

    it("Find sub-image match within image when first row matches in multiple places 3", () => {
        const img = readImage(getTestImgPath("1d"));
        const subImg = readImage(getTestImgPath("1-sub"));
        const matches = subImageMatch(img, subImg);
        expect(matches).to.deep.equal({ x: 3, y: 2 });
    });

    it("Find sub-image on big image", () => {
        const img = readImage(getTestImgPath("3"));
        const subImg = readImage(getTestImgPath("3-sub"));
        const matches = subImageMatch(img, subImg);
        expect(matches).to.deep.equal({ x: 924, y: 155 });
    });

});