
// calculate color difference according to the paper "Measuring perceived color difference
// using YIQ NTSC transmission color space in mobile applications" by Y. Kotsarenko and F. Ramos
export default function pixelMatches(
    img1: Buffer | Uint8Array | Uint8ClampedArray,
    img2: Buffer | Uint8Array | Uint8ClampedArray,
    k: number, m: number, maxDelta: number,
    channels: number, yOnly?: boolean
) {

    if ((k + 3) >= img1.length) {
        throw new Error(`Cannot get positions ${k} through ${k + 3} from img array of length ${img1.length}`);
    }
    if ((m + 3) >= img2.length) {
        throw new Error(`Cannot get positions ${m} through ${m + 3} from img array of length ${img2.length}`);
    }

    const rgba1 = []
    for (let index = 0; index < channels; index++) {
        rgba1.push(img1[k + index])
    }

    const rgba2 = []
    for (let index = 0; index < channels; index++) {
        rgba2.push(img2[m + index])
    }

    let allMatches = true;
    for (let index = 0; index < channels; index++) {
        allMatches = allMatches && rgba1[index] === rgba2[index]
    }
    if (allMatches) return true;

    if (channels === 4) {
        if (rgba1[3] < 255) {
            rgba1[3] /= 255;
            rgba1[0] = blend(rgba1[0], rgba1[3]);
            rgba1[1] = blend(rgba1[1], rgba1[3]);
            rgba1[2] = blend(rgba1[2], rgba1[3]);
        }
        if (rgba2[3] < 255) {
            rgba2[3] /= 255;
            rgba2[0] = blend(rgba2[0], rgba2[3]);
            rgba2[1] = blend(rgba2[1], rgba2[3]);
            rgba2[2] = blend(rgba2[2], rgba2[3]);
        }
    }

    const y = rgb2y(rgba1[0], rgba1[1], rgba1[2]) - rgb2y(rgba2[0], rgba2[1], rgba2[2]);

    let delta;

    if (yOnly) { // brightness difference only
        delta = y;
    } else {
        const i = rgb2i(rgba1[0], rgba1[1], rgba1[2]) - rgb2i(rgba2[0], rgba2[1], rgba2[2]);
        const q = rgb2q(rgba1[0], rgba1[1], rgba1[2]) - rgb2q(rgba2[0], rgba2[1], rgba2[2]);
        delta = 0.5053 * y * y + 0.299 * i * i + 0.1957 * q * q;
    }
    return delta <= maxDelta;
}

function rgb2y(r: number, g: number, b: number) { return r * 0.29889531 + g * 0.58662247 + b * 0.11448223; }
function rgb2i(r: number, g: number, b: number) { return r * 0.59597799 - g * 0.27417610 - b * 0.32180189; }
function rgb2q(r: number, g: number, b: number) { return r * 0.21147017 - g * 0.52261711 + b * 0.31114694; }

// blend semi-transparent color with white
function blend(c: number, a: number) {
    return 255 + (c - 255) * a;
}