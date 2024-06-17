import EditIcon from "@mui/icons-material/Edit";
import {
  Button,
  Chip,
  IconButton,
  Paper,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { SocialIcon } from "react-social-icons";
import { v4 as uuidv4 } from "uuid";

import { User } from "../../../configs/types/userTypes";
import { useAuth } from "../../../context/AuthContext/AuthContext";

import BadgesForm from "./BadgesForm/BadgesForm";
import ProfileDetailsForm from "./ProfileDetailsForm/ProfileDetailsForm";
import SkillsModal from "./SkillsModal/SkillsModal";

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
  const user = useAuth();
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
  return (
    <Stack
      direction={isMediumScreen ? "column" : "row"}
      justifyContent="space-between"
      useFlexGap
      flexWrap="wrap"
      gap={isMediumScreen ? 2 : 2}
    >
      <Paper
        sx={{
          width: { sx: "100%", md: "70%" },
          p: 2,
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
          bgcolor:
            theme.palette.mode === "dark"
              ? "background.secondary"
              : "background.default",
          position: "relative",
        }}
      >
        {user.isUser && (
          <IconButton
            aria-label="edit"
            sx={{ position: "absolute", top: "0", right: "0" }}
            onClick={() => handleProfileModal()}
          >
            <EditIcon />
          </IconButton>
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

        <Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: "600",
              mb: 2,
              color:
                theme.palette.mode === "dark"
                  ? "text.secondary"
                  : "text.primary",
            }}
          >
            About
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color:
                theme.palette.mode === "dark"
                  ? "text.secondary"
                  : "text.primary",
            }}
          >
            {profileTabInfo?.about}
          </Typography>
        </Box>
        <Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: "600",
              mb: 2,
              color:
                theme.palette.mode === "dark"
                  ? "text.secondary"
                  : "text.primary",
            }}
          >
            Follow me on
          </Typography>
          <Stack direction="row" gap={1} flexWrap="wrap">
            {profileTabInfo &&
              profileTabInfo.socialMedia.slice(0, 10).map((socialMedia) => (
                <Chip
                  key={uuidv4()}
                  variant="outlined"
                  size={isMediumScreen ? "small" : "medium"}
                  sx={{
                    borderColor:
                      theme.palette.mode === "dark"
                        ? "secondary.main"
                        : "border.secondary",
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? "background.secondary"
                        : "background.default",
                    color: "text.secondary",
                    fontSize: isMediumScreen ? "0.7rem" : "0.8rem",
                  }}
                  avatar={
                    <SocialIcon
                      network={socialMedia.platform}
                      url={socialMedia.url}
                      label={socialMedia.platform}
                      style={{
                        color: "green",
                        width: isMediumScreen ? "1.3rem" : "1.6rem",
                        height: isMediumScreen ? "1.3rem" : "1.6rem",
                        marginRight: "0px",
                      }}
                    />
                  }
                  label={socialMedia.platform}
                />
              ))}
          </Stack>
        </Box>
        <Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: "600",
              mb: 2,
              color:
                theme.palette.mode === "dark"
                  ? "text.secondary"
                  : "text.primary",
            }}
          >
            Tech Skills
          </Typography>
          <Stack direction="row" gap={1} flexWrap="wrap">
            {profileTabInfo && (
              <>
                {profileTabInfo.skills
                  .slice(
                    0,
                    profileTabInfo.skills.length < 10
                      ? profileTabInfo.skills.length
                      : 10
                  )
                  .map((skill) => (
                    <Chip
                      key={uuidv4()}
                      label={skill}
                      variant="outlined"
                      size={isMediumScreen ? "small" : "medium"}
                      sx={{
                        borderColor:
                          theme.palette.mode === "dark"
                            ? "secondary.main"
                            : "border.secondary",
                        backgroundColor:
                          theme.palette.mode === "dark"
                            ? "background.secondary"
                            : "background.default",
                        color:
                          theme.palette.mode === "dark"
                            ? "text.secondary"
                            : "secondary.main",
                        fontSize: isMediumScreen ? "0.7rem" : "0.8rem",
                      }}
                    />
                  ))}
                {profileTabInfo.skills.length > 10 && (
                  <Button
                    onClick={() => setOpenSkillsModal(true)}
                    sx={{
                      border: "1px solid",
                      borderRadius: "25rem",
                      borderColor:
                        theme.palette.mode === "dark"
                          ? "secondary.main"
                          : "border.secondary",
                      backgroundColor:
                        theme.palette.mode === "dark"
                          ? "background.secondary"
                          : "background.default",
                      color:
                        theme.palette.mode === "dark"
                          ? "text.secondary"
                          : "secondary.main",
                      fontSize: isMediumScreen ? "0.7rem" : "0.8rem",
                      height: "2rem",
                    }}
                  >
                    + {profileTabInfo.skills.length - 10}
                  </Button>
                )}
              </>
            )}
          </Stack>
          {openSkillsModal && profileTabInfo && (
            <SkillsModal
              openSkillsModal
              handleClose={() => setOpenSkillsModal((prev) => !prev)}
              skills={profileTabInfo.skills}
            />
          )}
        </Box>

        <Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: "600",
              mb: 2,
              color:
                theme.palette.mode === "dark"
                  ? "text.secondary"
                  : "text.primary",
            }}
          >
            Languages
          </Typography>
          <Stack direction="row" gap={1} flexWrap="wrap">
            {profileTabInfo &&
              profileTabInfo.languages
                .slice(
                  0,
                  profileTabInfo.languages.length < 10
                    ? profileTabInfo.languages.length
                    : 10
                )
                .map((language) => (
                  <Chip
                    key={uuidv4()}
                    label={language}
                    variant="outlined"
                    size={isMediumScreen ? "small" : "medium"}
                    sx={{
                      borderColor:
                        theme.palette.mode === "dark"
                          ? "secondary.main"
                          : "border.secondary",
                      backgroundColor:
                        theme.palette.mode === "dark"
                          ? "background.secondary"
                          : "background.default",
                      color:
                        theme.palette.mode === "dark"
                          ? "text.secondary"
                          : "secondary.main",
                      fontSize: isMediumScreen ? "0.7rem" : "0.8rem",
                    }}
                  />
                ))}
          </Stack>
        </Box>
      </Paper>
      <Paper
        sx={{
          width: { sx: "100%", md: "27%" },
          bgcolor:
            theme.palette.mode === "dark" ? "background.secondary" : "#eeeeee",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <Stack
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
            width: "100%",
          }}
        >
          <Typography sx={{ p: 1, fontWeight: 600 }} color="text.secondary">
            Badges Board
          </Typography>
          {user.isUser && (
            <IconButton aria-label="edit" onClick={() => handleBadgesModal()}>
              <EditIcon />
            </IconButton>
          )}
        </Stack>
        <Stack
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
            width: "100%",
            height: "100%",
            p: 1,
          }}
        >
          <Stack
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            {profileTabInfo?.badges.map((path, index) => {
              return (
                path.length > 3 && (
                  <img
                    key={index}
                    src={`http://localhost:8080/public/userProfileImages/${path}`}
                    alt={`${index}`}
                    width="42px"
                    height="42px"
                  />
                )
              );
            })}
          </Stack>
          {openBadgesModal ? (
            profileTabInfo && (
              <BadgesForm
                openBadgesModal={openBadgesModal}
                handleClose={handleBadgesModal}
                profileTabInfo={profileTabInfo}
                handleProfileInfo={handleProfileInfo}
              />
            )
          ) : (
            <></>
          )}
        </Stack>
      </Paper>
    </Stack>
  );
}
