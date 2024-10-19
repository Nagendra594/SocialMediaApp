import classes from "./Messages.module.css";
import { format } from "timeago.js";
import { Link } from "react-router-dom";
const Messages = ({
  own,
  text,
  createdAt,
  currentProfilePic,
  frndProfilePic,
  frndId,
}) => {
  return (
    <section className={own ? classes.own : classes.message}>
      <section className={classes.message__top}>
        {!own ? (
          <Link to={`/profile/${frndId}`}>
            <img
              src={`https://chitchatt.s3.ap-south-1.amazonaws.com/${
                frndProfilePic || "uploads/no_avatar.jpg"
              }`}
              alt="profilePic"
            />
          </Link>
        ) : (
          <img
            src={`https://chitchatt.s3.ap-south-1.amazonaws.com/${
              currentProfilePic || "uploads/no_avatar.jpg"
            }`}
            alt="profilePic"
          />
        )}

        <p>{text}</p>
      </section>
      <section className={classes.message__bottom}>
        <span>{format(createdAt)}</span>
      </section>
    </section>
  );
};
export default Messages;
