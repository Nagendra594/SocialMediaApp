import { useEffect, useState } from "react";
import classes from "./FrndsRequests.module.css";
import { useSelector } from "react-redux";
import FrndRequest from "../Components/FrndRequest/FrndRequests";
const FrndRequestsPage = () => {
  const userData = useSelector((state) => state.user);
  const [requests, setRequests] = useState([]);
  useEffect(() => {
    const ids = userData?.followers?.filter(
      (follower) => follower.status === "pending"
    );
    setRequests(ids);
  }, [userData]);
  return (
    <div className={classes.frndRequests}>
      <ul className={classes.frndRequests__list}>
        {requests?.map((req) => {
          return <FrndRequest req={req} key={req.id} />;
        })}
      </ul>
    </div>
  );
};
export default FrndRequestsPage;
