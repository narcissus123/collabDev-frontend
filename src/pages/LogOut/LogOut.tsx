import { Suspense } from "react";
import { Skeleton } from "@mui/material";

import LogOutContainer from "../../components/LogOutContainer/LogOutContainer";

export default function LogOut() {
  return (
    <Suspense fallback={<Skeleton variant="rectangular" height={400} />}>
      <LogOutContainer />
    </Suspense>
  );
}
