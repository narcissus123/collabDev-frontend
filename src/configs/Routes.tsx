import { lazy } from "react";

import { Config } from "./Config";

const LazyHome = lazy(() => import("../pages/Home/Home"));
const LazyProjects = lazy(() => import("../pages/Projects/Projects"));
const LazyChatRoom = lazy(
  () => import("../components/UserProfileContainer/ChatTab/ChatRoom/ChatRoom")
);
const LazyProjectsDetails = lazy(
  () => import("../pages/ProjectsDetails/ProjectsDetails")
);
const LazyAbout = lazy(() => import("../pages/About/About"));
const LazyLogOut = lazy(() => import("../pages/LogOut/LogOut"));
const LazyCallback = lazy(() => import("../pages/Callback/Callback"));
const LazyRegisteration = lazy(
  () => import("../pages/Registeration/Registeration")
);
const LazyUserProfile = lazy(() => import("../pages/UserProfile/UserProfile"));
const LazyAdminDashboard = lazy(
  () => import("../pages/AdminDashboard/AdminDashboard")
);
const LazyNotFound = lazy(() => import("../pages/NotFound/NotFound"));

interface Routes {
  path: string;
  element: React.ReactNode;
  children?: {
    path: string;
    element: React.ReactNode;
  };
}

export const publicRoutes: Routes[] = [
  {
    path: Config.Routes.homePage,
    element: <LazyHome />,
  },
  {
    path: Config.Routes.projectsPage,
    element: <LazyProjects />,
  },
  {
    path: Config.Routes.projectDetailsPage,
    element: <LazyProjectsDetails />,
  },
  {
    path: Config.Routes.aboutPage,
    element: <LazyAbout />,
  },
  {
    path: Config.Routes.registerationPage,
    element: <LazyRegisteration />,
  },
  {
    path: Config.Routes.logOutPage,
    element: <LazyLogOut />,
  },
  {
    path: Config.Routes.userProfilePage,
    element: <LazyUserProfile />,
    children: {
      path: Config.Routes.chatPage,
      element: <LazyChatRoom socket={null} />,
    },
  },
  {
    path: Config.Routes.pageNotFound,
    element: <LazyNotFound />,
  },
];

export const privateRoutes: Routes[] = [
  {
    path: Config.Routes.adminDashboardPage,
    element: <LazyAdminDashboard />,
  },
  {
    path: Config.Routes.logOutPage,
    element: <LazyLogOut />,
  },
  {
    path: Config.Routes.CallbackPage,
    element: <LazyCallback />,
  },
  {
    path: Config.Routes.pageNotFound,
    element: <LazyNotFound />,
  },
];
