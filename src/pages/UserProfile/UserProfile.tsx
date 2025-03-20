import { Suspense } from "react";
import { Skeleton, Stack } from "@mui/material";
import UserProfileContainer from "../../components/UserProfileContainer/UserProfileContainer";

export default function UserProfile() {
  return (
    <Suspense
      fallback={
        <Stack sx={{ flexDirection: "column", gap: 2 }}>
          <Skeleton variant="rectangular" width="100%" height={363} />
          <Skeleton variant="rectangular" width="100%" height={48} />
          <Skeleton variant="rectangular" width="100%" height={400} />
        </Stack>
      }
    >
      <UserProfileContainer />
    </Suspense>
  );
}
