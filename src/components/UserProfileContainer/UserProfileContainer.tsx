import { Suspense, useCallback, useState } from "react";
import { useParams } from "react-router";

import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Skeleton from "@mui/material/Skeleton";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
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
import { getUserById } from "../../core/services/api/manage-user.api";
import { useAuth } from "../../context/AuthContext/AuthContext";

import {
  AccountDetailsData,
  ProfileTabsListData,
} from "../../configs/data/UserProfileInputData";

import { QueryErrorBoundary } from "../common/QueryErrorBoundary/QueryErrorBoundary";
import { getUploadedFile } from "../../core/services/api/manage-fileupload.api";
import AccountDetailsForm from "./ProfileTab/AccountDetailsForm/AccountDetailsForm";
import ProfileTab from "./ProfileTab/ProfileTab";
import ChatTab from "./ChatTab/ChatTab";
import InboxTab from "./InboxTab/InboxTab";
import InvitationForm from "./InvitationForm/InvitationForm";
import ProjectsTab from "./ProjectsTab/ProjectsTab";

export default function UserProfileContainer() {
  const user = useAuth();
  const theme = useTheme();
  const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [value, setValue] = useState("1");
  const { userId } = useParams();

  const { data, isFetching } = useSuspenseQuery({
    queryKey: ["getUserById", userId],
    queryFn: () => getUserById(userId!),
  });

  const { data: developer } = data;

  const queryClient = useQueryClient();
  const handleProfileInfo = () => {
    queryClient.invalidateQueries({ queryKey: ["getUserById", userId] });
  };

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  // Handle edit modals:
  const [openProfileDetailsModal, setOpenProfileDetailsModal] =
    useState<boolean>(false);
  const [openBadgesModal, setOpenBadgesModalModal] = useState<boolean>(false);
  const [openInviteModal, setOpenInviteModal] = useState(false);
  const [openAccountDetailstModal, setOpenAccountDetailstModal] =
    useState<boolean>(false);

  const handleAcountModal = useCallback(() => {
    setOpenAccountDetailstModal((prev) => !prev);
  }, []);
  const handleProfileModal = useCallback(() => {
    setOpenProfileDetailsModal((prev) => !prev);
  }, []);
  const handleBadgesModal = useCallback(() => {
    setOpenBadgesModalModal((prev) => !prev);
  }, []);

  const handleResumeUpload = async () => {
    const res = await getUploadedFile(developer._id);
    if (!res) {
      toast.success("No resume available!");
    }
    window.open(res.resumeUrl);
  };

  return (
    <QueryErrorBoundary>
      <Grid
        component="section"
        container
        sx={{ flexGrow: 1, minHeight: "100vh" }}
      >
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
                ? `${process.env.PUBLIC_URL}/assets/images/userProfileBgDark.webp`
                : `${process.env.PUBLIC_URL}/assets/images/userProfileBgLight.webp`
            }
            alt="User profile background"
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "bottom",
              backgroundColor: "#142C58",
              borderRadius: "0%",
            }}
          />
        </Grid>
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
          {user.isUser && (
            <IconButton
              aria-label="edit"
              sx={{ position: "absolute", top: "0", right: "0" }}
              onClick={handleAcountModal}
            >
              <EditIcon />
            </IconButton>
          )}
          {openAccountDetailstModal && (
            <AccountDetailsForm
              open={openAccountDetailstModal}
              handleClose={handleAcountModal}
              handleProfileInfo={handleProfileInfo}
              developer={developer}
            />
          )}
          <div
            style={{
              width: "5.5rem",
              height: "5.5rem",
              borderRadius: "50%",
              display: "inline-block",
              overflow: "hidden",
              position: "relative",
              top: "-2.6rem",
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
                src={
                  developer?.avatar !== ""
                    ? `http://localhost:8080/public/userProfileImages/${developer?.avatar}`
                    : developer?.avatar
                }
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
          <Stack
            spacing={2}
            sx={{
              alignItems: "center",
              mt: "-2rem",
              textAlign: "center",
            }}
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
            <Stack direction="row" spacing={1}>
              <Button
                size={isMediumScreen ? "small" : "medium"}
                variant="contained"
                sx={{ bgcolor: "secondary.main" }}
                onClick={() => {
                  setOpenInviteModal((prev) => !prev);
                }}
              >
                Invite
              </Button>
              <Button
                size={isMediumScreen ? "small" : "medium"}
                variant="outlined"
                color="secondary"
                disabled={!developer?.resume?.fileKey}
                onClick={handleResumeUpload}
              >
                Resume
              </Button>
            </Stack>
          </Stack>
        </Grid>
        {openInviteModal && (
          <InvitationForm
            openInviteModal={openInviteModal}
            handleClose={() => {
              setOpenInviteModal((prev) => !prev);
            }}
          />
        )}
        <Grid
          item
          component="article"
          sx={{
            width: "100%",
            flexGrow: 1,
          }}
        >
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
                {ProfileTabsListData.map((tab, index) => (
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
                ))}
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
                      sx={{
                        width: { sx: "100%", md: "70%" },
                        height: "25rem",
                      }}
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
                    {developer && (
                      <ProfileTab
                        handleBadgesModal={handleBadgesModal}
                        handleProfileModal={handleProfileModal}
                        openBadgesModal={openBadgesModal}
                        openProfileDetailsModal={openProfileDetailsModal}
                        developer={developer || {}}
                      />
                    )}
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
                <QueryErrorBoundary sx={{ border: "1px solid red" }}>
                  {isFetching ? (
                    <Skeleton
                      variant="rectangular"
                      width="100%"
                      height="100%"
                    />
                  ) : (
                    user.isUser && <InboxTab />
                  )}
                </QueryErrorBoundary>
              </TabPanel>
              <TabPanel value="4">
                <QueryErrorBoundary sx={{ border: "1px solid red" }}>
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
                      user.isUser && <ChatTab />
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
