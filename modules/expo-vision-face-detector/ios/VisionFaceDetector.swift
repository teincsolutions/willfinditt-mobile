//
//  VisionFaceDetector.swift
//  Willfinditt
//
//  Native iOS face detection using Apple Vision framework
//  No Google ML Kit dependencies
//

import Foundation
import Vision
import AVFoundation
import CoreImage

@objc(VisionFaceDetector)
class VisionFaceDetector: NSObject {
    
    // MARK: - Face Detection Result Structure
    struct FaceResult: Codable {
        let pitchAngle: Double
        let rollAngle: Double
        let yawAngle: Double
        let bounds: BoundsResult
    }
    
    struct BoundsResult: Codable {
        let x: Double
        let y: Double
        let width: Double
        let height: Double
    }
    
    // MARK: - Detect Faces in Image
    @objc
    func detectFaces(
        _ imageUri: String,
        resolver resolve: @escaping RCTPromiseResolveBlock,
        rejecter reject: @escaping RCTPromiseRejectBlock
    ) {
        guard let url = URL(string: imageUri) else {
            reject("INVALID_URI", "Invalid image URI", nil)
            return
        }
        
        // Load image
        guard let imageData = try? Data(contentsOf: url),
              let image = CIImage(data: imageData) else {
            reject("IMAGE_LOAD_ERROR", "Failed to load image", nil)
            return
        }
        
        // Create face detection request
        let faceDetectionRequest = VNDetectFaceRectanglesRequest { [weak self] request, error in
            if let error = error {
                reject("DETECTION_ERROR", error.localizedDescription, error)
                return
            }
            
            guard let observations = request.results as? [VNFaceObservation] else {
                resolve([])
                return
            }
            
            let faces = observations.map { observation -> [String: Any] in
                let bounds = observation.boundingBox
                
                // Convert normalized coordinates to pixel coordinates
                let imageWidth = image.extent.width
                let imageHeight = image.extent.height
                
                return [
                    "pitchAngle": observation.pitch?.doubleValue ?? 0.0,
                    "rollAngle": observation.roll?.doubleValue ?? 0.0,
                    "yawAngle": observation.yaw?.doubleValue ?? 0.0,
                    "bounds": [
                        "x": bounds.origin.x * imageWidth,
                        "y": bounds.origin.y * imageHeight,
                        "width": bounds.width * imageWidth,
                        "height": bounds.height * imageHeight
                    ]
                ]
            }
            
            resolve(faces)
        }
        
        // Perform detection
        let handler = VNImageRequestHandler(ciImage: image, options: [:])
        do {
            try handler.perform([faceDetectionRequest])
        } catch {
            reject("DETECTION_ERROR", error.localizedDescription, error)
        }
    }
    
    // MARK: - React Native Module Setup
    @objc
    static func requiresMainQueueSetup() -> Bool {
        return false
    }
}
