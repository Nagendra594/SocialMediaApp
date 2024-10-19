import SideBar from "../Components/SideBar/SideBar";
import Feed from "../Components/Feed/Feed";
import RightBar from "../Components/RightBar/RightBar";
import classes from "./HomePage.module.css";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { searchFrndActions } from "../Store/UserStore/searchFrnds";
const HomePage = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(searchFrndActions.reset());
  }, []);
  return (
    <div className={classes.main_content}>
      <SideBar />
      <Feed page={"Home"} />
      <RightBar />
    </div>
  );
};

export default HomePage;
