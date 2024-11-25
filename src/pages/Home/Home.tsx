import { Suspense } from "react";
import { Skeleton } from "@mui/material";
import HomeContainer from "../../components/HomeContainer/HomeContainer";

export default function Home() {
  return (
    <Suspense fallback={<Skeleton variant="rectangular" height={400} />}>
      <HomeContainer />{" "}
    </Suspense>
  );
}
