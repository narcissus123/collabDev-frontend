import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import SendIcon from "@mui/icons-material/Send";
import {
  Avatar,
  Box,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import InfiniteScroll from "react-infinite-scroll-component";
import { useParams } from "react-router";
import { useLocation } from "react-router-dom";
import { Socket } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";

import {
  ChatMessage,
  ChatMessageFormType,
} from "../../../../configs/types/chatMessageTypes";
import { getUserChatMessageById } from "../../../../core/services/api/manage-chatMessages.api";
import { getItem } from "../../../../core/services/storage/Storage";

interface ChatRoomProp {
  socket: Socket | null;
}

const formatDate = (isoString: string) => {
  const date = new Date(isoString);

  // Format time
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;

  // Format day and month
  const formattedDay = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return { formattedTime, formattedDay };
};

function ChatRoom({ socket }: ChatRoomProp) {
  const { userId, participantId } = useParams();
  const location = useLocation();

  const [page, setPage] = useState(2);
  const [hasMore, setHasMore] = useState(true);
  const [hover, setHover] = useState<string>("");

  const handleMouseEnter = (id: string) => setHover(id);
  const handleMouseLeave = (id: string) => setHover(id);

  const sender = JSON.parse(getItem("user"));
  const { handleSubmit, reset, register } = useForm<ChatMessage>({
    defaultValues: {},
  });

  const [messages, setMessages] = useState<any[]>([]);

  const fetchMessages = useCallback(async () => {
    try {
      if (socket && participantId) {
        const response = await getUserChatMessageById(userId, participantId, 1);

        setMessages(response);
      }
    } catch (error) {
      console.error(error);
    }
  }, [userId, participantId, socket]);

  useEffect(() => {
    setHasMore(true);
    setPage(2);
    fetchMessages();
  }, [participantId, userId, socket]);

  const fetchMessagesMore = async () => {
    try {
      setTimeout(async () => {
        if (participantId) {
          const response = await getUserChatMessageById(
            userId,
            participantId,
            page
          );
          if (response.length < 10) {
            setHasMore(false);
          }

          if (response && response.length > 0) {
            setMessages((prevMessages) => [...response, ...prevMessages]);
            setPage((prev) => prev + 1);
          }
        }
      }, 1000);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // Rejoining the user to the room after a page refresh.
    if (socket && participantId) {
      socket.emit("joinRoom", { userId, participantId });
    }
  }, [socket, userId, participantId]);

  useEffect(() => {
    if (socket) {
      socket.on("message", (message: ChatMessage) => {
        if (messages.length > 0) {
          // For less than 10 messages, we do not have pagination.
          if (messages.length >= 10) {
            messages.shift(); // Remove the oldest message to prevent duplicates when fetching more messages.
          }
          setMessages([...messages, message]); // Add the new message to the list.

          socket.emit("messageSeen", {
            receiverId: participantId,
            senderId: userId,
          });
        }
      });

      socket.on("messageSeen", () => {
        setMessages((prevMessages) => {
          return prevMessages.map((msg) => {
            return { ...msg, seen: true };
          });
        });
      });

      socket.on("messageDeleted", (messageId: string) => {
        setMessages((prevMessages) =>
          prevMessages.filter((msg) => msg._id !== messageId)
        );
      });

      socket.on("disconnect", () => {
        console.log("Disconnected from the websocket server");
      });
      return () => {
        socket.off("message");
        socket.off("messageSeen");
        socket.off("messageDeleted");
      };
    }
  }, [socket, userId, messages]);

  const onSubmit = async (data: any) => {
    if (socket) {
      const messageData: ChatMessageFormType = {
        sender: {
          _id: sender?._id,
          name: sender?.name,
          avatar: sender?.avatar,
        },
        receiver: {
          _id: location.state?._id,
          name: location.state?.name,
          avatar: location.state?.avatar,
        },
        message: data.message,
        seen: false,
      };

      socket.emit("message", messageData);
      reset();
    }
  };

  const handleDelete = (messageId: string) => {
    if (socket) {
      socket.emit("deleteMessage", messageId);
    }
  };

  const isFirstMessageOfDay = (currentMessage: any, previousMessage: any) => {
    const currentDate = new Date(currentMessage.createdAt).toLocaleDateString();
    const previousDate = previousMessage
      ? new Date(previousMessage.createdAt).toLocaleDateString()
      : null;
    return currentDate !== previousDate;
  };

  return (
    <Grid item xs={8}>
      {messages?.length === 0 ? (
        <ListItem
          key={uuidv4()}
          sx={{
            display: "flex",
            alignItems: "start",
            justifyContent: "center",
            height: "100%",
            fontSize: "1.5rem",
            pt: 10,
            color: "text.secondary",
          }}
        >
          Start to chat!
        </ListItem>
      ) : (
        <>
          <List
            key={uuidv4()}
            id="scrollableDiv"
            sx={{
              height: "81vh",
              overflowY: "auto",
              display: "flex",
              width: "100%",
              flexDirection: "column-reverse",
            }}
          >
            <InfiniteScroll
              dataLength={messages.length}
              next={fetchMessagesMore}
              inverse={true}
              hasMore={hasMore}
              loader={<h4>Loading...</h4>}
              scrollableTarget="scrollableDiv"
            >
              {messages?.map((msg, index) => {
                const { formattedTime, formattedDay } = formatDate(
                  msg.updatedAt
                );
                return (
                  <Box key={uuidv4()}>
                    {isFirstMessageOfDay(msg, messages[index + 1]) && (
                      <Typography
                        variant="subtitle2"
                        align="center"
                        gutterBottom
                        sx={{ color: "text.secondary" }}
                      >
                        {formattedDay}
                      </Typography>
                    )}

                    <ListItem
                      key={msg._id}
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent:
                          msg?.sender?._id === userId
                            ? "flex-end"
                            : "flex-start",
                        alignItems: "flex-end",
                        gap: 2,
                      }}
                      onMouseEnter={() => handleMouseEnter(msg._id)}
                      onMouseLeave={() => handleMouseLeave(msg._id)}
                    >
                      <ListItemIcon
                        sx={{ order: msg?.sender?._id === userId ? 1 : 0 }}
                      >
                        <Avatar
                          alt={msg?.sender?.name}
                          src={`http://localhost:8080/public/userProfileImages/${msg?.sender?.avatar}`}
                        />
                      </ListItemIcon>
                      <Grid
                        container
                        display="flex"
                        flexDirection="column"
                        alignItems="flex-end"
                        sx={{
                          backgroundColor:
                            msg?.sender?._id === userId ? "#F2F2F2" : "#FAE4CB",

                          py: 0.5,
                          px: 1,
                          borderTopLeftRadius: "0.9rem",
                          borderStartEndRadius: "0.9rem",
                          borderEndEndRadius:
                            msg?.sender?._id === userId ? "0" : "0.9rem",
                          borderEndStartRadius:
                            msg?.sender?._id === userId ? "0.9rem" : "0",
                          position: "relative",
                          width: "50%",
                        }}
                      >
                        <Grid item xs={12} sx={{ width: "100%" }}>
                          <ListItemText
                            sx={{
                              justifyContent:
                                msg?.sender?._id === userId ? "left" : "right",
                              textAlign: "left",
                              width: "100%",
                            }}
                            primary={
                              <Typography
                                sx={{
                                  whiteSpace: "normal",
                                  wordBreak: "break-word",
                                }}
                              >
                                {msg.message}
                              </Typography>
                            }
                          ></ListItemText>
                        </Grid>
                        <Grid item xs={12}>
                          <ListItemText
                            sx={{
                              justifyContent:
                                msg?.sender?._id === userId ? "left" : "right",
                            }}
                            secondary={
                              <Box
                                component="span"
                                sx={{
                                  display: "flex",
                                  direction: "row",
                                  justifyContent: "flex-end",
                                  alignItems: "center",
                                }}
                              >
                                <Typography
                                  component="span"
                                  sx={{ mr: 1, color: "text.secondary" }}
                                >
                                  {formattedTime}
                                </Typography>
                                <DoneAllIcon
                                  color={msg.seen ? "success" : "disabled"}
                                />
                                {hover === msg._id &&
                                  msg?.sender._id === userId && (
                                    <IconButton
                                      sx={{
                                        position: "absolute",
                                        buttom: 0,
                                        left:
                                          msg.sender._id === userId ? "0" : "0",
                                      }}
                                      onClick={() => handleDelete(msg._id)}
                                    >
                                      <DeleteOutlineIcon
                                        sx={{ color: "text.secondary" }}
                                      />
                                    </IconButton>
                                  )}
                              </Box>
                            }
                          ></ListItemText>
                        </Grid>
                      </Grid>
                    </ListItem>
                  </Box>
                );
              })}
            </InfiniteScroll>
          </List>

          <Divider />
          <Grid style={{ padding: "18px" }}>
            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
              <Stack
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  width: "100%",
                }}
              >
                <TextField
                  {...register("message", { required: true })}
                  id="outlined-basic-email"
                  placeholder="Type a message"
                  fullWidth
                  sx={{ flex: 1, color: "text.secondary" }}
                  inputProps={{
                    sx: {
                      "&::placeholder": {
                        color: "text.secondary",
                        opacity: 1,
                      },
                      color: "text.secondary",
                    },
                  }}
                />
                <IconButton type="submit" color="primary">
                  <SendIcon sx={{ fontSize: "2.5rem" }} />
                </IconButton>
              </Stack>
            </Box>
          </Grid>
        </>
      )}
    </Grid>
  );
}

export default ChatRoom;
