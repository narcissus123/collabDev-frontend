import { Suspense, useCallback, useState } from "react";
import { useParams } from "react-router";

import { useSuspenseQuery } from "@tanstack/react-query";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Skeleton from "@mui/material/Skeleton";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { alpha } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";

import { toast } from "react-toastify";
import { Tooltip, Zoom } from "@mui/material";
import { getUserById } from "../../core/services/api/manage-user.api";
import { useAuth } from "../../context/AuthContext/AuthContext";

import {
  AccountDetailsData,
  ProfileTabsListData,
} from "../../configs/data/UserProfileInputData";

import { QueryErrorBoundary } from "../common/QueryErrorBoundary/QueryErrorBoundary";
import { getUploadedFile } from "../../core/services/api/manage-fileupload.api";
import { getImageUrl } from "../../core/utils/ImageUtils/imageUtils";
import AccountDetailsForm from "./ProfileTab/AccountDetailsForm/AccountDetailsForm";
import ProfileTab from "./ProfileTab/ProfileTab";
import ChatTab from "./ChatTab/ChatTab";
import InboxTab from "./InboxTab/InboxTab";
import InvitationForm from "./InvitationForm/InvitationForm";
import ProjectsTab from "./ProjectsTab/ProjectsTab";

export default function UserProfileContainer() {
  const { isProfileOwner } = useAuth();
  const theme = useTheme();
  const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [value, setValue] = useState("1");
  const { userId } = useParams();

  const [modalState, setModalState] = useState({
    openInviteModal: false,
    openProfileDetailsModal: false,
    openBadgesModal: false,
    openAccountDetailstModal: false,
  });

  const { data, isFetching } = useSuspenseQuery({
    queryKey: ["getUserById", userId],
    queryFn: () => getUserById(userId!),
  });

  const { data: developer } = data;

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  // Consolidate modal handlers into one function
  const toggleModal = useCallback((modalName: keyof typeof modalState) => {
    setModalState((prev) => ({
      ...prev,
      [modalName]: !prev[modalName],
    }));
  }, []);

  const handleResumeUpload = async () => {
    const res = await getUploadedFile(developer._id, "resume");
    if (!res) {
      toast.success("No resume available!");
    }
    window.open(res.resumeUrl);
  };

  return (
    <QueryErrorBoundary>
      <Grid container sx={{ flexGrow: 1, minHeight: "100vh" }}>
        {/* Background Image Grid */}
        <Grid
          item
          component="article"
          sx={{
            height: { xs: "10rem", lg: "12rem" },
            width: "100%",
            bgColor: "#142C58",
          }}
        >
          <Avatar
            src={
              theme.palette.mode === "dark"
                ? getImageUrl("common/userProfileBgDark.webp")
                : getImageUrl("common/userProfileBgLight.webp")
            }
            alt="background"
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "bottom",
              backgroundColor: "#142C58",
              borderRadius: "0%",
              color: "#142C58",
            }}
          />
        </Grid>

        {/* Profile Info Grid */}
        <Grid
          item
          component="article"
          sx={{
            bgcolor:
              theme.palette.mode === "dark"
                ? "background.default"
                : "background.default",
            width: "100%",
            position: "relative",
            py: 2,
            flexGrow: 1,
          }}
        >
          {/* Profile Edit Button */}
          {userId && isProfileOwner(userId) && (
            <Zoom in>
              <Tooltip title="Edit Account" placement="left">
                <IconButton
                  onClick={() => toggleModal("openAccountDetailstModal")}
                  sx={{
                    position: "absolute",
                    top: 4,
                    right: 4,
                    transition: "transform 0.2s ease-in-out",
                    "&:hover": { transform: "scale(1.1)" },
                  }}
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
            </Zoom>
          )}

          {/* Render Modals */}
          {modalState.openAccountDetailstModal && (
            <AccountDetailsForm
              open={modalState.openAccountDetailstModal}
              handleClose={() => toggleModal("openAccountDetailstModal")}
              developer={developer}
            />
          )}

          {/* Profile Avatar */}
          <div
            style={{
              width: "7rem",
              height: "7rem",
              borderRadius: "50%",
              display: "inline-block",
              overflow: "hidden",
              position: "relative",
              top: "-4.6rem",
              left: "50%",
              transform: "translatex(-50%)",
              outline: "none",
              backgroundColor: "white",
            }}
          >
            {isFetching ? (
              <Skeleton variant="circular" width="100%" height="100%" />
            ) : (
              <Avatar
                alt="User profile image"
                src={getImageUrl(developer?.avatar)}
                sx={{
                  cursor: "pointer",
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center",
                  fontSize: "2rem",
                }}
              >
                {developer?.name[0]}
              </Avatar>
            )}
          </div>

          {/* Profile Info Stack */}
          <Stack
            spacing={2}
            sx={{ alignItems: "center", mt: "-4rem", textAlign: "center" }}
          >
            {isFetching ? (
              <Stack
                spacing={2}
                sx={{ alignItems: "center", textAlign: "center", pt: 0.5 }}
              >
                <Skeleton variant="rectangular" width="8rem" />
                <Skeleton variant="rectangular" width="22rem" />
                <Skeleton variant="rectangular" width="8rem" />
              </Stack>
            ) : (
              AccountDetailsData(developer, theme).map((item, index) => (
                <Typography
                  key={index}
                  variant={item.variant}
                  sx={item.sx as any}
                  onClick={item.onClick}
                >
                  {item.child}
                </Typography>
              ))
            )}

            {/* Action Buttons */}
            <Stack direction="row" spacing={1}>
              {userId && !isProfileOwner(userId) && (
                <Button
                  size={isMediumScreen ? "small" : "medium"}
                  variant="contained"
                  sx={{
                    backgroundColor: "secondary.main",
                    "&:hover": {
                      backgroundColor: alpha(theme.palette.secondary.main, 0.8),
                    },
                  }}
                  onClick={() => toggleModal("openInviteModal")}
                >
                  Invite
                </Button>
              )}
              <Button
                size={isMediumScreen ? "small" : "medium"}
                variant="outlined"
                color="secondary"
                disabled={!developer?.resume}
                onClick={handleResumeUpload}
              >
                Resume
              </Button>
            </Stack>
          </Stack>
        </Grid>

        {/* Invitation Modal */}
        {modalState.openInviteModal && (
          <InvitationForm
            openInviteModal={modalState.openInviteModal}
            handleClose={() => toggleModal("openInviteModal")}
            userData={developer}
          />
        )}

        {/* Tabs Content */}
        <Grid item component="article" sx={{ width: "100%", flexGrow: 1 }}>
          <TabContext value={value}>
            <Box
              sx={{
                bgcolor:
                  theme.palette.mode === "dark"
                    ? "background.secondary"
                    : "background.default",
                color:
                  theme.palette.mode === "dark"
                    ? "text.primary"
                    : "text.primary",
                border: "2px solid",
                borderColor:
                  theme.palette.mode === "dark" ? "border.primary" : "#F1F1F3",
              }}
            >
              <TabList
                onChange={handleChange}
                centered
                aria-label="User profile tabs"
              >
                {userId &&
                  ProfileTabsListData(isProfileOwner(userId)).map(
                    (tab, index) => (
                      <Tab
                        key={index}
                        label={tab.label}
                        value={tab.value}
                        sx={{
                          fontSize: { xs: "0.7rem", md: "0.85rem" },
                          fontWeight: "700",
                          minWidth: 0,
                          width: "auto",
                        }}
                      />
                    )
                  )}
              </TabList>
            </Box>

            <Box
              sx={{
                bgcolor:
                  theme.palette.mode === "dark"
                    ? "background.secondary"
                    : "background.default",
                width: "100%",
                flexGrow: 1,
                minHeight: "100vh",
                overflowY: "auto",
              }}
            >
              <TabPanel value="1">
                {isFetching ? (
                  <Stack
                    direction={isMediumScreen ? "column" : "row"}
                    justifyContent="space-between"
                    useFlexGap
                    flexWrap="wrap"
                    gap={isMediumScreen ? 2 : 2}
                  >
                    <Skeleton
                      variant="rectangular"
                      sx={{ width: { sx: "100%", md: "70%" }, height: "25rem" }}
                    />
                    <Skeleton
                      variant="rectangular"
                      sx={{
                        width: { sx: "100%", md: "27%" },
                        height: { sx: "12.5rem", md: "25rem" },
                      }}
                    />
                  </Stack>
                ) : (
                  <QueryErrorBoundary>
                    {
                      <ProfileTab
                        handleBadgesModal={() => toggleModal("openBadgesModal")}
                        handleProfileModal={() =>
                          toggleModal("openProfileDetailsModal")
                        }
                        openBadgesModal={modalState.openBadgesModal}
                        openProfileDetailsModal={
                          modalState.openProfileDetailsModal
                        }
                        developer={developer}
                      />
                    }
                  </QueryErrorBoundary>
                )}
              </TabPanel>
              <TabPanel value="2">
                <QueryErrorBoundary>
                  {isFetching ? (
                    <Skeleton
                      variant="rectangular"
                      width="100%"
                      height="100%"
                    />
                  ) : (
                    <ProjectsTab />
                  )}
                </QueryErrorBoundary>
              </TabPanel>
              <TabPanel value="3">
                <QueryErrorBoundary>
                  {isFetching ? (
                    <Skeleton
                      variant="rectangular"
                      width="100%"
                      height="100%"
                    />
                  ) : (
                    userId &&
                    isProfileOwner(userId) && <InboxTab setValue={setValue} />
                  )}
                </QueryErrorBoundary>
              </TabPanel>
              <TabPanel value="4">
                <QueryErrorBoundary>
                  <Suspense
                    fallback={<Skeleton variant="rectangular" height={400} />}
                  >
                    {isFetching ? (
                      <Skeleton
                        variant="rectangular"
                        width="100%"
                        height="100%"
                      />
                    ) : (
                      userId && isProfileOwner(userId) && <ChatTab />
                    )}
                  </Suspense>
                </QueryErrorBoundary>
              </TabPanel>
            </Box>
          </TabContext>
        </Grid>
      </Grid>
    </QueryErrorBoundary>
  );
}
