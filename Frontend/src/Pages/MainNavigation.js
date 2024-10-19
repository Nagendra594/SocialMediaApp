import TopBar from "../Components/TopBar/TopBar";
import { defer, Outlet, redirect, useNavigation } from "react-router-dom";

const MainNavigation = () => {
  return (
    <>
      <TopBar />
      <main>
        <Outlet />
      </main>
    </>
  );
};
export default MainNavigation;
