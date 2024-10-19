import SideBar from "../Components/SideBar/SideBar";
import Feed from "../Components/Feed/Feed";
import classes from "./ProfilePage.module.css";
import { Suspense, useEffect, useState } from "react";
import {
  defer,
  Await,
  useLoaderData,
  Link,
  useNavigate,
} from "react-router-dom";
import { Add, Remove, Chat, Pending } from "@mui/icons-material";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { searchFrndActions } from "../Store/UserStore/searchFrnds";
import { userActions } from "../Store/UserStore/User";
const ProfilePage = () => {
  const { userFriends, user } = useLoaderData();
  const [isLoading, setIsLoading] = useState(false);
  const [follow, setFollow] = useState(false);
  const [following, setFollowing] = useState(false);
  const [pending, setPending] = useState(false);
  const navigate = useNavigate();
  const userData = useSelector((state) => state.user);
  const params = useParams();
  const dispatch = useDispatch();

  const followClickHandler = () => {
    const fetchUpdatedUser = async () => {
      await fetch(
        `http://localhost:8080/api/auth/${params.id}/${
          follow ? "unfollow" : "follow"
        }`,
        {
          method: "PUT",
          credentials: "include",
        }
      );
      const response = await fetch(
        "http://localhost:8080/api/auth/getUser/main",
        {
          credentials: "include",
        }
      );
      if (response.status !== 200) return;
      const updatedUser = await response.json();
      dispatch(userActions.setUser(updatedUser));
      if (!follow) setPending(true);
      if (follow) setFollow(false);
    };
    fetchUpdatedUser();
  };
  useEffect(() => {
    dispatch(searchFrndActions.reset());
  }, [params.id, dispatch]);

  useEffect(() => {
    if (userData?._id === params.id) return;
    if (!userData) {
      return setIsLoading(true);
    }
    setIsLoading(false);
    const followings = userData?.followings;
    const followers = userData?.followers;
    let isFoundFollower = false;
    for (let i = 0; i < followers.length; i++) {
      if (followers[i]?.id === params.id) {
        setFollowing(followers[i]?.status === "success");
        isFoundFollower = true;
        break;
      }
    }
    if (!isFoundFollower) {
      setFollowing(false);
    }
    let isFoundFollowing = false;
    for (let i = 0; i < followings.length; i++) {
      if (followings[i]?.id === params.id) {
        setPending(followings[i]?.status === "pending");
        setFollow(followings[i]?.status === "success");
        isFoundFollowing = true;
        break;
      }
    }
    if (!isFoundFollowing) setFollow(false);
  }, [params.id, userData]);
  const messageHandler = async () => {
    const response = await fetch(
      `http://localhost:8080/api/conversation/${params.id}`,
      {
        method: "POST",
        credentials: "include",
      }
    );
    if (response.status !== 200) return;
    const conversation = await response.json();
    let fetchUserId;
    if (conversation.senderId === userData._id) {
      fetchUserId = conversation.receiverId;
    }
    if (conversation.receiverId === userData._id) {
      fetchUserId = conversation.senderId;
    }
    navigate(`/chats/${conversation._id}/${fetchUserId}`);
  };
  return (
    <div className={classes.main_content}>
      <SideBar />
      <div className={classes.RightBar}>
        <div>
          <div className={classes.Pics}>
            <Suspense fallback={<p>Loading.....</p>}>
              <Await resolve={user}>
                {(userData) => {
                  return (
                    <>
                      <img
                        className={classes.coverPic}
                        src={`https://chitchatt.s3.ap-south-1.amazonaws.com/${
                          userData?.coverPicture || "NoCover.jpg"
                        }`}
                        alt="coverPic"
                      />
                      <img
                        className={classes.profilePic}
                        src={`https://chitchatt.s3.ap-south-1.amazonaws.com/${
                          userData?.profilePicture || "uploads/no_avatar.jpg"
                        }`}
                        alt="profilePic"
                      />
                    </>
                  );
                }}
              </Await>
            </Suspense>
          </div>
          <div className={classes.about}>
            <Suspense fallback={<p>Loading...</p>}>
              <Await resolve={user}>
                {(userData) => {
                  return (
                    <>
                      <h4>{userData?.userName}</h4>
                      <span>Hello my Friends</span>
                    </>
                  );
                }}
              </Await>
            </Suspense>
          </div>
        </div>
        <div className={classes.bottom}>
          <Feed page={"profile"} />
          <div className={classes.bottom__right}>
            {!isLoading && localStorage.getItem("userId") !== params.id && (
              <button
                className={classes.followBtn}
                onClick={followClickHandler}
                disabled={pending}
              >
                {follow
                  ? "UnFollow"
                  : pending
                  ? "Pending"
                  : following
                  ? "FollowBack"
                  : "Follow"}
                {follow ? <Remove /> : pending ? <Pending /> : <Add />}
              </button>
            )}
            {!isLoading && localStorage.getItem("userId") !== params.id && (
              <button className={classes.followBtn} onClick={messageHandler}>
                <span>Message</span>
                <Chat />
              </button>
            )}
            {isLoading && <p>Loading...</p>}
            <section className={classes.bottom__userInfo}>
              <h4>User Information</h4>
              <Suspense fallback={<p>Loading.....</p>}>
                <Await resolve={user}>
                  {(userData) => {
                    return (
                      <>
                        <div>
                          <span className={classes.bottom__key}>City:</span>
                          <span className={classes.bottom__value}>
                            {userData?.city || "New York"}
                          </span>
                        </div>
                        <div>
                          <span className={classes.bottom__key}>From:</span>
                          <span className={classes.bottom__value}>
                            {userData?.from || "Kakinada"}
                          </span>
                        </div>
                        <div>
                          <span className={classes.bottom__key}>
                            Relation Ship:
                          </span>
                          <span className={classes.bottom__value}>
                            {userData?.relationShip || "Single"}
                          </span>
                        </div>
                      </>
                    );
                  }}
                </Await>
              </Suspense>
            </section>
            <section className={classes.bottom__friends}>
              <h4>User Friends</h4>
              <div className={classes.bottom__allUsers}>
                <Suspense fallback={<p>Loading...</p>}>
                  <Await resolve={userFriends}>
                    {(friends) => {
                      return friends.map((friend) => {
                        return (
                          <Link
                            to={`http://localhost:3000/profile/${friend?._id}`}
                            className={classes.bottom__userDetails}
                            key={friend?._id}
                          >
                            <img
                              src={`https://chitchatt.s3.ap-south-1.amazonaws.com/${
                                friend?.profilePicture ||
                                "uploads/no_avatar.jpg"
                              }`}
                              alt="profilePic"
                            />

                            <span>{friend?.userName}</span>
                          </Link>
                        );
                      });
                    }}
                  </Await>
                </Suspense>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
const fetchUserFriends = async (id) => {
  const fetchedFriendsList = await fetch(
    `http://localhost:8080/api/auth/user/friends/${id}`,
    {
      credentials: "include",
    }
  );
  const friendsList = await fetchedFriendsList.json();
  return friendsList;
};
const fetchUser = async (id) => {
  const fetchedUser = await fetch(`http://localhost:8080/api/auth/${id}`, {
    credentials: "include",
  });
  const userData = await fetchedUser.json();
  return userData;
};
export const userFriendsLoader = ({ request, params }) => {
  const id = params.id;

  return defer({
    userFriends: fetchUserFriends(id),
    user: fetchUser(id),
  });
};
