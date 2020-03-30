// @flow
import { createEvent, createEffect } from "effector"
import { type Coords, type Dimensions } from "./types"

export const resetCropper = createEvent<void>()

export const resize = createEvent<number>()
export const move = createEvent<Coords>()

export const changeSourceImage = createEffect<string, Dimensions, Error>() // base64 string
export const crop = createEvent<void>()
export const cropProcess = createEffect<
  {
    coords: Coords,
    width: number,
    sourceImageBase64: string,
    sourceImageMimeType: string | null,
  },
  string,
  Error,
>()
