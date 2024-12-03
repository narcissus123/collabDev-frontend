import { useEffect, useState, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  Box,
  Paper,
  Stack,
  Typography,
  Chip,
  IconButton,
  Button,
  useTheme,
  useMediaQuery,
  Tooltip,
  Fade,
  Zoom,
} from "@mui/material";
import { Edit as EditIcon, Add as AddIcon } from "@mui/icons-material";
import { SocialIcon } from "react-social-icons";
import { useParams } from "react-router";
import { User } from "../../../configs/types/userTypes";
import { useAuth } from "../../../context/AuthContext/AuthContext";
import SkillsModal from "./SkillsModal/SkillsModal";
import BadgesBoard from "./BadgesBoard";
import ProfileDetailsForm from "./ProfileDetailsForm/ProfileDetailsForm";

interface ProfileTabProps {
  handleBadgesModal: () => void;
  openBadgesModal: boolean;
  handleProfileModal: () => void;
  openProfileDetailsModal: boolean;
  developer: User | undefined;
}
export default function ProfileTab({
  handleBadgesModal,
  openBadgesModal,
  handleProfileModal,
  openProfileDetailsModal,
  developer,
}: ProfileTabProps) {
  const theme = useTheme();
  const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));
  const { isProfileOwner } = useAuth();
  const { userId } = useParams();
  const [openSkillsModal, setOpenSkillsModal] = useState(false);
  const [profileTabInfo, setProfileTabInfo] = useState<User | undefined>(
    developer
  );

  useEffect(() => {
    setProfileTabInfo(developer);
  }, [developer]);

  const handleProfileInfo = (updatedInfo: User) => {
    setProfileTabInfo(updatedInfo);
  };

  const sectionStyles = useMemo(
    () => ({
      paper: {
        width: { xs: "100%", md: "70%" },
        p: 3,
        display: "flex",
        flexDirection: "column",
        gap: 3,
        bgcolor:
          theme.palette.mode === "dark"
            ? "background.secondary"
            : "background.default",
        position: "relative",
        borderRadius: 2,
        boxShadow: theme.shadows[2],
        transition: "all 0.3s ease-in-out",
      },
      chip: {
        borderColor:
          theme.palette.mode === "dark" ? "secondary.main" : "border.secondary",
        backgroundColor:
          theme.palette.mode === "dark"
            ? "background.secondary"
            : "background.default",
        color:
          theme.palette.mode === "dark" ? "text.secondary" : "secondary.main",
        fontSize: isMediumScreen ? "0.7rem" : "0.8rem",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: theme.shadows[2],
        },
      },
    }),
    [theme.palette.mode, isMediumScreen]
  );

  const Section = ({ title, children }: { title: string; children: any }) => (
    <Box>
      <Typography
        variant="h5"
        sx={{
          fontWeight: "600",
          mb: 2,
          color:
            theme.palette.mode === "dark" ? "text.secondary" : "text.primary",
        }}
      >
        {title}
      </Typography>
      {children}
    </Box>
  );

  return (
    <Stack
      direction={isMediumScreen ? "column" : "row"}
      justifyContent="space-between"
      useFlexGap
      flexWrap="wrap"
      gap={2}
    >
      <Fade in timeout={800}>
        <Paper sx={sectionStyles.paper}>
          {userId && isProfileOwner(userId) && (
            <Zoom in>
              <Tooltip title="Edit Profile" placement="left">
                <IconButton
                  aria-label="edit"
                  sx={{
                    position: "absolute",
                    top: 16,
                    right: 16,
                    transition: "transform 0.2s ease-in-out",
                    "&:hover": {
                      transform: "scale(1.1)",
                    },
                  }}
                  onClick={handleProfileModal}
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
            </Zoom>
          )}

          {openProfileDetailsModal ? (
            profileTabInfo && (
              <ProfileDetailsForm
                openProfileDetailsModal={openProfileDetailsModal}
                handleClose={handleProfileModal}
                profileTabInfo={profileTabInfo}
                handleProfileInfo={handleProfileInfo}
              />
            )
          ) : (
            <></>
          )}

          {/* About Section */}
          <Section title="About">
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ lineHeight: 1.7 }}
            >
              {profileTabInfo?.about}
            </Typography>
          </Section>

          {/* Social Media Section */}
          <Section title="Follow me on">
            <Stack direction="row" gap={1} flexWrap="wrap">
              {profileTabInfo?.socialMedia.slice(0, 10).map((socialMedia) => (
                <Tooltip title={`Visit ${socialMedia.platform}`} key={uuidv4()}>
                  <Chip
                    variant="outlined"
                    size={isMediumScreen ? "small" : "medium"}
                    sx={sectionStyles.chip}
                    avatar={
                      <SocialIcon
                        network={socialMedia.platform.toLowerCase()}
                        url={socialMedia.url}
                        label={socialMedia.platform}
                        style={{
                          width: isMediumScreen ? "1.3rem" : "1.6rem",
                          height: isMediumScreen ? "1.3rem" : "1.6rem",
                          marginRight: 0,
                        }}
                      />
                    }
                    label={socialMedia.platform}
                    onClick={() => window.open(socialMedia.url, "_blank")}
                  />
                </Tooltip>
              ))}
            </Stack>
          </Section>

          {/* Tech Skills Section */}
          <Section title="Tech Skills">
            <Stack direction="row" gap={1} flexWrap="wrap">
              {profileTabInfo?.skills
                .slice(0, 10)
                .map((skill) => (
                  <Chip
                    label={skill}
                    key={uuidv4()}
                    variant="outlined"
                    size={isMediumScreen ? "small" : "medium"}
                    sx={sectionStyles.chip}
                  />
                ))}
              {profileTabInfo && profileTabInfo?.skills.length > 10 && (
                <Button
                  startIcon={<AddIcon />}
                  onClick={() => setOpenSkillsModal(true)}
                  variant="outlined"
                  size="small"
                  sx={{
                    ...sectionStyles.chip,
                    height: "2rem",
                  }}
                >
                  {profileTabInfo.skills.length - 10} more
                </Button>
              )}
            </Stack>
          </Section>

          {/* Languages Section */}
          <Section title="Languages">
            <Stack direction="row" gap={1} flexWrap="wrap">
              {profileTabInfo?.languages
                .slice(0, 10)
                .map((language) => (
                  <Chip
                    label={language}
                    key={uuidv4()}
                    variant="outlined"
                    size={isMediumScreen ? "small" : "medium"}
                    sx={sectionStyles.chip}
                  />
                ))}
            </Stack>
          </Section>

          {/* Modals */}
          {openSkillsModal && profileTabInfo ? (
            <SkillsModal
              openSkillsModal
              handleClose={() => setOpenSkillsModal(false)}
              skills={profileTabInfo.skills}
            />
          ) : (
            <Box />
          )}
        </Paper>
      </Fade>

      <BadgesBoard
        openBadgesModal={openBadgesModal}
        handleClose={handleBadgesModal}
        profileTabInfo={profileTabInfo}
        handleProfileInfo={handleProfileInfo}
        developer={developer}
      />
    </Stack>
  );
}
