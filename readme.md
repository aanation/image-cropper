# Image cropper

Image Cropper based on React + EffectorJS 

## Usage 

Model:
```typescript
import {
  forward,
  createEvent,
  createEffect,
} from "effector"
import {
  changeSourceImage,
  crop,
  cropProcess,
} from "lib/image-crop"

export const onClickCropBtn = createEvent<void>()
export const readBase64StringFromFile = createEffect<File, string, Error>()

forward({
  from: readBase64StringFromFile.done.map(({ result }) => result),
  to: changeSourceImage,
})

forward({
  from: onClickCropBtn,
  to: crop,
})


cropProcess.done.watch(({ result }) => {
  const base64string = result
  // do something
})
```

View
```tsx
import * as React from "react"
import styled from "styled-components"
import { CropZone, Preview, $hasSourceImage, resetCropper } from "lib/image-crop"
import { UploadBtn } from "ui/upload"
import { onClickCropBtn, readBase64StringFromFile, reset } from "./my-model"

export const MyCrop = () => {
  React.useEffect(() => {
    return () => resetCropper()
  }, [])

  return (
    <Wrap>
      <CropZoneCol>
        <ColHeading>Crop your image</ColHeading>
        <CropZone maxHeight={600} />
      </CropZoneCol>
      <PreviewCol>
        <ColHeading>Preview</ColHeading>
        <Preview />
      </PreviewCol>
      <Buttons>
        <UploadBtn onFile={readBase64StringFromFile} type="button">Upload image</UploadBtn>
        <CropBtn onClick={onClickCropBtn} type="button">Crop!</CropBtn>
      </Buttons>
    </Wrap>
  )
}


const Wrap = styled.div``
const CropZoneCol = styled.div``
const ColHeading = styled.div``
const PreviewCol = styled.div``
const Buttons = styled.div``
const CropBtn = styled.div``
```