import classes from "./Post.module.css";
import PostTop from "./PostTop";
import PostMiddle from "./PostMiddle";
import PostBottom from "./PostBottom";
import { forwardRef } from "react";
const Post = forwardRef(({ postInfo }, ref) => {
  return (
    <section ref={ref} className={classes.bottomSection}>
      <PostTop date={postInfo?.createdAt} userId={postInfo?.userId} />
      <PostMiddle desc={postInfo?.desc} postPic={postInfo?.image} />
      <PostBottom
        postId={postInfo?._id}
        likes={postInfo?.likes.length}
        comments={postInfo?.comments || "9"}
      />
    </section>
  );
});
export default Post;
