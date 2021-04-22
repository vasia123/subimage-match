"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var tape_1 = __importDefault(require("tape"));
var pngjs_1 = __importDefault(require("pngjs"));
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
var index_1 = require("../src/index");
// eslint-disable-next-line no-undef
var getTestImgPath = function (filename) { return path_1.default.join(__dirname, "testimages/" + filename + ".png"); };
tape_1.default("throws error if provided wrong image data format", function (t) {
    var err = "Image data: Uint8Array, Uint8ClampedArray or Buffer expected";
    var testArr = {
        data: new Uint8Array(4 * 20 * 20),
        width: 20,
        height: 20
    };
    var badArr = {
        data: new Array(testArr.width * testArr.height).fill(0),
        width: 20,
        height: 20
    };
    t.throws(function () { return index_1.subImageMatch(badArr, testArr); }, err);
    t.throws(function () { return index_1.subImageMatch(testArr, badArr); }, err);
    t.end();
});
tape_1.default("throws error sub image is larger than base image", function (t) {
    var err = "Subimage is larger than base image";
    var smallArr = new Uint8Array(4 * 10 * 10);
    var largeArr = new Uint8Array(4 * 20 * 20);
    t.throws(function () { return index_1.subImageMatch(smallArr, largeArr); }, err);
    t.end();
});
tape_1.default("Matches on 2 identical images", function (t) {
    var img1 = readImage(getTestImgPath("1"));
    var img2 = readImage(getTestImgPath("1"));
    var matches = index_1.subImageMatch(img1, img2);
    t.ok(matches, "should find match");
    t.end();
});
tape_1.default("Doesn't match on 2 different images", function (t) {
    var img1 = readImage(getTestImgPath("1-sub"));
    var img2 = readImage(getTestImgPath("2"));
    var matches = index_1.subImageMatch(img1, img2);
    t.notOk(matches, "shouldn't find match");
    t.end();
});
tape_1.default("Find sub-image match within image", function (t) {
    var img = readImage(getTestImgPath("1"));
    var subImg = readImage(getTestImgPath("1-sub"));
    var matches = index_1.subImageMatch(img, subImg);
    t.ok(matches, "should find match");
    t.end();
});
tape_1.default("Find sub-image match within image when first row matches in multiple places", function (t) {
    var img = readImage(getTestImgPath("1b"));
    var subImg = readImage(getTestImgPath("1-sub"));
    var matches = index_1.subImageMatch(img, subImg);
    t.ok(matches, "should find match");
    t.end();
});
tape_1.default("Find sub-image match within image when first row matches in multiple places 2", function (t) {
    var img = readImage(getTestImgPath("1c"));
    var subImg = readImage(getTestImgPath("1-sub"));
    var matches = index_1.subImageMatch(img, subImg);
    t.ok(matches, "should find match");
    t.end();
});
tape_1.default("Find sub-image match within image when first row matches in multiple places 3", function (t) {
    var img = readImage(getTestImgPath("1d"));
    var subImg = readImage(getTestImgPath("1-sub"));
    var matches = index_1.subImageMatch(img, subImg);
    t.ok(matches, "should find match");
    t.end();
});
var readImage = function (path) {
    // eslint-disable-next-line no-undef
    return pngjs_1.default.PNG.sync.read(fs_1.default.readFileSync(path));
};
