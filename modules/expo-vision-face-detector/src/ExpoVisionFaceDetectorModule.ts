import { NativeModule, requireNativeModule } from 'expo';

import { ExpoVisionFaceDetectorModuleEvents } from './ExpoVisionFaceDetector.types';

declare class ExpoVisionFaceDetectorModule extends NativeModule<ExpoVisionFaceDetectorModuleEvents> {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ExpoVisionFaceDetectorModule>('ExpoVisionFaceDetector');
