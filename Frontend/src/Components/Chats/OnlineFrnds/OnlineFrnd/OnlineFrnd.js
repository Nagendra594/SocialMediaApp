import classes from "./OnlineFrnd.module.css";
import { useEffect, useState } from "react";
const initialState = { state: false, message: null };
const OnlineFrnd = ({ userId }) => {
  const [onlineUser, setOnlineUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(initialState);
  useEffect(() => {
    setIsLoading(true);
    setError(initialState);
    const fetchUser = async () => {
      const response = await fetch(`http://localhost:8080/api/auth/${userId}`);
      if (response.status !== 200) {
        setError({ state: true, message: "Server Error" });
        return setIsLoading(false);
      }
      const userData = await response.json();

      setOnlineUser(userData);
      setIsLoading(false);
    };
    fetchUser();
  }, []);
  return (
    <li className={classes.frndList} key={userId}>
      <div className={classes.frnd}>
        {isLoading && <p>Loading...</p>}
        {error.state && <p className="error">{error.message}</p>}
        {!isLoading && (
          <>
            <div className={classes.frndImg}>
              <img
                src={`https://chitchatt.s3.ap-south-1.amazonaws.com/${
                  onlineUser?.profilePicture || "uploads/no_avatar.jpg"
                }`}
                alt="profilePic"
              />
              <div className={classes.online}></div>
            </div>
            <span>{onlineUser?.userName}</span>
          </>
        )}
      </div>
    </li>
  );
};
export default OnlineFrnd;
