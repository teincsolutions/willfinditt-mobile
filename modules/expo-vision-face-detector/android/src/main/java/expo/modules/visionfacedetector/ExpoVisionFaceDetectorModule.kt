package expo.modules.visionfacedetector

import android.graphics.BitmapFactory
import android.net.Uri
import com.google.mlkit.vision.common.InputImage
import com.google.mlkit.vision.face.FaceDetection
import com.google.mlkit.vision.face.FaceDetectorOptions
import expo.modules.kotlin.Promise
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.io.File

class ExpoVisionFaceDetectorModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("ExpoVisionFaceDetector")

    OnCreate {
      android.util.Log.d("ExpoVisionFaceDetector", "Module created and available")
    }

    Function("hello") {
      "ExpoVisionFaceDetector initialized"
    }

    Function("isAvailable") {
      true
    }

    AsyncFunction("detectFaces") { imageUri: String, promise: Promise ->
      try {
        // Parse URI and load image
        val uri = Uri.parse(imageUri)
        val filePath = uri.path ?: throw IllegalArgumentException("Invalid image path")
        val imageFile = File(filePath)
        
        if (!imageFile.exists()) {
          promise.reject("IMAGE_NOT_FOUND", "Image file not found: $filePath", null)
          return@AsyncFunction
        }

        val bitmap = BitmapFactory.decodeFile(filePath)
        if (bitmap == null) {
          promise.reject("IMAGE_LOAD_ERROR", "Failed to decode image", null)
          return@AsyncFunction
        }

        val image = InputImage.fromBitmap(bitmap, 0)

        // Configure ML Kit face detector with same settings as frame processor
        val options = FaceDetectorOptions.Builder()
          .setPerformanceMode(FaceDetectorOptions.PERFORMANCE_MODE_FAST)
          .setLandmarkMode(FaceDetectorOptions.LANDMARK_MODE_NONE)
          .setContourMode(FaceDetectorOptions.CONTOUR_MODE_NONE)
          .setClassificationMode(FaceDetectorOptions.CLASSIFICATION_MODE_NONE)
          .setMinFaceSize(0.15f)
          .build()

        val detector = FaceDetection.getClient(options)

        detector.process(image)
          .addOnSuccessListener { faces ->
            val results = faces.map { face ->
              mapOf(
                "yawAngle" to (face.headEulerAngleY.toDouble()),
                "pitchAngle" to (face.headEulerAngleX.toDouble()),
                "rollAngle" to (face.headEulerAngleZ.toDouble()),
                "bounds" to mapOf(
                  "x" to face.boundingBox.left.toDouble(),
                  "y" to face.boundingBox.top.toDouble(),
                  "width" to face.boundingBox.width().toDouble(),
                  "height" to face.boundingBox.height().toDouble()
                )
              )
            }
            promise.resolve(results)
            bitmap.recycle()
          }
          .addOnFailureListener { e ->
            bitmap.recycle()
            promise.reject("DETECTION_ERROR", "Face detection failed: ${e.message}", e)
          }
      } catch (e: Exception) {
        promise.reject("DETECTION_ERROR", "Error detecting faces: ${e.message}", e)
      }
    }
  }
}
