// @flow
import {
  $coords,
  $sourceImageDimensions,
  $width,
  $minFrameWidth,
} from "./stores"
import { move, resize } from "./events"
import { type Coords, type Dimensions } from "./types"
import { transformCoords } from "./transform-coords"

type ImageRef = {|
  current: HTMLImageElement | null,
|}

type TransformerParams = {
  sourceImageDimensions: Dimensions,
  coords: Coords,
  startCoords: Coords,
  mouseSourceCoords: Coords,
  startMouseSourceCoords: Coords,
  width: number,
  minFrameWidth: number,
  move: typeof move,
  resize: typeof resize,
}

type Context = {
  imageRef: ImageRef,
  transformCoefficient: number,
  transformer: (cb: TransformerParams) => any,
}

export const useMoveOrResizeHandler = ({
  imageRef,
  transformCoefficient,
  transformer,
}: Context) => {
  return (downEvent: MouseEvent) => {
    downEvent.stopPropagation()

    if (imageRef.current === null) {
      return
    }

    const startMouseImageCoords = getMouseRelativeCoords(
      downEvent,
      imageRef.current,
    )

    const startMouseSourceCoords = transformCoords(
      1 / transformCoefficient,
      startMouseImageCoords,
    )

    const startCoords = $coords.getState()

    // eslint-disable-next-line consistent-return
    const resizeHandler = (moveEvent: MouseEvent) => {
      const coords = $coords.getState()
      const sourceImageDimensions = $sourceImageDimensions.getState()
      const width = $width.getState()
      const minFrameWidth = $minFrameWidth.getState()

      if (imageRef.current === null || sourceImageDimensions === null) {
        return null
      }

      // координаты курсора в системе связанноя с верхним левым углом изображения
      const mouseImageCoords = getMouseRelativeCoords(
        moveEvent,
        imageRef.current,
      )
      // координаты курсора в системе координат исходного изображения
      const mouseSourceCoords = transformCoords(
        1 / transformCoefficient,
        mouseImageCoords,
      )

      window.requestAnimationFrame(() => {
        transformer({
          startMouseSourceCoords,
          mouseSourceCoords,
          coords,
          startCoords,
          width,
          minFrameWidth,
          sourceImageDimensions,
          move,
          resize,
        })
      })
    }

    const clean = () => {
      document.removeEventListener("mousemove", resizeHandler)
      document.removeEventListener("mouseup", clean)
      document.removeEventListener("mouseleave", clean)
    }

    document.addEventListener("mousemove", resizeHandler)
    document.addEventListener("mouseup", clean)
    document.addEventListener("mouseleave", clean)
  }
}

function getMouseRelativeCoords(e: MouseEvent, el: HTMLElement): Coords {
  const rect = el.getBoundingClientRect()
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  }
}
