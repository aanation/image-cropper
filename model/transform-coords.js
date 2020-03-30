// @flow
import { type Coords } from "./types"

export function transformCoords(
  transformCoefficient: number,
  sourceCoords: Coords,
): Coords {
  // Nan or infinite fallback
  // eslint-disable-next-line no-restricted-globals
  if (!isFinite(transformCoefficient)) {
    return { x: 0, y: 0 }
  }

  return {
    x: sourceCoords.x * transformCoefficient,
    y: sourceCoords.y * transformCoefficient,
  }
}

export function transformLength(
  transformCoefficient: number,
  sourceLength: number,
) {
  // Nan or infinite fallback
  // eslint-disable-next-line no-restricted-globals
  if (!isFinite(transformCoefficient)) {
    return sourceLength
  }

  return sourceLength * transformCoefficient
}
