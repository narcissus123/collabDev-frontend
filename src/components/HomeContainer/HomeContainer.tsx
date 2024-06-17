import { Container, Typography, Button, Grid, Paper } from "@mui/material";
import { useNavigate } from "react-router";

const HomePage = () => {
  const navigate = useNavigate();
  return (
    <div>
      <section
        style={{
          paddingTop: "64px",
          paddingBottom: "64px",
          backgroundImage: 'url("/path/to/hero-image.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "white",
          textAlign: "center",
        }}
      >
        <Container maxWidth="md" sx={{ mt: 10 }}>
          <Typography variant="h2" gutterBottom sx={{ color: "black" }}>
            Welcome to CollabDev
          </Typography>
          <Typography variant="h5" paragraph sx={{ color: "black" }}>
            Where Developers Collaborate and Innovate
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => navigate("/login")}
          >
            Join CollabDev Now
          </Button>
        </Container>
      </section>
      <section
        style={{
          padding: "64px 0",
          backgroundColor: "lightgray",
          textAlign: "center",
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h4" gutterBottom>
            About CollabDev
          </Typography>
          <Typography variant="body1" paragraph>
            CollabDev is a vibrant platform designed to foster collaboration
            among developers worldwide. Whether you are a seasoned professional
            or just starting your journey in the world of coding, CollabDev
            offers you the opportunity to connect with like-minded individuals,
            explore exciting projects, and embark on collaborative endeavors
            that push the boundaries of innovation.
          </Typography>
          <Typography variant="body1" paragraph>
            Join CollabDev today and become part of a thriving community of
            developers passionate about making a difference through
            collaborative project development.
          </Typography>
        </Container>
      </section>
      <section
        style={{
          padding: "64px 0",
          backgroundColor: "lightblue",
          textAlign: "center",
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h4" gutterBottom>
            Key Features
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={3} style={{ padding: "24px" }}>
                <Typography variant="h6">Project Collaboration</Typography>
                <Typography variant="body2">
                  Find exciting projects to collaborate on or invite others to
                  join your own projects.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={3} style={{ padding: "24px" }}>
                <Typography variant="h6">AI-Driven Matchmaking</Typography>
                <Typography variant="body2">
                  Our intelligent matchmaking algorithm suggests potential
                  collaborators and projects tailored to your interests and
                  expertise.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={3} style={{ padding: "24px" }}>
                <Typography variant="h6">Skill Enhancement</Typography>
                <Typography variant="body2">
                  Explore projects outside your comfort zone and acquire new
                  skills while contributing to innovative solutions.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={3} style={{ padding: "24px" }}>
                <Typography variant="h6">Community Engagement</Typography>
                <Typography variant="body2">
                  Engage with developers through forums, discussions, and
                  networking events to share knowledge and insights.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </section>
    </div>
  );
};

export default HomePage;
