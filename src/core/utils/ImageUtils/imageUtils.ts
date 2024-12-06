export const getImageUrl = (path: string) => {
  // If it's a common asset, always use prod bucket
  if (path.startsWith("common/")) {
    console.log(
      "up",
      `https://collabdev-prod-storage-2024.s3.us-east-2.amazonaws.com/${path}`
    );
    return `https://collabdev-prod-storage-2024.s3.us-east-2.amazonaws.com/${path}`;
  }
  console.log("down", `${process.env.REACT_APP_S3_BUCKET_URL}/${path}`);
  // Otherwise use environment-specific bucket
  return `${process.env.REACT_APP_S3_BUCKET_URL}/${path}`;
};
