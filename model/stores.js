// @flow
import { createStore, type Store } from "effector"
import { type Coords, type Dimensions } from "./types"

const MIN_WIDTH_IN_PX_OF_FRAME = 30

export const $sourceImageBase64 = createStore<string>("")
export const $croppedImageBase64 = createStore<string>("")
export const $sourceImageDimensions = createStore<Dimensions | null>(null)
export const $coords = createStore<Coords>({ x: 0, y: 0 })
export const $width = createStore<number>(0)

export const $initialFrameWidth = createStore<number>(0)

export const $minFrameWidth: Store<number> = $initialFrameWidth.map(
  (initialFrameWidth) => {
    if (initialFrameWidth >= MIN_WIDTH_IN_PX_OF_FRAME) {
      return MIN_WIDTH_IN_PX_OF_FRAME
    }
    return initialFrameWidth
  },
)

export const $hasSourceImage: Store<boolean> = $sourceImageBase64.map(Boolean)

export const $sourceImageAspectRatio: Store<
  number | null,
> = $sourceImageDimensions.map((dimensions) => {
  if (dimensions !== null) {
    return dimensions.width / dimensions.height
  }
  return null
})

export const $sourceImageMimeType: Store<
  string | null,
> = $sourceImageBase64.map((base64) => {
  if (base64.length === 0) {
    return null
  }

  const mime = base64.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/)

  if (mime && mime.length !== 0) {
    return mime[1]
  }

  return null
})
