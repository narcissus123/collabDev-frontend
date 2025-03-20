import { Suspense, lazy } from "react";
import { Skeleton } from "@mui/material";

import Home from "../pages/Home/Home";
import Projects from "../pages/Projects/Projects";
import UserProfile from "../pages/UserProfile/UserProfile";
import { Config } from "./Config";

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
// const LazyUserProfile = lazy(() => import("../pages/UserProfile/UserProfile"));
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

export const commonRoutes = [
  {
    path: Config.Routes.homePage,
    element: <Home />,
  },
  {
    path: Config.Routes.projectsPage,
    element: <Projects />,
  },
  {
    path: Config.Routes.projectDetailsPage,
    element: (
      <Suspense fallback={<Skeleton variant="rectangular" height={400} />}>
        <LazyProjectsDetails />
      </Suspense>
    ),
  },
  {
    path: Config.Routes.aboutPage,
    element: (
      <Suspense fallback={<Skeleton variant="rectangular" height={400} />}>
        <LazyAbout />
      </Suspense>
    ),
  },
  {
    path: Config.Routes.userProfilePage,
    element: <UserProfile />,
    children: {
      path: Config.Routes.chatPage,
      element: (
        <Suspense fallback={<Skeleton variant="rectangular" height={400} />}>
          <LazyChatRoom socket={null} />
        </Suspense>
      ),
    },
  },
  {
    path: Config.Routes.pageNotFound,
    element: (
      <Suspense fallback={<Skeleton variant="rectangular" height={400} />}>
        <LazyNotFound />
      </Suspense>
    ),
  },
];

export const publicRoutes = [
  ...commonRoutes,
  {
    path: Config.Routes.registerationPage,
    element: (
      <Suspense fallback={<Skeleton variant="rectangular" height={400} />}>
        <LazyRegisteration />
      </Suspense>
    ),
  },
];

export const protectedRoutes = [
  ...commonRoutes,
  {
    path: Config.Routes.logOutPage,
    element: (
      <Suspense fallback={<Skeleton variant="rectangular" height={400} />}>
        <LazyLogOut />
      </Suspense>
    ),
  },
];

export const privateRoutes: Routes[] = [
  ...commonRoutes,
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
];
