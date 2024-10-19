import classes from "./FrndRequests.module.css";
import { useEffect, useState } from "react";
const FrndRequest = ({ req }) => {
  const [user, setUser] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [decline, setDecline] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const fetchUser = async () => {
      const response = await fetch(`http://localhost:8080/api/auth/${req.id}`);
      if (response.status !== 200) {
        return setIsLoading(false);
      }
      const fetchedUser = await response.json();
      setUser(fetchedUser);
      setIsLoading(false);
    };
    fetchUser();
  }, [req.id]);
  const acceptHandler = async () => {
    setAccepted(true);
    await fetch(`http://localhost:8080/api/auth/${req.id}/followAccept`, {
      method: "PUT",
      credentials: "include",
    });
  };
  const declineHandler = async () => {
    setDecline(true);
    await fetch(`http://localhost:8080/api/auth/${req.id}/followDecline`, {
      method: "PUT",
      credentials: "include",
    });
  };
  return (
    <li className={classes.frndRequests__list__frnd}>
      {isLoading && <p>Loading...</p>}
      {!isLoading && (
        <>
          <img
            src={`https://chitchatt.s3.ap-south-1.amazonaws.com/${
              user?.profilePicture || "uploads/no_avatar.jpg"
            }`}
            alt="profilePic"
            className={classes.frndRequests__list__frnd__img}
          />
          <span className={classes.frndRequests__list__frnd__userName}>
            {user?.userName}
          </span>
          {!accepted && !decline && (
            <>
              <button
                className={classes.frndRequests__list__frnd__responseBtn}
                onClick={acceptHandler}
              >
                Accept
              </button>
              <button
                className={classes.frndRequests__list__frnd__responseBtnDecline}
                onClick={declineHandler}
              >
                Decline
              </button>
            </>
          )}
          {accepted && (
            <button
              className={classes.frndRequests__list__frnd__responseBtn}
              disabled
            >
              Accepted
            </button>
          )}
          {decline && (
            <button
              className={classes.frndRequests__list__frnd__responseBtnDecline}
              disabled
            >
              Declined
            </button>
          )}
        </>
      )}
    </li>
  );
};
export default FrndRequest;
