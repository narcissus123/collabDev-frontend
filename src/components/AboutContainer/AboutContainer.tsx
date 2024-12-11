import {
  Box,
  Container,
  Typography,
  Stack,
  Paper,
  Skeleton,
} from "@mui/material";
import { Suspense } from "react";
import RocketIcon from "@mui/icons-material/Rocket";
import GroupsIcon from "@mui/icons-material/Groups";
import IntegrationInstructionsIcon from "@mui/icons-material/IntegrationInstructions";

export default function AboutContainer() {
  return (
    <Suspense fallback={<Skeleton variant="rectangular" height={400} />}>
      <Container maxWidth="lg" sx={{ py: 8 }}>
        {/* Hero Section */}
        <Stack spacing={4} alignItems="center" sx={{ my: 8 }}>
          <Typography
            variant="h3"
            component="h1"
            align="center"
            gutterBottom
            sx={{ fontWeight: "bold", color: "primary.main" }}
          >
            About CollabDev
          </Typography>
          <Typography
            variant="h6"
            align="center"
            color="text.secondary"
            sx={{ maxWidth: 800, fontSize: "15px" }}
          >
            Transform the way developers collaborate by eliminating
            fragmentation in project partnerships and creating a seamless
            journey from idea to implementation.
          </Typography>
        </Stack>

        {/* Main Content */}
        <Stack spacing={8}>
          {/* Platform Section */}
          <Paper elevation={0} sx={{ p: 4, bgcolor: "background.default" }}>
            <Stack spacing={3}>
              <Typography
                component="h2"
                gutterBottom
                sx={{ fontSize: "21px", color: "primary.main" }}
              >
                Our Platform
              </Typography>
              <Typography
                paragraph
                sx={{ fontSize: "15px", color: "text.secondary" }}
              >
                CollabDev brings together project discovery, structured
                collaboration, and integrated communication in one cohesive
                space. We streamline the collaboration process through detailed
                project profiles, targeted collaboration requests, and seamless
                team communication.
              </Typography>
              <Box sx={{ py: 2 }}>
                <Stack spacing={2}>
                  <Typography
                    sx={{
                      fontWeight: "medium",
                      fontSize: "15px",
                      color: "text.secondary",
                      "&::before": {
                        content: '"•"',
                        color: "secondary.main",
                        marginRight: "8px",
                      },
                    }}
                  >
                    Detailed project profiles that showcase goals and
                    requirements
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: "medium",
                      fontSize: "15px",
                      color: "text.secondary",
                      "&::before": {
                        content: '"•"',
                        color: "secondary.main",
                        marginRight: "8px",
                      },
                    }}
                  >
                    Targeted collaboration requests that facilitate meaningful
                    connections
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: "medium",
                      fontSize: "15px",
                      color: "text.secondary",
                      "&::before": {
                        content: '"•"',
                        color: "secondary.main",
                        marginRight: "8px",
                      },
                    }}
                  >
                    Built-in real-time chat for seamless team communication
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: "medium",
                      fontSize: "15px",
                      color: "text.secondary",
                      "&::before": {
                        content: '"•"',
                        color: "secondary.main",
                        marginRight: "8px",
                      },
                    }}
                  >
                    Comprehensive project management tools
                  </Typography>
                </Stack>
              </Box>
            </Stack>
          </Paper>

          {/* Community Section */}
          <Paper elevation={0} sx={{ p: 4, bgcolor: "background.default" }}>
            <Stack spacing={3}>
              <Typography
                component="h2"
                gutterBottom
                sx={{ fontSize: "21px", color: "primary.main" }}
              >
                Join Our Community
              </Typography>
              <Typography
                paragraph
                sx={{ fontSize: "15px", color: "text.secondary" }}
              >
                Whether you&apos;re initiating a project or looking to
                contribute, CollabDev provides the environment and tools you
                need to form effective partnerships. Our growing community of
                developers comes together to share ideas, build connections, and
                create impactful collaborations.
              </Typography>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
                  gap: 4,
                  py: 2,
                }}
              >
                <Paper elevation={0} sx={{ p: 3, textAlign: "center" }}>
                  <RocketIcon
                    sx={{ fontSize: 40, color: "secondary.main", mb: 2 }}
                  />
                  <Typography
                    gutterBottom
                    sx={{ fontSize: "16px", color: "primary.main" }}
                  >
                    Innovation
                  </Typography>
                  <Typography color="text.secondary" sx={{ fontSize: "14px" }}>
                    Share diverse project ideas and bring them to life
                  </Typography>
                </Paper>
                <Paper elevation={0} sx={{ p: 3, textAlign: "center" }}>
                  <GroupsIcon
                    sx={{ fontSize: 40, color: "secondary.main", mb: 2 }}
                  />
                  <Typography
                    gutterBottom
                    sx={{ fontSize: "16px", color: "primary.main" }}
                  >
                    Connection
                  </Typography>
                  <Typography color="text.secondary" sx={{ fontSize: "14px" }}>
                    Build valuable professional relationships
                  </Typography>
                </Paper>
                <Paper elevation={0} sx={{ p: 3, textAlign: "center" }}>
                  <IntegrationInstructionsIcon
                    sx={{ fontSize: 40, color: "secondary.main", mb: 2 }}
                  />
                  <Typography
                    gutterBottom
                    sx={{ fontSize: "16px", color: "primary.main" }}
                  >
                    Growth
                  </Typography>
                  <Typography color="text.secondary" sx={{ fontSize: "14px" }}>
                    Learn through meaningful project experiences
                  </Typography>
                </Paper>
              </Box>
            </Stack>
          </Paper>

          {/* Future Section */}
          <Paper elevation={0} sx={{ p: 4, bgcolor: "background.default" }}>
            <Stack spacing={3}>
              <Typography
                component="h2"
                gutterBottom
                sx={{ fontSize: "21px", color: "primary.main" }}
              >
                Future Development
              </Typography>
              <Typography
                paragraph
                sx={{ fontSize: "15px", color: "text.secondary" }}
              >
                We&apos;re continuously evolving to better serve our developer
                community. Our commitment to improvement drives us to expand and
                enhance our platform&apos;s capabilities.
              </Typography>
              <Box sx={{ py: 2 }}>
                <Stack spacing={2}>
                  <Typography
                    sx={{
                      fontWeight: "medium",
                      fontSize: "15px",
                      color: "text.secondary",
                      "&::before": {
                        content: '"•"',
                        color: "secondary.main",
                        marginRight: "8px",
                      },
                    }}
                  >
                    Advanced collaboration tools including group chat
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: "medium",
                      fontSize: "15px",
                      color: "text.secondary",
                      "&::before": {
                        content: '"•"',
                        color: "secondary.main",
                        marginRight: "8px",
                      },
                    }}
                  >
                    Extended project management capabilities
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: "medium",
                      fontSize: "15px",
                      color: "text.secondary",
                      "&::before": {
                        content: '"•"',
                        color: "secondary.main",
                        marginRight: "8px",
                      },
                    }}
                  >
                    Enhanced project discovery with AI-powered recommendations
                  </Typography>
                </Stack>
              </Box>
            </Stack>
          </Paper>
        </Stack>
      </Container>
    </Suspense>
  );
}
