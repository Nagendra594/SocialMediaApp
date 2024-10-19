import { MoreVert } from "@mui/icons-material";
import classes from "./PostTop.module.css";
import { useEffect, useState } from "react";
import { format } from "timeago.js";
const PostTop = ({ date, userId }) => {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const fetchedUser = await fetch(
        `http://localhost:8080/api/auth/${userId}`
      );
      if (fetchedUser.status !== 200) {
        return setLoading(false);
      }
      const userData = await fetchedUser.json();
      setUser(userData);
      setLoading(false);
    };
    fetchUser();
  }, [userId]);
  return (
    <div className={classes.bottomSection__top}>
      <div className={classes.bottomSection__top__details}>
        {loading && <p>Loading...</p>}
        {!loading && (
          <img
            src={`https://chitchatt.s3.ap-south-1.amazonaws.com/${
              user?.profilePicture || "uploads/no_avatar.jpg"
            }`}
            alt="profilePic"
          />
        )}
        <span className={classes.bottomSection__top__name}>
          {user?.userName}
        </span>
        <span className={classes.bottomSection__top__timeline}>
          {format(date)}
        </span>
      </div>
      <div>
        <MoreVert />
      </div>
    </div>
  );
};

export default PostTop;
