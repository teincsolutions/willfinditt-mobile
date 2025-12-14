import { registerWebModule, NativeModule } from 'expo';

import { ChangeEventPayload } from './ExpoVisionFaceDetector.types';

type ExpoVisionFaceDetectorModuleEvents = {
  onChange: (params: ChangeEventPayload) => void;
}

class ExpoVisionFaceDetectorModule extends NativeModule<ExpoVisionFaceDetectorModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
};

export default registerWebModule(ExpoVisionFaceDetectorModule, 'ExpoVisionFaceDetectorModule');
