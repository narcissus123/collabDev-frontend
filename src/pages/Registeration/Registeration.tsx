import { Suspense } from "react";
import { Skeleton } from "@mui/material";
import RegisterationContainer from "../../components/RegisterationContainer/RegisterationContainer";

export default function Registeration() {
  return (
    <Suspense fallback={<Skeleton variant="rectangular" height={400} />}>
      <RegisterationContainer />{" "}
    </Suspense>
  );
}
