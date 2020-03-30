// @flow
import * as React from "react"
import styled from "styled-components"
import { useMoveOrResizeHandler } from "../model"

type ResizerProps = {
  imageRef: {|
    current: HTMLImageElement | null,
  |},
  transformCoefficient: number,
}

export const TopLeft = ({ imageRef, transformCoefficient }: ResizerProps) => {
  const mouseDownHandler = useMoveOrResizeHandler({
    imageRef,
    transformCoefficient,
    transformer: ({
      mouseSourceCoords,
      coords,
      width,
      minFrameWidth,
      move,
      resize,
    }) => {
      const updatedY = mouseSourceCoords.x + coords.y - coords.x
      const updatedX = mouseSourceCoords.x
      const updatedWith = width + (coords.x - mouseSourceCoords.x)
      // проверка выхода за границы изображения
      if (updatedX >= 0 && updatedY >= 0 && updatedWith >= minFrameWidth) {
        move({ x: updatedX, y: updatedY })
        resize(updatedWith)
      }
    },
  })

  return (
    <TopLeftResizerStyled onMouseDown={mouseDownHandler}>
      <Circle />
    </TopLeftResizerStyled>
  )
}

export const TopRight = ({ imageRef, transformCoefficient }: ResizerProps) => {
  const mouseDownHandler = useMoveOrResizeHandler({
    imageRef,
    transformCoefficient,
    transformer: ({
      mouseSourceCoords,
      sourceImageDimensions,
      coords,
      width,
      minFrameWidth,
      move,
      resize,
    }) => {
      const updatedY = coords.y + width + coords.x - mouseSourceCoords.x
      const updatedWith = width + (mouseSourceCoords.x - coords.x - width)
      // проверка выхода за границы изображения
      if (
        updatedY >= 0 &&
        coords.x + updatedWith <= sourceImageDimensions.width &&
        updatedWith >= minFrameWidth
      ) {
        move({ x: coords.x, y: updatedY })
        resize(updatedWith)
      }
    },
  })

  return (
    <TopRightResizerStyled onMouseDown={mouseDownHandler}>
      <Circle />
    </TopRightResizerStyled>
  )
}

export const BottomLeft = ({
  imageRef,
  transformCoefficient,
}: ResizerProps) => {
  const mouseDownHandler = useMoveOrResizeHandler({
    imageRef,
    transformCoefficient,
    transformer: ({
      mouseSourceCoords,
      sourceImageDimensions,
      coords,
      width,
      minFrameWidth,
      move,
      resize,
    }) => {
      const { height: sourceImageHeight } = sourceImageDimensions

      const updatedX = mouseSourceCoords.x
      const updatedWith = width + (coords.x - mouseSourceCoords.x)
      // проверка выхода за границы изображения
      if (
        updatedX >= 0 &&
        coords.y + updatedWith <= sourceImageHeight &&
        updatedWith >= minFrameWidth
      ) {
        move({ x: updatedX, y: coords.y })
        resize(updatedWith)
      }
    },
  })

  return (
    <BottomLeftResizerStyled onMouseDown={mouseDownHandler}>
      <Circle />
    </BottomLeftResizerStyled>
  )
}

export const BottomRight = ({
  imageRef,
  transformCoefficient,
}: ResizerProps) => {
  const mouseDownHandler = useMoveOrResizeHandler({
    imageRef,
    transformCoefficient,
    transformer: ({
      mouseSourceCoords,
      sourceImageDimensions,
      coords,
      minFrameWidth,
      resize,
    }) => {
      const {
        height: sourceImageHeight,
        width: sourceImageWidth,
      } = sourceImageDimensions

      const updatedWith = mouseSourceCoords.x - coords.x
      // проверка выхода за границы изображения
      if (
        coords.x + updatedWith <= sourceImageWidth &&
        coords.y + updatedWith <= sourceImageHeight &&
        updatedWith >= minFrameWidth
      ) {
        resize(updatedWith)
      }
    },
  })
  return (
    <BottomRightResizerStyled onMouseDown={mouseDownHandler}>
      <Circle />
    </BottomRightResizerStyled>
  )
}

// кликабельная область "ручки" ресайза
const Resizer = styled.div`
  background: transparent;
  position: absolute;
  width: 30px;
  height: 30px;
  z-index: 13;
  display: flex;
  justify-content: center;
  align-items: center;
`

// кружочек в углоке
const Circle = styled.div`
  width: 5px;
  height: 5px;
  background-color: white;
  border-radius: 50%;
`

const TopLeftResizerStyled = styled(Resizer)`
  cursor: nw-resize;
  top: 0;
  left: 0;
  transform: translate(-50%, -50%);
`

const TopRightResizerStyled = styled(Resizer)`
  cursor: ne-resize;
  top: 0;
  right: 0;
  transform: translate(50%, -50%);
`

const BottomLeftResizerStyled = styled(Resizer)`
  cursor: sw-resize;
  bottom: 0;
  left: 0;
  transform: translate(-50%, 50%);
`

const BottomRightResizerStyled = styled(Resizer)`
  cursor: se-resize;
  bottom: 0;
  right: 0;
  transform: translate(50%, 50%);
`
