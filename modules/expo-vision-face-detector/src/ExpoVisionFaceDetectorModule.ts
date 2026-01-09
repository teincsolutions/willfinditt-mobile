import { NativeModule, requireNativeModule } from 'expo';

import { ExpoVisionFaceDetectorModuleEvents } from './ExpoVisionFaceDetector.types';

declare class ExpoVisionFaceDetectorModule extends NativeModule<ExpoVisionFaceDetectorModuleEvents> {
  PI: number;
  hello(): string;
  isAvailable(): boolean;
  detectFaces(imageUri: string): Promise<Array<{
    yawAngle: number;
    pitchAngle: number;
    rollAngle: number;
    bounds: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
  }>>;
  setValueAsync(value: string): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ExpoVisionFaceDetectorModule>('ExpoVisionFaceDetector');
