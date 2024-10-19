import classes from "./PostBottom.module.css";
import { useDispatch } from "react-redux";
import { postActions } from "../../Store/PostStore/Post";
const PostBottom = ({ postId, likes, comments }) => {
  const dispatch = useDispatch();
  const likeHandler = () => {
    fetch(`http://localhost:8080/api/post/${postId}`, {
      method: "PUT",
      body: JSON.stringify({ userId: localStorage.getItem("userId") }),
      headers: {
        "Content-type": "application/json",
      },
      credentials: "include",
    });
    dispatch(postActions.interact(postId));
  };
  return (
    <div className={classes.bottomSection__bottom}>
      <div className={classes.bottomSection__interact}>
        <img
          src="http://localhost:8080/images/like.png"
          onClick={likeHandler}
          alt="like"
        />
        <img
          src="http://localhost:8080/images/heart.png"
          onClick={likeHandler}
          alt="heart"
        />
        <span>
          {likes > 1
            ? `${likes} peoples like it`
            : likes === 1
            ? `${likes} person likes it`
            : "No likes"}
        </span>
      </div>
      <span className={classes.bottomSection__comments}>
        {comments} comments
      </span>
    </div>
  );
};
export default PostBottom;
