import classes from "./PostMiddle.module.css";
const PostMiddle = ({ desc, postPic }) => {
  return (
    <div className={classes.bottomSection__middle}>
      {desc && <p className={classes.bottomSection__middle__desc}>{desc}</p>}

      <img
        className={classes.bottomSection__middle__img}
        src={`https://chitchatt.s3.ap-south-1.amazonaws.com/${postPic}`}
        alt="postPic"
      />
    </div>
  );
};
export default PostMiddle;
