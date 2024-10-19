import classes from "./ChatPage.module.css";
import FrndsChat from "../Components/Chats/FrndsChat/FrndsChats";
import Messenger from "../Components/Chats/Messenger/Messenger";
import OnlineFrnds from "../Components/Chats/OnlineFrnds/OnlineFrnds";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { searchFrndActions } from "../Store/UserStore/searchFrnds";
import { useParams } from "react-router-dom";
const initialState = { state: false, message: null };
const ChatPage = () => {
  const params = useParams();
  const frndUserId = params.frndUserId;
  const convId = params.id;
  const [conversations, setConversations] = useState([]);
  const [conversationError, setConversationError] = useState(initialState);
  const [openMessages, setOpenMessages] = useState(false);
  const [messages, setMessages] = useState([]);
  const [messagesError, setMessagesError] = useState(initialState);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isLoadingConversations, setIsLoadingConversations] = useState(false);
  const [conversationId, setConversationId] = useState(convId || null);
  const [frndUser, setFrndUser] = useState(null);
  const [frndUserError, setFrndUserError] = useState(initialState);
  const setMessagesHandler = (message) => {
    setMessages([...messages, message]);
  };
  const setMessageHandle = async (id, userId) => {
    setIsLoadingMessages(true);
    setMessagesError(initialState);
    setFrndUserError(initialState);
    const response = await fetch(`http://localhost:8080/api/message/${id}`);
    if (response.status !== 200) {
      setIsLoadingMessages(false);
      return setMessagesError({ state: true, message: "Server Error" });
    }
    const messages = await response.json();
    setMessages(messages);
    const frndResponse = await fetch(
      `http://localhost:8080/api/auth/${userId}`
    );
    if (frndResponse.status !== 200) {
      setOpenMessages(true);
      return setFrndUserError({ state: true, message: "Server Error" });
    }
    const userData = await frndResponse.json();
    setFrndUser(userData);
    setIsLoadingMessages(false);
    setOpenMessages(true);
  };
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(searchFrndActions.reset());
  }, []);
  useEffect(() => {
    setIsLoadingConversations(true);
    setConversationError(initialState);
    const fetchConversations = async () => {
      const response = await fetch("http://localhost:8080/api/conversation", {
        credentials: "include",
      });
      if (response.status !== 200) {
        setIsLoadingConversations(false);
        return setConversationError({ state: true, message: "Server Error" });
      }
      const fetchedData = await response.json();
      setConversations(fetchedData);
      setIsLoadingConversations(false);
    };

    fetchConversations();
    if (convId !== "home") {
      setMessageHandle(convId, frndUserId);
    }
  }, [convId, frndUserId]);

  return (
    <div className={classes.chat}>
      <div className={classes.chat__frnds}>
        <FrndsChat
          isLoading={isLoadingConversations}
          conversations={conversations}
          conversationError={conversationError}
          setMessages={setMessages}
          setIsLoadingMessages={setIsLoadingMessages}
          setConversationId={setConversationId}
          setFrndUser={setFrndUser}
          setOpenMessages={setOpenMessages}
        />
      </div>
      {openMessages ? (
        <div className={classes.chat__messages}>
          <Messenger
            messagesError={messagesError}
            isLoading={isLoadingMessages}
            messages={messages}
            setMessages={setMessagesHandler}
            conversationId={conversationId}
            frndUser={frndUser}
          />
        </div>
      ) : (
        <p className={classes.chat__noMessages}>
          Open a Conversation to see the Messages
        </p>
      )}
      <div className={classes.chat__onlineFrnds}>
        <OnlineFrnds />
      </div>
    </div>
  );
};
export default ChatPage;
