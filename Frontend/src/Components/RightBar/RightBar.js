import classes from "./RightBar.module.css";
import { useSelector } from "react-redux";
import OnlineFrnd from "../Chats/OnlineFrnds/OnlineFrnd/OnlineFrnd";
const RightBar = () => {
  const onlineFrnds = useSelector((state) => state.onlineUsers);

  return (
    <div className={classes.RightBar}>
      <div className={classes.RightBar__wrapper}>
        <section className={classes.RightBar__onlineFriends}>
          <h3>Online Friends</h3>
          <ul className={classes.RightBar__friendsList}>
            {onlineFrnds?.map((oF) => {
              return <OnlineFrnd key={oF?.userId} userId={oF?.userId} />;
            })}
          </ul>
        </section>
      </div>
    </div>
  );
};
export default RightBar;
