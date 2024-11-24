import { useNavigate } from "react-router";
import { IconButton, Skeleton, useTheme } from "@mui/material";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { Suspense, useState } from "react";

import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import SignInContainer from "./SignInContainer/SignInContainer";
import SignUpContainer from "./SignUpContainer/SignUpContainer";

import "./RegisterationContainer.scss";

export default function RegisterationContainer() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [signIn, setSignIn] = useState<boolean>(true);

  const handleSignIn = (value: boolean): void => {
    setSignIn(value);
  };

  return (
    <Suspense fallback={<Skeleton variant="rectangular" height={400} />}>
      <Grid
        container
        sx={{
          display: "flex",
          flexDirection: "row",
          height: "100vh",
          position: "relative",
        }}
      >
        <Grid
          item
          className={`animated-item `}
          xs={8}
          md={6}
          lg={4}
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            p: "6px 8px",
            height: "100%",
            [theme.breakpoints.up("md")]: {
              p: "10px 16px",
            },
            [theme.breakpoints.up("lg")]: {
              justifyContent: "center",
              alignItems: "center",
            },
          }}
        >
          <Typography
            variant="h4"
            fontWeight="bold"
            fontFamily="Arial, sans-serif"
            sx={{
              color: "#FFFFFF",
              [theme.breakpoints.up("md")]: {
                fontSize: "2rem",
              },
              [theme.breakpoints.up("lg")]: {
                fontSize: "3rem",
              },
            }}
          >
            Code, Collaborate, Conquer with CollabDev!
          </Typography>
        </Grid>
        <Grid
          item
          xs={4}
          md={6}
          lg={8}
          sx={{
            height: "100%",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "flex-start",
          }}
        >
          <IconButton
            onClick={() => navigate("/")}
            sx={{ border: "1px solid #ccc", m: 2 }}
          >
            <HomeOutlinedIcon sx={{ fontSize: "1.7rem" }} />
          </IconButton>
        </Grid>

        {signIn ? (
          <SignInContainer handleSignIn={handleSignIn} />
        ) : (
          <SignUpContainer handleSignIn={handleSignIn} />
        )}
      </Grid>
    </Suspense>
  );
}
