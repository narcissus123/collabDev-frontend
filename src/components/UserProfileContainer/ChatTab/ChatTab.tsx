import { Box, Grid, Paper } from "@mui/material";

import { useSocket } from "../../../context/SocketContext/SocketContext";

import ChatList from "./ChatList/ChatList";
import ChatRoom from "./ChatRoom/ChatRoom";

const ChatTab = () => {
  const { socket } = useSocket();

  return (
    <Box>
      <Grid
        container
        component={Paper}
        sx={{
          width: "100%",
          height: "93vh",
        }}
      >
        <ChatList socket={socket} />
        <ChatRoom socket={socket} />
      </Grid>
    </Box>
  );
};

export default ChatTab;
