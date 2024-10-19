import classes from "./SideBar.module.css";
import {
  RssFeed,
  Chat,
  PlayCircle,
  Diversity3,
  Bookmarks,
  HelpOutline,
  WorkOutline,
  Event,
  School,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
const SideBar = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [frndsList, setFrndsList] = useState([]);
  const currentUser = useSelector((state) => state.user?._id);
  useEffect(() => {
    if (!currentUser) return;
    setIsLoading(true);
    const fetchUserFriends = async () => {
      const fetchedFriendsList = await fetch(
        `http://localhost:8080/api/auth/user/friends/${currentUser}`,
        {
          credentials: "include",
        }
      );
      const friendsList = await fetchedFriendsList.json();
      setFrndsList(friendsList);
      setIsLoading(false);
    };
    fetchUserFriends();
  }, [currentUser]);
  return (
    <aside className={classes.sideBar}>
      <div className={classes.sideBar__main}>
        <section>
          <ul className={classes.sideBar__ul}>
            <li>
              <RssFeed />
              <span>Feed</span>
            </li>
            <li>
              <Chat />
              <span>Chats</span>
            </li>
            <li>
              <PlayCircle />
              <span>Videos</span>
            </li>
            <li>
              <Diversity3 />
              <span>Groups</span>
            </li>
            <li>
              <Bookmarks />
              <span>Bookmarks</span>
            </li>
            <li>
              <HelpOutline />
              <span>Questions</span>
            </li>
            <li>
              <WorkOutline />
              <span>Jobs</span>
            </li>
            <li>
              <Event />
              <span>Events</span>
            </li>
            <li>
              <School />
              <span>Courses </span>
            </li>
          </ul>
          <button className={classes.sideBar__button}>Show more</button>
        </section>
        <hr className={classes.sideBar__hr} />
        <section>
          <ul className={classes.sideBar__friendsList}>
            {frndsList.map((frnd) => {
              return (
                <li key={frnd?._id}>
                  <Link
                    to={`http://localhost:3000/profile/${frnd?._id}`}
                    className={classes.userFrnd}
                  >
                    <img
                      src={`https://chitchatt.s3.ap-south-1.amazonaws.com/${
                        frnd?.profilePicture || "uploads/no_avatar.jpg"
                      }`}
                      alt="profilePic"
                    />

                    <span>{frnd?.userName}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </aside>
  );
};
export default SideBar;
