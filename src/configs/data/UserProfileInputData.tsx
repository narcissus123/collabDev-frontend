import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import { ReactNode } from "react";
import { SxProps, Theme } from "@mui/system";
import { User } from "../types/userTypes";

const ProfileDetailsInputData: any[] = [
  {
    sx: {},
    margin: "dense",
    labelText: "About",
    id: "about",
    name: "about",
    autoComplete: "about",
    placeholder:
      "Share a brief description about yourself, your interests, and what you do.",
    type: "text",
    required: false,
    fullWidth: true,
    formLabel: true,
    multiline: true,
    variant: "standard",
    register: {
      name: "about",
      schema: {
        required: false,
      },
    },
  },
];

interface ProfileDetail {
  variant?: "h4" | "body1";
  sx?: SxProps<Theme>;
  child?: ReactNode;
  onClick?: () => void;
}

type ProfileAccountDetailsDataType = (
  developer: User,
  theme: any
) => ProfileDetail[];

const AccountDetailsData: ProfileAccountDetailsDataType = (
  developer,
  theme
) => [
  {
    variant: "h4",
    sx: {
      fontWeight: "600",
      color: theme.palette.mode === "dark" ? "text.secondary" : "text.primary",
    },
    child: developer?.name,
  },
  {
    variant: "body1",
    sx: {
      fontSize: { md: "0.89rem" },
      px: { xs: "1rem", md: "6rem" },
      color: theme.palette.mode === "dark" ? "text.secondary" : "text.primary",
    },
    child: developer?.bio,
  },
  {
    variant: "body1",
    sx: {
      cursor: "pointer",
      textDecoration: "underline",
      color: "#bdbdbd",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "0.3rem",
    },
    child: (
      <>
        <AlternateEmailIcon />
        {developer?.email}
      </>
    ),
    onClick: () => {
      window.location.href = `mailto:${developer?.email}`;
    },
  },
];

const ProfileTabsListData = (isProfileOwner: boolean) => {
  return [
    {
      label: "Profile",
      value: "1",
    },
    {
      label: "Projects",
      value: "2",
    },
    ...(isProfileOwner
      ? [
          {
            label: "Inbox",
            value: "3",
          },
          {
            label: "Chat",
            value: "4",
          },
        ]
      : []),
  ];
};

export const socialMediaPlatforms = [
  "Facebook",
  "Twitter",
  "LinkedIn",
  "Instagram",
  "GitHub",
  "GitLab",
  "Slack",
  "Leetcode",
  "Codepen",
  "Stackoverflow",
  "YouTube",
];

export { ProfileDetailsInputData, AccountDetailsData, ProfileTabsListData };
