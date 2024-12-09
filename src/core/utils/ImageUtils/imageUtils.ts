export const getImageUrl = (path: string) => {
  // If it's a common asset, always use prod bucket
  if (path.startsWith("common/")) {
    return `https://collabdev-prod-storage-2024.s3.us-east-2.amazonaws.com/${path}`;
  }
  // Otherwise use environment-specific bucket
  return `${process.env.REACT_APP_S3_BUCKET_URL}/${path}`;
};
