// @flow
import * as React from "react"
import styled, { css } from "styled-components"
import ReactResizeDetector from "react-resize-detector"
import { useStore } from "effector-react"

import {
  type Dimensions,
  $sourceImageBase64,
  $coords,
  $width,
  $sourceImageAspectRatio,
  $sourceImageDimensions,
  transformCoords,
  transformLength,
  useMoveOrResizeHandler,
} from "../model"

import * as Resizer from "./resizer"

type Props = {
  maxHeight: number,
}

export const CropZone = ({ maxHeight }: Props) => {
  // conntect to model
  const imageSrc = useStore($sourceImageBase64)
  const sourceImageCoords = useStore($coords)
  const sourceImageDimensions = useStore($sourceImageDimensions)
  const sourceImageCropedAreaWidth = useStore($width)
  const aspectRatio = useStore($sourceImageAspectRatio)

  // refs
  const imageRef = React.useRef<HTMLImageElement | null>(null)

  // local state
  const [containerWidth, setContainerWidth] = React.useState<number>(0)
  const [
    innerImageDimensions,
    setInnerImageDimensions,
  ] = React.useState<Dimensions>({
    width: 0,
    height: 0,
  })

  if (sourceImageDimensions === null || aspectRatio === null) {
    return null
  }

  // computed data
  const transformCoefficient =
    innerImageDimensions.width / sourceImageDimensions.width

  const frameCoords = transformCoords(transformCoefficient, sourceImageCoords)
  const frameWidth = transformLength(
    transformCoefficient,
    sourceImageCropedAreaWidth,
  )
  const isFullHeightImage = containerWidth / aspectRatio >= maxHeight

  const frameStyles = {
    width: `${frameWidth}px`,
    height: `${frameWidth}px`,
    transform: `translate(${frameCoords.x}px, ${frameCoords.y}px)`,
  }

  const frameImageStyle = {
    width: innerImageDimensions.width,
    height: innerImageDimensions.height,
    transform: `translate(-${frameCoords.x}px, -${frameCoords.y}px)`,
  }

  const stopPropagation = (e) => {
    e.stopPropagation()
    e.preventDefault()
  }

  const mouseDownHanler = useMoveOrResizeHandler({
    imageRef,
    transformCoefficient,
    transformer: ({
      startMouseSourceCoords,
      startCoords,
      mouseSourceCoords,
      width,
      sourceImageDimensions: { width: imageWidth, height: imageHeight },
      move,
    }) => {
      const updatedX =
        mouseSourceCoords.x - startMouseSourceCoords.x + startCoords.x
      const updatedY =
        mouseSourceCoords.y - startMouseSourceCoords.y + startCoords.y

      if (
        updatedX >= 0 &&
        updatedY >= 0 &&
        updatedX + width <= imageWidth &&
        updatedY + width <= imageHeight
      ) {
        move({ x: updatedX, y: updatedY })
      }
    },
  })

  return (
    <Wrap maxHeight={maxHeight}>
      <ReactResizeDetector
        handleWidth
        onResize={(width: number) => setContainerWidth(width)}
      />
      <ImageWrapper isFullHeightImage={isFullHeightImage} maxHeight={maxHeight}>
        <ReactResizeDetector
          handleWidth
          handleHeigth
          onResize={(width: number, height: number) => {
            setInnerImageDimensions({ width, height })
          }}
        />
        <Image
          ref={imageRef}
          src={imageSrc}
          isFullHeightImage={isFullHeightImage}
          maxHeight={maxHeight}
        />
        <FadedBg />
        <Frame style={frameStyles} onDragStart={stopPropagation}>
          <FrameInnerImageWrapper>
            <FrameInnerImage
              onMouseDown={mouseDownHanler}
              onDragStart={stopPropagation}
              src={imageSrc}
              style={frameImageStyle}
            />
          </FrameInnerImageWrapper>
          <Resizer.TopLeft
            imageRef={imageRef}
            transformCoefficient={transformCoefficient}
          />
          <Resizer.TopRight
            imageRef={imageRef}
            transformCoefficient={transformCoefficient}
          />
          <Resizer.BottomLeft
            imageRef={imageRef}
            transformCoefficient={transformCoefficient}
          />
          <Resizer.BottomRight
            imageRef={imageRef}
            transformCoefficient={transformCoefficient}
          />
        </Frame>
      </ImageWrapper>
    </Wrap>
  )
}

const Wrap = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
`

const FadedBg = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(25, 25, 25, 0.5);
  z-index: 11;
  user-select: none;
`

const Frame = styled.div`
  cursor: move;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 12;
  user-select: none;
  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    border: 1px solid white;
    z-index: 13;
  }
`

const FrameInnerImageWrapper = styled.div`
  user-select: none;
  overflow: hidden;
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 12;
`

const FrameInnerImage = styled.img`
  user-select: none;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 12;
`

const ImageWrapper = styled.div`
  user-select: none;
  display: flex;
  position: relative;
  ${(p) =>
    p.isFullHeightImage &&
    css`
      height: ${p.maxHeight}px;
    `}
  ${(p) =>
    !p.isFullHeightImage &&
    css`
      width: 100%;
    `}
`

const Image = styled.img`
  user-select: none;
  ${(p) =>
    p.isFullHeightImage &&
    css`
      height: ${p.maxHeight}px;
    `}
  ${(p) =>
    !p.isFullHeightImage &&
    css`
      width: 100%;
    `}
`
