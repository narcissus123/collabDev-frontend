import { Suspense } from "react";
import { Skeleton } from "@mui/material";
import AboutContainer from "../../components/AboutContainer/AboutContainer";

export default function About() {
  return (
    <Suspense fallback={<Skeleton variant="rectangular" height={400} />}>
      <AboutContainer />
    </Suspense>
  );
}
