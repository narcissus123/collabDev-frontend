import { Route, Routes } from "react-router";

import { Suspense } from "react";
import { Box } from "@mui/material";

import Layout from "../../components/Layout/Layout";
import { protectedRoutes } from "../../configs/Routes";

export default function Auth() {
  return (
    <Routes>
      <Route path="/" element={<Layout header={true} footer={true} />}>
        {protectedRoutes.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            element={
              <Suspense
                fallback={
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "1px solid red",
                      mt: 14,
                      bg: "red",
                    }}
                  >
                    {route.path}
                  </Box>
                }
              >
                {route.element}
              </Suspense>
            }
          ></Route>
        ))}
      </Route>
    </Routes>
  );
}
