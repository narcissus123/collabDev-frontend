import { useEffect } from "react";
import { SocketProvider } from "../context/SocketContext/SocketContext";
import UnAuth from "./UnAuth/UnAuth";

import "./App.scss";

const App: React.FC = () => {
  useEffect(() => {
    window.process = {
      ...window.process,
    };
  }, []);

  return (
    <>
      <SocketProvider>
        <UnAuth />
      </SocketProvider>
    </>
  );
};

export default App;
