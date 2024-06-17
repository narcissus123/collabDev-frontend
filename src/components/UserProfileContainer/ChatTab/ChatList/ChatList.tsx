import {
  Avatar,
  Box,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Socket } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";

import { getAllUserChatMessages } from "../../../../core/services/api/manage-chatMessages.api";
import { getItem } from "../../../../core/services/storage/Storage";

interface User {
  _id: string;
  name: string;
  avatar: string;
}

interface Message {
  _id: string;
  sender: User;
  receiver: User;
  message: string;
  createdAt: string;
  updatedAt: string;
  seen: boolean;
}

interface Conversation {
  participant: User;
  latestMessage: Message;
}

interface ChatListProps {
  socket: Socket | null;
}

interface Participant {
  _id: string;
  avatar: string;
  name: string;
}

function formatChatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const oneDay = 24 * 60 * 60 * 1000;
  const oneWeek = 7 * oneDay;

  // If the date is today
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  // If the date is yesterday
  const yesterday = new Date(now.getTime() - oneDay);
  if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  }

  // If the date is within the last week
  if (diff < oneWeek) {
    return date.toLocaleDateString("en-US", { weekday: "long" });
  }

  // If the date is older
  return date.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "2-digit",
  });
}

const getRoom = (senderId: string, receiverId: string) => {
  return [JSON.stringify(senderId), JSON.stringify(receiverId)]
    .sort()
    .join("-");
};

const ChatList = ({ socket }: ChatListProps) => {
  const { userId, participantId: prevParticipantId } = useParams();
  const navigate = useNavigate();
  const [roomsWithNewMessages, setRoomsWithNewMessages] = useState<string[]>(
    []
  );

  const handleTabClick = (
    event: React.MouseEvent<HTMLDivElement>,
    participant: Participant
  ) => {
    event.preventDefault();
    let prevRoom = undefined;
    if (prevParticipantId) {
      prevRoom = getRoom(prevParticipantId, userId as string);
    }
    navigate(`/profile/${userId}/${participant._id}`, { state: participant });
    if (socket) {
      const participantId = participant._id;
      const currentRoom = getRoom(participantId, userId as string);

      const newRoomList = roomsWithNewMessages.filter(
        (room) => room === currentRoom
      );
      setRoomsWithNewMessages(newRoomList);
      socket.emit("messageSeen", {
        receiverId: userId,
        senderId: participantId,
      });
      socket.emit("joinRoom", { userId, participantId, prevRoom });
    }
  };

  const user = JSON.parse(getItem("user"));
  const [conversationsList, setConversationsList] = useState<Conversation[]>(
    []
  );

  const fetchConversationsList = useCallback(async () => {
    try {
      // Fetch chat history
      const response = await getAllUserChatMessages(user._id);

      setConversationsList(response);
    } catch (error) {
      console.error(error);
    }
  }, [user._id]);

  useEffect(() => {
    fetchConversationsList();
  }, [fetchConversationsList, roomsWithNewMessages]);

  useEffect(() => {
    if (socket) {
      // Register user with the backend
      socket.emit("registerUser", userId);
    }
  }, [userId, socket]);

  useEffect(() => {
    if (socket) {
      socket.on("directMessage", (roomId) => {
        setRoomsWithNewMessages((prev) => [...new Set([...prev, roomId])]);
      });

      return () => {
        socket.off("directMessage");
      };
    }
  }, [userId, socket]);

  return (
    <Grid
      item
      xs={4}
      sx={{
        borderRight: "1px solid #e0e0e0",
      }}
    >
      <Grid item xs={12} style={{ padding: "10px" }}>
        <TextField
          id="outlined-basic-email"
          label="Search"
          variant="outlined"
          fullWidth
        />
      </Grid>
      <Divider key={uuidv4()} />
      <List>
        {conversationsList.map((conversation) => {
          const currentRoom = getRoom(
            conversation.participant._id,
            userId as string
          );
          const hasNewMessage = roomsWithNewMessages.includes(currentRoom);

          return (
            <Box key={uuidv4()}>
              <ListItem
                button
                alignItems="flex-start"
                onClick={(event) =>
                  handleTabClick(event, conversation.participant)
                }
              >
                <ListItemIcon>
                  <Avatar
                    alt="Remy Sharp"
                    src={`http://localhost:8080/public/userProfileImages/${conversation.participant.avatar}`}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography
                      sx={{ color: "primary.main", fontSize: "0.9rem" }}
                    >
                      {conversation.participant.name}
                    </Typography>
                  }
                  secondary={
                    <Box component="span">
                      <Typography
                        variant="h6"
                        component="span"
                        sx={{ fontSize: "0.8rem", color: "primary.main" }}
                      >
                        {formatChatDate(conversation.latestMessage.updatedAt)}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                        component="span"
                      >
                        <Typography
                          sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            width: "80%",
                            WebkitBoxOrient: "vertical",
                            color: "text.secondary",
                            fontSize: "0.8rem",
                            mt: 1,
                          }}
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          {conversation.latestMessage.message}
                        </Typography>
                        {hasNewMessage && (
                          <Box
                            component="span"
                            sx={{
                              width: "0.5rem",
                              height: "0.5rem",
                              borderRadius: "50%",
                              backgroundColor: "green",
                            }}
                          ></Box>
                        )}
                      </Box>
                    </Box>
                  }
                >
                  {conversation.participant.name}
                </ListItemText>
              </ListItem>
              <Divider sx={{ mx: 2 }} />
            </Box>
          );
        })}
      </List>
    </Grid>
  );
};

export default ChatList;
