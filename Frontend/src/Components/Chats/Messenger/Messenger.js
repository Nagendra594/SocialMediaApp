import classes from "./Messenger.module.css";
import Messages from "./Messages/Messages";
import { useSelector } from "react-redux";
import { useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";
const initialState = { state: false, message: null };
const Messenger = ({
  isLoading,
  messages,
  setMessages,
  conversationId,
  frndUser,
  messagesError,
}) => {
  const scrollRef = useRef();
  const socket = useRef(io("ws://localhost:8000"));
  const currentUser = useSelector((state) => state.user);
  const [newMessage, setNewMessage] = useState("");
  const [arraivalMessage, setArraivalMessage] = useState(null);
  const [sendError, setSendError] = useState(initialState);
  const sendMessageHandler = async () => {
    if (!currentUser) return;
    setSendError(initialState);
    const body = {
      conversationId,
      senderId: currentUser?._id,
      text: newMessage,
    };
    try {
      const response = await fetch("http://localhost:8080/api/message", {
        method: "POST",
        body: JSON.stringify(body),
        credentials: "include",
        headers: {
          "Content-type": "application/json",
        },
      });
      if (response.status !== 200) {
        return setSendError({ state: true, message: "Server Error" });
      }
      const messageData = await response.json();

      socket.current?.emit("sendMessage", {
        senderId: currentUser?._id,
        receiverId: frndUser?._id,
        text: newMessage,
      });
      setMessages(messageData);
      setNewMessage("");
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    socket.current?.on("getMessage", (data) => {
      setArraivalMessage({
        senderId: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);
  useEffect(() => {
    if (!arraivalMessage || arraivalMessage.senderId !== frndUser?._id) return;
    setMessages(arraivalMessage);
  }, [arraivalMessage]);
  useEffect(() => {
    scrollRef.current?.scrollIntoView();
  }, [messages]);

  return (
    <div className={classes.messengerWrapper}>
      <section className={classes.chatting}>
        {isLoading && <p>Loading...</p>}
        {messagesError.state && (
          <p className="error">{messagesError.message}</p>
        )}
        {!isLoading &&
          messages?.map((m) => {
            return (
              <div ref={scrollRef} key={m._id}>
                <Messages
                  currentProfilePic={currentUser?.profilePicture}
                  frndProfilePic={frndUser?.profilePicture}
                  key={m._id}
                  own={currentUser?._id === m.senderId}
                  text={m.text}
                  createdAt={m.createdAt}
                  frndId={frndUser?._id}
                />
              </div>
            );
          })}
      </section>
      <section className={classes.message}>
        <textarea
          placeholder="write somthing..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        ></textarea>
        <button onClick={sendMessageHandler}>
          {sendError.state ? sendError.message : "Send"}
        </button>
      </section>
    </div>
  );
};
export default Messenger;
