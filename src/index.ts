import pixelMatches from './delta';

const defaultOptions = {
  threshold: 0.1, // matching threshold (0 to 1); smaller is more sensitive
  // includeAA: false,
  // whether to skip anti-aliasing detection. WIP (see pixelmatch package)
};

export interface inputImage {
  data: Buffer | Uint8Array | Uint8ClampedArray
  width: number
  height: number
}

export interface outputCoords {
  x: number
  y: number
}

function getChannelsCount(img: inputImage): number {
  let channelsCount = 1;
  if (img.data.length !== img.width * img.height
    && img.data.length % (img.width * img.height) === 0) {
    channelsCount = Math.round(img.data.length / (img.width * img.height));
  }
  return channelsCount;
}

function isPixelData(arr: Buffer | Uint8Array | Uint8ClampedArray) {
  return Buffer.isBuffer(arr)
    || arr.constructor === Uint8Array
    || arr.constructor === Uint8ClampedArray;
}

function posFromCoordinates(y: number, x: number, width: number, channels: number) {
  return (y * width + x) * channels;
}

export default function subImageMatch(
  img: inputImage,
  subImg: inputImage, optionsParam?: typeof defaultOptions,
): boolean | outputCoords {
  const { data: imgData, width: imgWidth, height: imgHeight } = img;
  const { data: subImgData, width: subImgWidth } = subImg;

  const imgChannels = getChannelsCount(img);
  const subImgChannels = getChannelsCount(subImg);

  if (!isPixelData(imgData) || !isPixelData(subImgData)) {
    throw new Error('Image data: Uint8Array, Uint8ClampedArray or Buffer expected.');
  }
  if (imgWidth < subImgWidth) {
    throw new Error('Subimage is larger than base image');
  }
  if (imgChannels < subImgChannels) {
    throw new Error('Subimage channels count not equal to image channels count');
  }

  const options = { ...defaultOptions, ...optionsParam };
  const maxDelta = 35215 * options.threshold * options.threshold;

  const subImgPos = 0;
  let matchingTopRowStartX = 0;
  let matchingTopRowStartY = 0;

  for (let y = 0; y < imgHeight; y += 1) {
    let matchingTopRowX = 0; // restart finding top row mode when we hit a new row in the main img
    for (let x = 0; x < imgWidth; x += 1) {
      const imgPos = posFromCoordinates(y, x, imgWidth, imgChannels);

      const matches = pixelMatches(imgData, subImgData, imgPos, subImgPos, maxDelta, imgChannels);
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
      } else {
        matchingTopRowX = 0; // restart finding top row mode when 2 pixels don't match
      }
    }
  }
  return false;
}

function subImageMatchOnCoordinates(
  img: inputImage, subImg: inputImage, matchY: number, matchX: number, maxDelta: number,
) {
  const { data: imgData, width: imgWidth } = img;
  const { data: subImgData, width: subImgWidth, height: subImgHeight } = subImg;
  const imgChannels = getChannelsCount(img);

  let subImgX = 0;
  let subImgY = 0;
  for (let imgY = matchY; imgY < (matchY + subImgHeight); imgY++) {
    subImgX = 0;

    for (let imgX = matchX; imgX < (matchX + subImgWidth); imgX++) {
      const imgPos = posFromCoordinates(imgY, imgX, imgWidth, imgChannels);
      const subImgPos = posFromCoordinates(subImgY, subImgX, subImgWidth, imgChannels);
      const matches = pixelMatches(imgData, subImgData, imgPos, subImgPos, maxDelta, imgChannels, imgY === 5);
      if (!matches) {
        return false;
      }
      subImgX++;
    }
    subImgY++;
  }
  return true;
}
