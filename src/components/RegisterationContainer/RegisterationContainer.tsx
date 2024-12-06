import { Navigate, useNavigate } from "react-router";
import { IconButton, Skeleton, Box } from "@mui/material";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { Suspense, useState } from "react";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import { useAuth } from "../../context/AuthContext/AuthContext";
import SignInContainer from "./SignInContainer/SignInContainer";
import SignUpContainer from "./SignUpContainer/SignUpContainer";
import "./RegisterationContainer.scss";

export default function RegisterationContainer() {
  const navigate = useNavigate();
  const [signIn, setSignIn] = useState<boolean>(true);
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  const handleSignIn = (value: boolean): void => {
    setSignIn(value);
  };

  return (
    <Suspense fallback={<Skeleton variant="rectangular" height="100vh" />}>
      <Grid
        container
        sx={{
          minHeight: "100vh",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Left animated section */}
        <Grid
          item
          className="animated-item"
          xs={12}
          md={6}
          lg={7}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            p: { xs: 3, md: 6, lg: 8 },
            position: "relative",
            minHeight: { xs: "auto", md: "100vh" },
          }}
        >
          {/* Top bar on mobile */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "64px",
              display: "flex",
              alignItems: "center",
              px: { xs: 2, md: 3 },
              background: { xs: "rgba(0,0,0,0.1)", md: "transparent" },
              backdropFilter: { xs: "blur(10px)", md: "none" },
            }}
          >
            <IconButton
              onClick={() => navigate("/")}
              sx={{
                border: "1px solid rgba(255, 255, 255, 0.3)",
                color: "white",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              <HomeOutlinedIcon />
            </IconButton>
          </Box>

          {/* Main content */}
          <Box sx={{ mt: { xs: 8, md: 0 } }}>
            <Typography
              variant="h2"
              fontWeight="700"
              sx={{
                color: "#FFFFFF",
                fontSize: {
                  xs: "1.85rem",
                  sm: "2rem",
                  md: "3rem",
                  lg: "3.5rem",
                },
                lineHeight: 1.2,
                textShadow: "0px 2px 4px rgba(0,0,0,0.1)",
                maxWidth: "600px",
                mx: "auto",
                textAlign: { xs: "center", md: "left" },
              }}
            >
              {/*  #F29A41*/}
              Build Together,{" "}
              <Box component="span" sx={{ color: "#2C1559" }}>
                Grow Together
              </Box>
            </Typography>

            <Typography
              variant="h6"
              sx={{
                color: "rgba(255, 255, 255, 0.9)",
                mt: 3,
                maxWidth: "500px",
                mx: "auto",
                fontSize: { xs: "1rem", md: "1.25rem" },
                textAlign: { xs: "center", md: "left" },
              }}
            >
              Join a thriving community of developers collaborating on
              innovative projects. Find your next great team or build your dream
              project.
            </Typography>
          </Box>
        </Grid>

        {/* Right form section */}
        <Grid
          item
          xs={12}
          md={6}
          lg={5}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            bgcolor: "background.paper",
            p: { xs: 2, sm: 4, md: 6 },
            minHeight: { xs: "55vh", md: "100vh" },
          }}
        >
          {signIn ? (
            <SignInContainer handleSignIn={handleSignIn} />
          ) : (
            <SignUpContainer handleSignIn={handleSignIn} />
          )}
        </Grid>
      </Grid>
    </Suspense>
  );
}
