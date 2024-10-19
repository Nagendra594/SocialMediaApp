import classes from "./OnlineFrnds.module.css";
import OnlineFrnd from "./OnlineFrnd/OnlineFrnd";
import { useSelector } from "react-redux";
const OnlineFrnds = () => {
  const onlineFrnds = useSelector((state) => state.onlineUsers);
  return (
    <div className={classes.chatOnline}>
      <ul>
        {onlineFrnds?.map((oF) => {
          return <OnlineFrnd key={oF.userId} userId={oF.userId} />;
        })}
      </ul>
    </div>
  );
};
export default OnlineFrnds;
