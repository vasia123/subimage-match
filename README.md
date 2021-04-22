# subimage-match

Lightweight library that finds matches of an image within another image, perfect for visual validation in testing scenarios.
Heavily inspired by (read: blatantly copied some subroutines from) [pixelmatch](https://github.com/mapbox/pixelmatch), and just like [pixelmatch](https://github.com/mapbox/pixelmatch), its advantages are that it's fast and lightweight, with zero dependencies.

## Install

Install with NPM:

```bash
npm install subimage-match
```

or yarn:

```bash
yarn add subimage-match
```

## API

### subImageMatch(img, subImg[, options])

- `img1`, `img2` — Object contain image "data"(`Buffer`, `Uint8Array` or `Uint8ClampedArray`), "width" and "height".
- `options` is an object literal with only one property currently:
    - `threshold` — Matching threshold, ranges from `0` to `1`. Smaller values make the comparison more sensitive. `0.1` by default.

Returns `false` if no match has been found, or object with found coordinates `{x: number, y: number}`

## Example usage

### Node.js

```js
const fs = require("fs");
const PNG = require("pngjs").PNG;
const subImageMatch = require("subimage-match");

const data = PNG.sync.read(fs.readFileSync("image.png"));
const subImg = PNG.sync.read(fs.readFileSync("sub_image.png"));
subImageMatch(img1, img2, {threshold: 0.1});
```
