interface Config {
  Routes: {
    homePage: string;
    projectsPage: string;
    projectDetailsPage: string;
    chatPage: string;
    aboutPage: string;
    registerationPage: string;
    authFailPage: string;
    logOutPage: string;
    userProfilePage: string;
    adminDashboardPage: string;
    pageNotFound: string;
    CallbackPage: string;
  };
}

const Config: Config = {
  Routes: {
    homePage: "/",
    projectsPage: "/projects",
    projectDetailsPage: "/projects/:projectId",
    userProfilePage: "/profile/:userId/",
    chatPage: ":participantId",
    aboutPage: "/about-us",
    registerationPage: "/login",
    authFailPage: "/",
    logOutPage: "/logout",
    adminDashboardPage: "/dashboard",
    pageNotFound: "*",
    CallbackPage: "/callback",
  },
};

export { Config };
