import classes from "./Feed.module.css";
import Post from "./Post";
import Share from "./Share";
import { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { CircularProgress } from "@mui/material";
import { postActions } from "../../Store/PostStore/Post";

const Feed = ({ page }) => {
  const params = useParams();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const postsDetails = useSelector((state) => state.post);
  const [error, setError] = useState("");

  let observer = useRef();
  const lastElementRef = useCallback(
    (node) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && postsDetails?.hasMore) {
          dispatch(postActions.updatePageNumber());
        }
      });
      if (node) observer.current?.observe(node);
    },
    [isLoading, postsDetails?.hasMore, dispatch]
  );
  useEffect(() => {
    const abortController = new AbortController();
    const fetchAllPosts = async () => {
      setIsLoading(true);
      setError("");
      try {
        const data = await fetch(
          `http://localhost:8080/api/post/${
            page === "profile"
              ? `userPosts/posts/${params.id}`
              : "timeline/posts"
          }/?page=${postsDetails?.pageNumber}`,
          {
            credentials: "include",
            signal: abortController.signal,
          }
        );
        if (data.status !== 200) {
          setError("Not Authorized");
          return;
        }
        const fetchedData = await data.json();

        dispatch(postActions.addPost(fetchedData));
        dispatch(postActions.toggleHasMore(fetchedData.length > 0));
        setIsLoading(false);
      } catch (err) {
        if (err.name !== "AbortError") setError(err.message);
      }
    };
    fetchAllPosts();
    return () => {
      abortController.abort();
    };
  }, [postsDetails?.pageNumber, page, params.id, dispatch]);
  useEffect(() => {
    dispatch(postActions.reset());
  }, [params.id, dispatch]);

  let isAuthenticated = false;
  if (localStorage.getItem("isLogged") === "true") {
    isAuthenticated = true;
  }
  const ShareComponent = () => {
    if (isAuthenticated) {
      if (localStorage.getItem("userId") === params.id || page !== "profile") {
        return <Share />;
      }
    }
    return null;
  };

  return (
    <div className={classes.feedContainer}>
      <div className={classes.feedWrapper}>
        {ShareComponent && <ShareComponent />}

        {postsDetails?.posts?.map((post, index) => {
          if (postsDetails?.posts?.length - 1 === index) {
            return <Post ref={lastElementRef} key={index} postInfo={post} />;
          }
          return <Post key={index} postInfo={post} />;
        })}
        {isLoading && (
          <div className={classes.loader}>
            <CircularProgress />
          </div>
        )}
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
};
export default Feed;
