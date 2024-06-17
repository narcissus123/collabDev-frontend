import { Box, IconButton, useMediaQuery, useTheme } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useParams } from "react-router";
import { toast } from "react-toastify";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import { startTransition, useEffect, useState } from "react";
import { User } from "../../configs/types/userTypes";
import { getUserById } from "../../core/services/api/manage-user.api";
import { useAuth } from "../../context/AuthContext/AuthContext";

import userProfileBgDark from "../../assets/images/userProfileBgDark.png";
import UserProfileBgLight from "../../assets/images/userProfileBgLight.png";
import AccountDetailsForm from "./ProfileTab/AccountDetailsForm/AccountDetailsForm";
import ProfileTab from "./ProfileTab/ProfileTab";

import ChatTab from "./ChatTab/ChatTab";
import InboxTab from "./InboxTab/InboxTab";
import InvitationForm from "./InvitationForm/InvitationForm";
import ProjectsTab from "./ProjectsTab/ProjectsTab";

const TabsList = [
  {
    label: "Profile",
    value: "1",
  },
  {
    label: "Projects",
    value: "2",
  },
  {
    label: "Inbox",
    value: "3",
  },
  {
    label: "Chat",
    value: "4",
  },
];

export default function UserProfileContainer() {
  const user = useAuth();
  const theme = useTheme();
  const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [value, setValue] = useState("1");

  const [developer, setDeveloper] = useState<User | undefined>();
  const { userId } = useParams();

  const getDeveloper = async () => {
    try {
      if (userId !== undefined) {
        const response = await getUserById(userId);

        if (response) {
          startTransition(() => {
            setDeveloper(response);
          });
        }
      }
    } catch (error) {
      toast.error("Sorry. Something went wrong.");
      console.error(error);
    }
  };
  useEffect(() => {
    getDeveloper();
  }, []);

  const handleProfileInfo = (updatedInfo: User) => {
    setDeveloper(updatedInfo);
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

  const handleAcountModal = () => {
    setOpenAccountDetailstModal((prev) => !prev);
  };
  const handleProfileModal = () => {
    setOpenProfileDetailsModal((prev) => !prev);
  };
  const handleBadgesModal = () => {
    setOpenBadgesModalModal((prev) => !prev);
  };

  const handleEmailClick = () => {
    window.location.href = `mailto:${developer?.email}`;
  };

  return (
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
        {theme.palette.mode === "dark" ? (
          <img
            src={userProfileBgDark}
            alt="User profile background"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "bottom",
              backgroundColor: "#142C58",
            }}
          />
        ) : (
          <img
            src={UserProfileBgLight}
            alt="User profile background"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "bottom",
              backgroundColor: "#142C58",
            }}
          />
        )}
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
        {developer?.avatar !== "" ? (
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
              backgroundColor: "grey",
            }}
          >
            <img
              src={`http://localhost:8080/public/userProfileImages/${developer?.avatar}`}
              alt="user avatar"
              style={{
                cursor: "pointer",
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
              }}
            />
          </div>
        ) : (
          <Avatar
            alt="User profile image"
            src={developer?.avatar}
            sx={{
              width: 76,
              height: 76,
              position: "absolute",
              top: "-2.6rem",
              left: "50%",
              transform: "translatex(-50%)",
              fontSize: "2rem",
              fontWeight: 600,
            }}
          >
            {developer?.name[0]}
          </Avatar>
        )}
        <Stack
          spacing={2}
          sx={{
            alignItems: "center",
            mt: "-2rem",
            textAlign: "center",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: "600",
              color:
                theme.palette.mode === "dark"
                  ? "text.secondary"
                  : "text.primary",
            }}
          >
            {developer?.name}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: { md: "0.89rem" },
              px: { xs: "1rem", md: "6rem" },
              color:
                theme.palette.mode === "dark"
                  ? "text.secondary"
                  : "text.primary",
            }}
          >
            {developer?.bio}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              cursor: "pointer",
              textDecoration: "underline",
              color: "#bdbdbd",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "0.3rem",
            }}
            onClick={handleEmailClick}
          >
            <AlternateEmailIcon />
            {developer?.email}
          </Typography>
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
                theme.palette.mode === "dark" ? "text.primary" : "text.primary",
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
              {TabsList.map((tab, index) => (
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
          {/* <Box
            sx={{
              bgcolor:
                theme.palette.mode === "dark"
                  ? "background.secondary"
                  : "background.default",
              width: "100%",
              height: "100vh",
            }}
          > */}
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
              {developer && (
                <ProfileTab
                  handleBadgesModal={handleBadgesModal}
                  handleProfileModal={handleProfileModal}
                  openBadgesModal={openBadgesModal}
                  openProfileDetailsModal={openProfileDetailsModal}
                  developer={developer || {}}
                />
              )}
            </TabPanel>
            <TabPanel value="2">
              <ProjectsTab />
            </TabPanel>
            <TabPanel value="3">{user.isUser && <InboxTab />}</TabPanel>
            <TabPanel value="4">{user.isUser && <ChatTab />}</TabPanel>
          </Box>
        </TabContext>
      </Grid>
    </Grid>
  );
}
