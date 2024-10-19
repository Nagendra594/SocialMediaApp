import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainNavigation from "./Pages/MainNavigation";
import HomePage from "./Pages/HomePage";
import { Provider } from "react-redux";
import store from "./Store/Store";
import ProfilePage from "./Pages/ProfilePage";
import LoginPage from "./Pages/LoginPage";
import RegisterPage from "./Pages/RegisterPage";
import FrndRequestsPage from "./Pages/FrndsRequestsPage";

import { signupAction } from "./Components/Register/Register";
import { shareAction } from "./Components/Feed/Share";
import { userFriendsLoader } from "./Pages/ProfilePage";
import ChatPage from "./Pages/ChatPage";
const Router = createBrowserRouter([
  {
    path: "/",
    element: <MainNavigation />,
    children: [
      {
        index: true,
        element: <HomePage />,
        action: shareAction,
      },
      {
        path: "profile/:id",
        element: <ProfilePage />,
        action: shareAction,
        loader: userFriendsLoader,
        id: "userData",
      },
      {
        path: "chats/:id/:frndUserId",
        element: <ChatPage />,
      },
      {
        path: "/friendRequests",
        element: <FrndRequestsPage />,
      },
    ],
  },
  {
    path: "login",
    element: <LoginPage />,
  },
  {
    path: "signup",
    element: <RegisterPage />,
    action: signupAction,
  },
]);
function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={Router} />
    </Provider>
  );
}

export default App;
