import {
  Container,
  Typography,
  Button,
  Grid,
  Skeleton,
  Box,
  Stack,
  useTheme,
  Paper,
  alpha,
} from "@mui/material";
import { Suspense } from "react";
import { useNavigate } from "react-router";
import { Code, Chat, Group, AccountBox } from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext/AuthContext";
import { getImageUrl } from "../../core/utils/ImageUtils/imageUtils";

const HomePage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: (
        <Code
          sx={{
            fontSize: 40,
            color:
              theme.palette.mode === "dark" ? "secondary.main" : "promary.main",
          }}
        />
      ),
      title: "Project Discovery",
      description:
        "Advanced filtering, detailed project profiles with tech stack information, goals, and requirements.",
    },
    {
      icon: (
        <Chat
          sx={{
            fontSize: 40,
            color:
              theme.palette.mode === "dark" ? "secondary.main" : "promary.main",
          }}
        />
      ),
      title: "Collaboration Tools",
      description:
        "Connect through real-time chat, send structured collaboration requests, and coordinate with team members effectively.",
    },
    {
      icon: (
        <AccountBox
          sx={{
            fontSize: 40,
            color:
              theme.palette.mode === "dark" ? "secondary.main" : "promary.main",
          }}
        />
      ),
      title: "Professional Profiles",
      description:
        "Showcase your skills, build your project portfolio, and customize your profile.",
    },
    {
      icon: (
        <Group
          sx={{
            fontSize: 40,
            color:
              theme.palette.mode === "dark" ? "secondary.main" : "promary.main",
          }}
        />
      ),
      title: "Developer Network",
      description:
        "Connect with developers who share your interests and build meaningful professional relationships through project collaboration.",
    },
    // {
    //   icon: (
    //     <Rocket
    //       sx={{
    //         fontSize: 40,
    //         color:
    //           theme.palette.mode === "dark" ? "secondary.main" : "promary.main",
    //       }}
    //     />
    //   ),
    //   title: "Skill Enhancement",
    //   description:
    //     "Level up your skills by working on diverse projects. Learn from experienced developers and stay ahead with cutting-edge technologies.",
    // },
    // {
    //   icon: <GitHub sx={{ fontSize: 40, color: "primary.main" }} />,
    //   title: "AI-Driven Matchmaking",
    //   description:
    //     "Find the perfect project or team member with our intelligent matching system. Get personalized recommendations based on your skills and interests.",
    // },
    // {
    //   icon: <Security sx={{ fontSize: 40, color: "primary.main" }} />,
    //   title: "Secure Platform",
    //   description:
    //     "Robust protection with JWT-based authentication, role-based access control, and secure data handling.",
    // },
  ];

  return (
    <Box sx={{ overflow: "hidden", mt: 8 }}>
      <Suspense fallback={<Skeleton variant="rectangular" height="100vh" />}>
        {/* Hero Section */}
        <Box
          sx={{
            position: "relative",
            minHeight: "90vh",
            display: "flex",
            alignItems: "center",
            backgroundColor: "background.paper",
            overflow: "hidden",
            "&::after": {
              content: '""',
              position: "absolute",
              top: 0,
              right: "-10%",
              width: "50%",
              height: "100%",
              background: theme.palette.primary.main,
              opacity: 0.05,
              transform: "skewX(-20deg)",
              display: { xs: "none", md: "block" },
            },
          }}
        >
          <Container maxWidth="lg">
            <Grid container spacing={6} alignItems="center">
              <Grid item xs={12} md={6}>
                <Stack spacing={4} sx={{ position: "relative" }}>
                  <Box>
                    <Typography
                      variant="overline"
                      sx={{
                        color: "primary.main",
                        fontWeight: 600,
                        letterSpacing: 1.5,
                      }}
                    >
                      WELCOME TO COLLABDEV
                    </Typography>
                    <Typography
                      variant="h1"
                      sx={{
                        fontSize: { xs: "2.5rem", md: "3.5rem", lg: "4rem" },
                        fontWeight: 800,
                        lineHeight: 1.2,
                        mb: 2,
                        color:
                          theme.palette.mode === "dark"
                            ? "text.secondary"
                            : "#000000",
                      }}
                    >
                      Transform How You
                      <Box
                        component="span"
                        sx={{
                          color: "primary.main",
                          display: "block",
                        }}
                      >
                        Collaborate & Code
                      </Box>
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{
                        color: "text.secondary",
                        fontWeight: 400,
                        lineHeight: 1.6,
                        mb: 4,
                      }}
                    >
                      Connect with developers, work on real projects, and build
                      meaningful experiences together. Your next great
                      collaboration starts here.
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={2}>
                    {!isAuthenticated && (
                      <Button
                        variant="contained"
                        size="large"
                        onClick={() => navigate("/login")}
                        sx={{
                          py: 1.5,
                          px: 4,
                          borderRadius: 2,
                          textTransform: "none",
                          fontSize: "1.1rem",
                          fontWeight: 600,
                          backgroundColor:
                            theme.palette.mode === "dark"
                              ? "secondary.main"
                              : "primary.main",
                          "&:hover": {
                            backgroundColor:
                              theme.palette.mode === "dark"
                                ? alpha(theme.palette.secondary.main, 0.8)
                                : alpha(theme.palette.primary.main, 0.8),
                            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                          },
                        }}
                      >
                        Get Started
                      </Button>
                    )}
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={() => navigate("/projects")}
                      sx={{
                        py: 1.5,
                        px: 4,
                        borderRadius: 2,
                        textTransform: "none",
                        fontSize: "1.1rem",
                        fontWeight: 600,
                        borderColor:
                          theme.palette.mode === "dark"
                            ? "secondary.main"
                            : "primary.main",
                        color:
                          theme.palette.mode === "dark"
                            ? "secondary.main"
                            : "primary.main",
                        "&:hover": {
                          backgroundColor:
                            theme.palette.mode === "dark"
                              ? alpha(theme.palette.secondary.main, 0.1)
                              : alpha(theme.palette.primary.main, 0.05),
                          borderColor:
                            theme.palette.mode === "dark"
                              ? "secondary.main"
                              : "primary.main",
                        },
                      }}
                    >
                      Explore Projects
                    </Button>
                  </Stack>
                </Stack>
              </Grid>
              <Grid
                item
                xs={12}
                md={6}
                sx={{
                  display: { xs: "none", md: "flex" },
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Box
                  component="img"
                  src={getImageUrl("common/collaboration.svg")}
                  alt="Where Ideas Meet"
                  sx={{
                    width: "100%",
                    maxWidth: 600,
                    transform: "scale(1.1)",
                  }}
                />
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Features Section */}
        <Box
          sx={{
            py: { xs: 8, md: 12 },
            backgroundColor:
              theme.palette.mode === "dark" ? "background.paper" : "grey.50",
          }}
        >
          <Container maxWidth="lg">
            <Typography
              variant="h2"
              align="center"
              sx={{
                mb: 8,
                fontSize: { xs: "2rem", md: "2.5rem" },
                fontWeight: 700,
                color:
                  theme.palette.mode === "dark" ? "text.secondary" : "#000000",
              }}
            >
              Why Choose CollabDev?
            </Typography>
            <Grid container spacing={4}>
              {features.map((feature, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 4,
                      height: "100%",
                      borderRadius: 4,
                      transition: "transform 0.3s ease-in-out",
                      "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: theme.shadows[8],
                      },
                    }}
                  >
                    <Stack spacing={3} alignItems="center" textAlign="center">
                      {feature.icon}
                      <Typography
                        variant="h6"
                        fontWeight={600}
                        sx={{
                          color:
                            theme.palette.mode === "dark"
                              ? "primary.main"
                              : "#000000",
                        }}
                      >
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {feature.description}
                      </Typography>
                    </Stack>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* About Section */}
        <Box
          sx={{
            py: { xs: 8, md: 12 },
            backgroundColor:
              theme.palette.mode === "dark" ? "background.paper" : "white",
          }}
        >
          <Container maxWidth="md">
            <Stack spacing={4} alignItems="center" textAlign="center">
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: "1.75rem", md: "2.25rem" },
                  color:
                    theme.palette.mode === "dark" ? "primary.main" : "#000000",
                }}
              >
                Build Your Developer Network
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontSize: "1.1rem",
                  color: "text.secondary",
                  maxWidth: "800px",
                  lineHeight: 1.8,
                }}
              >
                CollabDev is more than just a platform—it&apos;s a thriving
                ecosystem where developers at all stages of their journey come
                together to create exceptional software. Whether you&apos;re a
                seasoned professional or just starting out, you&apos;ll find
                opportunities to contribute, learn, and grow.
              </Typography>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate("/about")}
                sx={{
                  mt: 2,
                  py: 1.5,
                  px: 4,
                  borderRadius: "8px",
                  textTransform: "none",
                  borderColor:
                    theme.palette.mode === "dark"
                      ? "secondary.main"
                      : "promary.main",
                  color:
                    theme.palette.mode === "dark"
                      ? "secondary.main"
                      : "primary.main",
                  "&:hover": {
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? alpha(theme.palette.secondary.main, 0.1)
                        : alpha(theme.palette.primary.main, 0.05),
                    borderColor:
                      theme.palette.mode === "dark"
                        ? "secondary.main"
                        : "primary.main",
                  },
                }}
              >
                Learn More About Us
              </Button>
            </Stack>
          </Container>
        </Box>
      </Suspense>
    </Box>
  );
};

export default HomePage;
