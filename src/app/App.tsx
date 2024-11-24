import { useEffect } from "react";

import { useAuth } from "../context/AuthContext/AuthContext";
import { SocketProvider } from "../context/SocketContext/SocketContext";
import scrollToTopUtility from "../core/utils/ScrollToTop/scrollToTopUtility";

import Auth from "./Auth/Auth";
import UnAuth from "./UnAuth/UnAuth";

import "./App.scss";

const App: React.FC = () => {
  const user = useAuth();
  scrollToTopUtility();
  useEffect(() => {
    window.process = {
      ...window.process,
    };
  }, []);

  return (
    <>
      {/* <ScrollToTop /> */}
      <SocketProvider>{user.isAdmin ? <Auth /> : <UnAuth />}</SocketProvider>
    </>
  );
};

export default App;
