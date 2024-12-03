import { useEffect } from "react";
import { useAuth } from "../context/AuthContext/AuthContext";
import { SocketProvider } from "../context/SocketContext/SocketContext";
import UnAuth from "./UnAuth/UnAuth";

import "./App.scss";

const App: React.FC = () => {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    window.process = {
      ...window.process,
    };
  }, []);
  console.log("isAuthenticated", isAuthenticated);
  return (
    <>
      <SocketProvider>
        <UnAuth />
      </SocketProvider>
    </>
  );
};

export default App;
