import { Suspense, useEffect } from "react";

import { Loading } from "../components/common/Loading/Loading";
import { useAuth } from "../context/AuthContext/AuthContext";
import { SocketProvider } from "../context/SocketContext/SocketContext";
import scrollToTopUtility from "../core/utils/ScrollToTop/scrollToTopUtility";

import Auth from "./Auth/Auth";
import UnAuth from "./UnAuth/UnAuth";

import "./App.scss";

export default function App() {
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
      <SocketProvider>
        <Suspense fallback={<Loading />}>
          {user.isAdmin ? <Auth /> : <UnAuth />}
        </Suspense>
      </SocketProvider>
    </>
  );
}
