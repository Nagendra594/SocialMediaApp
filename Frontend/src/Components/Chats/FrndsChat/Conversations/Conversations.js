import { useEffect, useState } from "react";
import classes from "./Conversations.module.css";
import { useSelector } from "react-redux";
const initialState = { state: false, message: null };

const Conversation = ({ conversation, setMessagesHandler }) => {
  const [user, setUser] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const currentUser = useSelector((state) => state.user?._id);
  const [error, setError] = useState(initialState);
  useEffect(() => {
    setIsLoading(true);
    setError(initialState);
    let fetchUserId;
    if (!currentUser) {
      return setIsLoading(false);
    }
    if (conversation?.senderId === currentUser) {
      fetchUserId = conversation?.receiverId;
    }
    if (conversation?.receiverId === currentUser) {
      fetchUserId = conversation?.senderId;
    }
    const fetchUserFromServer = async () => {
      const response = await fetch(
        `http://localhost:8080/api/auth/${fetchUserId}`
      );

      if (response.status !== 200) {
        setIsLoading(false);
        setError({ state: true, message: "Server Error" });
        return;
      }
      const userData = await response.json();
      setUser(userData);
      setIsLoading(false);
    };
    fetchUserId && fetchUserFromServer();
  }, [conversation, currentUser]);
  return (
    <div
      className={classes.frnds}
      onClick={() => {
        setMessagesHandler(conversation._id, user);
      }}
    >
      {error.state && <p className="error">{error.message}</p>}
      {isLoading && <p>Loading...</p>}

      {!isLoading && (
        <>
          <img
            src={`https://chitchatt.s3.ap-south-1.amazonaws.com/${
              user?.profilePicture || "uploads/no_avatar.jpg"
            }`}
            alt="profilePic"
          />
          <span>{user?.userName}</span>
        </>
      )}
    </div>
  );
};
export default Conversation;
