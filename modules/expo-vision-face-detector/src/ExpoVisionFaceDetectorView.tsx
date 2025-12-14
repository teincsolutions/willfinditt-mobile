import { requireNativeView } from 'expo';
import * as React from 'react';

import { ExpoVisionFaceDetectorViewProps } from './ExpoVisionFaceDetector.types';

const NativeView: React.ComponentType<ExpoVisionFaceDetectorViewProps> =
  requireNativeView('ExpoVisionFaceDetector');

export default function ExpoVisionFaceDetectorView(props: ExpoVisionFaceDetectorViewProps) {
  return <NativeView {...props} />;
}
