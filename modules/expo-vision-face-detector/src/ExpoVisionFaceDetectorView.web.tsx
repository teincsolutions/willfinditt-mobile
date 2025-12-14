import * as React from 'react';

import { ExpoVisionFaceDetectorViewProps } from './ExpoVisionFaceDetector.types';

export default function ExpoVisionFaceDetectorView(props: ExpoVisionFaceDetectorViewProps) {
  return (
    <div>
      <iframe
        style={{ flex: 1 }}
        src={props.url}
        onLoad={() => props.onLoad({ nativeEvent: { url: props.url } })}
      />
    </div>
  );
}
