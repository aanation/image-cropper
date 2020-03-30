// @flow
import { forward, sample, createStoreObject } from "effector"
import {
  resetCropper,
  resize,
  move,
  changeSourceImage,
  crop,
  cropProcess,
} from "./events"
import {
  $sourceImageDimensions,
  $sourceImageBase64,
  $coords,
  $width,
  $initialFrameWidth,
  $croppedImageBase64,
  $sourceImageMimeType,
} from "./stores"
import { type Dimensions, type Coords } from "./types"

const INITIAL_CROP_FRAME_WIDTH_PERCENT = 0.5

$sourceImageBase64
  .on(changeSourceImage, (_, base64) => base64)
  .reset(changeSourceImage.fail, resetCropper)

$sourceImageDimensions
  .on(changeSourceImage.done, (_, { result }) => result)
  .reset(changeSourceImage, resetCropper)

$initialFrameWidth
  .on(changeSourceImage.done, (_, { result }) => calculateInitialWidth(result))
  .reset(changeSourceImage, resetCropper)

$coords
  .on(move, (_, coords) => coords)
  .on(changeSourceImage.done, (_, { result }) => calculateInitialCoords(result))
  .reset(resetCropper)

$width
  .on(resize, (_, width) => width)
  .on(changeSourceImage.done, (_, { result }) => calculateInitialWidth(result))
  .reset(resetCropper)

$croppedImageBase64
  .on(cropProcess.done, (_, { result }) => result)
  .reset(resetCropper, changeSourceImage)

// get image size from base64 string
changeSourceImage.use(
  (base64) =>
    new Promise((resolve, reject) => {
      const image = new Image()
      image.addEventListener("load", () =>
        resolve({
          width: image.width,
          height: image.height,
        }),
      )
      image.addEventListener("error", reject)
      image.src = base64
    }),
)

// run crop proccess on crop event called
forward({
  from: sample(
    createStoreObject({
      coords: $coords,
      width: $width,
      sourceImageBase64: $sourceImageBase64,
      sourceImageMimeType: $sourceImageMimeType,
    }),
    crop,
  ),
  to: cropProcess,
})

cropProcess.use(
  ({ coords, width, sourceImageBase64, sourceImageMimeType }) =>
    new Promise((resolve, reject) => {
      if (sourceImageMimeType === null) {
        reject(new Error("incorrect source image base64"))
      } else {
        const image = new Image()
        image.src = sourceImageBase64
        image.addEventListener("load", () => {
          const canvas = document.createElement("canvas")
          canvas.width = width
          canvas.height = width
          try {
            canvas
              .getContext("2d")
              .drawImage(
                image,
                coords.x,
                coords.y,
                width,
                width,
                0,
                0,
                width,
                width,
              )
            const croppedImageBase64 = canvas.toDataURL(sourceImageMimeType)
            resolve(croppedImageBase64)
          } catch (error) {
            reject(error)
          }
        })
      }
    }),
)

// расчет начальной позиции для фрейма кропа
function calculateInitialCoords(dimensions: Dimensions): Coords {
  const initialFrameWidth = calculateInitialWidth(dimensions)
  // позиционирование по центру
  return {
    x: dimensions.width / 2 - initialFrameWidth / 2,
    y: dimensions.height / 2 - initialFrameWidth / 2,
  }
}

// расчет начальной ширины для фрейма кропа
function calculateInitialWidth({ width, height }: Dimensions): number {
  if (width < height) {
    return width * INITIAL_CROP_FRAME_WIDTH_PERCENT
  }
  return height * INITIAL_CROP_FRAME_WIDTH_PERCENT
}
