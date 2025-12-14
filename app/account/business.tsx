import FaceAutoCapture from "@/components/kyc/FaceAutoCapture";
import AppView from "@/components/ui/AppView";

export default function BusinessScreen() {
  return (
    <AppView style={{ flex: 1 }}>
      <FaceAutoCapture
        onCaptured={(photos) => {
          console.log("✅ All poses captured:", photos.length);
          photos.forEach((photo) => {
            console.log(`  ${photo.pose}: ${photo.uri}`);
          });
          // TODO: Handle the captured photos (upload for KYC verification)
        }}
        requireAllPoses={true}
        allowCameraSwitch={true}
      />
    </AppView>
  );
}
