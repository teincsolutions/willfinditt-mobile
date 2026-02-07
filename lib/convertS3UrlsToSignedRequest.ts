/**
 * Convert S3 shortened URLs to signed URL request paths.
 *
 * Example input:
 *  [
 *    "s3://willfind8-kyc-documents/cmeg6qvzz0000mpa4cqbd56wd/national_id/e18003e7-9483-43ec-982e-5dc847fa542b.pdf"
 *  ]
 *
 * Example output:
 *  [
 *    "/api/v1/upload/signed-url/kyc-documents/cmeg6qvzz0000mpa4cqbd56wd/national_id/e18003e7-9483-43ec-982e-5dc847fa542b.pdf"
 *  ]
 */
export function convertS3UrlsToSignedRequest(urls: string[]): string[] {
  return urls.map(convertS3UrlToSignedRequest);
}

export function convertS3UrlToSignedRequest(url: string): string {
  // Remove "s3://"
  const withoutScheme = url.replace(/^s3:\/\//, "");

  // Split into bucket + path
  const [bucketWithPrefix, ...pathParts] = withoutScheme.split("/");

  // Example: bucket = "willfind8-kyc-documents"
  // We only need "kyc-documents"
  const bucket = bucketWithPrefix.split("-").slice(1).join("-");

  // Construct final API path
  return `/api/v1/upload/signed-url/${bucket}/${pathParts.join("/")}`;
}
