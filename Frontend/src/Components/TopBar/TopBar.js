import { Search, Person, Notifications, Chat } from "@mui/icons-material";
import classes from "./TopBar.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userActions } from "../../Store/UserStore/User";
import { io } from "socket.io-client";
import { onlineUserActions } from "../../Store/UserStore/onlineUsers";
import { searchFrndActions } from "../../Store/UserStore/searchFrnds";
const TopBar = () => {
  const socket = useRef(io("ws://localhost:8000"));
  const searchFrnds = useSelector((state) => state.searchFrnds?.frnds);
  const searchValue = useSelector((state) => state.searchFrnds?.searchValue);
  const userData = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    socket.current?.on("getUsers", (onlineUsers) => {
      dispatch(
        onlineUserActions.setOnlineUsers(
          onlineUsers.filter((oU) => {
            const ids = [];
            userData?.followings?.forEach((following) => {
              if (following.status === "success") {
                ids.push(following.id);
              }
            });
            return ids.includes(oU.userId);
          })
        )
      );
    });
  }, [socket, userData, dispatch]);
  useEffect(() => {
    setIsLoading(true);
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setIsLoading(false);
      navigate("/login");
    }
    const fetchUser = async () => {
      const response = await fetch(`http://localhost:8080/api/auth/${userId}`);
      if (response.status !== 200) return setIsLoading(false);
      const userData = await response.json();
      dispatch(userActions.setUser(userData));
      setIsLoading(false);
    };
    fetchUser();
  }, [dispatch, navigate]);

  useEffect(() => {
    if (!userData) return;
    socket.current?.emit("addUser", userData?._id);
  }, [socket, userData]);

  const logOutHandle = async () => {
    socket.current?.emit("logout");
    await fetch("http://localhost:8080/api/auth/logout", {
      credentials: "include",
    });
    localStorage.clear();
    return navigate("/login");
  };

  useEffect(() => {
    const futureDate = new Date(localStorage.getItem("date"));
    const currentDate = Date.now();
    setTimeout(() => {
      logOutHandle();
    }, futureDate - currentDate);
  }, []);

  useEffect(() => {
    if (!searchValue) {
      dispatch(searchFrndActions.reset());
      return;
    }
    const abortController = new AbortController();
    const users = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/auth/users/search/${searchValue}`,
          {
            signal: abortController.signal,
            credentials: "include",
          }
        );
        if (response.status !== 200) {
          return;
        }
        const usersList = await response.json();
        dispatch(searchFrndActions.setSearchFrnds(usersList));
      } catch (err) {
        if (err.name !== "AbortError") console.log(err.message);
      }
    };
    users();
    return () => {
      abortController.abort();
    };
  }, [searchValue, dispatch]);
  return (
    <header className={classes.TopBar}>
      <div className={classes.TopBar__left}>
        <h2 className={classes.TopBar__left__logo}>CHITCHAT</h2>
      </div>
      <div className={classes.TopBar__center}>
        <div className={classes.TopBar__center__search}>
          <Search className={classes.searchIcon} />
          <input
            type="serch"
            placeholder="Search for a friend, post or video"
            onChange={(e) =>
              dispatch(searchFrndActions.setSearchValue(e.target.value))
            }
            value={searchValue}
            className={classes.TopBar__center__searchInput}
          />
          {searchFrnds.length > 0 && (
            <ul className={classes.TopBar__center__searchResults}>
              {searchFrnds.map((frnd) => {
                return (
                  <li key={frnd?._id}>
                    <Link
                      to={`http://localhost:3000/profile/${frnd?._id}`}
                      className={classes.TopBar__center__searchResults__frnd}
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
          )}
        </div>
      </div>
      <div className={classes.TopBar__right}>
        <div className={classes.TopBar__right__links}>
          <Link to="/" className={classes.TopBar__right__link}>
            <span>HomePage</span>
          </Link>
          <Link to="timeline" className={classes.TopBar__right__link}>
            <span>TimeLine</span>
          </Link>
        </div>

        <div className={classes.TopBar__right__Icons}>
          <div>
            <Link
              to="/friendRequests"
              style={{ textDecoration: "none", color: "white" }}
            >
              <Person />
            </Link>
            <span>1</span>
          </div>
          <div>
            <Link
              to="/chats/home/messages"
              style={{ textDecoration: "none", color: "white" }}
            >
              <Chat />
            </Link>
            <span>3</span>
          </div>
          <div>
            <Notifications />
            <span>4</span>
          </div>
        </div>

        <div className={classes.TopBar__right__img}>
          <Link
            to={`profile/${userData?._id}`}
            style={{ textDecoration: "none", color: "white" }}
          >
            {!isLoading && (
              <img
                src={`https://chitchatt.s3.ap-south-1.amazonaws.com/${
                  userData?.profilePicture || "uploads/no_avatar.jpg"
                }`}
                alt="profilePic"
              />
            )}
            {isLoading && <p>loading...</p>}
          </Link>
        </div>
        <button type="submit" className={classes.logout} onClick={logOutHandle}>
          Log Out
        </button>
      </div>
    </header>
  );
};
export default TopBar;
