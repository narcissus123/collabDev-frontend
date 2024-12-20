import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { SocketProvider } from "../context/SocketContext/SocketContext";
import { useAuth } from "../context/AuthContext/AuthContext";
import UnAuth from "./UnAuth/UnAuth";

import "./App.scss";
import Auth from "./Auth/Auth";

const App: React.FC = () => {
  const { isAuthenticated } = useAuth();
  useEffect(() => {
    window.process = {
      ...window.process,
    };
  }, []);

  return (
    <>
      <ToastContainer />
      <SocketProvider>{isAuthenticated ? <Auth /> : <UnAuth />}</SocketProvider>
    </>
  );
};

export default App;
