// Reexport the native module. On web, it will be resolved to ExpoVisionFaceDetectorModule.web.ts
// and on native platforms to ExpoVisionFaceDetectorModule.ts
export { default } from './src/ExpoVisionFaceDetectorModule';
export { default as ExpoVisionFaceDetectorView } from './src/ExpoVisionFaceDetectorView';
export * from  './src/ExpoVisionFaceDetector.types';
