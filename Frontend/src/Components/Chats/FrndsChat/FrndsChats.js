import classes from "./FrndsChats.module.css";
import Conversation from "./Conversations/Conversations";
import { useState } from "react";
const initialState = { state: false, message: null };

const FrndsChats = ({
  isLoading,
  conversations,
  setMessages,
  setIsLoadingMessages,
  setConversationId,
  setFrndUser,
  setOpenMessages,
  conversationError,
}) => {
  const [error, setError] = useState(initialState);

  const setMessagesHandler = async (id, user) => {
    setIsLoadingMessages(true);
    setError(initialState);
    const response = await fetch(`http://localhost:8080/api/message/${id}`);
    if (response.status !== 200) {
      return setError({ state: true, message: "Server Error" });
    }
    const messages = await response.json();
    setMessages(messages);
    setConversationId(id);
    setFrndUser(user);
    setIsLoadingMessages(false);
    setOpenMessages(true);
  };
  return (
    <div className={classes.frndsChatsWrapper}>
      <section>
        <input
          type="search"
          placeholder="search for a friend..."
          className={classes.frndSearchInput}
        />
      </section>
      {isLoading && <p>Loading...</p>}
      {conversationError.state && (
        <p className="error">{conversationError.message}</p>
      )}
      <section>
        {conversations?.map((c) => {
          return (
            <Conversation
              key={c._id}
              conversation={c}
              setMessagesHandler={setMessagesHandler}
            />
          );
        })}
      </section>
    </div>
  );
};
export default FrndsChats;
