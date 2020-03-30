// @flow
import * as React from "react"
import { useStore } from "effector-react"
import styled from "styled-components"
import ReactResizeDetector from "react-resize-detector"
import {
  $sourceImageBase64,
  $sourceImageDimensions,
  $width,
  $coords,
  transformCoords,
} from "../model"

type Props = {
  size?: number,
}

export const Preview = ({ size }: Props) => {
  const sourceImageBase64 = useStore($sourceImageBase64)
  const sourceImageCropedAreaWidth = useStore($width)
  const sourceImageDimensions = useStore($sourceImageDimensions)
  const sourceCoords = useStore($coords)

  const [containerWidth, setContainerWidth] = React.useState(100)

  const previewSize = typeof size === "number" ? size : containerWidth

  if (sourceImageDimensions === null) {
    return null
  }

  const transformCoefficient = previewSize / sourceImageCropedAreaWidth
  const previewCoords = transformCoords(transformCoefficient, sourceCoords)

  const imageStyles = {
    width: sourceImageDimensions.width * transformCoefficient,
    transform: `translate(-${previewCoords.x}px, -${previewCoords.y}px)`,
  }

  const wrapperStyles = {
    width: size ? `${size}px` : `${containerWidth}px`,
    height: size ? `${size}px` : `${containerWidth}px`,
  }

  return (
    <div>
      <ReactResizeDetector
        handleWidth
        onResize={(width: number) => setContainerWidth(width)}
      />
      <Wrap style={wrapperStyles}>
        <Image style={imageStyles} src={sourceImageBase64} />
      </Wrap>
    </div>
  )
}

Preview.defaultProps = {
  size: undefined,
}

const Wrap = styled.div`
  overflow: hidden;
  border: 2px solid white;
`

const Image = styled.img``
