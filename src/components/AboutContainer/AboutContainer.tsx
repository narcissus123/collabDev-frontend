import { Skeleton } from "@mui/material";
import { Suspense } from "react";

export default function AboutContainer() {
  return (
    <Suspense fallback={<Skeleton variant="rectangular" height={400} />}>
      <div>AboutContainer</div>
    </Suspense>
  );
}
